import { normalizePath, Notice } from "obsidian";
import { RaGame } from "../types";
import RaSearchPlugin from "../main";

// Not sure how to get the secret without passing the whole class...
export async function addGame(plugin: RaSearchPlugin, path: string, props: RaGame) {
	if (!plugin.isTokenSet()) {
		new Notice("RA Web API Token not set in settings. Cannot search for games.");
		return;
	}

	let p = normalizePath(path);
	if (!p.endsWith(".md")) {
		p = p + ".md";
	}

	try {
		const gameNote = await plugin.app.vault.create(p, "");
		plugin.app.fileManager.processFrontMatter(gameNote, (fm) => {
			Object.assign(fm, props);
		});
	} catch (error: any) {
		if (error.message && error.message.toLowerCase() === "file already exists.") {
			new Notice(`${plugin.manifest.name}: "${path}" already exists.`).containerEl.addClass("error-text");
		}
	}
}
