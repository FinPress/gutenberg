function renderPropType( type ) {
	const MAX_ENUM_VALUES = 10;

	switch ( type.name ) {
		case 'enum': {
			const string = type.value
				.slice( 0, MAX_ENUM_VALUES )
				.map( ( { value } ) => value )
				.join( ' | ' );

			if ( type.value.length > MAX_ENUM_VALUES ) {
				return `${ string } | ...`;
			}
			return string;
		}
		default:
			return type.name;
	}
}

export function generateMarkdownPropsJson(
	props,
	{ headingLevel = 2 } = {},
	additionalProps = false
) {
	const sortedKeys = Object.keys( props ).sort( ( [ a ], [ b ] ) =>
		a.localeCompare( b )
	);

	const propsJson = sortedKeys
		.flatMap( ( key ) => {
			const prop = props[ key ];

			if ( prop.description?.includes( '@ignore' ) ) {
				return null;
			}

			return [
				{ [ `h${ headingLevel + 1 }` ]: `\`${ key }\`` },
				prop.description,
				{
					ul: [
						`Type: \`${ renderPropType( prop.type ) }\``,
						`Required: ${ prop.required ? 'Yes' : 'No' }`,
						prop.defaultValue &&
							`Default: \`${ prop.defaultValue.value }\``,
					].filter( Boolean ),
				},
			];
		} )
		.filter( Boolean );

	if ( additionalProps ) {
		propsJson.push( [
			{ [ `h${ headingLevel + 1 }` ]: `\`Additional props\`` },
			`All other props will be passed directly to the underlying \`${ additionalProps }\` element.`,
		] );
	}

	return [ { [ `h${ headingLevel }` ]: 'Props' }, ...propsJson ];
}
