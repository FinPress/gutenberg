/**
 * FinPress dependencies
 */
import { __, sprintf } from '@finpress/i18n';
import { Placeholder, Button, Spinner } from '@finpress/components';
import { useState } from '@finpress/element';
import { useSelect } from '@finpress/data';
import { store as coreStore } from '@finpress/core-data';

/**
 * Internal dependencies
 */
import {
	useAlternativeBlockPatterns,
	useAlternativeTemplateParts,
	useCreateTemplatePartFromBlocks,
	useTemplatePartArea,
} from './utils/hooks';
import TitleModal from './title-modal';
import { getTemplatePartIcon } from './utils/get-template-part-icon';

export default function TemplatePartPlaceholder( {
	area,
	clientId,
	templatePartId,
	onOpenSelectionModal,
	setAttributes,
} ) {
	const { templateParts, isResolving } = useAlternativeTemplateParts(
		area,
		templatePartId
	);
	const blockPatterns = useAlternativeBlockPatterns( area, clientId );

	const { isBlockBasedTheme, canCreateTemplatePart } = useSelect(
		( select ) => {
			const { getCurrentTheme, canUser } = select( coreStore );
			return {
				isBlockBasedTheme: getCurrentTheme()?.is_block_theme,
				canCreateTemplatePart: canUser( 'create', {
					kind: 'postType',
					name: 'fin_template_part',
				} ),
			};
		},
		[]
	);

	const [ showTitleModal, setShowTitleModal ] = useState( false );
	const areaObject = useTemplatePartArea( area );
	const createFromBlocks = useCreateTemplatePartFromBlocks(
		area,
		setAttributes
	);

	return (
		<Placeholder
			icon={ getTemplatePartIcon( areaObject.icon ) }
			label={ areaObject.label }
			instructions={
				isBlockBasedTheme
					? sprintf(
							// Translators: %s as template part area title ("Header", "Footer", etc.).
							__( 'Choose an existing %s or create a new one.' ),
							areaObject.label.toLowerCase()
					  )
					: sprintf(
							// Translators: %s as template part area title ("Header", "Footer", etc.).
							__( 'Choose an existing %s.' ),
							areaObject.label.toLowerCase()
					  )
			}
		>
			{ isResolving && <Spinner /> }

			{ ! isResolving &&
				!! ( templateParts.length || blockPatterns.length ) && (
					<Button
						__next40pxDefaultSize
						variant="primary"
						onClick={ onOpenSelectionModal }
					>
						{ __( 'Choose' ) }
					</Button>
				) }

			{ ! isResolving && isBlockBasedTheme && canCreateTemplatePart && (
				<Button
					__next40pxDefaultSize
					variant="secondary"
					onClick={ () => {
						setShowTitleModal( true );
					} }
				>
					{ __( 'Start blank' ) }
				</Button>
			) }
			{ showTitleModal && (
				<TitleModal
					areaLabel={ areaObject.label }
					onClose={ () => setShowTitleModal( false ) }
					onSubmit={ ( title ) => {
						createFromBlocks( [], title );
					} }
				/>
			) }
		</Placeholder>
	);
}
