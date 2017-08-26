"use strict";

const electron = require("electron");
const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow() {
	// Defined in lounge's ./index.js
	global.log = require("./node_modules/thelounge/src/log");

	// Set by command-line/index.js which we do not load
	const helper = require("./node_modules/thelounge/src/helper");
	helper.setHome(path.join(__dirname, "appdata"));

	// Load the actual lounge server
	const server = require("./node_modules/thelounge/src/server");

	// Set working directory otherwise it can't find build.js and exits
	process.chdir(path.join(__dirname, "node_modules", "thelounge"));
	server();

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});

	mainWindow.loadURL("http://127.0.0.1:9000/");

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
