/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';

/**
 * FinPress dependencies
 */
import { useviewportMatch } from '@finpress/compose';

/**
 * Internal dependencies
 */
import '../store';
import withviewportMatch from '../with-viewport-match';

jest.mock( '@finpress/compose/src/hooks/use-viewport-match' );

const Component = ( { isWide, isSmall, isLarge, isLessThanSmall } ) => {
	return (
		<div>
			<span>{ isWide && 'Is wide' }</span>
			<span>{ isSmall && 'Is small' }</span>
			<span>{ isLarge && 'Is large' }</span>
			<span>{ isLessThanSmall && 'Is less than small' }</span>
		</div>
	);
};

describe( 'withviewportMatch()', () => {
	afterEach( () => {
		useviewportMatch.mockClear();
	} );

	it( 'should render with result of query as custom prop name', () => {
		const EnhancedComponent = withviewportMatch( {
			isWide: '>= wide',
			isSmall: '>= small',
			isLarge: 'large',
			isLessThanSmall: '< small',
		} )( Component );

		useviewportMatch.mockReturnValueOnce( false );
		useviewportMatch.mockReturnValueOnce( true );
		useviewportMatch.mockReturnValueOnce( true );
		useviewportMatch.mockReturnValueOnce( false );

		render( <EnhancedComponent /> );

		expect( useviewportMatch.mock.calls ).toEqual( [
			[ 'wide', '>=' ],
			[ 'small', '>=' ],
			[ 'large', '>=' ],
			[ 'small', '<' ],
		] );

		expect( screen.getByText( 'Is small' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Is large' ) ).toBeInTheDocument();
		expect( screen.queryByText( 'Is wide' ) ).not.toBeInTheDocument();
		expect(
			screen.queryByText( 'Is less than small' )
		).not.toBeInTheDocument();
	} );
} );
