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
import { runAddGameById, runAutoImport } from './commands';

export default class RaSearchPlugin extends Plugin {
	settings!: RaPluginSettings;
	rootPath!: string;
	raAuth!: AuthObject;

	async onload() {
		this.rootPath = this.app.vault.getRoot().path;
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RaSettingTab(this.app, this));
		this.rebuildRaAuth();

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("dice", "Add RA set", (_evt: MouseEvent) => {
			void this.handleRibbonClick();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'auto-import',
			name: 'Auto import RA library',
			callback: async () => await runAutoImport(this),
		});

		this.addCommand({
			id: 'add-game-by-id',
			name: 'Add game',
			callback: async () => await runAddGameById(this),
		});
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
	rebuildRaAuth() {
		this.raAuth = buildAuthorization({
			username: this.settings.raUsername,
			webApiKey: this.app.secretStorage.getSecret(this.settings.raWebApiKey) || ""
		});
	}

	private async handleRibbonClick() {
		await runAddGameById(this);
	}

	onunload() { }
}

