import {
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	RaPluginSettings,
	RaSettingTab,
} from './settings';
import { type AuthObject, buildAuthorization } from '@retroachievements/api';
import { runAddGameById, runAutoImport } from './commands';
import { RA_LOGO_ICON_ID, registerRaIcon } from './icons';

export default class RaSearchPlugin extends Plugin {
	settings!: RaPluginSettings;
	rootPath!: string;
	raAuth!: AuthObject;
	private ribbonEl!: HTMLElement | null;

	async onload() {
		registerRaIcon();
		this.rootPath = this.app.vault.getRoot().path;
		await this.loadSettings();
		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new RaSettingTab(this.app, this));
		this.rebuildRaAuth();
		this.toggleRibbonIcon();

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
	toggleRibbonIcon() {
		if (this.settings.displayRibbonIcon && !this.ribbonEl) {
			this.ribbonEl = this.addRibbonIcon(RA_LOGO_ICON_ID, "Add RA achievement set", (_evt: MouseEvent) => void this.handleRibbonClick());
		} else {
			this.ribbonEl?.remove();
			this.ribbonEl = null;
		}
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
		if (this.settings.raUsername && this.settings.raWebApiKey) {
			this.raAuth = buildAuthorization({
				username: this.settings.raUsername,
				webApiKey: this.app.secretStorage.getSecret(this.settings.raWebApiKey) || ""
			});
		}
	}

	private async handleRibbonClick() {
		await runAddGameById(this);
	}

	onunload() { }
}

