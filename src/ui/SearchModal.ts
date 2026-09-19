import { Modal, Notice } from "obsidian";
import RaSearchPlugin from "../main";

export class SearchModal extends Modal {
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
		input.placeholder = "Search by game ID";

		const btn = contentEl.createEl("button");
		btn.textContent = "Add game";
		btn.addEventListener("click", (_e) => {
			new Notice("Not yet implemented.");
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

