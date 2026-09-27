import { App, normalizePath, TFile, TFolder } from "obsidian";
import RaSearchPlugin from "./main";
import { MissingCredentialsModal } from "./ui/MissingCredentialsModal";

export const ILLEGAL_NOTE_TITLE_CHARS_REGEX = /[:/\\]/g;

export const toInternalLink = (s: string | string[]) => {
	if (Array.isArray(s)) {
		return s
			.filter(x => x.length > 0)
			.map(x => wrap(x));
	}
	return s.length > 0 ? wrap(s) : "";
}

const wrap = (s: string) => `[[${s}]]`

export const ensureFolderStructure = async (app: App, path: string) => {
	let p = normalizePath(path)
	// Remove *.md from the path
	if (p.endsWith(".md")) {
		p = p.substring(0, p.lastIndexOf("/"));
	}
	const file = app.vault.getAbstractFileByPath(p);
	if (!(file instanceof (TFolder))) {
		await app.vault.createFolder(p);
	}
}

export const noteExists = async (app: App, path: string) => {
	let p = normalizePath(path)
	const file = app.vault.getAbstractFileByPath(p);
	if (file instanceof (TFile)) {
		return file;
	}
	return null;
}

export const gameToFileName = (plugin: RaSearchPlugin, gameTitle: string, consoleName: string) => {
	let t = sanitizeGameTitle(gameTitle);
	let c = sanitizeConsoleName(consoleName);
	if (plugin.settings.consoleSubfolders) {
		return normalizePath(`${plugin.settings.raGamesPath}/${c}/${t}.md`);
	} else {
		return normalizePath(`${plugin.settings.raGamesPath}/${t} (${c}).md`);
	}
}

export const sanitizeConsoleName = (consoleName: string) => {
	let c = consoleName;
	if (c[0] === ".") {
		c = c.slice(1);
	}
	c = c.replaceAll(ILLEGAL_NOTE_TITLE_CHARS_REGEX, " - ")
		.replaceAll("  ", " ");
	return c;
}

export const sanitizeGameTitle = (title: string) => {
	let t = title;
	// Obsidian hides files that start with a fullstop from the file explorer.
	if (t[0] === ".") {
		t = t.slice(1);
	}
	// This line is specifically for the .hack// series of games, which has been causing trouble.
	t = t.replaceAll("//", " - ");

	t = t.replaceAll(ILLEGAL_NOTE_TITLE_CHARS_REGEX, " - ")
		.replaceAll("  ", " ");
	return t;
}

export function isNumeric(str: string) {
	if (typeof str != "string") return false // we only process strings!  
	return !isNaN(+str) && //use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

export const stringToArray = (str: string) => {
	return str?.split(", ").map(x => x.trim()) || [];
}

export function requireCredentials(plugin: RaSearchPlugin) {
	if (!plugin.settings.raUsername || !plugin.isTokenSet()) {
		new MissingCredentialsModal(plugin).open();
		return false;
	}
	return true;
}

export async function openVaultNote(app: App, gameNote: TFile) {
	const leaf = app.workspace.getLeaf(true);
	await leaf.openFile(gameNote);
}

export function abortableSleep(ms: number, signal: AbortSignal): Promise<void> {
	return new Promise((resolve, reject) => {
		if (signal.aborted) {
			reject(createAbortError());
			return;
		}
		const timeoutId = window.setTimeout(() => {
			signal.removeEventListener("abort", onAbort);
			resolve();
		}, ms);
		const onAbort = () => {
			window.clearTimeout(timeoutId);
			reject(createAbortError());
		};
		signal.addEventListener("abort", onAbort, { once: true });
	});
}

export function isAbortError(error: unknown) {
	return (error instanceof Error || error instanceof DOMException)
		&& error.name === "AbortError";
}

function createAbortError() {
	const error = new Error("Aborted");
	error.name = "AbortError";
	return error;
}
