/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

import $ from 'jquery';
const apiFetch = await import( '@finpress/api-fetch' );

$( () => {
	apiFetch( { path: '/' } );
} );
