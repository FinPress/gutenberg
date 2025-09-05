/**
 * FinPress dependencies
 */
import deprecated from '@finpress/deprecated';

export { store } from './store';
export { default as DotTip } from './components/dot-tip';

deprecated( 'fp.nux', {
	since: '5.4',
	hint: 'fp.components.Guide can be used to show a user guide.',
	version: '6.2',
} );
