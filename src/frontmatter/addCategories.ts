import { TFile } from "obsidian";
import RaSearchPlugin from "../main";

export const addCategories = async (plugin: RaSearchPlugin, note: TFile) => {
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
