/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import Theme from '../';

type MyThemableComponentProps = {
	children: ReactNode;
};

const MyThemableComponent = ( props: MyThemableComponentProps ) => {
	return (
		<div
			{ ...props }
			style={ {
				color: 'var(--fp-components-color-accent)',
			} }
		/>
	);
};

describe( 'Theme', () => {
	describe( 'accent color', () => {
		it( 'does not define the accent color (and its variations) as a CSS variable when the `accent` prop is undefined', () => {
			render(
				<Theme data-testid="theme">
					<MyThemableComponent>Inner</MyThemableComponent>
				</Theme>
			);

			const innerElementStyles = window.getComputedStyle(
				screen.getByTestId( 'theme' )
			);

			[
				'--fp-components-color-accent',
				'--fp-components-color-accent-darker-10',
				'--fp-components-color-accent-darker-20',
				'--fp-components-color-accent-inverted',
			].forEach( ( cssVariable ) => {
				expect(
					innerElementStyles.getPropertyValue( cssVariable )
				).toBe( '' );
			} );
		} );

		it( 'defines the accent color (and its variations) as a CSS variable', () => {
			render(
				<Theme accent="#123abc" data-testid="theme">
					<MyThemableComponent>Inner</MyThemableComponent>
				</Theme>
			);

			expect( screen.getByTestId( 'theme' ) ).toHaveStyle( {
				'--fp-components-color-accent': '#123abc',
				'--fp-components-color-accent-darker-10': '#0e2c8d',
				'--fp-components-color-accent-darker-20': '#091d5f',
				'--fp-components-color-accent-inverted': '#fff',
			} );
		} );
	} );

	describe( 'background color', () => {
		it( 'does not define the background color (and its dependent colors) as a CSS variable when the `background` prop is undefined', () => {
			render(
				<Theme data-testid="theme">
					<MyThemableComponent>Inner</MyThemableComponent>
				</Theme>
			);

			const innerElementStyles = window.getComputedStyle(
				screen.getByTestId( 'theme' )
			);

			[
				'--fp-components-color-background',
				'--fp-components-color-foreground',
				'--fp-components-color-foreground-inverted',
				...[ '100', '200', '300', '400', '600', '700', '800' ].map(
					( shade ) => `--fp-components-color-gray-${ shade }`
				),
			].forEach( ( cssVariable ) => {
				expect(
					innerElementStyles.getPropertyValue( cssVariable )
				).toBe( '' );
			} );
		} );

		it( 'defines the background color (and its dependent colors) as a CSS variable', () => {
			render(
				<Theme background="#ffffff" data-testid="theme">
					<MyThemableComponent>Inner</MyThemableComponent>
				</Theme>
			);

			expect( screen.getByTestId( 'theme' ) ).toHaveStyle( {
				'--fp-components-color-background': '#ffffff',
				'--fp-components-color-foreground': '#1e1e1e',
				'--fp-components-color-foreground-inverted': '#fff',
				'--fp-components-color-gray-100': '#f0f0f0',
				'--fp-components-color-gray-200': '#e0e0e0',
				'--fp-components-color-gray-300': '#dddddd',
				'--fp-components-color-gray-400': '#cccccc',
				'--fp-components-color-gray-600': '#949494',
				'--fp-components-color-gray-700': '#757575',
				'--fp-components-color-gray-800': '#2f2f2f',
			} );
		} );
	} );

	describe( 'unsupported values', () => {
		describe.each( [ 'accent', 'background' ] )( '%s', ( propName ) => {
			it.each( [
				// Keywords
				'currentcolor',
				'initial',
				'reset',
				'inherit',
				'revert',
				'unset',
				// CSS Custom properties
				'var( --my-variable )',
			] )( 'should warn when the value is "%s"', ( value ) => {
				render( <Theme { ...{ [ propName ]: value } } /> );
				expect( console ).toHaveWarned();
			} );
		} );
	} );
} );
