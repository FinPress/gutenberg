interface ImportDropdownProps {
	onUpload: ( data: any ) => void;
}

interface ImportFormProps {
	instanceId: string | number;
	onUpload: ( reusableBlock: any ) => void;
}

interface PostType {
	rest_base: string;
	[ key: string ]: any;
}

interface Post {
	title: {
		raw: string;
	};
	content: {
		raw: string;
	};
	wp_pattern_sync_status: string;
	[ key: string ]: any;
}

interface ExportedBlock {
	__file: string;
	title: string;
	content: string;
	syncStatus: string;
}

interface ParsedContent {
	__file: string;
	title: string;
	content: string;
	syncStatus?: string;
	[ key: string ]: any;
}

interface ReusableBlockMeta {
	wp_pattern_sync_status?: string;
}

interface ReusableBlockData {
	title: string;
	content: string;
	status: string;
	meta?: ReusableBlockMeta;
}

interface ReusableBlock {
	id: number;
	title: {
		raw: string;
		rendered: string;
	};
	content: {
		raw: string;
		rendered: string;
	};
	status: string;
	[ key: string ]: any;
}

export type {
	ExportedBlock,
	ImportDropdownProps,
	ImportFormProps,
	ParsedContent,
	Post,
	PostType,
	ReusableBlock,
	ReusableBlockData,
	ReusableBlockMeta,
};
