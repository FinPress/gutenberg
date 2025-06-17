/**
 * WordPress dependencies
 */
import { useState, useEffect, useCallback, useMemo } from '@wordpress/element';

const Dropdown = ( { renderContent, renderToggle, onToggle } ) => {
	const [ isOpen, setIsOpen ] = useState( false );

	const toggle = useCallback( () => {
		setIsOpen( ( prev ) => ! prev );
	}, [] );

	const close = useCallback( () => {
		setIsOpen( false );
	}, [] );

	useEffect( () => {
		if ( onToggle ) {
			onToggle( isOpen );
		}

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
