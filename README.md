# ThatFruedDued Kahoot Smasher

A little script you can use to flood Kahoot games with numerous players that randomly answer questions. Fully functional as of **August 18, 2024**.

## Usage

### Browser

To run this program in your web browser, you can either use a bookmarklet or the Developer Tools console. Developer Tools are often blocked on school devices, so you may find more success with the bookmarklet method.

#### Variants

You can either choose to run the [`index.js`](https://github.com/ThatFruedDued/kahoot-smasher/blob/master/min/index.js) script or the [`fakerless.js`](https://github.com/ThatFruedDued/kahoot-smasher/blob/master/min/fakerless.js) script. The `index.js` script includes [Faker](https://fakerjs.dev/), a tool to generate realistic names. However, the inclusion of Faker makes the script much larger, so it does not work as a bookmarklet. The `fakerless.js` script does not include Faker which reduces file size, but the generated names will just be random numbers.

#### Bookmarklet

0. Copy the contents of the [`fakerless.bookmarklet.js`](https://github.com/ThatFruedDued/kahoot-smasher/blob/master/min/fakerless.bookmarklet.js).
1. Create a new bookmark.
2. Set the name to `Kahoot Smasher`.
3. Paste the script you copied earlier into the URL field.
4. Save the bookmark.
5. After you enter a Kahoot game, click on the bookmarklet and the script will run.

#### Developer Tools

0. Copy your desired script.
1. Enter your Kahoot game.
2. Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>i</kbd> on Windows/Chrome OS/Linux or <kbd>⌘</kbd> + <kbd>⌥</kbd> + <kbd>i</kbd> on macOS to open the Inspect tab.
3. At the top of the Developer Tools window, click Console.
4. Paste the script. If the script does not appear and you see a warning telling you to allow pasting, type `allow pasting` into the console and press <kbd>Enter</kbd>. Then, paste the script again.
5. Press <kbd>Enter</kbd> to run the script.
6. You can close the console window once you have run the script.

### Bun

This program was written using [Bun](https://bun.sh). However, it should also be fully compatible with comparable JavaScript runtimes such as [Deno](https://deno.land).

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run start
```

## Confused?

Here's a simple tutorial to run the program using [Repl](https://repl.it), a free development platform that provides access to the tools necessary to run this program.

0. Go to [Repl](https://repl.it) and create an account (or sign in)
1. Create a new Repl, import from GitHub URL
2. Paste the link to this repository (https://github.com/ThatFruedDued/kahoot-smasher)
3. Wait for the Repl to be created and run it
4. Follow the prompts in the command window

## Licence

This code is free and open source, licenced under the GNU Affero General Public License version 3. If you are simply using the script yourself, you are not at risk of violating the license.
