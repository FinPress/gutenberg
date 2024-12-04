/**
 * Internal dependencies
 */
import type { Template } from '../../types';
import { BaseTitleView } from '../title/view';

export default function PageTitleView( { item }: { item: Template } ) {
	return (
		<BaseTitleView item={ item } className="fields-field__template-title" />
	);
}
