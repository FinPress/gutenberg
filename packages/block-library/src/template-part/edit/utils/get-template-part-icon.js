/**
 * FinPress dependencies
 */
import {
	header as headerIcon,
	footer as footerIcon,
	sidebar as sidebarIcon,
	symbolFilled as symbolFilledIcon,
} from '@finpress/icons';

export const getTemplatePartIcon = ( iconName ) => {
	if ( 'header' === iconName ) {
		return headerIcon;
	} else if ( 'footer' === iconName ) {
		return footerIcon;
	} else if ( 'sidebar' === iconName ) {
		return sidebarIcon;
	}
	return symbolFilledIcon;
};
