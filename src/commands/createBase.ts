import { stringifyYaml, type BasesConfigFile, type BasesConfigFileView } from 'obsidian';
import RaSearchPlugin from '../main';
import { noteExists, openVaultNote } from '../utils';

const RA_STATUS_MARKER = `html("<span class='ra-status-value'>" + if(status, status, "none") + "</span><div class='ra-status ra-status-" + if(status, status, "none") + "'></div>")`;
// const RA_STATUS_MARKER = `html("<span class='ra-status-label'>Status</span><span class='ra-status-value ra-status-" + if(status, status, "none") + "'>" + if(status, status, "none") + "</span>")`;


type CardsView = BasesConfigFileView & {
	image?: string;
	imageFit?: string;
	imageAspectRatio?: number;
	cardSize?: number;
};

const view: CardsView = {
	type: "cards",
	name: "default",
	order: ["title", "console", "formula.raStatus"],
	image: "coverUrl",
	imageFit: "contain",
	cardSize: 320,
	imageAspectRatio: 1.40
};

export const runCreateBase = async (plugin: RaSearchPlugin) => {
	const base: BasesConfigFile = {
		filters: { and: [`file.inFolder("${plugin.settings.raGamesPath}")`, 'category == "RetroAchievements"'] },
		formulas: { raStatus: RA_STATUS_MARKER, },
		views: [view],
		properties: { "formula.raStatus": { displayName: "status" } }
	};
	const fileName = `${plugin.settings.raGamesPath}/RA Library.base`;
	let note = await noteExists(plugin.app, fileName);
	if (!note) {
		note = await plugin.app.vault.create(fileName, stringifyYaml(base));
	}
	await openVaultNote(plugin.app, note);
}
