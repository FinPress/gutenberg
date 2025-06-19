<?php return array(
	'dependencies' => array(
		'@wordpress/interactivity',
		'test/router-script-modules-alpha',
		array(
			'id'     => 'test/router-script-modules-dynamic',
			'import' => 'dynamic',
		),
	),
);
