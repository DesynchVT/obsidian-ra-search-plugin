import { Notice } from "obsidian";
import type RaSearchPlugin from "../main";
import { findNoteBySetUrl, isAbortError, requireCredentials } from "../utils";
import { getAllRaGames } from "../ra";

const VALID_STATUSES: ReadonlySet<string> = new Set([
	"beaten-softcore",
	"beaten-hardcore",
	"completed",
	"mastered",
	"none",
]);

export const runUpdateMasteryStatus = async (plugin: RaSearchPlugin) => {
	if (!requireCredentials(plugin)) {
		return;
	}

	const abortController = plugin.startAutoImport();
	if (!abortController) {
		new Notice(`${plugin.manifest.name}: An import is already running.`);
		return;
	}

	try {
		const games = await getAllRaGames(plugin.raAuth, plugin.settings.raUsername, abortController.signal);

		let updated = 0;
		let skipped = 0;
		for (const game of games) {
			abortController.signal.throwIfAborted();
			const note = findNoteBySetUrl(plugin, game.gameId);
			if (!note) {
				skipped++;
				continue;
			}

			const current = String(plugin.app.metadataCache.getCache(note.path)?.frontmatter?.status);
			// Respect manual values: only touch statuses the plugin itself would have set.
			if (typeof current !== "string" || !VALID_STATUSES.has(current)) {
				skipped++;
				continue;
			}

			if (current === game.status) {
				skipped++;
				continue;
			}

			await plugin.app.fileManager.processFrontMatter(note, (fm) => {
				(fm as Record<string, unknown>).status = game.status;
			});
			updated++;
		}
		new Notice(`${plugin.manifest.name}: Updated status of ${updated} games`);
	} catch (error) {
		if (isAbortError(error)) {
			new Notice(`${plugin.manifest.name}: Status refresh cancelled.`);
			return;
		}
		console.error(error);
		new Notice(`${plugin.manifest.name}: ${String(error)}`).containerEl.addClass("ra-search-error-text");
	} finally {
		plugin.finishAutoImport(abortController);
	}
}
