import RaSearchPlugin from "../main";
import { SearchModal } from "../ui";
import { requireCredentials } from "../utils";

export const runAddGameById = async (plugin: RaSearchPlugin) => {
	if (!requireCredentials(plugin)) {
		return;
	}
	new SearchModal(plugin).open();
}

