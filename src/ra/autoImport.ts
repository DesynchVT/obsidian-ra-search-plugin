import { addGame } from "../commands";
import RaSearchPlugin from "../main";
import { ensureFolderStructure, gameToFileName, noteExists } from "../utils";
import { getGameBoxartUrl, getAllRaGames } from ".";
import { FetchedRaGame } from "../types";
import { Notice } from "obsidian";

export const autoImport = async (plugin: RaSearchPlugin) => {
	await ensureFolderStructure(plugin.app, plugin.settings.raGamesPath);
	let games = await getAllRaGames(plugin.raAuth, plugin.settings.raUsername);
	const initialAmount = games.length;
	if (!plugin.settings.includeSubsets) {
		games = filterSubsets(games);
	}
	games = await filterExistingNotes(plugin, games);
	const filteredAmount = initialAmount - games.length;
	let msg = `${plugin.manifest.name}: Skipping ${filteredAmount} sets. ${games.length} left to import.`;
	if (games.length <= 0) {
		msg = `${plugin.manifest.name}: Nothing to import!`;
	}

	new Notice(msg);

	for (const game of games) {
		const g = await getGameBoxartUrl(plugin.raAuth, [game]);
		if (g[0]) {
			await addGame(plugin, g[0]);
		}
		await sleep(5000);
	}
}

const filterExistingNotes = async (plugin: RaSearchPlugin, games: FetchedRaGame[]) => {
	const keep = [];
	for (const game of games) {
		const path = gameToFileName(plugin, game.title, game.console);
		const exists = await noteExists(plugin.app, path);
		if (!exists) {
			keep.push(game);
		}
	}
	return keep;
}

const filterSubsets = (games: FetchedRaGame[]) => {
	return games.filter(game => !game.title.includes("[Subset - "));
}
