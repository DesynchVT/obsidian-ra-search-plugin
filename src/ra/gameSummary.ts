import { type AuthObject, getGame } from "@retroachievements/api";
import type { FetchedRaGame, RaGame } from "../types";
import { raCoverUrl } from "./utils";

export const getGameBoxartUrl = async (raAuth: AuthObject, gamesList: FetchedRaGame[]) => {
	const games: RaGame[] = [];
	for (const game of gamesList) {
		const g = await getGame(raAuth, {
			gameId: game.gameId
		});
		const genres = g.genre?.split(", ") || [];
		const developers = g.developer?.split(", ") || [];
		const publishers = g.publisher?.split(", ") || [];
		const coverUrl = raCoverUrl(g.imageBoxArt);
		games.push({
			...game,
			genres,
			developers,
			publishers,
			coverUrl,
		})
	}
	return games;
}
