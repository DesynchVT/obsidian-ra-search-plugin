import {
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	RaPluginSettings,
	RaSettingTab,
} from './settings';
import { type AuthObject, buildAuthorization } from '@retroachievements/api';
import { SearchModal } from './ui';
import { autoImport } from './ra';

export default class RaSearchPlugin extends Plugin {
	settings!: RaPluginSettings;
	rootPath!: string;
	raAuth!: AuthObject;

	async onload() {
		this.rootPath = this.app.vault.getRoot().path;
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RaSettingTab(this.app, this));
		this.raAuth = buildAuthorization({
			username: "Desynch",
			webApiKey: this.app.secretStorage.getSecret(this.settings.raWebApiKey) || ""
		})

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("dice", "Add RA set", (_evt: MouseEvent) => {
			new Notice("NYI");
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'auto-import',
			name: 'Auto import RA library',
			callback: async () => {
				if (!this.isTokenSet()) {
					new Notice("RA web API token not set in settings. Cannot auto import games.");
					return;
				}

				await autoImport(this);
				new Notice(`${this.manifest.name}: Auto import completed!`);
			},
		});

		this.addCommand({
			id: 'add-game-by-id',
			name: 'Add game',
			callback: () => {
				if (!this.isTokenSet()) {
					new Notice("RA web API token not set in settings. Cannot auto import games.");
					return;
				}
				new SearchModal(this).open();
			},
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

