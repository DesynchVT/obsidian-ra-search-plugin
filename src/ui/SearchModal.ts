import { Modal, Notice } from "obsidian";
import RaSearchPlugin from "../main";
import { isNumeric } from "../utils";
import { getSpecificGame } from "../ra";
import { addGame } from "../commands";

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
			if (!this.isInputValid(input.value)) {
				// TODO: HTML to show the user error
				return;
			}
			getSpecificGame(this.plugin, +input.value).then((game) => {
				if (!game) {
					new Notice(`Error importing game with ID "${input.value}." It might not exist.`);
					return;
				}
				addGame(this.plugin, game).catch(e => {
					console.error(e);
					new Notice(`Error importing game with ID "${input.value}."`).containerEl.addClass("error-text");
					return;
				})
				new Notice(`${this.plugin.manifest.name}: Imported "${game.title}"`);

			}).catch(err => {
				console.error(err)
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	isInputValid(inputVal: string) {
		if (inputVal === "" || inputVal === null || inputVal === undefined) {
			new Notice(inputVal).containerEl.addClass("error-text");
			return false;
		} else if (!isNumeric(inputVal) || +inputVal < 0) {
			new Notice(`${inputVal} is not a valid RA game id.`).containerEl.addClass("error-text");
			return false;
		}
		return true;
	}
}

