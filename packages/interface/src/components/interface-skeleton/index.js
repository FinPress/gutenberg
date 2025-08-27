/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { forwardRef, useEffect, useState } from '@wordpress/element';
import {
	__unstableMotion as motion,
	__unstableAnimatePresence as AnimatePresence,
} from '@wordpress/components';
import { __, _x } from '@wordpress/i18n';
import {
	useReducedMotion,
	useViewportMatch,
	useResizeObserver,
} from '@wordpress/compose';
import { store as preferencesStore } from '@wordpress/preferences';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import NavigableRegion from '../navigable-region';

const ANIMATION_DURATION = 0.25;
const commonTransition = {
	type: 'tween',
	duration: ANIMATION_DURATION,
	ease: [ 0.6, 0, 0.4, 1 ],
};

function useHTMLClass( className ) {
	useEffect( () => {
		const element =
			document && document.querySelector( `html:not(.${ className })` );
		if ( ! element ) {
			return;
		}
		element.classList.toggle( className );
		return () => {
			element.classList.toggle( className );
		};
	}, [ className ] );
}

const headerVariants = {
	hidden: { opacity: 1, marginTop: -60 },
	visible: { opacity: 1, marginTop: 0 },
	distractionFreeHover: {
		opacity: 1,
		marginTop: 0,
		transition: {
			...commonTransition,
			delay: 0.2,
			delayChildren: 0.2,
		},
	},
	distractionFreeHidden: {
		opacity: 0,
		marginTop: -60,
	},
	distractionFreeDisabled: {
		opacity: 0,
		marginTop: 0,
		transition: {
			...commonTransition,
			delay: 0.8,
			delayChildren: 0.8,
		},
	},
};

function InterfaceSkeleton(
	{
		isDistractionFree,
		footer,
		header,
		editorNotices,
		sidebar,
		secondarySidebar,
		content,
		actions,
		labels,
		className,
	},
	ref
) {
	const [ secondarySidebarResizeListener, secondarySidebarSize ] =
		useResizeObserver();
	const isMobileViewport = useViewportMatch( 'medium', '<' );
	const disableMotion = useReducedMotion();
	// Track whether this is the initial render or a subsequent interaction
	const [ isInitialRender, setIsInitialRender ] = useState( true );
	// Track if sidebar has been sized
	const [ hasSidebarBeenSized, setHasSidebarBeenSized ] = useState( false );
	// Get the preference for "Always open List View" preference.
	const { get: getPreference } = useSelect( preferencesStore );
	const showListViewByDefault = getPreference(
		'core',
		'showListViewByDefault'
	);

	// Create different transitions for initial vs subsequent renders
	const initialTransition = { duration: 0 };
	const animationTransition = {
		type: 'tween',
		duration: disableMotion ? 0 : ANIMATION_DURATION,
		ease: [ 0.6, 0, 0.4, 1 ],
	};

	// Use the appropriate transition based on render state
	const defaultTransition =
		showListViewByDefault && isInitialRender
			? initialTransition
			: animationTransition;

	useHTMLClass( 'interface-interface-skeleton__html-container' );

	// When sidebar size changes and it has a width, mark initial rendering as complete
	useEffect( () => {
		if (
			showListViewByDefault &&
			isInitialRender &&
			secondarySidebar &&
			secondarySidebarSize.width > 0
		) {
			// Size has been detected, sidebar is ready
			if ( ! hasSidebarBeenSized ) {
				setHasSidebarBeenSized( true );
				// Allow a single frame for the non-animated render to complete
				window.requestAnimationFrame( () => {
					setIsInitialRender( false );
				} );
			}
		}
	}, [
		isInitialRender,
		secondarySidebar,
		secondarySidebarSize,
		showListViewByDefault,
		hasSidebarBeenSized,
	] );

	const defaultLabels = {
		/* translators: accessibility text for the top bar landmark region. */
		header: _x( 'Header', 'header landmark area' ),
		/* translators: accessibility text for the content landmark region. */
		body: __( 'Content' ),
		/* translators: accessibility text for the secondary sidebar landmark region. */
		secondarySidebar: __( 'Block Library' ),
		/* translators: accessibility text for the settings landmark region. */
		sidebar: _x( 'Settings', 'settings landmark area' ),
		/* translators: accessibility text for the publish landmark region. */
		actions: __( 'Publish' ),
		/* translators: accessibility text for the footer landmark region. */
		footer: __( 'Footer' ),
	};

	const mergedLabels = { ...defaultLabels, ...labels };

	return (
		<div
			ref={ ref }
			className={ clsx(
				className,
				'interface-interface-skeleton',
				!! footer && 'has-footer'
			) }
		>
			<div className="interface-interface-skeleton__editor">
				<AnimatePresence initial={ false }>
					{ !! header && (
						<NavigableRegion
							as={ motion.div }
							className="interface-interface-skeleton__header"
							aria-label={ mergedLabels.header }
							initial={
								isDistractionFree && ! isMobileViewport
									? 'distractionFreeHidden'
									: 'hidden'
							}
							whileHover={
								isDistractionFree && ! isMobileViewport
									? 'distractionFreeHover'
									: 'visible'
							}
							animate={
								isDistractionFree && ! isMobileViewport
									? 'distractionFreeDisabled'
									: 'visible'
							}
							exit={
								isDistractionFree && ! isMobileViewport
									? 'distractionFreeHidden'
									: 'hidden'
							}
							variants={ headerVariants }
							transition={ defaultTransition }
						>
							{ header }
						</NavigableRegion>
					) }
				</AnimatePresence>
				{ isDistractionFree && (
					<div className="interface-interface-skeleton__header">
						{ editorNotices }
					</div>
				) }
				<div className="interface-interface-skeleton__body">
					<AnimatePresence
						initial={ showListViewByDefault && isInitialRender }
					>
						{ !! secondarySidebar && (
							<NavigableRegion
								className="interface-interface-skeleton__secondary-sidebar"
								ariaLabel={ mergedLabels.secondarySidebar }
								as={ motion.div }
								initial={
									showListViewByDefault && isInitialRender
										? 'open'
										: 'closed'
								}
								animate="open"
								exit="closed"
								variants={ {
									open: { width: secondarySidebarSize.width },
									closed: { width: 0 },
								} }
								transition={ defaultTransition }
							>
								<motion.div
									style={ {
										position: 'absolute',
										width: isMobileViewport
											? '100vw'
											: 'fit-content',
										height: '100%',
										left: 0,
									} }
									variants={ {
										open: { x: 0 },
										closed: { x: '-100%' },
									} }
									transition={ defaultTransition }
								>
									{ secondarySidebarResizeListener }
									{ secondarySidebar }
								</motion.div>
							</NavigableRegion>
						) }
					</AnimatePresence>
					<NavigableRegion
						className="interface-interface-skeleton__content"
						ariaLabel={ mergedLabels.body }
					>
						{ content }
					</NavigableRegion>
					{ !! sidebar && (
						<NavigableRegion
							className="interface-interface-skeleton__sidebar"
							ariaLabel={ mergedLabels.sidebar }
						>
							{ sidebar }
						</NavigableRegion>
					) }
					{ !! actions && (
						<NavigableRegion
							className="interface-interface-skeleton__actions"
							ariaLabel={ mergedLabels.actions }
						>
							{ actions }
						</NavigableRegion>
					) }
				</div>
			</div>
			{ !! footer && (
				<NavigableRegion
					className="interface-interface-skeleton__footer"
					ariaLabel={ mergedLabels.footer }
				>
					{ footer }
				</NavigableRegion>
			) }
		</div>
	);
}

export default forwardRef( InterfaceSkeleton );
