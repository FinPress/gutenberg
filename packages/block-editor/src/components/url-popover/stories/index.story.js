/**
 * FinPress dependencies
 */
import { Button, ToggleControl } from '@finpress/components';
import { useState } from '@finpress/element';
import { __ } from '@finpress/i18n';
import { keyboardReturn } from '@finpress/icons';

/**
 * Internal dependencies
 */
import URLPopover from '../';

export default { title: 'BlockEditor/URLPopover' };

const TestURLPopover = () => {
	const [ isVisible, setVisiblility ] = useState( false );
	const [ url, setUrl ] = useState( '' );

	const close = () => setVisiblility( false );
	const setTarget = () => {};

	const handleUrlChange = ( event ) => {
		setUrl( event.target.value );
	};

	return (
		<>
			<Button
				__next40pxDefaultSize
				onClick={ () => setVisiblility( true ) }
			>
				Edit URL
			</Button>
			{ isVisible && (
				<URLPopover
					onClose={ close }
					renderSettings={ () => (
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open in new tab' ) }
							onChange={ setTarget }
						/>
					) }
				>
					<form onSubmit={ close }>
						<input
							type="url"
							value={ url }
							onChange={ handleUrlChange }
						/>
						<Button
							__next40pxDefaultSize
							icon={ keyboardReturn }
							label={ __( 'Apply' ) }
							type="submit"
						/>
					</form>
				</URLPopover>
			) }
		</>
	);
};

export const _default = () => {
	return <TestURLPopover />;
};
