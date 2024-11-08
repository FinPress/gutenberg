<?php

/**
 * Adds the x-wav mime type to the list of mime types.
 * This is necessary for Firefox as it uses the identifier for uploaded .wav files.
 *
 * @since 6.8.0
 *
 * @param string[] $mime_types Mime types.
 * @return string[] Mime types keyed by the file extension regex corresponding to those types.
*/
function gutenberg_get_mime_types_6_8( $mime_types ) {
	if ( isset( $mime_types['wav'] ) ) {
		$mime_types['wav|x-wav'] = 'audio/wav';
		unset( $mime_types['wav'] );
	}
	return $mime_types;
}
add_filter( 'mime_types', 'gutenberg_get_mime_types_6_8', 10 );
