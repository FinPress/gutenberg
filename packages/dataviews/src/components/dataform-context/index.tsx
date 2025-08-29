/**
 * WordPress dependencies
 */
import { createContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

type DataFormContextType< Item > = {
	fields: NormalizedField< Item >[];
	errorMessages?: Record< string, string | null >;
};

const DataFormContext = createContext< DataFormContextType< any > >( {
	fields: [],
	errorMessages: {},
} );

export function DataFormProvider< Item >( {
	fields,
	errorMessages,
	children,
}: React.PropsWithChildren< {
	fields: NormalizedField< Item >[];
	errorMessages?: Record< string, string | null >;
} > ) {
	return (
		<DataFormContext.Provider value={ { fields, errorMessages } }>
			{ children }
		</DataFormContext.Provider>
	);
}

export default DataFormContext;
