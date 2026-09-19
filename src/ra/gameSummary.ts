import { type AuthObject, getGame } from "@retroachievements/api";
import type { FetchedRaGame, RaGame } from "../types";
import { raCoverUrl, raGameUrl } from "./utils";
import { stringToArray } from "../utils";

export const getGameBoxartUrl = async (raAuth: AuthObject, gamesList: FetchedRaGame[]) => {
	const games: RaGame[] = [];
	for (const game of gamesList) {
		const g = await getGame(raAuth, {
			gameId: game.gameId
		});
		const genres = stringToArray(g.genre);
		const developers = stringToArray(g.developer);
		const publishers = stringToArray(g.publisher);
		const coverUrl = raCoverUrl(g.imageBoxArt);
		games.push({
			...game,
			console: g.console,
			gameId: g.id,
			title: g.title,
			setUrl: raGameUrl(g.id),
			genres,
			developers,
			publishers,
			coverUrl,
		})
	}
	return games;
}

