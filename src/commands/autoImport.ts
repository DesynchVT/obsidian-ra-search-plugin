import { addGame } from "../commands";
import RaSearchPlugin from "../main";
import { ensureFolderStructure, gameToFileName, noteExists, requireCredentials } from "../utils";
import { getGameBoxartUrl, getAllRaGames, displayCredentialsError } from "../ra";
import { FetchedRaGame } from "../types";
import { Notice } from "obsidian";

export const runAutoImport = async (plugin: RaSearchPlugin) => {
	if (!requireCredentials(plugin)) {
		return;
	}

	try {
		const amountImported = await _autoImport(plugin);
		if (amountImported === 0) {
			new Notice(`${plugin.manifest.name}: Nothing to import!`);
			return
		}
		new Notice(`${plugin.manifest.name}: Auto import completed!`);
	} catch (error: any) {
		console.error(error);
		if (error?.message?.includes("422")) {
			displayCredentialsError();
		} else {
			new Notice(`${plugin.manifest.name}: ${error}`).containerEl.addClass("error-text");
		}
	}

}

const _autoImport = async (plugin: RaSearchPlugin) => {
	await ensureFolderStructure(plugin.app, plugin.settings.raGamesPath);
	let games = await getAllRaGames(plugin.raAuth, plugin.settings.raUsername);
	const initialAmount = games.length;
	if (!plugin.settings.includeSubsets) {
		games = filterSubsets(games);
	}
	games = await filterExistingNotes(plugin, games);
	const filteredAmount = initialAmount - games.length;
	if (games.length <= 0) {
		return 0;
	}

	new Notice(`${plugin.manifest.name}: Importing ${games.length} of ${initialAmount} sets`);

	for (const [i, game] of games.entries()) {
		const [g] = await getGameBoxartUrl(plugin.raAuth, [game]);
		if (g) {
			await addGame(plugin, g);
		}
		if (i + 1 != games.length) {
			await sleep(5000);
		}
	}
	return filteredAmount;
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
