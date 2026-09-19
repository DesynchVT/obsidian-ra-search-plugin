import { type AuthObject, getUserCompletionProgress } from "@retroachievements/api";
import type { FetchedRaGame } from "../types";
import { raGameUrl } from "./utils";

export const getAllRaGames = async (raAuth: AuthObject, raUsername: string) => {
	let gamesList: FetchedRaGame[] = [];
	let offset = 0

	while (true) {
		const userCompletionProgress = await getUserCompletionProgress(raAuth, {
			username: raUsername,
			count: 500,
			offset,
		});

		const fetchedGames: FetchedRaGame[] =
			userCompletionProgress.results.map((game) => {
				return {
					title: game.title,
					gameId: game.gameId,
					console: game.consoleName,
					setUrl: raGameUrl(game.gameId),
					status: game.highestAwardKind || 'none',
				};
			})

		gamesList = [...gamesList, ...fetchedGames];
		if (gamesList.length >= userCompletionProgress.total) {
			break;
		}
		offset = gamesList.length;
	}
	return gamesList;
}

