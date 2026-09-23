import { type AuthObject, getUserCompletionProgress } from "@retroachievements/api";
import type { FetchedRaGame } from "../types";
import { raGameUrl } from "./utils";
import { consoleNameSanitizer, abortableSleep } from "../utils";

export const getAllRaGames = async (raAuth: AuthObject, raUsername: string, signal?: AbortSignal) => {
	let gamesList: FetchedRaGame[] = [];
	let offset = 0

	while (true) {
		signal?.throwIfAborted();
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
					console: consoleNameSanitizer(game.consoleName),
					setUrl: raGameUrl(game.gameId),
					status: game.highestAwardKind || 'none',
				};
			})

		gamesList = [...gamesList, ...fetchedGames];
		signal?.throwIfAborted();
		if (gamesList.length >= userCompletionProgress.total) {
			break;
		}
		offset = gamesList.length;
		if (signal) {
			await abortableSleep(2000, signal);
		} else {
			await sleep(2000);
		}
	}
	return gamesList;
}

