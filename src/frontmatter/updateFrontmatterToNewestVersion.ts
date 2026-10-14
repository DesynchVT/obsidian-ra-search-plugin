import { normalizePath, TFile } from "obsidian";
import type RaSearchPlugin from "../main";
import { LATEST_FRONTMATTER_VERSION } from "../settings";

/** Go through all existing RA game files and update the frontmatter, if necessary */
export const updateFrontmatterToNewestVersion = async (plugin: RaSearchPlugin) => {
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

/** Adds 'categories' list-type property to all existing RA game notes. Included as of manifest version 1.2.0, frontmatterVersion 2 */
const addCategories = async (plugin: RaSearchPlugin, note: TFile) => {
	const fm = plugin.app.metadataCache.getCache(note.path)?.frontmatter;
	if (fm?.categories) {
		// categories property already exists
		return;
	}

	let value: string[] = [];
	const category = typeof fm?.category === "string" ? fm.category : "";
	if (typeof category === "string" && category.length > 0) {
		value = [category];
	}

	await plugin.app.fileManager.processFrontMatter(note, (frontmatter) => {
		Object.assign(frontmatter, {
			categories: value,
		})
	});
};
