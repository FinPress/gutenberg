/**
 * WordPress dependencies
 */
import { useBlockProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { backgroundColor, progressColor } = attributes;
	const blockProps = useBlockProps.save();

	const readProgressStyle = {
		backgroundColor,
		height: '20px',
	};

	const progressStyle = {
		backgroundColor: progressColor,
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
