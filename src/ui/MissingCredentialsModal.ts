import { Modal, Notice, Setting } from "obsidian";
import RaSearchPlugin from "../main";

interface AppWithSettingsTab {
	setting: {
		open(): void;
		openTabById(id: string): void;
	};
}

export class MissingCredentialsModal extends Modal {
	private readonly plugin: RaSearchPlugin;
	constructor(plugin: RaSearchPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onOpen() {
		this.titleEl.setText("RA credentials missing");
		this.contentEl.createEl("p", {
			text: `${this.plugin.manifest.name} needs the following before it can run:`
		});
		const list = this.contentEl.createEl("ul");
		if (!this.plugin.settings.raUsername) {
			list.createEl("li", {
				text: "RA username"
			});
		}
		if (!this.plugin.isTokenSet()) {
			list.createEl("li", {
				text: "RA web API key"
			});
		}

		this.contentEl.createEl("p", {
			text: "Open settings and set them now?"
		});

		new Setting(this.contentEl)
			.addButton((btn) => btn.setButtonText("Open settings").setCta()
				.onClick(() => {
					this.close();
					const settingsOpenSuccess = this.openPluginSettings()
					if (!settingsOpenSuccess) {
						// Theoretically should never happen, but here we are
						new Notice(`${this.plugin.manifest.name}: Couldn't open settings. Please do so manually.`).containerEl.addClass("ra-search-error-text");
					}
				}))
			.addButton((btn) => btn.setButtonText("Cancel")
				.onClick(() => {
					this.close();
				}));
	}
	onClose() {
		this.contentEl.empty();
	}

	private openPluginSettings(): boolean {
		const app = this.app as unknown as Partial<AppWithSettingsTab>;
		if (!app.setting) return false;
		app.setting.open();
		app.setting.openTabById(this.plugin.manifest.id);
		return true;
	}
}
