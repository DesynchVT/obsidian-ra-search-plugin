import { addGame } from "../commands";
import RaSearchPlugin from "../main";
import { abortableSleep, ensureFolderStructure, gameToFileName, isAbortError, noteExists, requireCredentials } from "../utils";
import { getGameBoxartUrl, getAllRaGames, displayCredentialsError } from "../ra";
import { FetchedRaGame } from "../types";
import { Notice } from "obsidian";

export const runAutoImport = async (plugin: RaSearchPlugin) => {
	if (!requireCredentials(plugin)) {
		return;
	}
	const abortController = plugin.startAutoImport();
	if (!abortController) {
		new Notice(`${plugin.manifest.name}: An import is already running.`);
		return;
	}

	try {
		const amountImported = await _autoImport(plugin, abortController.signal);
		if (amountImported === 0) {
			new Notice(`${plugin.manifest.name}: Nothing to import!`);
			return
		}
		new Notice(`${plugin.manifest.name}: Auto import completed!`);
	} catch (error) {
		if (isAbortError(error)) {
			new Notice(`${plugin.manifest.name}: Auto import cancelled.`);
			return;
		}
		console.error(error);
		const errorMsg = error instanceof Error ? error.message : String(error);
		if (errorMsg.includes("422")) {
			displayCredentialsError();
		} else {
			new Notice(`${plugin.manifest.name}: ${String(error)}`).containerEl.addClass("ra-search-error-text");
		}
	} finally {
		plugin.finishAutoImport(abortController);
	}

}

const _autoImport = async (plugin: RaSearchPlugin, signal: AbortSignal) => {
	await ensureFolderStructure(plugin.app, plugin.settings.raGamesPath);
	let games = await getAllRaGames(plugin.raAuth, plugin.settings.raUsername, signal);
	const initialAmount = games.length;
	if (!plugin.settings.includeSubsets) {
		games = filterSubsets(games);
	}
	games = await filterExistingNotes(plugin, games, signal);
	const filteredAmount = initialAmount - games.length;
	if (games.length <= 0) {
		return 0;
	}

	new Notice(`${plugin.manifest.name}: Importing ${games.length} of ${initialAmount} sets`);

	for (const [i, game] of games.entries()) {
		signal.throwIfAborted();
		const [g] = await getGameBoxartUrl(plugin.raAuth, [game], signal);
		signal.throwIfAborted();
		if (g) {
			await addGame(plugin, g);
		}
		if (i + 1 != games.length) {
			await abortableSleep(5000, signal);
		}
	}
	return filteredAmount;
}

const filterExistingNotes = async (plugin: RaSearchPlugin, games: FetchedRaGame[], signal?: AbortSignal) => {
	const keep = [];
	for (const game of games) {
		signal?.throwIfAborted();
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
