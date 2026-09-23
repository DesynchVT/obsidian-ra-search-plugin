# Obsidian RA Search plugin

**This plugin is not officially supported or endorsed by the RetroAchievements team. It is independently created and supported by [DesynchVT](https://github.com/DesynchVT)**

# Description
Easily import your [RetroAchievements](https://retroachievements.org/) library with various metadata to see connections and themes between your games.

![demo of base with imported RA-supported titles](https://github.com/DesynchVT/obsidian-ra-search-plugin/blob/86cf19781fafd0f9bc7db4654a0baf3f36f506a9/demo-images/library-base.png?raw=true)

# Usage
The plugin ships with just 3 easy-to-use commands. **Before you can use any of them**, you must set up your own RetroAchievements username and web API key in the settings. You can find your API key [under your RA user settings](https://retroachievements.org/settings?tab=applications)

## Auto import RA library
**Requires an RA account**
As the name suggests, it imports every single game listed on your RA account. Choose to also import subsets in the settings!
## Add game
**Requires an RA account**
Add any game or subset to your notes, whether or not you've played it before!
## Create base
Automatically create a base within Obsidian, automatically showing files in your configured RA notes library. You can customize it from here yourself, it's just to get you going.

# Settings
![image of the settings menu in Obsidian](https://github.com/DesynchVT/obsidian-ra-search-plugin/blob/fc921981fe43b3d6422b624ba932e247bfdd160b/demo-images/plugin-settings.png?raw=true)

`RA username`: self explanatory.

`RA web API key`: Necessary to communicate with the RetroAchievements servers. Found [under your RA user settings](https://retroachievements.org/settings?tab=applications)

`Properties as links`: Save game metadata as internal links in your vault to create connections between them.

`Auto open added game`: Automatically open newly added game notes in a new tab. Does NOT affect auto import.

`Game note directory`: The path RA games are imported to.

`Console subfolders`:
Enabled: Games go into subfolders of the console name (`~/PlayStation/Crash Bandicoot`
Disabled: Games go into the root game note directory. (`~/Crash Bandicoot (PlayStation)`)

`Include subsets in auto import`: Whether auto import includes subsets or not.

`Show RA logo in ribbon menu`: Toggle RA logo in ribbon menu. Clicking it runs the `Add game` command.

# Installation
