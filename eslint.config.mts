import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import { globalIgnores, defineConfig } from 'eslint/config';
import { DEFAULT_ACRONYMS } from "eslint-plugin-obsidianmd/dist/lib/rules/ui/acronyms.js";
import { DEFAULT_BRANDS } from "eslint-plugin-obsidianmd/dist/lib/rules/ui/brands.js";

export default defineConfig(
	globalIgnores([
		'node_modules',
		'dist',
		'esbuild.config.mjs',
		'version-bump.mjs',
		'versions.json',
		'main.js',
		'package.json',
		'package-lock.json',
		'tsconfig.json',
	]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
			parserOptions: {
				projectService: {
					allowDefaultProject: ['eslint.config.mts', 'manifest.json'],
				},
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
		},
	},
	...obsidianmd.configs.recommended,
	// Custom changes to the linter for this specific plugin. "RA" is an acronym of "RetroAchievements", which is the project hosted on https://retroachievements.org/
	// The rules below should not affect the linter otherwise
	{
		rules: {
			"obsidianmd/ui/sentence-case": ["warn", {
				enforceCamelCaseLower: true, // keep recommended behavior
				acronyms: [...DEFAULT_ACRONYMS, "RA"],
				brands: [...DEFAULT_BRANDS, "RetroAchievements"],
			}],
		},
	},
);
