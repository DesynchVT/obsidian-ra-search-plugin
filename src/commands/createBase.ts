import { stringifyYaml, type BasesConfigFile, type BasesConfigFileView } from 'obsidian';
import RaSearchPlugin from '../main';
import { noteExists, openVaultNote } from '../utils';

type CardsView = BasesConfigFileView & {
	image?: string;
	imageFit?: string;
	imageAspectRatio?: number;
	cardSize?: number;
};

const view: CardsView = {
	type: "cards",
	name: "default",
	order: ["title", "console", "status"],
	image: "coverUrl",
	imageFit: "contain",
	cardSize: 320,
};

export const runCreateBase = async (plugin: RaSearchPlugin) => {
	const base: BasesConfigFile = {
		filters: { and: [`file.inFolder("${plugin.settings.raGamesPath}")`] },
		views: [view],
	};
	const fileName = `${plugin.settings.raGamesPath}/RA Library.base`;
	let note = await noteExists(plugin.app, fileName);
	if (!note) {
		note = await plugin.app.vault.create(fileName, stringifyYaml(base));
	}
	await openVaultNote(plugin.app, note);
}
