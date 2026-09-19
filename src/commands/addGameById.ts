import { Notice } from "obsidian";
import RaSearchPlugin from "../main";
import { SearchModal } from "../ui";

export const runAddGameById = async (plugin: RaSearchPlugin) => {
	if (!plugin.isTokenSet()) {
		new Notice("RA web API token not set in settings. Cannot auto import games.");
		return;
	}
	new SearchModal(plugin).open();
}

