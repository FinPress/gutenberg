<?php return array(
	'dependencies' => array(
		'@wordpress/interactivity',
		'test/router-script-modules-charlie',
		array(
			'id'     => 'test/router-script-modules-dynamic',
			'import' => 'dynamic',
		),
	),
);
