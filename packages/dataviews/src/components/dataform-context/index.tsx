/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { NormalizedField } from '../../types';

type DataFormContextType< Item > = {
	fields: NormalizedField< Item >[];
};

const DataFormContext = createContext< DataFormContextType< any > >( {
	fields: [],
} );

export function DataFormProvider< Item >( {
	fields,
	children,
}: React.PropsWithChildren< { fields: NormalizedField< Item >[] } > ) {
	return (
		<DataFormContext.Provider value={ { fields } }>
			{ children }
		</DataFormContext.Provider>
	);
}

export default DataFormContext;
