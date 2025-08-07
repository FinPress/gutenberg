export type LayoutType = 'regular' | 'panel' | 'card';
export type LabelPosition = 'top' | 'side' | 'none';

export type RegularLayout = {
	type: 'regular';
	labelPosition: LabelPosition;
};

export type PanelLayout = {
	type: 'panel';
	labelPosition: LabelPosition;
};

export type CardLayout = {
	type: 'card';
	labelPosition: Extract< LabelPosition, 'top' | 'none' >;
	opened: boolean;
};

export type Layout = RegularLayout | PanelLayout | CardLayout;
