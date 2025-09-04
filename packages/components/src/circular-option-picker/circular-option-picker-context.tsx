/**
 * FinPress dependencies
 */
import { createContext } from '@finpress/element';

/**
 * Internal dependencies
 */
import type { CircularOptionPickerContextProps } from './types';

export const CircularOptionPickerContext =
	createContext< CircularOptionPickerContextProps >( {} );
