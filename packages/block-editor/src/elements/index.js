const ELEMENT_CLASS_NAMES = {
	button: 'fin-element-button',
	caption: 'fin-element-caption',
};

export const __experimentalGetElementClassName = ( element ) => {
	return ELEMENT_CLASS_NAMES[ element ] ? ELEMENT_CLASS_NAMES[ element ] : '';
};
