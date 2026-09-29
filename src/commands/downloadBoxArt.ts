import { normalizePath, Notice } from "obsidian";
import type RaSearchPlugin from "../main";
import { abortableSleep, gameIdFromSetUrl, isAbortError } from "../utils";
import { downloadBoxArt } from "../ra";

const DOWNLOAD_DELAY_MS = 500;

const getFronMatterOfNote = (plugin: RaSearchPlugin, notePath: string) => {
	return plugin.app.metadataCache.getCache(notePath)?.frontmatter;
}

export const runDownloadBoxArt = async (plugin: RaSearchPlugin) => {
	const root = normalizePath(plugin.settings.raGamesPath);
	if (!root) {
		new Notice(`${plugin.manifest.name}: Set a game note directory in settings first.`);
		return;
	}

	const abortController = plugin.startAutoImport();
	if (!abortController) {
		new Notice(`${plugin.manifest.name}: An import is already running.`);
		return;
	}

	try {
		const notes = plugin.app.vault
			.getMarkdownFiles()
			.filter((file) => file.path.startsWith(`${root}/`));

		let downloaded = 0;
		let skipped = 0;
		let failed = 0;

		for (const [i, note] of notes.entries()) {
			abortController.signal.throwIfAborted();

			const fm = getFronMatterOfNote(plugin, note.path);
			const coverUrl = typeof fm?.coverUrl === "string" ? fm.coverUrl : "";
			if (!coverUrl) {
				skipped++;
				continue;
			}

			// A cover field pointing at a deleted file would render as a broken image, so
			// treat it as missing and re-download rather than skipping.
			const existingCover = typeof fm?.cover === "string" ? fm.cover : "";
			if (existingCover && plugin.app.vault.getAbstractFileByPath(existingCover)) {
				skipped++;
				continue;
			}

			const setUrl = typeof fm?.setUrl === "string" ? fm.setUrl : "";
			const gameId = gameIdFromSetUrl(setUrl);
			if (gameId === undefined) {
				skipped++;
				continue;
			}

			const boxartPath = await downloadBoxArt(plugin, gameId, coverUrl, abortController.signal);
			if (!boxartPath) {
				failed++;
				continue;
			}

			await plugin.app.fileManager.processFrontMatter(note, (frontmatter) => {
				Object.assign(frontmatter, { cover: boxartPath });
			});
			downloaded++;

			if (i + 1 !== notes.length) {
				await abortableSleep(DOWNLOAD_DELAY_MS, abortController.signal);
			}
		}

		new Notice(
			`${plugin.manifest.name}: downloaded ${downloaded} new boxart.`,
		);
		if (failed > 0) {
			new Notice(
				`${plugin.manifest.name}: ${failed} boxarts failed to download.`,
			);
		}
	} catch (error) {
		if (isAbortError(error)) {
			new Notice(`${plugin.manifest.name}: Boxart download cancelled.`);
			return;
		}
		console.error(error);
		new Notice(`${plugin.manifest.name}: ${String(error)}`).containerEl.addClass("ra-search-error-text");
	} finally {
		plugin.finishAutoImport(abortController);
	}
};
