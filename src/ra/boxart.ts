import { normalizePath, requestUrl } from "obsidian";
import RaSearchPlugin from "../main";
import { ensureFolderStructure } from "../utils";

const FALLBACK_EXTENSION = "png";
const BOX_ART_FOLDER = "boxart";

/**
 * Vault-relative path for a game's cover. Keyed by the permanent RA game ID rather than
 * the title, so covers are collision-free, survive title changes, and make re-imports
 * idempotent without any filename sanitisation.
 */
export const boxArtPath = (plugin: RaSearchPlugin, gameId: number, coverUrl: string) => {
	const ext = new URL(coverUrl).pathname.match(/\.([a-z]+)$/i)?.[1] ?? FALLBACK_EXTENSION;
	return normalizePath(`${plugin.settings.raGamesPath}/${BOX_ART_FOLDER}/${gameId}.${ext}`);
};

/**
 * Download a game's cover into the vault.
 *
 * Returns the vault-relative path, or an empty string when the game has no box art or the
 * download failed. A failed cover must never fail the game import, so every failure path
 * here degrades to "no local cover" and lets the card fall back to the remote URL.
 */
export const downloadBoxArt = async (
	plugin: RaSearchPlugin,
	gameId: number,
	coverUrl: string,
	signal?: AbortSignal,
) => {
	if (!plugin.settings.downloadBoxArt || !coverUrl) {
		return "";
	}

	try {
		const path = boxArtPath(plugin, gameId, coverUrl);
		if (plugin.app.vault.getAbstractFileByPath(path)) {
			return path;
		}

		signal?.throwIfAborted();
		const res = await requestUrl({ url: coverUrl, throw: false });
		if (res.status !== 200 || res.arrayBuffer.byteLength === 0) {
			console.warn(`${plugin.manifest.name}: Boxart download failed (${res.status}) for ${coverUrl}`);
			return "";
		}

		await ensureFolderStructure(plugin.app, path);
		await plugin.app.vault.createBinary(path, res.arrayBuffer);
		return path;
	} catch (error) {
		console.error(`${plugin.manifest.name}: Boxart download error for ${coverUrl}`, error);
		return "";
	}
};
