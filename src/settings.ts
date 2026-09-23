import { App, PluginSettingTab, Setting, SecretComponent } from 'obsidian';
import RaSearchPlugin from './main';

export interface RaPluginSettings {
	raWebApiKey: string;
	propertiesAsLinks: boolean;
	raUsername: string;
	raGamesPath: string;
	includeSubsets: boolean;
	displayRibbonIcon: boolean;
	autoOpenAddedGame: boolean;
	consoleSubfolders: boolean;
}

export const DEFAULT_SETTINGS: RaPluginSettings = {
	raWebApiKey: '',
	propertiesAsLinks: true,
	raUsername: "",
	raGamesPath: "RetroAchievements/library",
	includeSubsets: false,
	displayRibbonIcon: true,
	autoOpenAddedGame: true,
	consoleSubfolders: true,
};

export class RaSettingTab extends PluginSettingTab {
	plugin: RaSearchPlugin;

	constructor(app: App, plugin: RaSearchPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("RA username")
			.setDesc("Your username on retroachievements.org")
			.addText((text) => {
				text.setValue(this.plugin.settings.raUsername).onChange(async (val) => {
					this.plugin.settings.raUsername = val?.trim();
					await this.plugin.saveSettings();
					this.plugin.rebuildRaAuth();
				})
			});
		const raApiKeyDesc = document.createDocumentFragment();
		raApiKeyDesc.appendText("Your personal API key from retroachievements.org. Found in ");
		raApiKeyDesc.createEl("a", {
			text: "RA user settings",
			href: "https://retroachievements.org/settings?tab=applications",
		});
		raApiKeyDesc.appendText(".");
		new Setting(containerEl)
			.setName('RA web API key')
			.setDesc(raApiKeyDesc)
			.addComponent(el => new SecretComponent(this.app, el)
				.setValue(this.plugin.settings.raWebApiKey)
				.onChange(async (val) => {
					this.plugin.settings.raWebApiKey = val?.trim();
					await this.plugin.saveSettings();
					this.plugin.rebuildRaAuth();
				})
			);

		new Setting(containerEl)
			.setName("Properties as links")
			.setDesc(`Save game metadata as internal links in your vault to create connections between them.\nDefault: ${DEFAULT_SETTINGS.propertiesAsLinks}`)
			.addToggle(btn => {
				btn.setValue(this.plugin.settings.propertiesAsLinks).onChange(async (value) => {
					this.plugin.settings.propertiesAsLinks = value;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName("Auto open added game")
			.setDesc(`Automatically open newly added game notes in a new tab. Does NOT affect auto import.\nDefault: ${DEFAULT_SETTINGS.autoOpenAddedGame}`)
			.addToggle(btn => {
				btn.setValue(this.plugin.settings.autoOpenAddedGame).onChange(async (value) => {
					this.plugin.settings.autoOpenAddedGame = value;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName("Game note directory")
			.setDesc(`The path RA games are imported to.\nDefault: ${DEFAULT_SETTINGS.raGamesPath}`)
			.addText((text) => {
				text.setValue(this.plugin.settings.raGamesPath).onChange(async (val) => {
					this.plugin.settings.raGamesPath = val.trim();
					await this.plugin.saveSettings();
				});
				text.setPlaceholder(DEFAULT_SETTINGS.raGamesPath);
			});

		const consoleSubfoldersDesc = document.createDocumentFragment();
		consoleSubfoldersDesc.appendText("Enabled: Games go into subfolders of the console name. E.g. ");
		consoleSubfoldersDesc.createEl("br");
		consoleSubfoldersDesc.createEl("code", {
			text: "~/PlayStation/Crash Bandicoot",
		});
		consoleSubfoldersDesc.createEl("br");
		consoleSubfoldersDesc.appendText("Disabled: Games go into the game note directory. E.g. ");
		consoleSubfoldersDesc.createEl("br");
		consoleSubfoldersDesc.createEl("code", {
			text: "~/Crash Bandicoot (PlayStation)",
		});
		new Setting(containerEl)
			.setName("Console subfolders")
			.setDesc(consoleSubfoldersDesc)
			.addToggle(btn => {
				btn.setValue(this.plugin.settings.consoleSubfolders).onChange(async (value) => {
					this.plugin.settings.consoleSubfolders = value;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName("Include subsets in auto import")
			.setDesc(`Whether auto import includes subsets or not.\nDefault: ${DEFAULT_SETTINGS.includeSubsets}`)
			.addToggle(btn => {
				btn.setValue(this.plugin.settings.includeSubsets).onChange(async (value) => {
					this.plugin.settings.includeSubsets = value;
					await this.plugin.saveSettings();
				})
			});

		new Setting(containerEl)
			.setName("Show RA logo in ribbon menu")
			.addToggle(btn => {
				btn.setValue(this.plugin.settings.displayRibbonIcon).onChange(async (value) => {
					this.plugin.settings.displayRibbonIcon = value;
					await this.plugin.saveSettings();
					this.plugin.toggleRibbonIcon();
				})
			});
	}
}
