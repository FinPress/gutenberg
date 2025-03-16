export function fixAttributes( block, blockType ) {
	if ( blockType.name !== 'core/paragraph' ) {
		return block;
	}

	const { attributes } = block;
	const { align, style = {}, className = '', ...rest } = attributes;

	const TEXT_ALIGN_OPTIONS = [ 'left', 'right', 'center' ];
	if ( ! TEXT_ALIGN_OPTIONS.includes( align ) ) {
		return block;
	}

	// Remove text alignment classes from className
	const updatedClassName =
		className
			.split( ' ' )
			.filter(
				( classItem ) =>
					! TEXT_ALIGN_OPTIONS.includes(
						classItem.replace( 'has-text-align-', '' )
					)
			)
			.join( ' ' ) || undefined;

	const updatedAttributes = {
		...rest,
		align: undefined,
		style: {
			...style,
			typography: {
				...style?.typography,
				textAlign: align,
			},
		},
		className: updatedClassName,
	};

	return {
		...block,
		attributes: updatedAttributes,
	};
}
