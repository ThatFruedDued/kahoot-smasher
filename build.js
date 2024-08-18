import * as esbuild from "esbuild";
import bookmarkletPlugin from "esbuild-plugin-bookmarklet";

esbuild.build({
	entryPoints: ["./min/fakerless.js"],
	bundle: true,
	minify: true,
	write: false,
	outfile: "./min/fakerless.bookmarklet.js",
	format: "iife",
	plugins: [bookmarkletPlugin],
});
