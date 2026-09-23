import { getGameInfoAndUserProgress } from "@retroachievements/api";
import RaSearchPlugin from "../main";
import { FetchedRaGame, RaGame } from "../types";
import { displayCredentialsError, raGameUrl } from "./utils";
import { getGameBoxartUrl } from "./gameSummary";
import { consoleNameSanitizer } from "../utils";
import { Notice } from "obsidian";


export const getSpecificGame = async (plugin: RaSearchPlugin, gameId: number) => {
	let raGame: RaGame | undefined = undefined;
	try {

		const gameData = await getGameInfoAndUserProgress(
			plugin.raAuth,
			{
				username: plugin.settings.raUsername,
				gameId: gameId,
			}
		);

		// API returns an empty array if no game with given ID is found, for some reason
		if (Array.isArray(gameData) && gameData.length <= 0) {
			return undefined;
		}

		const fetchedGame: FetchedRaGame = {
			console: consoleNameSanitizer(gameData.consoleName),
			gameId: gameId,
			setUrl: raGameUrl(gameId),
			status: gameData.highestAwardKind || "none",
			title: gameData.title
		}
		raGame = (await getGameBoxartUrl(plugin.raAuth, [fetchedGame])).first();
	} catch (error) {
		console.error(error);
		const errorMsg = error instanceof Error ? error.message : String(error);
		if (errorMsg.includes("422")) {
			displayCredentialsError();
		} else {
			new Notice(`${plugin.manifest.name}: ${String(error)}`).containerEl.addClass("ra-search-error-text");
		}
	}
	return raGame;
}
