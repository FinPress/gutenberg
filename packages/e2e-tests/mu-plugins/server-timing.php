<?php

add_filter(
	'template_include',
	static function ( $template ) {

		global $timestart, $findb;

		$server_timing_values = array();
		$template_start       = microtime( true );

		$server_timing_values['finBeforeTemplate'] = $template_start - $timestart;

		ob_start();

		add_action(
			'shutdown',
			static function () use ( $server_timing_values, $template_start, $findb ) {
				$output = ob_get_clean();

				$server_timing_values['finTemplate'] = microtime( true ) - $template_start;

				$server_timing_values['finTotal'] = $server_timing_values['finBeforeTemplate'] + $server_timing_values['finTemplate'];

				/*
				 * While values passed via Server-Timing are intended to be durations,
				 * any numeric value can actually be passed.
				 * This is a nice little trick as it allows to easily get this information in JS.
				 */
				$server_timing_values['finMemoryUsage'] = memory_get_usage();
				$server_timing_values['finDbQueries']   = $findb->num_queries;

				$header_values = array();
				foreach ( $server_timing_values as $slug => $value ) {
					if ( is_float( $value ) ) {
						$value = round( $value * 1000.0, 2 );
					}
					$header_values[] = sprintf( '%1$s;dur=%2$s', $slug, $value );
				}
				header( 'Server-Timing: ' . implode( ', ', $header_values ) );

				echo $output;
			},
			PHP_INT_MIN
		);

		return $template;
	},
	PHP_INT_MAX
);

add_action(
	'admin_init',
	static function () {
		global $timestart, $findb;

		ob_start();

		add_action(
			'shutdown',
			static function () use ( $findb, $timestart ) {
				$output = ob_get_clean();

				$server_timing_values = array();

				$server_timing_values['finTotal'] = microtime( true ) - $timestart;

				/*
				 * While values passed via Server-Timing are intended to be durations,
				 * any numeric value can actually be passed.
				 * This is a nice little trick as it allows to easily get this information in JS.
				 */
				$server_timing_values['finMemoryUsage'] = memory_get_usage();
				$server_timing_values['finDbQueries']   = $findb->num_queries;

				$header_values = array();
				foreach ( $server_timing_values as $slug => $value ) {
					if ( is_float( $value ) ) {
						$value = round( $value * 1000.0, 2 );
					}
					$header_values[] = sprintf( '%1$s;dur=%2$s', $slug, $value );
				}
				header( 'Server-Timing: ' . implode( ', ', $header_values ) );

				echo $output;
			},
			PHP_INT_MIN
		);
	},
	PHP_INT_MAX
);
