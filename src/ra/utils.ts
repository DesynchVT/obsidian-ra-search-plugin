import { Notice } from "obsidian";

export const raUserUrl = (username: string) => `https://retroachievements.org/user/${username}`;
export const raGameUrl = (gameId: number) => `https://retroachievements.org/game/${gameId}`;
export const raCoverUrl = (imageString: string) => `https://media.retroachievements.org${imageString}`

export const displayCredentialsError = () => {
	new Notice("Error 422: Incorrectly configured RA username or API key.").containerEl.addClass("error-text");
}
