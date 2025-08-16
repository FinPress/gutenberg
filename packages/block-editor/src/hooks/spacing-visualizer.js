/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect, useReducer } from '@wordpress/element';
import isShallowEqual from '@wordpress/is-shallow-equal';

/**
 * Internal dependencies
 */
import BlockPopoverCover from '../components/block-popover/cover';
import { useBlockElement } from '../components/block-list/use-block-props/use-block-refs';

function SpacingVisualizer( {
	clientId,
	value,
	renderVisualizer,
	forceShow,
	useResizeObserver = false,
} ) {
	const blockElement = useBlockElement( clientId );
	const [ visualizer, updateVisualizer ] = useReducer( () =>
		renderVisualizer( blockElement )
	);

	// It's not sufficient to read the block’s computed style when `value` changes because
	// the effect would run before the block’s style has updated. Thus observing mutations
	// to the block’s attributes is used to trigger updates to the visualizer’s styles.
	useEffect( () => {
		if ( ! blockElement ) {
			return;
		}
		const observer = new window.MutationObserver( updateVisualizer );
		observer.observe( blockElement, {
			attributes: true,
			attributeFilter: [ 'style', 'class' ],
		} );
		return () => {
			observer.disconnect();
		};
	}, [ blockElement ] );

	// Since the gap styles are applied via the CSS selector, apply the resize observer
	// rather than the mutation observer.
	useEffect( () => {
		if ( ! blockElement || ! useResizeObserver ) {
			return;
		}
		const observer = new window.ResizeObserver( updateVisualizer );
		observer.observe( blockElement );
		return () => {
			observer.disconnect();
		};
	}, [ blockElement, useResizeObserver ] );

	const previousValueRef = useRef( value );
	const [ isActive, setIsActive ] = useState( false );

	useEffect( () => {
		if ( isShallowEqual( value, previousValueRef.current ) || forceShow ) {
			return;
		}

		setIsActive( true );
		previousValueRef.current = value;

		const timeout = setTimeout( () => {
			setIsActive( false );
		}, 400 );

		return () => {
			setIsActive( false );
			clearTimeout( timeout );
		};
	}, [ value, forceShow ] );

	if ( ! isActive && ! forceShow ) {
		return null;
	}

	return (
		<BlockPopoverCover
			clientId={ clientId }
			__unstablePopoverSlot="block-toolbar"
		>
			{ visualizer }
		</BlockPopoverCover>
	);
}

function getComputedCSS( element, property ) {
	return element.ownerDocument.defaultView
		.getComputedStyle( element )
		.getPropertyValue( property );
}

export function MarginVisualizer( { clientId, value, forceShow } ) {
	return (
		<SpacingVisualizer
			clientId={ clientId }
			value={ value?.spacing?.margin }
			renderVisualizer={ ( blockElement ) => {
				const top = getComputedCSS( blockElement, 'margin-top' );
				const right = getComputedCSS( blockElement, 'margin-right' );
				const bottom = getComputedCSS( blockElement, 'margin-bottom' );
				const left = getComputedCSS( blockElement, 'margin-left' );
				const styles = {
					borderTopWidth: top,
					borderRightWidth: right,
					borderBottomWidth: bottom,
					borderLeftWidth: left,
					top: top ? `-${ top }` : 0,
					right: right ? `-${ right }` : 0,
					bottom: bottom ? `-${ bottom }` : 0,
					left: left ? `-${ left }` : 0,
				};
				return (
					<div
						className="block-editor__spacing-visualizer"
						style={ styles }
					/>
				);
			} }
			forceShow={ forceShow }
		/>
	);
}

export function PaddingVisualizer( { clientId, value, forceShow } ) {
	return (
		<SpacingVisualizer
			clientId={ clientId }
			value={ value?.spacing?.padding }
			renderVisualizer={ ( blockElement ) => {
				const styles = {
					borderTopWidth: getComputedCSS(
						blockElement,
						'padding-top'
					),
					borderRightWidth: getComputedCSS(
						blockElement,
						'padding-right'
					),
					borderBottomWidth: getComputedCSS(
						blockElement,
						'padding-bottom'
					),
					borderLeftWidth: getComputedCSS(
						blockElement,
						'padding-left'
					),
				};
				return (
					<div
						className="block-editor__spacing-visualizer"
						style={ styles }
					/>
				);
			} }
			forceShow={ forceShow }
		/>
	);
}

export function GapVisualizer( { clientId, value, forceShow } ) {
	return (
		<SpacingVisualizer
			clientId={ clientId }
			value={ value }
			useResizeObserver
			renderVisualizer={ ( blockElement ) => {
				const display = getComputedCSS( blockElement, 'display' );

				if ( display === 'grid' ) {
					const visualizerStyles =
						getGridVisualizerStyles( blockElement );
					return visualizerStyles.map( ( { style }, index ) => (
						<div
							key={ index }
							className="block-editor__gap-visualizer"
							style={ style }
						/>
					) );
				}
				return null;
			} }
			forceShow={ forceShow }
		/>
	);
}

function getGridVisualizerStyles( blockElement ) {
	const offsetTop = parseFloat(
		getComputedCSS( blockElement, 'padding-top' )
	);
	const offsetLeft = parseFloat(
		getComputedCSS( blockElement, 'padding-left' )
	);
	const gap = parseFloat( getComputedCSS( blockElement, 'gap' ) );
	const columns = getComputedCSS( blockElement, 'grid-template-columns' )
		.split( ' ' )
		.map( ( column ) => parseFloat( column ) );
	const rows = getComputedCSS( blockElement, 'grid-template-rows' )
		.split( ' ' )
		.map( ( row ) => parseFloat( row ) );

	columns.pop();
	rows.pop();

	const columnVisualizerStyles = [];
	let currentLeftPosition = offsetTop;

	for ( const column of columns ) {
		currentLeftPosition += column;
		columnVisualizerStyles.push( {
			style: {
				left: currentLeftPosition,
				top: 0,
				width: gap,
				height: '100%',
			},
		} );
		currentLeftPosition += gap;
	}

	const rowVisualizerStyles = [];
	let currentTopPosition = offsetLeft;

	for ( const row of rows ) {
		currentTopPosition += row;
		rowVisualizerStyles.push( {
			style: {
				left: 0,
				top: currentTopPosition,
				width: '100%',
				height: gap,
			},
		} );
		currentTopPosition += gap;
	}

	return [ ...columnVisualizerStyles, ...rowVisualizerStyles ];
}
