/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Badge from '..';

describe( 'Badge', () => {
	it( 'should render correctly with default props', () => {
		render( <Badge>Code is Poetry</Badge> );
		const badge = screen.getByText( 'Code is Poetry' );
		expect( badge ).toBeInTheDocument();
		expect( badge.tagName ).toBe( 'DIV' ); // Default element should be a div
		expect( badge ).toHaveClass( 'components-badge' );
	} );

	it( 'should render as a span when specified', () => {
		render( <Badge as="span">Code is Poetry</Badge> );
		const badge = screen.getByText( 'Code is Poetry' );
		expect( badge.tagName ).toBe( 'SPAN' );
		expect( badge ).toHaveClass( 'components-badge' );
	} );

	it( 'should render as a custom element when specified', () => {
		render( <Badge as="article">Code is Poetry</Badge> );
		const badge = screen.getByText( 'Code is Poetry' );
		expect( badge.tagName ).toBe( 'ARTICLE' );
		expect( badge ).toHaveClass( 'components-badge' );
	} );

	it( 'should combine custom className with default class', () => {
		render( <Badge className="custom-class">Code is Poetry</Badge> );
		const badge = screen.getByText( 'Code is Poetry' );
		expect( badge ).toHaveClass( 'components-badge' );
		expect( badge ).toHaveClass( 'custom-class' );
	} );

	it( 'should render children correctly', () => {
		render(
			<Badge>
				<span>Nested</span> Content
			</Badge>
		);

		const badge = screen.getByText( ( content, element ) => {
			return element?.classList?.contains( 'components-badge' ) ?? false;
		} );

		expect( badge ).toBeInTheDocument();
		expect( badge ).toHaveClass( 'components-badge' );
		expect( badge ).toHaveTextContent( 'Nested Content' );

		const nestedSpan = screen.getByText( 'Nested' );
		expect( nestedSpan.tagName ).toBe( 'SPAN' );
	} );

	it( 'should pass through additional props', () => {
		render( <Badge data-testid="custom-badge">Code is Poetry</Badge> );
		const badge = screen.getByTestId( 'custom-badge' );
		expect( badge ).toHaveTextContent( 'Code is Poetry' );
		expect( badge ).toHaveClass( 'components-badge' );
	} );
} );
