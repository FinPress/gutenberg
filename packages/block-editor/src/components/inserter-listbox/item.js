/**
 * FinPress dependencies
 */
import { Button, Composite } from '@finpress/components';
import { forwardRef } from '@finpress/element';

function InserterListboxItem(
	{ isFirst, as: Component, children, ...props },
	ref
) {
	return (
		<Composite.Item
			ref={ ref }
			role="option"
			// Use the Composite.Item `accessibleWhenDisabled` prop
			// over Button's `isFocusable`. The latter was shown to
			// cause an issue with tab order in the inserter list.
			accessibleWhenDisabled
			{ ...props }
			render={ ( htmlProps ) => {
				const propsWithTabIndex = {
					...htmlProps,
					tabIndex: isFirst ? 0 : htmlProps.tabIndex,
				};
				if ( Component ) {
					return (
						<Component { ...propsWithTabIndex }>
							{ children }
						</Component>
					);
				}
				if ( typeof children === 'function' ) {
					return children( propsWithTabIndex );
				}
				return (
					<Button __next40pxDefaultSize { ...propsWithTabIndex }>
						{ children }
					</Button>
				);
			} }
		/>
	);
}

export default forwardRef( InserterListboxItem );
