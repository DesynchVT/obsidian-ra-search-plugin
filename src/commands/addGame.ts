import { Notice } from "obsidian";
import type { RaGame, RaMetaData } from "../types";
import type RaSearchPlugin from "../main";
import { consoleNameSanitizer, ensureFolderStructure, gameToFileName, toInternalLink } from "../utils";

export async function addGame(plugin: RaSearchPlugin, gameData: RaGame) {
	let notePath = gameToFileName(plugin, gameData.title, gameData.console);
	await ensureFolderStructure(plugin.app, notePath);

	try {
		const gameNote = await plugin.app.vault.create(notePath, "");

		await plugin.app.fileManager.processFrontMatter(gameNote, (fm) => {
			const consoleName = consoleNameSanitizer(gameData.console);
			let gameObj: RaMetaData = {
				title: gameData.title,
				console: consoleName,
				genres: gameData.genres,
				status: gameData.status,
				// raDevelopers: [],
				developers: gameData.developers,
				publishers: gameData.publishers,
				setUrl: gameData.setUrl,
				coverUrl: gameData.coverUrl,
				category: "RetroAchievements",
			}
			if (plugin.settings.propertiesAsLinks) {
				gameObj = {
					...gameObj,
					console: toInternalLink(consoleName) as string,
					genres: toInternalLink(gameData.genres) as string[],
					developers: toInternalLink(gameData.developers) as string[],
					publishers: toInternalLink(gameData.publishers) as string[],
				}
			}
			Object.assign(fm, gameObj);
		});
		return gameNote;
	} catch (error) {
		if (error instanceof Error && error?.message === "File already exists.") {
			new Notice(`${plugin.manifest.name}: "${notePath}" already exists.`).containerEl.addClass("ra-search-error-text");
		} else {
			console.error(String(error));
		}
		return null;
	}
}
