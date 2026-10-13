import { normalizePath, type TFile } from "obsidian";
import type RaSearchPlugin from "../main";
import { addCategories } from "./addCategories";
import { LATEST_FRONTMATTER_VERSION } from "../settings";

/** Go through all existing RA game files and update the frontmatter, if necessary */
export const updateFrontmatter = async (plugin: RaSearchPlugin) => {
	const root = normalizePath(plugin.settings.raGamesPath);
	for (const note of plugin.app.vault.getMarkdownFiles()) {
		if (!note.path.startsWith(`${root}/`)) {
			continue;
		}
		const fm = plugin.app.metadataCache.getCache(note.path)?.frontmatter;
		if (!fm?.categories) {
			await addCategories(plugin, note);
		}
	}
	plugin.settings.frontmatterVersion = LATEST_FRONTMATTER_VERSION;
	await plugin.saveSettings();
}

