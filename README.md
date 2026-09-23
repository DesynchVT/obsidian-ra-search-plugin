# Obsidian RA Search plugin

**This plugin is not officially supported or endorsed by the RetroAchievements team. It is independently created by me, [DesynchVT](https://github.com/DesynchVT)**. This is my first Obsidian plugin, so I am sure it can be improved upon.

![demo of base with imported RA-supported titles](https://github.com/DesynchVT/obsidian-ra-search-plugin/blob/86cf19781fafd0f9bc7db4654a0baf3f36f506a9/demo-images/library-base.png?raw=true)

# Description
Easily import your [RetroAchievements](https://retroachievements.org/) library with various metadata to discover connections and themes between your games.

# Usage
The plugin ships with just 3 easy-to-use commands. **Before you can use any of them**, you must set up your own RetroAchievements username and web API key in the settings. You can find your API key [under your RA user settings](https://retroachievements.org/settings?tab=applications)

## Auto import RA library
**Requires an RA account**

As the name suggests, it imports every single game listed on your RA account. Choose to also import subsets in the settings! Skips already imported games.

## Cancel auto import
If auto import is taking too long, run the **Cancel auto import** command from the command palette to stop it. Already-created notes are kept.

## Add game
**Requires an RA account**

Add any game or subset to your notes, whether or not you've played it before!
## Create base
Automatically create a base within Obsidian, automatically showing files in your configured RA notes library. You can customize it from here yourself, it's just to get you going. As a side note, the boxart images used in the base are hosted on RetroAchievements official media host: https://media.retroachievements.org

# Settings
![image of the settings menu in Obsidian](https://github.com/DesynchVT/obsidian-ra-search-plugin/blob/fc921981fe43b3d6422b624ba932e247bfdd160b/demo-images/plugin-settings.png?raw=true)

## RA username
self explanatory.

## RA web API key
Necessary to communicate with the RetroAchievements servers. Found [under your RA user settings](https://retroachievements.org/settings?tab=applications)

## Properties as links
Save game metadata as internal links in your vault to create connections between them.

## Auto open added game
Automatically open newly added game notes in a new tab. Does NOT affect auto import.

## Game note directory
The path RA games are imported to.

## Console subfolders
Enabled: Games go into subfolders of the console name (`~/PlayStation/Crash Bandicoot`

Disabled: Games go into the root game note directory. (`~/Crash Bandicoot (PlayStation)`)

## Include subsets in auto import
Whether auto import includes subsets or not.

## Show RA logo in ribbon menu
Toggle RA logo in ribbon menu. Clicking it runs the `Add game` command.

# Installation
I'm working on getting the plugin added to the official Obsidian community plugins page. For now, a manual installation is required.

## Manual installation
### Option A: Install from a release
1. Go to the [releases page](https://github.com/DesynchVT/obsidian-ra-search-plugin/releases) and download the latest release's `main.js`, `manifest.json`, and `styles.css`.
2. In your vault, open (or create) the folder `<vault>/.obsidian/plugins/obsidian-ra-search-plugin/`. The folder names **must** match exactly.
3. Copy the three downloaded files into that folder.
4. In Obsidian, open `Settings -> Community plugins` and select `Reload` (or fully restart Obsidian).
5. Find RA Search in the list and toggle it on.
Obsidian requires `Settings -> Community plugins -> Turn off safe mode` before any manually installed plugin can be enabled. Only install plugins from authors you trust.

### Option B: Build from source
Requires Node.js (https://nodejs.org/) 18+ and npm.

1. git clone https://github.com/DesynchVT/obsidian-ra-search-plugin.git

2. cd obsidian-ra-search-plugin

3. npm install

4. npm run build

5. Copy `main.js`, `manifest.json`, and `styles.css` into `<vault>/.obsidian/plugins/obsidian-ra-search-plugin/` and enable the plugin as in steps 4–5 above.
