/**
 * External dependencies
 *
 */
/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import {
	useBlockProps,
	useInnerBlocksProps,
	__experimentalGetBorderClassesAndStyles as getBorderClassesAndStyles,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
	__experimentalGetSpacingClassesAndStyles as getSpacingClassesAndStyles,
	__experimentalGetElementClassName,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import useColorSupports from './use-color-supports';

export default function Save( { attributes } ) {
	const {
		customTabBackgroundColor,
		customTabHoverColor,
		customTabActiveColor,
		customTabTextColor,
		customTabActiveTextColor,
		customTabHoverTextColor,
	} = attributes;

	const borderProps = getBorderClassesAndStyles( attributes );
	// const colorProps = getColorClassesAndStyles( attributes );
	const spacingProps = getSpacingClassesAndStyles( attributes );
	// const colorProps = useColorSupports( {
	// 	customTabBackgroundColor,
	// 	customTabHoverColor,
	// 	customTabActiveColor,
	// 	customTabTextColor,
	// 	customTabActiveTextColor,
	// 	customTabHoverTextColor,
	// } );

	// eslint-disable-next-line react-compiler/react-compiler
	const blockProps = useBlockProps.save( {
		className: clsx(
			__experimentalGetElementClassName( 'tabs' ),
			spacingProps.className
		),
		style: {
			// ...colorProps.style,
			...borderProps.style,
			...spacingProps.style,
		},
	} );

	// eslint-disable-next-line react-compiler/react-compiler
	const innerBlocksProps = useInnerBlocksProps.save( {} );

	return (
		<div { ...blockProps }>
			<h3 className="tabs__title">Contents</h3>
			<ul className="tabs__list"></ul>
			{ innerBlocksProps.children }
		</div>
	);
}
