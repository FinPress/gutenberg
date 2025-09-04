<?php return array(
	'dependencies' => array(
		'@finpress/interactivity',
		array(
			'id'     => '@finpress/interactivity-router',
			'import' => 'dynamic',
		),
		'test/router-script-modules-initial-1',
		array(
			'id'     => 'test/router-script-modules-initial-2',
			'import' => 'dynamic',
		),
	),
);
