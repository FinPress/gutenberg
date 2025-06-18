/**
 * WordPress dependencies
 */
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	useRef,
} from '@wordpress/element';

const Dropdown = ( { renderContent, renderToggle, onToggle } ) => {
	const [ isOpen, setIsOpen ] = useState( false );
	const prevIsOpenRef = useRef( isOpen );

	const toggle = useCallback( () => {
		setIsOpen( ( prev ) => ! prev );
	}, [] );

	const close = useCallback( () => {
		setIsOpen( false );
	}, [] );

	useEffect( () => {
		// Only call `onToggle` when `isOpen` changes,
		// avoiding a call on initial mount.
		if ( prevIsOpenRef.current !== isOpen && onToggle ) {
			onToggle( isOpen );
		}

		prevIsOpenRef.current = isOpen;

		return () => {
			if ( isOpen && onToggle ) {
				onToggle( false );
			}
		};
	}, [ isOpen, onToggle ] );

	const args = useMemo( () => {
		return { isOpen, onToggle: toggle, onClose: close };
	}, [ isOpen, toggle, close ] );

	return (
		<>
			{ renderToggle( args ) }
			{ isOpen && renderContent( args ) }
		</>
	);
};

export default Dropdown;
