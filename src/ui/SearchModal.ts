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
		input.placeholder = "Search by game ID or URL";

		const btn = contentEl.createEl("button");
		btn.textContent = "Add game";
		btn.addEventListener("click", (_e) => {
			const inputCheck = this.isInputValid(input.value);
			if (!inputCheck.success) {
				// TODO: HTML to show the user error
				new Notice(inputCheck.msg).containerEl.addClass("error-text")
				return;
			}
			if (!inputCheck.id) {
				return;
			}
			getSpecificGame(this.plugin, inputCheck.id).then((game) => {
				if (!game) {
					new Notice(`Error importing game with ID "${inputCheck.id}." It might not exist.`);
					return;
				}
				addGame(this.plugin, game).catch(e => {
					console.error(e);
					new Notice(`Error importing game with ID "${inputCheck.id}."`).containerEl.addClass("error-text");
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

	isInputValid(inputVal: string): { success: boolean, msg: string, id?: number } {
		const originalInput = inputVal;

		if (inputVal === "" || inputVal === null || inputVal === undefined) {
			new Notice(inputVal).containerEl.addClass("error-text");
			return {
				success: false,
				msg: "Input must not be empty."
			};
		}
		// check is full url
		if (inputVal.includes("retroachievements.org")) {
			const id = inputVal.substring(inputVal.lastIndexOf("/") + 1);
			inputVal = id;
		}
		if (!isNumeric(inputVal) || +inputVal < 0) {
			// check is just ID
			return {
				success: false,
				msg: `${originalInput} is not a valid RA game id.`
			}
		}
		return {
			success: true,
			msg: "",
			id: +inputVal,
		};
	}
}

