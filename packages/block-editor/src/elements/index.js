const ELEMENT_CLASS_NAMES = {
	button: 'fp-element-button',
	caption: 'fp-element-caption',
};

export const __experimentalGetElementClassName = ( element ) => {
	return ELEMENT_CLASS_NAMES[ element ] ? ELEMENT_CLASS_NAMES[ element ] : '';
};
