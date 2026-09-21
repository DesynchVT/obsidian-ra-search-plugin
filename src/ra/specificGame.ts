import { getGameInfoAndUserProgress } from "@retroachievements/api";
import RaSearchPlugin from "../main";
import { FetchedRaGame } from "../types";
import { raGameUrl } from "./utils";
import { getGameBoxartUrl } from "./gameSummary";


export const getSpecificGame = async (plugin: RaSearchPlugin, gameId: number) => {
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
		console: gameData.consoleName,
		gameId: gameId,
		setUrl: raGameUrl(gameId),
		status: gameData.highestAwardKind || "none",
		title: gameData.title
	}
	const raGame = (await getGameBoxartUrl(plugin.raAuth, [fetchedGame])).first();
	return raGame;
}
