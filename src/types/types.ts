import { type AwardKind } from "@retroachievements/api";

export type RaGame = {
	title: string,
	gameId: number,
	console: string,
	setUrl: string,
	status: AwardKind | 'none';
	genres: string[],
	raDevelopers?: string[],
	developers: string[],
	publishers: string[],
	coverUrl: string,
}

export type FetchedRaGame = {
	title: string,
	gameId: number,
	console: string,
	setUrl: string;
	status: AwardKind | 'none';
}

export type RaMetaData = {
	title: string,
	console: string,
	setUrl: string,
	status: string;
	genres: string[],
	raDevelopers?: string[],
	developers: string[],
	publishers: string[],
	coverUrl: string,
	category: 'RetroAchievements',
}
