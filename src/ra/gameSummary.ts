import { type AuthObject, getGame } from "@retroachievements/api";
import type { FetchedRaGame, RaGame } from "../types";
import { raCoverUrl, raGameUrl } from "./utils";

export const getGameBoxartUrl = async (raAuth: AuthObject, gamesList: FetchedRaGame[]) => {
	const games: RaGame[] = [];
	for (const game of gamesList) {
		const g = await getGame(raAuth, {
			gameId: game.gameId
		});
		const genres = g.genre?.split(", ").map(x => x.trim()) || [];
		const developers = g.developer?.split(", ").map(x => x.trim()) || [];
		const publishers = g.publisher?.split(", ").map(x => x.trim()) || [];
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
