/**
 * FinPress dependencies
 */
import { store } from '@finpress/interactivity';

const html = `
		<div
			data-fin-interactive="directive-key"
			data-fin-router-region="some-id"
		>
			<ul>
				<li data-fin-key="id-1">1</li>
				<li data-fin-key="id-2" data-testid="second-item">2</li>
				<li data-fin-key="id-3">3</li>
			</ul>
		</div>`;

store( 'directive-key', {
	actions: {
		*navigate() {
			const { actions } = yield import(
				'@finpress/interactivity-router'
			);
			return actions.navigate( window.location, {
				force: true,
				html,
			} );
		},
	},
} );
