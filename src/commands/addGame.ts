import { normalizePath, Notice } from "obsidian";
import { RaGame } from "../types";
import RaSearchPlugin from "../main";

// Not sure how to get the secret without passing the whole class...
export async function addGame(plugin: RaSearchPlugin, path: string, props: RaGame) {
	if (!plugin.isTokenSet()) {
		new Notice("Ra web API token not set in settings. Cannot add games.");
		return null;
	}

	let p = normalizePath(path);
	if (!p.endsWith(".md")) {
		p = p + ".md";
	}

	try {
		const gameNote = await plugin.app.vault.create(p, "");
		await plugin.app.fileManager.processFrontMatter(gameNote, (fm) => {
			Object.assign(fm, props);
		});
	} catch (error) {
		// @ts-ignore
		if (error?.message === "File already exists.") {
			new Notice(`${plugin.manifest.name}: "${path}" already exists.`).containerEl.addClass("error-text");
		}
	}
	return null
}
