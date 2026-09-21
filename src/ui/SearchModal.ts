import { Modal, Notice, Setting } from "obsidian";
import RaSearchPlugin from "../main";
import { isNumeric } from "../utils";
import { getSpecificGame } from "../ra";
import { addGame } from "../commands";

export class SearchModal extends Modal {
	private readonly plugin: RaSearchPlugin;
	private errorEl: HTMLElement | null = null;
	constructor(plugin: RaSearchPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onOpen() {
		this.titleEl.setText("Add game");

		const form = this.contentEl.createEl("form");
		this.errorEl = form.createDiv({ cls: "error-text" });

		let inputValue = "";
		new Setting(form)
			.setName("Game ID or URL")
			.setDesc("Paste a RetroAchievements game ID or URL.")
			.addText((text) => {
				text.setPlaceholder("retroachievements.org/game/1")
					.onChange((v) => { inputValue = v; });
			})
			.addButton((btn) => {
				btn.setButtonText("Add game").setCta()
			});

		form.addEventListener("submit", (e) => {
			e.preventDefault();
			void this.handleOnAddGame(inputValue);
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		this.errorEl = null;
	}

	private async handleOnAddGame(inputVal: string) {
		this.errorEl?.empty();
		const inputCheck = this.isInputValid(inputVal);
		if (!inputCheck.success) {
			this.errorEl?.setText(inputCheck.msg);
			return;
		}
		// Should never be true, but ts complains otherwise
		if (!inputCheck.id) {
			return;
		}

		const game = await getSpecificGame(this.plugin, inputCheck.id)
		if (!game) {
			this.errorEl?.setText(`Error importing game with ID "${inputCheck.id}." It might not exist.`);
			return;
		}

		try {
			const gameNote = await addGame(this.plugin, game);
			if (gameNote != null) {
				new Notice(`${this.plugin.manifest.name}: Imported "${game.title}"`);
				if (this.plugin.settings.autoOpenAddedGame) {
					const leaf = this.plugin.app.workspace.getLeaf(true);
					await leaf.openFile(gameNote);
				}
				this.close();
				return;
			}
		} catch (error) {
			console.error(error);
			this.errorEl?.setText(`Error importing game with ID "${inputCheck.id}."`);
			return;
		}
		this.close();
	}

	isInputValid(inputVal: string): { success: boolean, msg: string, id?: number } {
		const originalInput = inputVal;

		if (inputVal === "" || inputVal === null || inputVal === undefined) {
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

