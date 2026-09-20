import { addIcon } from 'obsidian';
import raLogoSvg from './assets/ra-logo.svg';

export const RA_LOGO_ICON_ID = 'ra-logo';

export function registerRaIcon(): void {
	addIcon(RA_LOGO_ICON_ID, raLogoSvg);
}
