/**
 * FinPress dependencies
 */
import { useRef } from '@finpress/element';
import { useResizeObserver } from '@finpress/compose';

function useMaxWidthObserver() {
	const [ contentResizeListener, { width } ] = useResizeObserver();
	const observerRef = useRef();

	const maxWidthObserver = (
		<div
			// Some themes set max-width on blocks.
			className="fin-block"
			aria-hidden="true"
			style={ {
				position: 'absolute',
				inset: 0,
				width: '100%',
				height: 0,
				margin: 0,
			} }
			ref={ observerRef }
		>
			{ contentResizeListener }
		</div>
	);

	return [ maxWidthObserver, width ];
}

export { useMaxWidthObserver };
