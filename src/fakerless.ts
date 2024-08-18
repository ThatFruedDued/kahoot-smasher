/* Kahoot Smasher - add bots to Kahoot games
 * Copyright (C) 2024 ThatFruedDued
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License only.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { v4 as uuid } from "uuid";

const wsLogs = false;
const isBrowser = "window" in globalThis;

async function joinGame(pin: string, name: string) {
	// step 1: reserve a session using the game pin to get WebSocket details

	const generatedUuid = uuid();

	if (isBrowser) {
		document.cookie = `generated-uuid=${generatedUuid}`;
	}
	const reserveResponse = await fetch(
		`https://kahoot.it/reserve/session/${pin}/?${Date.now()}`,
		isBrowser
			? undefined
			: {
					headers: {
						cookie: `generated-uuid=${generatedUuid}`,
					},
			  }
	);

	// step 2: decoding the WebSocket url
	// for some reason Kahoot thinks it's a good idea to send a JS challenge
	// back to the client to solve to "prove" they are Kahoot
	// we grab the necessary values from the challenge then do it ourselves,
	// unfortunately the math equation for the offset needs to be evaluated
	// so we check that Kahoot isn't trying to execute arbitrary code on
	// our computer before running the otherwise unsafe eval()
	//
	// also after we get the challenge response we need to xor the string with
	// the base64-decoded session token to get the resulting url

	const sessionToken = reserveResponse.headers.get("x-kahoot-session-token")!;
	const { challenge } = (await reserveResponse.json()) as { challenge: string };

	const challengeInput = challenge.slice(19, 119);
	const offsetCode = challenge
		.split("var offset = ")[1]
		.split(";")[0]
		.replace(/\s/g, "");

	if (/[^\d()*+]/.test(offsetCode)) {
		console.warn(
			"Kahoot just attempted to run the following code on your computer:",
			offsetCode,
			"\nLuckily, you were protected."
		);
		return;
	}

	const offset = eval(offsetCode) as number;

	const challengeResponse = challengeInput
		.split("")
		.map((char, i) =>
			String.fromCharCode(((char.charCodeAt(0) * i + offset) % 77) + 48)
		)
		.join("");

	const xorResult = String.fromCharCode(
		...atob(sessionToken)
			.split("")
			.map((char, i) => char.charCodeAt(0) ^ challengeResponse.charCodeAt(i))
	);

	// step 3: finally connect to Kahoot and add player

	const ws = new WebSocket(
		`wss://kahoot.it/cometd/${pin}/${xorResult}`,
		isBrowser
			? undefined
			: ({
					headers: { cookie: `generated-uuid=${generatedUuid}` },
			  } as any)
	);

	ws.onopen = async () => {
		let id = 1;

		const send = (message: any) => {
			id++;
			wsLogs && console.log("Sent", message);
			ws.send(JSON.stringify(message));
		};

		ws.addEventListener("message", (event) => {
			wsLogs && console.log("Received", JSON.parse(event.data as string));
		});

		const nextMessage = (condition?: (message: any) => boolean) =>
			new Promise((res) => {
				const listener = (event: any) => {
					event = event as MessageEvent<string>;
					const message = JSON.parse(event.data);
					if (!condition || condition(message)) {
						res(message);
						ws.removeEventListener("message", listener);
					}
				};
				ws.addEventListener("message", listener);
			});

		send([
			{
				id: id.toString(),
				version: "1.0",
				minimumVersion: "1.0",
				channel: "/meta/handshake",
				supportedConnectionTypes: [
					"websocket",
					"long-polling",
					"callback-polling",
				],
				advice: { timeout: 60000, interval: 0 },
				ext: { ack: true, timesync: { tc: Date.now(), l: 0, o: 0 } },
			},
		]);

		const clientRes = (await nextMessage(
			(message) => message?.[0]?.clientId
		)) as [{ clientId: string }];
		const { clientId } = clientRes[0];

		send([
			{
				id: id.toString(),
				channel: "/meta/connect",
				connectionType: "websocket",
				advice: { timeout: 0 },
				clientId,
				ext: { ack: 0, timesync: { tc: Date.now(), l: 0, o: 0 } },
			},
		]);

		ws.addEventListener("message", async (event) => {
			const data = event.data as string;
			const message = JSON.parse(data);

			if (message?.[0]?.channel === "/meta/connect") {
				send([
					{
						id: id.toString(),
						channel: "/meta/connect",
						connectionType: "websocket",
						clientId,
						ext: {
							ack: message[0].ext.ack,
							// timesync: { tc: Date.now(), l: 0, o: 0 },
						},
					},
				]);
			}

			if (
				message?.[0]?.channel === "/service/player" &&
				message[0].data.id === 2
			) {
				await new Promise((r) =>
					setTimeout(r, Math.floor(Math.random() * 3000))
				);
				const content = JSON.parse(message[0].data.content);
				if (content.type === "quiz") {
					send([
						{
							id: id.toString(),
							channel: "/service/controller",
							data: {
								gameid: pin,
								type: "message",
								host: "kahoot.it",
								id: 45,
								content: JSON.stringify({
									type: "quiz",
									choice: Math.floor(Math.random() * content.numberOfChoices),
									questionIndex: content.gameBlockIndex,
								}),
							},
							clientId,
							ext: {},
						},
					]);
				} else if (content.type === "multiple_select_quiz") {
					send([
						{
							id: id.toString(),
							channel: "/service/controller",
							data: {
								gameid: pin,
								type: "message",
								host: "kahoot.it",
								id: 45,
								content: JSON.stringify({
									type: "multiple_select_quiz",
									choice: new Array(content.numberOfChoices)
										.fill(0)
										.map((_, i) => i)
										.filter(() => Math.random() < 0.5),
									questionIndex: content.gameBlockIndex,
								}),
							},
							clientId,
							ext: {},
						},
					]);
				} else if (content.type === "jumble") {
					send([
						{
							id: id.toString(),
							channel: "/service/controller",
							data: {
								gameid: pin,
								type: "message",
								host: "kahoot.it",
								id: 45,
								content: JSON.stringify({
									type: "jumble",
									choice: new Array(content.numberOfChoices)
										.fill(0)
										.map((_, i) => i)
										.sort(() => Math.random() - 0.5),
									questionIndex: content.gameBlockIndex,
								}),
							},
							clientId,
							ext: {},
						},
					]);
				} else if (content.type === "open_ended") {
					send([
						{
							id: id.toString(),
							channel: "/service/controller",
							data: {
								gameid: pin,
								type: "message",
								host: "kahoot.it",
								id: 45,
								content: JSON.stringify({
									type: "open_ended",
									text: "amogus",
									questionIndex: content.gameBlockIndex,
								}),
							},
							clientId,
							ext: {},
						},
					]);
				} else if (content.type === "slider") {
					send([
						{
							id: id.toString(),
							channel: "/service/controller",
							data: {
								gameid: pin,
								type: "message",
								host: "kahoot.it",
								id: 45,
								content: JSON.stringify({
									type: "slider",
									choice:
										Math.floor(
											(Math.random() *
												(content.maxRange - content.minRange + 1)) /
												content.step
										) *
											content.step +
										content.minRange,
									questionIndex: content.gameBlockIndex,
								}),
							},
							clientId,
							ext: {},
						},
					]);
				}
			}
		});

		await nextMessage();

		const loginId = id.toString();
		send([
			{
				id: loginId,
				channel: "/service/controller",
				data: {
					type: "login",
					gameid: pin,
					host: "kahoot.it",
					name,
					content: JSON.stringify({
						device: {
							userAgent:
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.3",
						},
						screen: { width: 1920, height: 1080 },
					}),
				},
				clientId,
				ext: {},
			},
		]);

		await nextMessage((message) => message?.[0]?.id === loginId);

		send([
			{
				id: id.toString(),
				channel: "/service/controller",
				data: {
					gameid: pin,
					type: "message",
					host: "kahoot.it",
					id: 16,
					content: JSON.stringify({ usingNamerator: false }),
				},
				clientId,
				ext: {},
			},
		]);
	};
}

const pin = prompt("Game PIN:")!;
let bots = parseInt(prompt("How many bots to add?")!);

if (isNaN(bots)) {
	bots = 500;
	console.error("Invalid number (defaulting to 500)");
}

for (let i = 0; i < bots; i++) {
	const name = Math.floor(Math.random() * 1000000).toString();
	console.log("Joining as", name);
	await Promise.allSettled([
		joinGame(pin, name)
			.then(() => console.log("Joined as", name))
			.catch((e) => {
				console.error(e);
			}),
		new Promise((r) => setTimeout(r, 1000 / 15)),
	]);
}
