import { Modal, Setting } from "obsidian";
import RaSearchPlugin from "../main";

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
					(this.app as any).setting.open();
					(this.app as any).setting.openTabById(this.plugin.manifest.id);
				}))
			.addButton((btn) => btn.setButtonText("Cancel")
				.onClick(() => {
					this.close();
				}));
	}
	onClose() {
		this.contentEl.empty();
	}
}
