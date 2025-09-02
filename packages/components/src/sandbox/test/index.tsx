/**
 * External dependencies
 */
import { fireEvent, render, screen, within } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import SandBox from '..';

describe( 'SandBox', () => {
	const TestWrapper = ( {
		title,
		sandbox,
		html,
	}: {
		title: string;
		sandbox?: string;
		html?: string;
	} ) => {
		const initialHtml =
			html ||
			'<iframe title="Mock Iframe" src="https://super.embed"></iframe>';
		const [ innerHtml, setInnerHtml ] = useState(
			// MutationObserver implementation from JSDom does not work as intended
			// with iframes so we need to ignore it for the time being.
			'<script type="text/javascript">window.MutationObserver = null;</script>' +
				initialHtml
		);

		const updateHtml = () => {
			setInnerHtml(
				'<iframe title="Mock Iframe" src="https://another.super.embed"></iframe>'
			);
		};

		return (
			<div>
				<button onClick={ updateHtml } className="mock-button">
					Mock Button
				</button>
				<SandBox
					html={ innerHtml }
					title={ title }
					sandbox={ sandbox }
				/>
			</div>
		);
	};

	it( 'should rerender with new emdeded content if html prop changes', () => {
		render( <TestWrapper title="SandBox Title" /> );

		const iframe =
			screen.getByTitle< HTMLIFrameElement >( 'SandBox Title' );

		if ( ! iframe.contentWindow ) {
			throw new Error();
		}

		let sandboxedIframe = within(
			iframe.contentWindow.document.body
		).getByTitle( 'Mock Iframe' );

		expect( sandboxedIframe ).toHaveAttribute(
			'src',
			'https://super.embed'
		);

		fireEvent.click( screen.getByRole( 'button' ) );

		sandboxedIframe = within(
			iframe.contentWindow.document.body
		).getByTitle( 'Mock Iframe' );

		expect( sandboxedIframe ).toHaveAttribute(
			'src',
			'https://another.super.embed'
		);
	} );

	it( 'should render with the correct sandbox attribute when sandbox prop is not provided', () => {
		render( <TestWrapper title="SandBox Title 2" /> );

		const iframe =
			screen.getByTitle< HTMLIFrameElement >( 'SandBox Title 2' );

		expect( iframe ).toHaveAttribute(
			'sandbox',
			'allow-scripts allow-same-origin allow-presentation'
		);
	} );

	it( 'should render with the correct sandbox attribute when sandbox prop is provided', () => {
		render(
			<TestWrapper
				title="SandBox Title 3"
				sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
			/>
		);

		const iframe =
			screen.getByTitle< HTMLIFrameElement >( 'SandBox Title 3' );

		expect( iframe ).toHaveAttribute(
			'sandbox',
			'allow-scripts allow-same-origin allow-presentation allow-popups'
		);
	} );
} );
