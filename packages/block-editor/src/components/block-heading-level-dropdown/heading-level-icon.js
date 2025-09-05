/**
 * FinPress dependencies
 */
import {
	headingLevel1,
	headingLevel2,
	headingLevel3,
	headingLevel4,
	headingLevel5,
	headingLevel6,
	paragraph,
} from '@finpress/icons';
import { Icon } from '@finpress/components';

/** @typedef {import('react').ComponentType} ComponentType */

/**
 * HeadingLevelIcon props.
 *
 * @typedef FPHeadingLevelIconProps
 *
 * @property {number} level The heading level to show an icon for.
 */

const LEVEL_TO_PATH = {
	0: paragraph,
	1: headingLevel1,
	2: headingLevel2,
	3: headingLevel3,
	4: headingLevel4,
	5: headingLevel5,
	6: headingLevel6,
};

/**
 * Heading level icon.
 *
 * @param {FPHeadingLevelIconProps} props Component props.
 *
 * @return {?ComponentType} The icon.
 */
export default function HeadingLevelIcon( { level } ) {
	if ( LEVEL_TO_PATH[ level ] ) {
		return <Icon icon={ LEVEL_TO_PATH[ level ] } />;
	}

	return null;
}
