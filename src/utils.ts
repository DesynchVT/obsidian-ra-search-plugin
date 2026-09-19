import { App, normalizePath, TFile, TFolder } from "obsidian";
import RaSearchPlugin from "./main";

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
		return true;
	}
	return false;
}

export const gameToFileName = (plugin: RaSearchPlugin, gameTitle: string, consoleName: string) => {
	let t = gameTitle.replaceAll(/:|\\|\//g, " -");
	let c = consoleName.replaceAll(/\//g, "-");
	return normalizePath(`${plugin.settings.raGamesPath}/${c}/${t}.md`);
}
