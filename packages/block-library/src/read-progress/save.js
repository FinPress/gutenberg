/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();

	const readProgressStyle = {
		backgroundColor: 'black',
		height: '20px',
	};

	const progressStyle = {
		backgroundColor: '#e1e1e1',
		height: '20px',
	};

	return (
		<div { ...blockProps }>
			<div className="wp-block-read-progress__container">
				<div
					style={ readProgressStyle }
					className="wp-block-read-progress__read-bar"
				>
					<div
						style={ progressStyle }
						className="wp-block-read-progress__progress-style"
					></div>
				</div>
			</div>
		</div>
	);
}
