import { App, PluginSettingTab, Setting, SecretComponent } from 'obsidian';
import RaSearchPlugin from './main';

export interface RaPluginSettings {
	raWebApiKey: string;
	propertiesAsLinks: boolean;
}

export const DEFAULT_SETTINGS: RaPluginSettings = {
	raWebApiKey: '',
	propertiesAsLinks: true,
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
			.setName('RA Web API Key')
			.addComponent(el => new SecretComponent(this.app, el)
				.setValue(this.plugin.settings.raWebApiKey)
				.onChange(val => {
					this.plugin.settings.raWebApiKey = val;
					this.plugin.saveSettings();
				})
			);
		new Setting(containerEl).setName("Properties as Links").setDesc("Save game metadata as internal links in your vault to create connections between them").addToggle(btn => {
			btn.setValue(this.plugin.settings.propertiesAsLinks).onChange(async (value) => {
				this.plugin.settings.propertiesAsLinks = value;
				await this.plugin.saveSettings();
			})
		})
	}
}
