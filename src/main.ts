import {
	Modal,
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	RaPluginSettings,
	RaSettingTab,
} from './settings';
import { addGame } from "./commands";
import { RaGame } from './types';
import { raUserUrl } from './ra/utils';

const temp: RaGame = {
	title: "Ratchet & Clank",
	console: "PS2",
	genres: ["action", "platformer"],
	status: "mastered",
	raDevelopers: [`[Desynch](${raUserUrl("Desynch")})`],
	developers: ["Insomniac Games"],
	publishers: ["someone"],
	setUrl: "",
	coverUrl: "",
}


export default class RaSearchPlugin extends Plugin {
	settings!: RaPluginSettings;
	rootPath!: string;

	async onload() {
		this.rootPath = this.app.vault.getRoot().path;
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RaSettingTab(this.app, this));

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("dice", 'Sample', (_evt: MouseEvent) => {
			const raToken = this.app.secretStorage.getSecret(this.settings.raWebApiKey) || "Not found";
			new Notice(raToken);
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'add-game',
			name: 'Add game',
			callback: async () => new SearchModal(this).open(),
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
		// );
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<RaPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	isTokenSet() {
		return this.app.secretStorage.getSecret(this.settings.raWebApiKey) !== null;
	}
	onunload() { }
}

class SearchModal extends Modal {
	private readonly plugin: RaSearchPlugin;
	constructor(plugin: RaSearchPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1").textContent = "Add game";

		const input = contentEl.createEl("input");
		input.name = "raGame";
		input.id = "raGame";
		input.placeholder = "Search by game title or ID";

		const btn = contentEl.createEl("button");
		btn.textContent = "Add game"
		btn.addEventListener('click', async (_e) => {
			const game = input.value;
			await addGame(this.plugin, game, temp);
			this.close();
		})
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
