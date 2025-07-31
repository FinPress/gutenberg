var Vips = ( () => {
	return async function ( moduleArg = {} ) {
		var moduleRtn;

		var m = moduleArg,
			aa = 'object' == typeof window,
			ba = 'undefined' != typeof WorkerGlobalScope,
			ca = 'object' == typeof Deno;
		aa ||= ca;
		var t = ba && self.name?.startsWith( 'em-pthread' );
		m.dynamicLibraries = m.dynamicLibraries || [
			'vips-jxl.wasm',
			'vips-heif.wasm',
		];
		var da = [],
			ea = './this.program',
			ha = import.meta.url,
			ia = '';
		function ka( a ) {
			return m.locateFile ? m.locateFile( a, ia ) : ia + a;
		}
		var la, ma;
		if ( aa || ba ) {
			try {
				ia = new URL( '.', ha ).href;
			} catch {}
			ba &&
				( ma = ( a ) => {
					var b = new XMLHttpRequest();
					b.open( 'GET', a, ! 1 );
					b.responseType = 'arraybuffer';
					b.send( null );
					return new Uint8Array( b.response );
				} );
			la = async ( a ) => {
				a = await fetch( a, { credentials: 'same-origin' } );
				if ( a.ok ) return a.arrayBuffer();
				throw Error( a.status + ' : ' + a.url );
			};
		}
		var na = console.log.bind( console ),
			v = console.error.bind( console ),
			oa = [],
			pa,
			qa,
			ra = ! 1,
			sa;
		class w extends Error {}
		class ta extends w {}
		class ua extends w {
			constructor( a ) {
				super( a );
				this.va = a;
				a = va( a );
				this.name = a[ 0 ];
				this.message = a[ 1 ];
			}
		}
		var wa,
			xa,
			ya,
			za = {};
		if ( t ) {
			var Ba = ! 1;
			self.onunhandledrejection = ( b ) => {
				throw b.reason || b;
			};
			function a( b ) {
				try {
					var c = b.data,
						d = c.U;
					if ( 'load' === d ) {
						let e = [];
						self.onmessage = ( f ) => e.push( f );
						self.startWorker = () => {
							postMessage( { U: 'loaded' } );
							for ( let f of e ) a( f );
							self.onmessage = a;
						};
						oa = c.zb;
						za = c.kc;
						for ( const f of c.Kb )
							if ( ! m[ f ] || m[ f ].proxy )
								( m[ f ] = ( ...g ) => {
									postMessage( {
										U: 'callHandler',
										Jb: f,
										tb: g,
									} );
								} ),
									'print' == f && ( na = m[ f ] ),
									'printErr' == f && ( v = m[ f ] );
						Ca = c.rc;
						Da();
						ya( c.sc );
					} else if ( 'run' === d ) {
						Ea( c.X );
						Fa( c.X, 0, 0, 1, 0, 0 );
						Ga();
						Ha( c.X );
						Ba || ( Ia(), ( Ba = ! 0 ) );
						try {
							Ja( c.nc, c.Da );
						} catch ( e ) {
							if ( 'unwind' != e ) throw e;
						}
					} else
						'setimmediate' !== c.target &&
							( 'checkMailbox' === d
								? Ba && Ka()
								: d &&
								  ( v(
										`worker: received unknown command ${ d }`
								  ),
								  v( c ) ) );
				} catch ( e ) {
					throw ( La(), e );
				}
			}
			self.onmessage = a;
		}
		var Ca,
			y,
			z,
			A,
			C,
			D,
			E,
			Na,
			Oa,
			F,
			Pa,
			Qa = ! 1,
			Ra = ! 1;
		function Da() {
			var a = Ca.buffer;
			y = new Int8Array( a );
			A = new Int16Array( a );
			z = new Uint8Array( a );
			C = new Uint16Array( a );
			D = new Int32Array( a );
			E = new Uint32Array( a );
			Na = new Float32Array( a );
			Oa = new Float64Array( a );
			F = new BigInt64Array( a );
			Pa = new BigUint64Array( a );
		}
		var Sa = [];
		function Ta() {
			Qa = ! 0;
			t
				? startWorker( m )
				: ( Ua( Sa ),
				  m.noFSInit || FS.Ga || FS.init(),
				  Va.__wasm_call_ctors(),
				  Ua( Wa ),
				  ( FS.bb = ! 1 ) );
		}
		var Xa = 0,
			Ya = null;
		function Za() {
			Xa++;
			m.monitorRunDependencies?.( Xa );
		}
		function $a() {
			Xa--;
			m.monitorRunDependencies?.( Xa );
			if ( 0 == Xa && Ya ) {
				var a = Ya;
				Ya = null;
				a();
			}
		}
		function ab( a ) {
			m.onAbort?.( a );
			a = 'Aborted(' + a + ')';
			v( a );
			ra = ! 0;
			a = new WebAssembly.RuntimeError(
				a + '. Build with -sASSERTIONS for more info.'
			);
			xa?.( a );
			throw a;
		}
		var bb;
		async function cb( a ) {
			if ( ! pa )
				try {
					var b = await la( a );
					return new Uint8Array( b );
				} catch {}
			if ( a == bb && pa ) a = new Uint8Array( pa );
			else if ( ma ) a = ma( a );
			else throw 'both async and sync fetching of the wasm failed';
			return a;
		}
		async function db( a, b ) {
			try {
				var c = await cb( a );
				return await WebAssembly.instantiate( c, b );
			} catch ( d ) {
				v( `failed to asynchronously prepare wasm: ${ d }` ), ab( d );
			}
		}
		async function eb( a ) {
			var b = bb;
			if ( ! pa && 'function' == typeof WebAssembly.instantiateStreaming )
				try {
					var c = fetch( b, { credentials: 'same-origin' } );
					return await WebAssembly.instantiateStreaming( c, a );
				} catch ( d ) {
					v( `wasm streaming compile failed: ${ d }` ),
						v( 'falling back to ArrayBuffer instantiation' );
				}
			return db( b, a );
		}
		function fb() {
			G = {
				__assert_fail: gb,
				__call_sighandler: hb,
				__cxa_begin_catch: ib,
				__cxa_end_catch: jb,
				__cxa_find_matching_catch_2: kb,
				__cxa_find_matching_catch_3: lb,
				__cxa_rethrow: mb,
				__cxa_throw: nb,
				__cxa_uncaught_exceptions: ob,
				__heap_base: pb,
				__indirect_function_table: qb,
				__lsan_ignore_object: rb,
				__memory_base: sb,
				__pthread_create_js: tb,
				__resumeException: ub,
				__stack_high: vb,
				__stack_low: wb,
				__stack_pointer: xb,
				__syscall_dup: yb,
				__syscall_faccessat: zb,
				__syscall_fcntl64: Ab,
				__syscall_fstat64: Bb,
				__syscall_ftruncate64: Cb,
				__syscall_getcwd: Db,
				__syscall_ioctl: Eb,
				__syscall_lstat64: Fb,
				__syscall_newfstatat: Gb,
				__syscall_openat: Hb,
				__syscall_poll: Ib,
				__syscall_rmdir: Jb,
				__syscall_stat64: Kb,
				__syscall_unlinkat: Lb,
				__table_base: Mb,
				_abort_js: Nb,
				_dlopen_js: Ob,
				_dlsym_catchup_js: Pb,
				_dlsym_js: Qb,
				_embind_finalize_value_object: Rb,
				_embind_register_arithmetic_vector: Sb,
				_embind_register_bigint: Tb,
				_embind_register_bool: Ub,
				_embind_register_class: Vb,
				_embind_register_class_class_function: Wb,
				_embind_register_class_constructor: Xb,
				_embind_register_class_function: Yb,
				_embind_register_class_property: Zb,
				_embind_register_emval: $b,
				_embind_register_enum: ac,
				_embind_register_enum_value: bc,
				_embind_register_float: cc,
				_embind_register_function: dc,
				_embind_register_integer: ec,
				_embind_register_memory_view: fc,
				_embind_register_std_string: gc,
				_embind_register_std_wstring: hc,
				_embind_register_value_object: ic,
				_embind_register_value_object_field: jc,
				_embind_register_void: kc,
				_emscripten_dlopen_js: lc,
				_emscripten_dlsync_threads: mc,
				_emscripten_dlsync_threads_async: nc,
				_emscripten_get_dynamic_libraries_js: oc,
				_emscripten_init_main_thread_js: pc,
				_emscripten_notify_mailbox_postmessage: qc,
				_emscripten_receive_on_main_thread_js: rc,
				_emscripten_runtime_keepalive_clear: sc,
				_emscripten_thread_cleanup: tc,
				_emscripten_thread_exit_joinable: uc,
				_emscripten_thread_mailbox_await: Ha,
				_emscripten_thread_set_strongref: vc,
				_emscripten_throw_longjmp: wc,
				_emval_as: xc,
				_emval_call: yc,
				_emval_decref: zc,
				_emval_get_global: Ac,
				_emval_get_method_caller: Bc,
				_emval_get_module_property: Cc,
				_emval_get_property: Dc,
				_emval_incref: Ec,
				_emval_instanceof: Fc,
				_emval_is_number: Gc,
				_emval_is_string: Hc,
				_emval_new_cstring: Ic,
				_emval_run_destructors: Jc,
				_emval_set_property: Kc,
				_emval_take_value: Lc,
				_emval_typeof: Mc,
				_gmtime_js: Nc,
				_localtime_js: Oc,
				_mmap_js: Pc,
				_munmap_js: Qc,
				_tzset_js: Rc,
				clock_time_get: Sc,
				emscripten_check_blocking_allowed: Tc,
				emscripten_date_now: Uc,
				emscripten_err: Vc,
				emscripten_exit_with_live_runtime: Wc,
				emscripten_get_heap_max: Xc,
				emscripten_get_now: Yc,
				emscripten_num_logical_cores: Zc,
				emscripten_promise_destroy: $c,
				emscripten_promise_resolve: ad,
				emscripten_resize_heap: bd,
				environ_get: cd,
				environ_sizes_get: dd,
				exit: ed,
				fd_close: fd,
				fd_fdstat_get: gd,
				fd_read: hd,
				fd_seek: jd,
				fd_write: kd,
				ffi_call_js: ld,
				heif_color_conversion_options_ext_copy: md,
				heif_color_conversion_options_ext_free: nd,
				heif_encoding_options_alloc: od,
				heif_encoding_options_free: pd,
				heif_error_success: qd,
				heif_image_get_bits_per_pixel_range: rd,
				heif_image_get_chroma_format: sd,
				heif_image_get_nclx_color_profile: td,
				heif_image_get_plane_readonly2: ud,
				heif_image_release: vd,
				heif_nclx_color_profile_free: wd,
				heif_tai_clock_info_release: xd,
				heif_tai_timestamp_packet_alloc: yd,
				heif_tai_timestamp_packet_copy: zd,
				heif_tai_timestamp_packet_release: Ad,
				invoke_di: Bd,
				invoke_dii: Cd,
				invoke_diii: Dd,
				invoke_diiii: Ed,
				invoke_fiii: Fd,
				invoke_i: Gd,
				invoke_ii: Hd,
				invoke_iii: Id,
				invoke_iiid: Jd,
				invoke_iiii: Kd,
				invoke_iiiii: Ld,
				invoke_iiiiid: Md,
				invoke_iiiiii: Nd,
				invoke_iiiiiii: Od,
				invoke_iiiiiiii: Pd,
				invoke_iiiiiiiiiii: Qd,
				invoke_iiiiiiiiiiii: Rd,
				invoke_iiiiiiiiiiiii: Sd,
				invoke_iiiiij: Td,
				invoke_ji: Ud,
				invoke_jiiii: Vd,
				invoke_v: Wd,
				invoke_vi: Xd,
				invoke_vid: Yd,
				invoke_viddi: Zd,
				invoke_vii: $d,
				invoke_viid: ae,
				invoke_viidd: be,
				invoke_viiddi: ce,
				invoke_viidi: de,
				invoke_viii: ee,
				invoke_viiid: fe,
				invoke_viiidddddi: ge,
				invoke_viiiddddi: he,
				invoke_viiidddi: ie,
				invoke_viiiddi: je,
				invoke_viiidi: ke,
				invoke_viiii: le,
				invoke_viiiii: me,
				invoke_viiiiii: ne,
				invoke_viiiiiii: oe,
				invoke_viiiiiiii: pe,
				invoke_viiiiiiiii: qe,
				invoke_viiiiiiiiii: re,
				invoke_viiiiiiiiiii: se,
				invoke_viiiiiiiiiiii: te,
				invoke_viiiiiiiiiiiii: ue,
				invoke_viiiiiiiiiiiiiii: ve,
				memory: Ca,
				proc_exit: we,
				random_get: xe,
			};
			return {
				env: G,
				wasi_snapshot_preview1: G,
				'GOT.mem': new Proxy( G, ye ),
				'GOT.func': new Proxy( G, ye ),
			};
		}
		var Ae = ( a ) => {
			if ( ! ( a instanceof ze || 'unwind' == a ) ) throw a;
		};
		class ze {
			name = 'ExitStatus';
			constructor( a ) {
				this.message = `Program terminated with exit(${ a })`;
				this.status = a;
			}
		}
		var I = 0,
			Be = ( a ) => {
				a.terminate();
				a.onmessage = () => {};
			},
			Ie = ( a ) => {
				var b = Ce[ a ];
				De.delete( a );
				a in Ee && Ee[ a ].resolve();
				a = b.X;
				delete Ce[ a ];
				Fe.push( b );
				Ge.splice( Ge.indexOf( b ), 1 );
				b.X = 0;
				He( a );
			},
			Ua = ( a ) => {
				for ( ; 0 < a.length;  ) a.shift()( m );
			},
			Je = [],
			Me = ( a ) => {
				0 == Fe.length && ( Ke(), Le( Fe[ 0 ] ) );
				var b = Fe.pop();
				if ( ! b ) return 6;
				Ge.push( b );
				Ce[ a.X ] = b;
				b.X = a.X;
				b.postMessage( { U: 'run', nc: a.mc, Da: a.Da, X: a.X }, a.nb );
				return 0;
			},
			Fe = [],
			Ge = [],
			Ne = [],
			Ce = {};
		function Oe() {
			for (
				var a =
					6 < navigator.hardwareConcurrency
						? navigator.hardwareConcurrency
						: 6;
				a--;

			)
				Ke();
			Je.push( () => {
				Za( 'loading-workers' );
				Pe( () => $a( 'loading-workers' ) );
			} );
			Ee = {};
			De = new Set();
		}
		var Qe = () => {
			for ( var a of Ge ) Be( a );
			for ( a of Fe ) Be( a );
			Fe = [];
			Ge = [];
			Ce = {};
		};
		function Ga() {
			Ne.forEach( ( a ) => a() );
		}
		var Le = ( a ) =>
			new Promise( ( b ) => {
				a.onmessage = ( f ) => {
					f = f.data;
					var g = f.U;
					if ( f.Ca && f.Ca != Re() ) {
						var h = Ce[ f.Ca ];
						h
							? h.postMessage( f, f.nb )
							: v(
									`Internal error! Worker sent a message "${ g }" to target pthread ${ f.Ca }, but that thread no longer exists!`
							  );
					} else if ( 'checkMailbox' === g ) Ka();
					else if ( 'spawnThread' === g ) Me( f );
					else if ( 'cleanupThread' === g ) Ie( f.Qa );
					else if ( 'markAsFinished' === g )
						( f = f.Qa ), De.add( f ), f in Ee && Ee[ f ].resolve();
					else if ( 'loaded' === g ) ( a.loaded = ! 0 ), b( a );
					else if ( 'setimmediate' === f.target ) a.postMessage( f );
					else if ( 'callHandler' === g ) m[ f.Jb ]( ...f.tb );
					else g && v( `worker sent an unknown command ${ g }` );
				};
				a.onerror = ( f ) => {
					v(
						`${ 'worker sent an error!' } ${ f.filename }:${
							f.lineno
						}: ${ f.message }`
					);
					throw f;
				};
				var c = [],
					d = [ 'onExit', 'onAbort', 'print', 'printErr' ],
					e;
				for ( e of d ) m.propertyIsEnumerable( e ) && c.push( e );
				a.postMessage( {
					U: 'load',
					Kb: c,
					rc: Ca,
					sc: qa,
					zb: oa,
					kc: za,
				} );
			} );
		function Pe( a ) {
			t ? a() : Promise.all( Fe.map( Le ) ).then( a );
		}
		function Ke() {
			if ( m.mainScriptUrlOrBlob ) {
				var a = m.mainScriptUrlOrBlob;
				'string' != typeof a && ( a = URL.createObjectURL( a ) );
				a = new Worker( a, { type: 'module', name: 'em-pthread' } );
			} else
				a = new Worker( new URL( 'vips-es6.js', import.meta.url ), {
					type: 'module',
					name: 'em-pthread',
				} );
			Fe.push( a );
		}
		var De,
			Ee,
			O = ( a, b, ...c ) => {
				for (
					var d = 2 * c.length,
						e = J(),
						f = Se( 8 * d ),
						g = f >> 3,
						h = 0;
					h < c.length;
					h++
				) {
					var k = c[ h ];
					'bigint' == typeof k
						? ( ( F[ g + 2 * h ] = 1n ),
						  ( F[ g + 2 * h + 1 ] = k ) )
						: ( ( F[ g + 2 * h ] = 0n ),
						  ( Oa[ g + 2 * h + 1 ] = k ) );
				}
				a = Te( a, 0, d, f, b );
				K( e );
				return a;
			};
		function we( a ) {
			if ( t ) return O( 0, 1, a );
			sa = a;
			Ue || 0 < I || ( Qe(), m.onExit?.( a ), ( ra = ! 0 ) );
			throw new ze( a );
		}
		we.g = 'vi';
		function Ve( a ) {
			if ( t ) return O( 1, 0, a );
			ed( a );
		}
		var ed = ( a ) => {
			sa = a;
			if ( t ) throw ( Ve( a ), 'unwind' );
			if ( ! ( Ue || 0 < I || t ) ) {
				We();
				FS.Ga = ! 1;
				Xe( 0 );
				for ( var b of FS.streams ) b && FS.close( b );
				Qe();
				Ra = ! 0;
			}
			we( a );
		};
		ed.g = 'vi';
		var Ze = ( a ) => {
				if ( ! Ra && ! ra )
					try {
						if ( ( a(), ! ( Ra || Ue || 0 < I ) ) )
							try {
								t ? Ye( sa ) : ed( sa );
							} catch ( b ) {
								Ae( b );
							}
					} catch ( b ) {
						Ae( b );
					}
			},
			$e = ( a ) => {
				I += 1;
				setTimeout( () => {
					--I;
					Ze( a );
				}, 1e4 );
			},
			af = [],
			bf = {},
			cf = ! 1;
		function df() {
			function a() {
				var c = m.canvas;
				cf =
					document.pointerLockElement === c ||
					document.mozPointerLockElement === c ||
					document.webkitPointerLockElement === c ||
					document.msPointerLockElement === c;
			}
			if ( ! ef ) {
				ef = ! 0;
				af.push( {
					canHandle: function ( c ) {
						return (
							! m.noImageDecoding &&
							/\.(jpg|jpeg|png|bmp|webp)$/i.test( c )
						);
					},
					handle: function ( c, d, e, f ) {
						var g = new Blob( [ c ], { type: ff( d ) } );
						g.size !== c.length &&
							( g = new Blob( [ new Uint8Array( c ).buffer ], {
								type: ff( d ),
							} ) );
						var h = URL.createObjectURL( g ),
							k = new Image();
						k.onload = () => {
							var l = document.createElement( 'canvas' );
							l.width = k.width;
							l.height = k.height;
							l.getContext( '2d' ).drawImage( k, 0, 0 );
							URL.revokeObjectURL( h );
							e?.( c );
						};
						k.onerror = () => {
							v( `Image ${ h } could not be decoded` );
							f?.();
						};
						k.src = h;
					},
				} );
				af.push( {
					canHandle: function ( c ) {
						return (
							! m.noAudioDecoding &&
							c.slice( -4 ) in { '.ogg': 1, '.wav': 1, '.mp3': 1 }
						);
					},
					handle: function ( c, d, e ) {
						function f() {
							g || ( ( g = ! 0 ), e?.( c ) );
						}
						var g = ! 1,
							h = URL.createObjectURL(
								new Blob( [ c ], { type: ff( d ) } )
							),
							k = new Audio();
						k.addEventListener(
							'canplaythrough',
							() => f( k ),
							! 1
						);
						k.onerror = function () {
							if ( ! g ) {
								v(
									`warning: browser could not fully decode audio ${ d }, trying slower base64 approach`
								);
								for (
									var l = '', p = 0, n = 0, q = 0;
									q < c.length;
									q++
								)
									for (
										p = ( p << 8 ) | c[ q ], n += 8;
										6 <= n;

									) {
										var r = ( p >> ( n - 6 ) ) & 63;
										n -= 6;
										l +=
											'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[
												r
											];
									}
								2 == n
									? ( ( l +=
											'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[
												( p & 3 ) << 4
											] ),
									  ( l += '==' ) )
									: 4 == n &&
									  ( ( l +=
											'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'[
												( p & 15 ) << 2
											] ),
									  ( l += '=' ) );
								k.src =
									'data:audio/x-' +
									d.slice( -3 ) +
									';base64,' +
									l;
								f( k );
							}
						};
						k.src = h;
						$e( () => {
							f( k );
						} );
					},
				} );
				var b = m.canvas;
				b &&
					( ( b.requestPointerLock =
						b.requestPointerLock ||
						b.mozRequestPointerLock ||
						b.webkitRequestPointerLock ||
						b.msRequestPointerLock ||
						( () => {} ) ),
					( b.exitPointerLock =
						document.exitPointerLock ||
						document.mozExitPointerLock ||
						document.webkitExitPointerLock ||
						document.msExitPointerLock ||
						( () => {} ) ),
					( b.exitPointerLock = b.exitPointerLock.bind( document ) ),
					document.addEventListener( 'pointerlockchange', a, ! 1 ),
					document.addEventListener( 'mozpointerlockchange', a, ! 1 ),
					document.addEventListener(
						'webkitpointerlockchange',
						a,
						! 1
					),
					document.addEventListener( 'mspointerlockchange', a, ! 1 ),
					m.elementPointerLock &&
						b.addEventListener(
							'click',
							( c ) => {
								! cf &&
									m.canvas.requestPointerLock &&
									( m.canvas.requestPointerLock(),
									c.preventDefault() );
							},
							! 1
						) );
			}
		}
		function ff( a ) {
			return {
				jpg: 'image/jpeg',
				jpeg: 'image/jpeg',
				png: 'image/png',
				bmp: 'image/bmp',
				ogg: 'audio/ogg',
				wav: 'audio/wav',
				mp3: 'audio/mpeg',
			}[ a.slice( a.lastIndexOf( '.' ) + 1 ) ];
		}
		var gf = {},
			ef,
			hf = {},
			jf = new Set( [ '__lsan_ignore_object', '__lsan_ignore_object' ] ),
			ye = {
				get( a, b ) {
					( a = hf[ b ] ) ||
						( a = hf[ b ] =
							new WebAssembly.Global( {
								value: 'i32',
								mutable: ! 0,
							} ) );
					jf.has( b ) || ( a.required = ! 0 );
					return a;
				},
			},
			kf = [];
		function Ea( a ) {
			var b = E[ ( a + 52 ) >> 2 ];
			lf( b, b - E[ ( a + 56 ) >> 2 ] );
			K( b );
		}
		var mf = new TextDecoder(),
			nf = ( a, b = 0, c = NaN ) => {
				c = b + c;
				for ( var d = b; a[ d ] && ! ( d >= c );  ) ++d;
				return mf.decode(
					a.buffer
						? a.buffer instanceof ArrayBuffer
							? a.subarray( b, d )
							: a.slice( b, d )
						: new Uint8Array( a.slice( b, d ) )
				);
			},
			of = ( a ) => {
				function b() {
					for ( var n = 0, q = 1; ;  ) {
						var r = a[ f++ ];
						n += ( r & 127 ) * q;
						q *= 128;
						if ( ! ( r & 128 ) ) break;
					}
					return n;
				}
				function c() {
					var n = b();
					f += n;
					return nf( a, f - n, n );
				}
				function d() {
					for ( var n = b(), q = []; n--;  ) q.push( c() );
					return q;
				}
				function e( n, q ) {
					if ( n ) throw Error( q );
				}
				var f = 0,
					g = 0;
				if ( a instanceof WebAssembly.Module )
					( g = WebAssembly.Module.customSections( a, 'dylink.0' ) ),
						e( 0 === g.length, 'need dylink section' ),
						( a = new Uint8Array( g[ 0 ] ) ),
						( g = a.length );
				else {
					g =
						1836278016 ==
						new Uint32Array(
							new Uint8Array( a.subarray( 0, 24 ) ).buffer
						)[ 0 ];
					e( ! g, 'need to see wasm magic number' );
					e( 0 !== a[ 8 ], 'need the dylink section to be first' );
					f = 9;
					g = b();
					g = f + g;
					var h = c();
					e( 'dylink.0' !== h );
				}
				for (
					h = { La: [], mb: new Set(), ob: new Set(), jb: [] };
					f < g;

				) {
					var k = a[ f++ ],
						l = b();
					if ( 1 === k )
						( h.Ka = b() ),
							( h.Tb = b() ),
							( h.sa = b() ),
							( h.Mc = b() );
					else if ( 2 === k ) h.La = d();
					else if ( 3 === k )
						for ( k = b(); k--;  ) {
							l = c();
							var p = b();
							p & 256 && h.mb.add( l );
						}
					else if ( 4 === k )
						for ( k = b(); k--;  )
							c(),
								( l = c() ),
								( p = b() ),
								1 == ( p & 3 ) && h.ob.add( l );
					else 5 === k ? ( h.jb = d() ) : ( f += l );
				}
				return h;
			},
			pf = [],
			qb = new WebAssembly.Table( { initial: 5941, element: 'anyfunc' } ),
			P = ( a ) => {
				var b = pf[ a ];
				b || ( pf[ a ] = b = qb.get( a ) );
				return b;
			},
			Ja = ( a, b ) => {
				Ue = I = 0;
				qf();
				a = P( a )( b );
				Ue || 0 < I ? ( sa = a ) : Ye( a );
			},
			tf = ( a, b, c ) => {
				c = { Aa: Infinity, name: a, exports: c, global: ! 0 };
				rf[ a ] = c;
				void 0 != b && ( sf[ b ] = c );
				return c;
			},
			rf = {},
			sf = {},
			pb = 3676496,
			uf = ( a, b ) => Math.ceil( a / b ) * b,
			wf = ( a ) => {
				if ( Qa ) return vf( a, 1 );
				var b = pb;
				pb = a = b + 16 * Math.ceil( a / 16 );
				hf.__heap_base.value = a;
				return b;
			},
			yf = ( a, b ) => {
				if ( xf )
					for ( var c = a; c < a + b; c++ ) {
						var d = P( c );
						d && xf.set( d, c );
					}
			},
			xf,
			zf = ( a ) => {
				xf || ( ( xf = new WeakMap() ), yf( 0, qb.length ) );
				return xf.get( a ) || 0;
			},
			Af = [],
			Bf = ( a, b ) => {
				var c = zf( a );
				if ( c ) return c;
				if ( Af.length ) c = Af.pop();
				else {
					try {
						qb.grow( 1 );
					} catch ( k ) {
						if ( ! ( k instanceof RangeError ) ) throw k;
						throw 'Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.';
					}
					c = qb.length - 1;
				}
				try {
					var d = c;
					qb.set( d, a );
					pf[ d ] = qb.get( d );
				} catch ( k ) {
					if ( ! ( k instanceof TypeError ) ) throw k;
					if ( 'function' == typeof WebAssembly.Function ) {
						d = WebAssembly.Function;
						for (
							var e = {
									i: 'i32',
									j: 'i64',
									f: 'f32',
									d: 'f64',
									e: 'externref',
									p: 'i32',
								},
								f = {
									parameters: [],
									results:
										'v' == b[ 0 ] ? [] : [ e[ b[ 0 ] ] ],
								},
								g = 1;
							g < b.length;
							++g
						)
							f.parameters.push( e[ b[ g ] ] );
						b = new d( f, a );
					} else {
						d = [ 1 ];
						f = b.slice( 0, 1 );
						b = b.slice( 1 );
						g = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
						d.push( 96 );
						var h = b.length;
						128 > h ? d.push( h ) : d.push( h % 128 | 128, h >> 7 );
						for ( e of b ) d.push( g[ e ] );
						'v' == f ? d.push( 0 ) : d.push( 1, g[ f ] );
						b = [ 0, 97, 115, 109, 1, 0, 0, 0, 1 ];
						e = d.length;
						128 > e ? b.push( e ) : b.push( e % 128 | 128, e >> 7 );
						b.push( ...d );
						b.push(
							2,
							7,
							1,
							1,
							101,
							1,
							102,
							0,
							0,
							7,
							5,
							1,
							1,
							102,
							0,
							0
						);
						b = new WebAssembly.Module( new Uint8Array( b ) );
						b = new WebAssembly.Instance( b, { e: { f: a } } )
							.exports.f;
					}
					d = c;
					qb.set( d, b );
					pf[ d ] = qb.get( d );
				}
				xf.set( a, c );
				return c;
			},
			Cf = ( a, b, c ) => {
				var d = {},
					e;
				for ( e in a ) {
					var f = a[ e ];
					'object' == typeof f && ( f = f.value );
					'number' == typeof f && ( f += b );
					d[ e ] = f;
				}
				for ( var g in d ) {
					a = g;
					if (
						'__cpp_exception __c_longjmp __wasm_apply_data_relocs __dso_handle __tls_size __tls_align __set_stack_limits _emscripten_tls_init __wasm_init_tls __wasm_call_ctors __start_em_asm __stop_em_asm __start_em_js __stop_em_js'
							.split( ' ' )
							.includes( a ) ||
						a.startsWith( '__em_js__' )
					)
						continue;
					a = d[ g ];
					let h, k;
					( h = hf )[ ( k = g ) ] ||
						( h[ k ] = new WebAssembly.Global( {
							value: 'i32',
							mutable: ! 0,
						} ) );
					if ( c || 0 == hf[ g ].value )
						'function' == typeof a
							? ( hf[ g ].value = Bf( a ) )
							: 'number' == typeof a
							? ( hf[ g ].value = a )
							: v(
									`unhandled export type for '${ g }': ${ typeof a }`
							  );
				}
				return d;
			},
			Df = ( a ) => {
				a = G[ a ];
				return ! a || a.G ? ! 1 : ! 0;
			},
			Ef = ( a, b = [] ) => P( a )( ...b ),
			Ff =
				( a ) =>
				( b, ...c ) => {
					var d = J();
					try {
						return Ef( b, c );
					} catch ( e ) {
						K( d );
						if ( ! ( e instanceof w ) ) throw e;
						Q( 1, 0 );
						if ( 'j' == a[ 0 ] ) return 0n;
					}
				},
			Hf = ( a ) => {
				var b;
				Df( a )
					? ( b = G[ a ] )
					: a.startsWith( 'invoke_' )
					? ( b = G[ a ] = Ff( a.split( '_' )[ 1 ] ) )
					: a.startsWith( '__cxa_find_matching_catch_' ) &&
					  ( b = G[ a ] = ( ...c ) => Gf( c ) );
				return { Pa: b, name: a };
			},
			Wa = [],
			R = ( a, b ) => {
				if ( ! a ) return '';
				b = a + b;
				for ( var c = a; ! ( c >= b ) && z[ c ];  ) ++c;
				return mf.decode( z.slice( a, c ) );
			},
			Mf = ( a, b, c, d, e ) => {
				function f() {
					function h( x, B ) {
						function L( Aa, fa ) {
							Aa = [];
							for ( var Ma = 0; 16 > Ma; Ma++ )
								if ( -1 != fa.indexOf( '$' + Ma ) )
									Aa.push( '$' + Ma );
								else break;
							Aa = Aa.join( ',' );
							If[ H ] = eval( `(${ Aa }) => { ${ fa } };` );
						}
						function M( Aa, fa, Ma ) {
							var Nf = [];
							fa = fa.slice( 1, -1 );
							if ( 'void' != fa ) {
								fa = fa.split( ',' );
								for ( var Xh in fa ) {
									var Yh = fa[ Xh ].split( ' ' ).pop();
									Nf.push( Yh.replace( '*', '' ) );
								}
							}
							q[ Aa ] = eval( `(${ Nf }) => ${ Ma };` );
						}
						! t && c && ( za[ c ] = x );
						yf( n, g.sa );
						q = Cf( B.exports, p );
						b.sb || Jf();
						if ( '__start_em_asm' in q ) {
							var H = q.__start_em_asm;
							for ( x = q.__stop_em_asm; H < x;  ) {
								var ja = R( H );
								L( H, ja );
								H = z.indexOf( 0, H ) + 1;
							}
						}
						for ( var N in q )
							N.startsWith( '__em_js__' ) &&
								( ( H = q[ N ] ),
								( ja = R( H ) ),
								( x = ja.split( '<::>' ) ),
								M(
									N.replace( '__em_js__', '' ),
									x[ 0 ],
									x[ 1 ]
								),
								delete q[ N ] );
						Kf( q._emscripten_tls_init, B.exports, g );
						k &&
							( ( B = q.__wasm_apply_data_relocs ) &&
								( Qa ? B() : Sa.push( B ) ),
							( B = q.__wasm_call_ctors ) &&
								( Qa ? B() : Wa.push( B ) ) );
						return q;
					}
					var k = ! e || ! y[ e + 8 ];
					if ( k ) {
						var l = Math.pow( 2, g.Tb ),
							p = g.Ka ? uf( wf( g.Ka + l ), l ) : 0,
							n = g.sa ? qb.length : 0;
						e &&
							( ( y[ e + 8 ] = 1 ),
							( E[ ( e + 12 ) >> 2 ] = p ),
							( D[ ( e + 16 ) >> 2 ] = g.Ka ),
							( E[ ( e + 20 ) >> 2 ] = n ),
							( D[ ( e + 24 ) >> 2 ] = g.sa ) );
					} else
						( p = E[ ( e + 12 ) >> 2 ] ),
							( n = E[ ( e + 20 ) >> 2 ] );
					g.sa && qb.grow( g.sa );
					var q;
					l = new Proxy(
						{},
						{
							get( x, B ) {
								switch ( B ) {
									case '__memory_base':
										return p;
									case '__table_base':
										return n;
								}
								if ( B in G && ! G[ B ].G ) return G[ B ];
								if ( ! ( B in x ) ) {
									var L;
									x[ B ] = ( ...M ) => {
										if ( ! L ) {
											var H = Hf( B ).Pa;
											! H && d && ( H = d[ B ] );
											H ||= q[ B ];
											L = H;
										}
										return L( ...M );
									};
								}
								return x[ B ];
							},
						}
					);
					var r = {
						'GOT.mem': new Proxy( {}, ye ),
						'GOT.func': new Proxy( {}, ye ),
						env: l,
						wasi_snapshot_preview1: l,
					};
					if ( b.H )
						return ( async () => {
							var x;
							a instanceof WebAssembly.Module
								? ( x = new WebAssembly.Instance( a, r ) )
								: ( { module: a, instance: x } =
										await WebAssembly.instantiate( a, r ) );
							return h( a, x );
						} )();
					l =
						a instanceof WebAssembly.Module
							? a
							: new WebAssembly.Module( a );
					var u = new WebAssembly.Instance( l, r );
					return h( l, u );
				}
				var g = of( a );
				jf = g.ob;
				b = { ...b, fc: { Yb: c, ac: g.jb } };
				if ( b.H )
					return g.La.reduce(
						( h, k ) => h.then( () => Lf( k, b, d ) ),
						Promise.resolve()
					).then( f );
				g.La.forEach( ( h ) => Lf( h, b, d ) );
				return f();
			},
			Of = ( a ) => {
				var b, c;
				for ( [ b, c ] of Object.entries( a ) )
					Df( b ) || ( G[ b ] = c );
			},
			Pf = async ( a ) => {
				a = await la( a );
				return new Uint8Array( a );
			},
			Qf = ( a, b ) => {
				for ( var c = 0, d = a.length - 1; 0 <= d; d-- ) {
					var e = a[ d ];
					'.' === e
						? a.splice( d, 1 )
						: '..' === e
						? ( a.splice( d, 1 ), c++ )
						: c && ( a.splice( d, 1 ), c-- );
				}
				if ( b ) for ( ; c; c-- ) a.unshift( '..' );
				return a;
			},
			Rf = ( a ) => {
				var b = '/' === a.charAt( 0 ),
					c = '/' === a.slice( -1 );
				( a = Qf(
					a.split( '/' ).filter( ( d ) => !! d ),
					! b
				).join( '/' ) ) ||
					b ||
					( a = '.' );
				a && c && ( a += '/' );
				return ( b ? '/' : '' ) + a;
			},
			Sf = ( a ) => {
				var b =
					/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
						.exec( a )
						.slice( 1 );
				a = b[ 0 ];
				b = b[ 1 ];
				if ( ! a && ! b ) return '.';
				b &&= b.slice( 0, -1 );
				return a + b;
			},
			Tf = ( a ) => a && a.match( /([^\/]+|\/)\/*$/ )[ 1 ],
			Uf = ( a, b ) => Rf( a + '/' + b ),
			Vf = ( a ) => {
				var b = J();
				a = a();
				K( b );
				return a;
			},
			Wf = ( a ) => {
				for ( var b = 0, c = 0; c < a.length; ++c ) {
					var d = a.charCodeAt( c );
					127 >= d
						? b++
						: 2047 >= d
						? ( b += 2 )
						: 55296 <= d && 57343 >= d
						? ( ( b += 4 ), ++c )
						: ( b += 3 );
				}
				return b;
			},
			Xf = ( a, b, c, d ) => {
				if ( ! ( 0 < d ) ) return 0;
				var e = c;
				d = c + d - 1;
				for ( var f = 0; f < a.length; ++f ) {
					var g = a.codePointAt( f );
					if ( 127 >= g ) {
						if ( c >= d ) break;
						b[ c++ ] = g;
					} else if ( 2047 >= g ) {
						if ( c + 1 >= d ) break;
						b[ c++ ] = 192 | ( g >> 6 );
						b[ c++ ] = 128 | ( g & 63 );
					} else if ( 65535 >= g ) {
						if ( c + 2 >= d ) break;
						b[ c++ ] = 224 | ( g >> 12 );
						b[ c++ ] = 128 | ( ( g >> 6 ) & 63 );
						b[ c++ ] = 128 | ( g & 63 );
					} else {
						if ( c + 3 >= d ) break;
						b[ c++ ] = 240 | ( g >> 18 );
						b[ c++ ] = 128 | ( ( g >> 12 ) & 63 );
						b[ c++ ] = 128 | ( ( g >> 6 ) & 63 );
						b[ c++ ] = 128 | ( g & 63 );
						f++;
					}
				}
				b[ c ] = 0;
				return c - e;
			},
			Yf = ( a ) => {
				var b = Wf( a ) + 1,
					c = Se( b );
				Xf( a, z, c, b );
				return c;
			},
			Zf = () => ( a ) =>
				a.set(
					crypto.getRandomValues( new Uint8Array( a.byteLength ) )
				),
			$f = ( a ) => {
				( $f = Zf() )( a );
			},
			ag = ( ...a ) => {
				for (
					var b = '', c = ! 1, d = a.length - 1;
					-1 <= d && ! c;
					d--
				) {
					c = 0 <= d ? a[ d ] : FS.cwd();
					if ( 'string' != typeof c )
						throw new TypeError(
							'Arguments to path.resolve must be strings'
						);
					if ( ! c ) return '';
					b = c + '/' + b;
					c = '/' === c.charAt( 0 );
				}
				b = Qf(
					b.split( '/' ).filter( ( e ) => !! e ),
					! c
				).join( '/' );
				return ( c ? '/' : '' ) + b || '.';
			},
			bg = ( a, b ) => {
				function c( g ) {
					for ( var h = 0; h < g.length && '' === g[ h ]; h++ );
					for ( var k = g.length - 1; 0 <= k && '' === g[ k ]; k-- );
					return h > k ? [] : g.slice( h, k - h + 1 );
				}
				a = ag( a ).slice( 1 );
				b = ag( b ).slice( 1 );
				a = c( a.split( '/' ) );
				b = c( b.split( '/' ) );
				for (
					var d = Math.min( a.length, b.length ), e = d, f = 0;
					f < d;
					f++
				)
					if ( a[ f ] !== b[ f ] ) {
						e = f;
						break;
					}
				d = [];
				for ( f = e; f < a.length; f++ ) d.push( '..' );
				d = d.concat( b.slice( e ) );
				return d.join( '/' );
			},
			cg = [],
			dg = ( a ) => {
				var b = Array( Wf( a ) + 1 );
				a = Xf( a, b, 0, b.length );
				b.length = a;
				return b;
			},
			eg = [];
		function fg( a, b ) {
			eg[ a ] = { input: [], output: [], ba: b };
			FS.registerDevice( a, gg );
		}
		var gg = {
				open( a ) {
					var b = eg[ a.node.qa ];
					if ( ! b ) throw new FS.h( 43 );
					a.B = b;
					a.seekable = ! 1;
				},
				close( a ) {
					a.B.ba.xa( a.B );
				},
				xa( a ) {
					a.B.ba.xa( a.B );
				},
				read( a, b, c, d ) {
					if ( ! a.B || ! a.B.ba.ab ) throw new FS.h( 60 );
					for ( var e = 0, f = 0; f < d; f++ ) {
						try {
							var g = a.B.ba.ab( a.B );
						} catch ( h ) {
							throw new FS.h( 29 );
						}
						if ( void 0 === g && 0 === e ) throw new FS.h( 6 );
						if ( null === g || void 0 === g ) break;
						e++;
						b[ c + f ] = g;
					}
					e && ( a.node.Z = Date.now() );
					return e;
				},
				write( a, b, c, d ) {
					if ( ! a.B || ! a.B.ba.Na ) throw new FS.h( 60 );
					try {
						for ( var e = 0; e < d; e++ )
							a.B.ba.Na( a.B, b[ c + e ] );
					} catch ( f ) {
						throw new FS.h( 29 );
					}
					d && ( a.node.N = a.node.M = Date.now() );
					return e;
				},
			},
			hg = {
				ab() {
					a: {
						if ( ! cg.length ) {
							var a = null;
							'undefined' != typeof window &&
								'function' == typeof window.prompt &&
								( ( a = window.prompt( 'Input: ' ) ),
								null !== a && ( a += '\n' ) );
							if ( ! a ) {
								a = null;
								break a;
							}
							cg = dg( a );
						}
						a = cg.shift();
					}
					return a;
				},
				Na( a, b ) {
					null === b || 10 === b
						? ( na( nf( a.output ) ), ( a.output = [] ) )
						: 0 != b && a.output.push( b );
				},
				xa( a ) {
					0 < a.output?.length &&
						( na( nf( a.output ) ), ( a.output = [] ) );
				},
				Nb() {
					return {
						yc: 25856,
						Ac: 5,
						xc: 191,
						zc: 35387,
						wc: [
							3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15,
							23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
							0,
						],
					};
				},
				Ob() {
					return 0;
				},
				Pb() {
					return [ 24, 80 ];
				},
			},
			ig = {
				Na( a, b ) {
					null === b || 10 === b
						? ( v( nf( a.output ) ), ( a.output = [] ) )
						: 0 != b && a.output.push( b );
				},
				xa( a ) {
					0 < a.output?.length &&
						( v( nf( a.output ) ), ( a.output = [] ) );
				},
			},
			kg = ( a ) => {
				a = 65536 * Math.ceil( a / 65536 );
				var b = jg( 65536, a );
				b && z.fill( 0, b, b + a );
				return b;
			},
			S = {
				W: null,
				mount() {
					return S.createNode( null, '/', 16895, 0 );
				},
				createNode( a, b, c, d ) {
					var e;
					( e = FS.isBlkdev( c ) ) || ( e = 4096 === ( c & 61440 ) );
					if ( e ) throw new FS.h( 63 );
					S.W ||
						( S.W = {
							dir: {
								node: {
									R: S.m.R,
									T: S.m.T,
									ha: S.m.ha,
									aa: S.m.aa,
									rename: S.m.rename,
									unlink: S.m.unlink,
									rmdir: S.m.rmdir,
									ra: S.m.ra,
									symlink: S.m.symlink,
								},
								stream: { llseek: S.o.llseek },
							},
							file: {
								node: { R: S.m.R, T: S.m.T },
								stream: {
									llseek: S.o.llseek,
									read: S.o.read,
									write: S.o.write,
									ia: S.o.ia,
									ka: S.o.ka,
								},
							},
							link: {
								node: {
									R: S.m.R,
									T: S.m.T,
									readlink: S.m.readlink,
								},
								stream: {},
							},
							Sa: { node: { R: S.m.R, T: S.m.T }, stream: FS.vb },
						} );
					c = FS.createNode( a, b, c, d );
					FS.isDir( c.mode )
						? ( ( c.m = S.W.dir.node ),
						  ( c.o = S.W.dir.stream ),
						  ( c.u = {} ) )
						: FS.isFile( c.mode )
						? ( ( c.m = S.W.file.node ),
						  ( c.o = S.W.file.stream ),
						  ( c.D = 0 ),
						  ( c.u = null ) )
						: FS.isLink( c.mode )
						? ( ( c.m = S.W.link.node ), ( c.o = S.W.link.stream ) )
						: FS.isChrdev( c.mode ) &&
						  ( ( c.m = S.W.Sa.node ), ( c.o = S.W.Sa.stream ) );
					c.Z = c.N = c.M = Date.now();
					a && ( ( a.u[ b ] = c ), ( a.Z = a.N = a.M = c.Z ) );
					return c;
				},
				Hc( a ) {
					return a.u
						? a.u.subarray
							? a.u.subarray( 0, a.D )
							: new Uint8Array( a.u )
						: new Uint8Array( 0 );
				},
				m: {
					R( a ) {
						var b = {};
						b.xb = FS.isChrdev( a.mode ) ? a.id : 1;
						b.Mb = a.id;
						b.mode = a.mode;
						b.Ub = 1;
						b.uid = 0;
						b.Ib = 0;
						b.qa = a.qa;
						FS.isDir( a.mode )
							? ( b.size = 4096 )
							: FS.isFile( a.mode )
							? ( b.size = a.D )
							: FS.isLink( a.mode )
							? ( b.size = a.link.length )
							: ( b.size = 0 );
						b.Z = new Date( a.Z );
						b.N = new Date( a.N );
						b.M = new Date( a.M );
						b.ub = 4096;
						b.Ra = Math.ceil( b.size / b.ub );
						return b;
					},
					T( a, b ) {
						for ( var c of [ 'mode', 'atime', 'mtime', 'ctime' ] )
							null != b[ c ] && ( a[ c ] = b[ c ] );
						void 0 !== b.size &&
							( ( b = b.size ),
							a.D != b &&
								( 0 == b
									? ( ( a.u = null ), ( a.D = 0 ) )
									: ( ( c = a.u ),
									  ( a.u = new Uint8Array( b ) ),
									  c &&
											a.u.set(
												c.subarray(
													0,
													Math.min( b, a.D )
												)
											),
									  ( a.D = b ) ) ) );
					},
					ha() {
						throw S.Wa;
					},
					aa( a, b, c, d ) {
						return S.createNode( a, b, c, d );
					},
					rename( a, b, c ) {
						try {
							var d = lg( b, c );
						} catch ( f ) {}
						if ( d ) {
							if ( FS.isDir( a.mode ) )
								for ( var e in d.u ) throw new FS.h( 55 );
							mg( d );
						}
						delete a.parent.u[ a.name ];
						b.u[ c ] = a;
						a.name = c;
						b.M = b.N = a.parent.M = a.parent.N = Date.now();
					},
					unlink( a, b ) {
						delete a.u[ b ];
						a.M = a.N = Date.now();
					},
					rmdir( a, b ) {
						var c = lg( a, b ),
							d;
						for ( d in c.u ) throw new FS.h( 55 );
						delete a.u[ b ];
						a.M = a.N = Date.now();
					},
					ra( a ) {
						return [ '.', '..', ...Object.keys( a.u ) ];
					},
					symlink( a, b, c ) {
						a = S.createNode( a, b, 41471, 0 );
						a.link = c;
						return a;
					},
					readlink( a ) {
						if ( ! FS.isLink( a.mode ) ) throw new FS.h( 28 );
						return a.link;
					},
				},
				o: {
					read( a, b, c, d, e ) {
						var f = a.node.u;
						if ( e >= a.node.D ) return 0;
						a = Math.min( a.node.D - e, d );
						if ( 8 < a && f.subarray )
							b.set( f.subarray( e, e + a ), c );
						else for ( d = 0; d < a; d++ ) b[ c + d ] = f[ e + d ];
						return a;
					},
					write( a, b, c, d, e, f ) {
						if ( ! d ) return 0;
						a = a.node;
						a.N = a.M = Date.now();
						if ( b.subarray && ( ! a.u || a.u.subarray ) ) {
							if ( f )
								return (
									( a.u = b.subarray( c, c + d ) ),
									( a.D = d )
								);
							if ( 0 === a.D && 0 === e )
								return (
									( a.u = b.slice( c, c + d ) ), ( a.D = d )
								);
							if ( e + d <= a.D )
								return a.u.set( b.subarray( c, c + d ), e ), d;
						}
						f = e + d;
						var g = a.u ? a.u.length : 0;
						g >= f ||
							( ( f = Math.max(
								f,
								( g * ( 1048576 > g ? 2 : 1.125 ) ) >>> 0
							) ),
							0 != g && ( f = Math.max( f, 256 ) ),
							( g = a.u ),
							( a.u = new Uint8Array( f ) ),
							0 < a.D && a.u.set( g.subarray( 0, a.D ), 0 ) );
						if ( a.u.subarray && b.subarray )
							a.u.set( b.subarray( c, c + d ), e );
						else
							for ( f = 0; f < d; f++ ) a.u[ e + f ] = b[ c + f ];
						a.D = Math.max( a.D, e + d );
						return d;
					},
					llseek( a, b, c ) {
						1 === c
							? ( b += a.position )
							: 2 === c &&
							  FS.isFile( a.node.mode ) &&
							  ( b += a.node.D );
						if ( 0 > b ) throw new FS.h( 28 );
						return b;
					},
					ia( a, b, c, d, e ) {
						if ( ! FS.isFile( a.node.mode ) ) throw new FS.h( 43 );
						a = a.node.u;
						if ( e & 2 || ! a || a.buffer !== y.buffer ) {
							d = ! 0;
							e = kg( b );
							if ( ! e ) throw new FS.h( 48 );
							if ( a ) {
								if ( 0 < c || c + b < a.length )
									a.subarray
										? ( a = a.subarray( c, c + b ) )
										: ( a = Array.prototype.slice.call(
												a,
												c,
												c + b
										  ) );
								y.set( a, e );
							}
						} else ( d = ! 1 ), ( e = a.byteOffset );
						return { s: e, ca: d };
					},
					ka( a, b, c, d ) {
						S.o.write( a, b, 0, d, c, ! 1 );
						return 0;
					},
				},
			},
			ng = ( a, b, c, d ) => {
				'undefined' != typeof gf && df();
				var e = ! 1;
				af.forEach( ( f ) => {
					! e &&
						f.canHandle( b ) &&
						( f.handle( a, b, c, d ), ( e = ! 0 ) );
				} );
				return e;
			},
			og = ( a, b, c, d, e, f, g, h, k, l ) => {
				function p( r ) {
					function u( x ) {
						l?.();
						h || FS.createDataFile( a, b, x, d, e, k );
						f?.();
						$a( q );
					}
					ng( r, n, u, () => {
						g?.();
						$a( q );
					} ) || u( r );
				}
				var n = b ? ag( Rf( a + '/' + b ) ) : a,
					q = `cp ${ n }`;
				Za( q );
				'string' == typeof c ? Pf( c ).then( p, g ) : p( c );
			},
			pg = ( a, b ) => {
				var c = 0;
				a && ( c |= 365 );
				b && ( c |= 146 );
				return c;
			};
		function lg( a, b ) {
			var c = FS.isDir( a.mode )
				? ( c = qg( a, 'x' ) )
					? c
					: a.m.ha
					? 0
					: 2
				: 54;
			if ( c ) throw new FS.h( c );
			for ( c = FS.V[ rg( a.id, b ) ]; c; c = c.ja ) {
				var d = c.name;
				if ( c.parent.id === a.id && d === b ) return c;
			}
			return FS.ha( a, b );
		}
		function mg( a ) {
			var b = rg( a.parent.id, a.name );
			if ( FS.V[ b ] === a ) FS.V[ b ] = a.ja;
			else
				for ( b = FS.V[ b ]; b;  ) {
					if ( b.ja === a ) {
						b.ja = a.ja;
						break;
					}
					b = b.ja;
				}
		}
		function rg( a, b ) {
			for ( var c = 0, d = 0; d < b.length; d++ )
				c = ( ( c << 5 ) - c + b.charCodeAt( d ) ) | 0;
			return ( ( a + c ) >>> 0 ) % FS.V.length;
		}
		function sg( a ) {
			var b = rg( a.parent.id, a.name );
			a.ja = FS.V[ b ];
			FS.V[ b ] = a;
		}
		function tg( a ) {
			var b = [ 'r', 'w', 'rw' ][ a & 3 ];
			a & 512 && ( b += 'w' );
			return b;
		}
		function qg( a, b ) {
			if ( FS.bb ) return 0;
			if ( ! b.includes( 'r' ) || a.mode & 292 ) {
				if (
					( b.includes( 'w' ) && ! ( a.mode & 146 ) ) ||
					( b.includes( 'x' ) && ! ( a.mode & 73 ) )
				)
					return 2;
			} else return 2;
			return 0;
		}
		function ug( a, b ) {
			if ( ! FS.isDir( a.mode ) ) return 54;
			try {
				return lg( a, b ), 20;
			} catch ( c ) {}
			return qg( a, 'wx' );
		}
		function vg( a, b, c ) {
			try {
				var d = lg( a, b );
			} catch ( e ) {
				return e.A;
			}
			if ( ( a = qg( a, 'wx' ) ) ) return a;
			if ( c ) {
				if ( ! FS.isDir( d.mode ) ) return 54;
				if ( FS.ma( d ) || FS.getPath( d ) === FS.cwd() ) return 10;
			} else if ( FS.isDir( d.mode ) ) return 31;
			return 0;
		}
		function wg( a, b ) {
			if ( ! a ) throw new FS.h( b );
			return a;
		}
		function T( a ) {
			a = FS.$a( a );
			if ( ! a ) throw new FS.h( 8 );
			return a;
		}
		function xg( a, b = -1 ) {
			a = Object.assign( new FS.qb(), a );
			if ( -1 == b )
				a: {
					for ( b = 0; b <= FS.rb; b++ )
						if ( ! FS.streams[ b ] ) break a;
					throw new FS.h( 33 );
				}
			a.$ = b;
			return ( FS.streams[ b ] = a );
		}
		function yg( a, b = -1 ) {
			a = xg( a, b );
			a.o?.Cc?.( a );
			return a;
		}
		function zg( a, b, c ) {
			var d = a?.o.T;
			a = d ? a : b;
			d ??= b.m.T;
			wg( d, 63 );
			d( a, c );
		}
		function Ag( a ) {
			var b = [];
			for ( a = [ a ]; a.length;  ) {
				var c = a.pop();
				b.push( c );
				a.push( ...c.na );
			}
			return b;
		}
		function Bg( a ) {
			var b = {
				vc: 4096,
				Fc: 4096,
				Ra: 1e6,
				uc: 5e5,
				tc: 5e5,
				files: FS.Ma,
				Dc: FS.Ma - 1,
				Gc: 42,
				flags: 2,
				Kc: 255,
			};
			a.m.lb && Object.assign( b, a.m.lb( a.mount.Wb.root ) );
			return b;
		}
		function Cg( a, b, c, d ) {
			zg( a, b, {
				mode: ( c & 4095 ) | ( b.mode & -4096 ),
				M: Date.now(),
				Xa: d,
			} );
		}
		function Dg( a, b, c ) {
			if ( FS.isDir( b.mode ) ) throw new FS.h( 31 );
			if ( ! FS.isFile( b.mode ) ) throw new FS.h( 28 );
			var d = qg( b, 'w' );
			if ( d ) throw new FS.h( d );
			zg( a, b, { size: c, timestamp: Date.now() } );
		}
		function Eg( a, b, c, d ) {
			a = 'string' == typeof a ? a : FS.getPath( a );
			b = Rf( a + '/' + b );
			return FS.create( b, pg( c, d ) );
		}
		function Fg( a ) {
			if ( ! ( a.Qb || a.Rb || a.link || a.u ) ) {
				if ( 'undefined' != typeof XMLHttpRequest )
					throw Error(
						'Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.'
					);
				try {
					( a.u = ma( a.url ) ), ( a.D = a.u.length );
				} catch ( b ) {
					throw new FS.h( 29 );
				}
			}
		}
		var FS = {
				root: null,
				na: [],
				Va: {},
				streams: [],
				Ma: 1,
				V: null,
				Ta: '/',
				Ga: ! 1,
				bb: ! 0,
				Cb: null,
				Ba: 0,
				ib: {},
				h: class {
					name = 'ErrnoError';
					constructor( a ) {
						this.A = a;
					}
				},
				qb: class {
					O = {};
					node = null;
					get object() {
						return this.node;
					}
					set object( a ) {
						this.node = a;
					}
					get flags() {
						return this.O.flags;
					}
					set flags( a ) {
						this.O.flags = a;
					}
					get position() {
						return this.O.position;
					}
					set position( a ) {
						this.O.position = a;
					}
				},
				pb: class {
					m = {};
					o = {};
					S = null;
					constructor( a, b, c, d ) {
						a ||= this;
						this.parent = a;
						this.mount = a.mount;
						this.id = FS.Ma++;
						this.name = b;
						this.mode = c;
						this.qa = d;
						this.Z = this.N = this.M = Date.now();
					}
					get read() {
						return 365 === ( this.mode & 365 );
					}
					set read( a ) {
						a ? ( this.mode |= 365 ) : ( this.mode &= -366 );
					}
					get write() {
						return 146 === ( this.mode & 146 );
					}
					set write( a ) {
						a ? ( this.mode |= 146 ) : ( this.mode &= -147 );
					}
					get Rb() {
						return FS.isDir( this.mode );
					}
					get Qb() {
						return FS.isChrdev( this.mode );
					}
				},
				lookupPath( a, b = {} ) {
					if ( ! a ) throw new FS.h( 44 );
					b.wa ?? ( b.wa = ! 0 );
					'/' === a.charAt( 0 ) || ( a = FS.cwd() + '/' + a );
					var c = 0;
					a: for ( ; 40 > c; c++ ) {
						a = a.split( '/' ).filter( ( h ) => !! h );
						for (
							var d = FS.root, e = '/', f = 0;
							f < a.length;
							f++
						) {
							var g = f === a.length - 1;
							if ( g && b.parent ) break;
							if ( '.' !== a[ f ] )
								if ( '..' === a[ f ] )
									if ( ( ( e = Sf( e ) ), FS.ma( d ) ) ) {
										a =
											e +
											'/' +
											a.slice( f + 1 ).join( '/' );
										continue a;
									} else d = d.parent;
								else {
									e = Rf( e + '/' + a[ f ] );
									try {
										d = lg( d, a[ f ] );
									} catch ( h ) {
										if ( 44 === h?.A && g && b.Vb )
											return { path: e };
										throw h;
									}
									! d.S ||
										( g && ! b.wa ) ||
										( d = d.S.root );
									if (
										FS.isLink( d.mode ) &&
										( ! g || b.follow )
									) {
										if ( ! d.m.readlink )
											throw new FS.h( 52 );
										d = d.m.readlink( d );
										'/' === d.charAt( 0 ) ||
											( d = Sf( e ) + '/' + d );
										a =
											d +
											'/' +
											a.slice( f + 1 ).join( '/' );
										continue a;
									}
								}
						}
						return { path: e, node: d };
					}
					throw new FS.h( 32 );
				},
				getPath( a ) {
					for ( var b; ;  ) {
						if ( FS.ma( a ) )
							return (
								( a = a.mount.fb ),
								b
									? '/' !== a[ a.length - 1 ]
										? `${ a }/${ b }`
										: a + b
									: a
							);
						b = b ? `${ a.name }/${ b }` : a.name;
						a = a.parent;
					}
				},
				createNode( a, b, c, d ) {
					a = new FS.pb( a, b, c, d );
					sg( a );
					return a;
				},
				ma( a ) {
					return a === a.parent;
				},
				isFile( a ) {
					return 32768 === ( a & 61440 );
				},
				isDir( a ) {
					return 16384 === ( a & 61440 );
				},
				isLink( a ) {
					return 40960 === ( a & 61440 );
				},
				isChrdev( a ) {
					return 8192 === ( a & 61440 );
				},
				isBlkdev( a ) {
					return 24576 === ( a & 61440 );
				},
				isSocket( a ) {
					return 49152 === ( a & 49152 );
				},
				rb: 4096,
				$a: ( a ) => FS.streams[ a ],
				vb: {
					open( a ) {
						a.o = FS.Eb( a.node.qa ).o;
						a.o.open?.( a );
					},
					llseek() {
						throw new FS.h( 70 );
					},
				},
				Ja: ( a ) => a >> 8,
				Ic: ( a ) => a & 255,
				makedev: ( a, b ) => ( a << 8 ) | b,
				registerDevice( a, b ) {
					FS.Va[ a ] = { o: b };
				},
				Eb: ( a ) => FS.Va[ a ],
				syncfs( a, b ) {
					function c( g ) {
						FS.Ba--;
						return b( g );
					}
					function d( g ) {
						if ( g ) {
							if ( ! d.Ab ) return ( d.Ab = ! 0 ), c( g );
						} else ++f >= e.length && c( null );
					}
					'function' == typeof a && ( ( b = a ), ( a = ! 1 ) );
					FS.Ba++;
					1 < FS.Ba &&
						v(
							`warning: ${ FS.Ba } FS.syncfs operations in flight at once, probably just doing extra work`
						);
					var e = Ag( FS.root.mount ),
						f = 0;
					e.forEach( ( g ) => {
						if ( ! g.type.syncfs ) return d( null );
						g.type.syncfs( g, a, d );
					} );
				},
				mount( a, b, c ) {
					var d = '/' === c;
					if ( d && FS.root ) throw new FS.h( 10 );
					if ( ! d && c ) {
						var e = FS.lookupPath( c, { wa: ! 1 } );
						c = e.path;
						e = e.node;
						if ( e.S ) throw new FS.h( 10 );
						if ( ! FS.isDir( e.mode ) ) throw new FS.h( 54 );
					}
					b = { type: a, Wb: b, fb: c, na: [] };
					a = a.mount( b );
					a.mount = b;
					b.root = a;
					d
						? ( FS.root = a )
						: e && ( ( e.S = b ), e.mount && e.mount.na.push( b ) );
					return a;
				},
				unmount( a ) {
					a = FS.lookupPath( a, { wa: ! 1 } );
					if ( ! a.node.S ) throw new FS.h( 28 );
					a = a.node;
					var b = a.S,
						c = Ag( b );
					Object.keys( FS.V ).forEach( ( d ) => {
						for ( d = FS.V[ d ]; d;  ) {
							var e = d.ja;
							c.includes( d.mount ) && mg( d );
							d = e;
						}
					} );
					a.S = null;
					a.mount.na.splice( a.mount.na.indexOf( b ), 1 );
				},
				ha( a, b ) {
					return a.m.ha( a, b );
				},
				aa( a, b, c ) {
					var d = FS.lookupPath( a, { parent: ! 0 } ).node;
					a = Tf( a );
					if ( ! a ) throw new FS.h( 28 );
					if ( '.' === a || '..' === a ) throw new FS.h( 20 );
					var e = ug( d, a );
					if ( e ) throw new FS.h( e );
					if ( ! d.m.aa ) throw new FS.h( 63 );
					return d.m.aa( d, a, b, c );
				},
				lb( a ) {
					return Bg( FS.lookupPath( a, { follow: ! 0 } ).node );
				},
				Lc( a ) {
					return Bg( a.node );
				},
				create( a, b = 438 ) {
					return FS.aa( a, ( b & 4095 ) | 32768, 0 );
				},
				mkdir( a, b = 511 ) {
					return FS.aa( a, ( b & 1023 ) | 16384, 0 );
				},
				Jc( a, b ) {
					var c = a.split( '/' ),
						d = '',
						e;
					for ( e of c )
						if ( e ) {
							if ( d || '/' === a.charAt( 0 ) ) d += '/';
							d += e;
							try {
								FS.mkdir( d, b );
							} catch ( f ) {
								if ( 20 != f.A ) throw f;
							}
						}
				},
				mkdev( a, b, c ) {
					'undefined' == typeof c && ( ( c = b ), ( b = 438 ) );
					return FS.aa( a, b | 8192, c );
				},
				symlink( a, b ) {
					if ( ! ag( a ) ) throw new FS.h( 44 );
					var c = FS.lookupPath( b, { parent: ! 0 } ).node;
					if ( ! c ) throw new FS.h( 44 );
					b = Tf( b );
					var d = ug( c, b );
					if ( d ) throw new FS.h( d );
					if ( ! c.m.symlink ) throw new FS.h( 63 );
					return c.m.symlink( c, b, a );
				},
				rename( a, b ) {
					var c = Sf( a ),
						d = Sf( b ),
						e = Tf( a ),
						f = Tf( b );
					var g = FS.lookupPath( a, { parent: ! 0 } );
					var h = g.node;
					g = FS.lookupPath( b, { parent: ! 0 } );
					g = g.node;
					if ( ! h || ! g ) throw new FS.h( 44 );
					if ( h.mount !== g.mount ) throw new FS.h( 75 );
					var k = lg( h, e );
					a = bg( a, d );
					if ( '.' !== a.charAt( 0 ) ) throw new FS.h( 28 );
					a = bg( b, c );
					if ( '.' !== a.charAt( 0 ) ) throw new FS.h( 55 );
					try {
						var l = lg( g, f );
					} catch ( p ) {}
					if ( k !== l ) {
						b = FS.isDir( k.mode );
						if ( ( e = vg( h, e, b ) ) ) throw new FS.h( e );
						if ( ( e = l ? vg( g, f, b ) : ug( g, f ) ) )
							throw new FS.h( e );
						if ( ! h.m.rename ) throw new FS.h( 63 );
						if ( k.S || ( l && l.S ) ) throw new FS.h( 10 );
						if ( g !== h && ( e = qg( h, 'w' ) ) )
							throw new FS.h( e );
						mg( k );
						try {
							h.m.rename( k, g, f ), ( k.parent = g );
						} catch ( p ) {
							throw p;
						} finally {
							sg( k );
						}
					}
				},
				rmdir( a ) {
					var b = FS.lookupPath( a, { parent: ! 0 } ).node;
					a = Tf( a );
					var c = lg( b, a ),
						d = vg( b, a, ! 0 );
					if ( d ) throw new FS.h( d );
					if ( ! b.m.rmdir ) throw new FS.h( 63 );
					if ( c.S ) throw new FS.h( 10 );
					b.m.rmdir( b, a );
					mg( c );
				},
				ra( a ) {
					a = FS.lookupPath( a, { follow: ! 0 } ).node;
					return wg( a.m.ra, 54 )( a );
				},
				unlink( a ) {
					var b = FS.lookupPath( a, { parent: ! 0 } ).node;
					if ( ! b ) throw new FS.h( 44 );
					a = Tf( a );
					var c = lg( b, a ),
						d = vg( b, a, ! 1 );
					if ( d ) throw new FS.h( d );
					if ( ! b.m.unlink ) throw new FS.h( 63 );
					if ( c.S ) throw new FS.h( 10 );
					b.m.unlink( b, a );
					mg( c );
				},
				readlink( a ) {
					a = FS.lookupPath( a ).node;
					if ( ! a ) throw new FS.h( 44 );
					if ( ! a.m.readlink ) throw new FS.h( 28 );
					return a.m.readlink( a );
				},
				stat( a, b ) {
					a = FS.lookupPath( a, { follow: ! b } ).node;
					return wg( a.m.R, 63 )( a );
				},
				lstat( a ) {
					return FS.stat( a, ! 0 );
				},
				chmod( a, b, c ) {
					a =
						'string' == typeof a
							? FS.lookupPath( a, { follow: ! c } ).node
							: a;
					Cg( null, a, b, c );
				},
				lchmod( a, b ) {
					FS.chmod( a, b, ! 0 );
				},
				fchmod( a, b ) {
					a = T( a );
					Cg( a, a.node, b, ! 1 );
				},
				chown( a, b, c, d ) {
					a =
						'string' == typeof a
							? FS.lookupPath( a, { follow: ! d } ).node
							: a;
					zg( null, a, { timestamp: Date.now(), Xa: d } );
				},
				lchown( a, b, c ) {
					FS.chown( a, b, c, ! 0 );
				},
				fchown( a ) {
					a = T( a );
					zg( a, a.node, { timestamp: Date.now(), Xa: ! 1 } );
				},
				truncate( a, b ) {
					if ( 0 > b ) throw new FS.h( 28 );
					a =
						'string' == typeof a
							? FS.lookupPath( a, { follow: ! 0 } ).node
							: a;
					Dg( null, a, b );
				},
				ftruncate( a, b ) {
					a = T( a );
					if ( 0 > b || 0 === ( a.flags & 2097155 ) )
						throw new FS.h( 28 );
					Dg( a, a.node, b );
				},
				utime( a, b, c ) {
					a = FS.lookupPath( a, { follow: ! 0 } ).node;
					wg( a.m.T, 63 )( a, { Z: b, N: c } );
				},
				open( a, b, c = 438 ) {
					if ( '' === a ) throw new FS.h( 44 );
					if ( 'string' == typeof b ) {
						var d = {
							r: 0,
							'r+': 2,
							w: 577,
							'w+': 578,
							a: 1089,
							'a+': 1090,
						}[ b ];
						if ( 'undefined' == typeof d )
							throw Error( `Unknown file open mode: ${ b }` );
						b = d;
					}
					c = b & 64 ? ( c & 4095 ) | 32768 : 0;
					if ( 'object' == typeof a ) d = a;
					else {
						var e = a.endsWith( '/' );
						a = FS.lookupPath( a, {
							follow: ! ( b & 131072 ),
							Vb: ! 0,
						} );
						d = a.node;
						a = a.path;
					}
					var f = ! 1;
					if ( b & 64 )
						if ( d ) {
							if ( b & 128 ) throw new FS.h( 20 );
						} else {
							if ( e ) throw new FS.h( 31 );
							d = FS.aa( a, c | 511, 0 );
							f = ! 0;
						}
					if ( ! d ) throw new FS.h( 44 );
					FS.isChrdev( d.mode ) && ( b &= -513 );
					if ( b & 65536 && ! FS.isDir( d.mode ) )
						throw new FS.h( 54 );
					if ( ! f ) {
						e = d;
						var g = b;
						if (
							( e = e
								? FS.isLink( e.mode )
									? 32
									: FS.isDir( e.mode ) &&
									  ( 'r' !== tg( g ) || g & 576 )
									? 31
									: qg( e, tg( g ) )
								: 44 )
						)
							throw new FS.h( e );
					}
					b & 512 && ! f && FS.truncate( d, 0 );
					b &= -131713;
					e = xg( {
						node: d,
						path: FS.getPath( d ),
						flags: b,
						seekable: ! 0,
						position: 0,
						o: d.o,
						pc: [],
						error: ! 1,
					} );
					e.o.open && e.o.open( e );
					f && FS.chmod( d, c & 511 );
					! m.logReadFiles ||
						b & 1 ||
						a in FS.ib ||
						( FS.ib[ a ] = 1 );
					return e;
				},
				close( a ) {
					if ( null === a.$ ) throw new FS.h( 8 );
					a.Ea && ( a.Ea = null );
					try {
						a.o.close && a.o.close( a );
					} catch ( b ) {
						throw b;
					} finally {
						FS.streams[ a.$ ] = null;
					}
					a.$ = null;
				},
				llseek( a, b, c ) {
					if ( null === a.$ ) throw new FS.h( 8 );
					if ( ! a.seekable || ! a.o.llseek ) throw new FS.h( 70 );
					if ( 0 != c && 1 != c && 2 != c ) throw new FS.h( 28 );
					a.position = a.o.llseek( a, b, c );
					a.pc = [];
					return a.position;
				},
				read( a, b, c, d, e ) {
					if ( 0 > d || 0 > e ) throw new FS.h( 28 );
					if ( null === a.$ ) throw new FS.h( 8 );
					if ( 1 === ( a.flags & 2097155 ) ) throw new FS.h( 8 );
					if ( FS.isDir( a.node.mode ) ) throw new FS.h( 31 );
					if ( ! a.o.read ) throw new FS.h( 28 );
					var f = 'undefined' != typeof e;
					if ( ! f ) e = a.position;
					else if ( ! a.seekable ) throw new FS.h( 70 );
					b = a.o.read( a, b, c, d, e );
					f || ( a.position += b );
					return b;
				},
				write( a, b, c, d, e, f ) {
					if ( 0 > d || 0 > e ) throw new FS.h( 28 );
					if ( null === a.$ ) throw new FS.h( 8 );
					if ( 0 === ( a.flags & 2097155 ) ) throw new FS.h( 8 );
					if ( FS.isDir( a.node.mode ) ) throw new FS.h( 31 );
					if ( ! a.o.write ) throw new FS.h( 28 );
					a.seekable && a.flags & 1024 && FS.llseek( a, 0, 2 );
					var g = 'undefined' != typeof e;
					if ( ! g ) e = a.position;
					else if ( ! a.seekable ) throw new FS.h( 70 );
					b = a.o.write( a, b, c, d, e, f );
					g || ( a.position += b );
					return b;
				},
				ia( a, b, c, d, e ) {
					if (
						0 !== ( d & 2 ) &&
						0 === ( e & 2 ) &&
						2 !== ( a.flags & 2097155 )
					)
						throw new FS.h( 2 );
					if ( 1 === ( a.flags & 2097155 ) ) throw new FS.h( 2 );
					if ( ! a.o.ia ) throw new FS.h( 43 );
					if ( ! b ) throw new FS.h( 28 );
					return a.o.ia( a, b, c, d, e );
				},
				ka( a, b, c, d, e ) {
					return a.o.ka ? a.o.ka( a, b, c, d, e ) : 0;
				},
				Ha( a, b, c ) {
					if ( ! a.o.Ha ) throw new FS.h( 59 );
					return a.o.Ha( a, b, c );
				},
				readFile( a, b = {} ) {
					b.flags = b.flags || 0;
					b.encoding = b.encoding || 'binary';
					if ( 'utf8' !== b.encoding && 'binary' !== b.encoding )
						throw Error(
							`Invalid encoding type "${ b.encoding }"`
						);
					var c = FS.open( a, b.flags );
					a = FS.stat( a ).size;
					var d = new Uint8Array( a );
					FS.read( c, d, 0, a, 0 );
					'utf8' === b.encoding && ( d = nf( d ) );
					FS.close( c );
					return d;
				},
				writeFile( a, b, c = {} ) {
					c.flags = c.flags || 577;
					a = FS.open( a, c.flags, c.mode );
					'string' == typeof b && ( b = new Uint8Array( dg( b ) ) );
					if ( ArrayBuffer.isView( b ) )
						FS.write( a, b, 0, b.byteLength, void 0, c.Bc );
					else throw Error( 'Unsupported data type' );
					FS.close( a );
				},
				cwd: () => FS.Ta,
				chdir( a ) {
					a = FS.lookupPath( a, { follow: ! 0 } );
					if ( null === a.node ) throw new FS.h( 44 );
					if ( ! FS.isDir( a.node.mode ) ) throw new FS.h( 54 );
					var b = qg( a.node, 'x' );
					if ( b ) throw new FS.h( b );
					FS.Ta = a.path;
				},
				init( a, b, c ) {
					FS.Ga = ! 0;
					a ??= m.stdin;
					b ??= m.stdout;
					c ??= m.stderr;
					a
						? FS.createDevice( '/dev', 'stdin', a )
						: FS.symlink( '/dev/tty', '/dev/stdin' );
					b
						? FS.createDevice( '/dev', 'stdout', null, b )
						: FS.symlink( '/dev/tty', '/dev/stdout' );
					c
						? FS.createDevice( '/dev', 'stderr', null, c )
						: FS.symlink( '/dev/tty1', '/dev/stderr' );
					FS.open( '/dev/stdin', 0 );
					FS.open( '/dev/stdout', 1 );
					FS.open( '/dev/stderr', 1 );
				},
				Ec( a, b ) {
					a = FS.analyzePath( a, b );
					return a.Ya ? a.object : null;
				},
				analyzePath( a, b ) {
					try {
						var c = FS.lookupPath( a, { follow: ! b } );
						a = c.path;
					} catch ( e ) {}
					var d = {
						ma: ! 1,
						Ya: ! 1,
						error: 0,
						name: null,
						path: null,
						object: null,
						Xb: ! 1,
						$b: null,
						Zb: null,
					};
					try {
						( c = FS.lookupPath( a, { parent: ! 0 } ) ),
							( d.Xb = ! 0 ),
							( d.$b = c.path ),
							( d.Zb = c.node ),
							( d.name = Tf( a ) ),
							( c = FS.lookupPath( a, { follow: ! b } ) ),
							( d.Ya = ! 0 ),
							( d.path = c.path ),
							( d.object = c.node ),
							( d.name = c.node.name ),
							( d.ma = '/' === c.path );
					} catch ( e ) {
						d.error = e.A;
					}
					return d;
				},
				createPath( a, b ) {
					a = 'string' == typeof a ? a : FS.getPath( a );
					for ( b = b.split( '/' ).reverse(); b.length;  ) {
						var c = b.pop();
						if ( c ) {
							var d = Rf( a + '/' + c );
							try {
								FS.mkdir( d );
							} catch ( e ) {
								if ( 20 != e.A ) throw e;
							}
							a = d;
						}
					}
					return d;
				},
				createDataFile( a, b, c, d, e, f ) {
					var g = b;
					a &&
						( ( a = 'string' == typeof a ? a : FS.getPath( a ) ),
						( g = b ? Rf( a + '/' + b ) : a ) );
					a = pg( d, e );
					g = FS.create( g, a );
					if ( c ) {
						if ( 'string' == typeof c ) {
							b = Array( c.length );
							d = 0;
							for ( e = c.length; d < e; ++d )
								b[ d ] = c.charCodeAt( d );
							c = b;
						}
						FS.chmod( g, a | 146 );
						b = FS.open( g, 577 );
						FS.write( b, c, 0, c.length, 0, f );
						FS.close( b );
						FS.chmod( g, a );
					}
				},
				createDevice( a, b, c, d ) {
					a = Uf( 'string' == typeof a ? a : FS.getPath( a ), b );
					b = pg( !! c, !! d );
					var e;
					( e = FS.createDevice ).Ja ?? ( e.Ja = 64 );
					e = FS.makedev( FS.createDevice.Ja++, 0 );
					FS.registerDevice( e, {
						open( f ) {
							f.seekable = ! 1;
						},
						close() {
							d?.buffer?.length && d( 10 );
						},
						read( f, g, h, k ) {
							for ( var l = 0, p = 0; p < k; p++ ) {
								try {
									var n = c();
								} catch ( q ) {
									throw new FS.h( 29 );
								}
								if ( void 0 === n && 0 === l )
									throw new FS.h( 6 );
								if ( null === n || void 0 === n ) break;
								l++;
								g[ h + p ] = n;
							}
							l && ( f.node.Z = Date.now() );
							return l;
						},
						write( f, g, h, k ) {
							for ( var l = 0; l < k; l++ )
								try {
									d( g[ h + l ] );
								} catch ( p ) {
									throw new FS.h( 29 );
								}
							k && ( f.node.N = f.node.M = Date.now() );
							return l;
						},
					} );
					return FS.mkdev( a, b, e );
				},
				createLazyFile( a, b, c, d, e ) {
					function f( n, q, r, u, x ) {
						n = n.node.u;
						if ( x >= n.length ) return 0;
						u = Math.min( n.length - x, u );
						if ( n.slice )
							for ( var B = 0; B < u; B++ )
								q[ r + B ] = n[ x + B ];
						else
							for ( B = 0; B < u; B++ )
								q[ r + B ] = n.get( x + B );
						return u;
					}
					class g {
						Fa = ! 1;
						O = [];
						la = void 0;
						eb = 0;
						cb = 0;
						get( n ) {
							if ( ! ( n > this.length - 1 || 0 > n ) ) {
								var q = n % this.kb;
								return this.la( ( n / this.kb ) | 0 )[ q ];
							}
						}
						oc( n ) {
							this.la = n;
						}
						gb() {
							var n = new XMLHttpRequest();
							n.open( 'HEAD', c, ! 1 );
							n.send( null );
							if (
								! (
									( 200 <= n.status && 300 > n.status ) ||
									304 === n.status
								)
							)
								throw Error(
									"Couldn't load " +
										c +
										'. Status: ' +
										n.status
								);
							var q = Number(
									n.getResponseHeader( 'Content-length' )
								),
								r,
								u =
									( r =
										n.getResponseHeader(
											'Accept-Ranges'
										) ) && 'bytes' === r;
							n =
								( r =
									n.getResponseHeader(
										'Content-Encoding'
									) ) && 'gzip' === r;
							var x = 1048576;
							u || ( x = q );
							var B = this;
							B.oc( ( L ) => {
								var M = L * x,
									H = ( L + 1 ) * x - 1;
								H = Math.min( H, q - 1 );
								if ( 'undefined' == typeof B.O[ L ] ) {
									var ja = B.O;
									if ( M > H )
										throw Error(
											'invalid range (' +
												M +
												', ' +
												H +
												') or no bytes requested!'
										);
									if ( H > q - 1 )
										throw Error(
											'only ' +
												q +
												' bytes available! programmer error!'
										);
									var N = new XMLHttpRequest();
									N.open( 'GET', c, ! 1 );
									q !== x &&
										N.setRequestHeader(
											'Range',
											'bytes=' + M + '-' + H
										);
									N.responseType = 'arraybuffer';
									N.overrideMimeType &&
										N.overrideMimeType(
											'text/plain; charset=x-user-defined'
										);
									N.send( null );
									if (
										! (
											( 200 <= N.status &&
												300 > N.status ) ||
											304 === N.status
										)
									)
										throw Error(
											"Couldn't load " +
												c +
												'. Status: ' +
												N.status
										);
									M =
										void 0 !== N.response
											? new Uint8Array( N.response || [] )
											: dg( N.responseText || '' );
									ja[ L ] = M;
								}
								if ( 'undefined' == typeof B.O[ L ] )
									throw Error( 'doXHR failed!' );
								return B.O[ L ];
							} );
							if ( n || ! q )
								( x = q = 1 ),
									( x = q = this.la( 0 ).length ),
									na(
										'LazyFiles on gzip forces download of the whole file when length is accessed'
									);
							this.eb = q;
							this.cb = x;
							this.Fa = ! 0;
						}
						get length() {
							this.Fa || this.gb();
							return this.eb;
						}
						get kb() {
							this.Fa || this.gb();
							return this.cb;
						}
					}
					if ( 'undefined' != typeof XMLHttpRequest ) {
						if ( ! ba )
							throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
						var h = new g();
						var k = void 0;
					} else ( k = c ), ( h = void 0 );
					var l = Eg( a, b, d, e );
					h ? ( l.u = h ) : k && ( ( l.u = null ), ( l.url = k ) );
					Object.defineProperties( l, {
						D: {
							get: function () {
								return this.u.length;
							},
						},
					} );
					var p = {};
					Object.keys( l.o ).forEach( ( n ) => {
						var q = l.o[ n ];
						p[ n ] = ( ...r ) => {
							Fg( l );
							return q( ...r );
						};
					} );
					p.read = ( n, q, r, u, x ) => {
						Fg( l );
						return f( n, q, r, u, x );
					};
					p.ia = ( n, q, r ) => {
						Fg( l );
						var u = kg( q );
						if ( ! u ) throw new FS.h( 48 );
						f( n, y, u, q, r );
						return { s: u, ca: ! 0 };
					};
					l.o = p;
					return l;
				},
			},
			Hg = ( a, b ) => {
				if ( Qa ) {
					if ( '/' === a.charAt( 0 ) )
						try {
							return FS.lookupPath( a ), a;
						} catch ( d ) {
							return;
						}
					var c = ( b?.ac || [] ).map( ( d ) => {
						var e = b?.Yb;
						return d.startsWith( '$ORIGIN' )
							? d.replace( '$ORIGIN', Sf( e ) )
							: d;
					} );
					return Vf( () => {
						var d = Se( 512 ),
							e = Yf( c.join( ':' ) ),
							f = Yf( a );
						return ( d = Gg( d, e, f, 512 ) ) ? R( d ) : void 0;
					} );
				}
			};
		function Lf( a, b = { global: ! 0, oa: ! 0 }, c, d ) {
			function e() {
				var k = za[ a ];
				if ( k ) return b.H ? Promise.resolve( k ) : k;
				if ( d ) {
					k = E[ ( d + 28 ) >> 2 ];
					var l = E[ ( d + 32 ) >> 2 ];
					if ( k && l )
						return (
							( k = y.slice( k, k + l ) ),
							b.H ? Promise.resolve( k ) : k
						);
				}
				if ( ( k = Hg( a, b.fc ) ) )
					return (
						( k = FS.readFile( k, { encoding: 'binary' } ) ),
						b.H ? Promise.resolve( k ) : k
					);
				k = ka( a );
				if ( b.H ) return Pf( k );
				if ( ! ma )
					throw Error(
						`${ k }: file not found, and synchronous loading of external files is not available`
					);
				return ma( k );
			}
			function f() {
				var k = bf[ a ];
				return k
					? b.H
						? Promise.resolve( k )
						: k
					: b.H
					? e().then( ( l ) => Mf( l, b, a, c, d ) )
					: Mf( e(), b, a, c, d );
			}
			function g( k ) {
				h.global ? Of( k ) : c && Object.assign( c, k );
				h.exports = k;
			}
			var h = rf[ a ];
			if ( h )
				return (
					b.global
						? h.global || ( ( h.global = ! 0 ), Of( h.exports ) )
						: c && Object.assign( c, h.exports ),
					b.oa && Infinity !== h.Aa && ( h.Aa = Infinity ),
					h.Aa++,
					d && ( sf[ d ] = h ),
					b.H ? Promise.resolve( ! 0 ) : ! 0
				);
			h = tf( a, d, 'loading' );
			h.Aa = b.oa ? Infinity : 1;
			h.global = b.global;
			if ( b.H )
				return f().then( ( k ) => {
					g( k );
					return ! 0;
				} );
			g( f() );
			return ! 0;
		}
		var Jf = () => {
				var a, b;
				for ( [ a, b ] of Object.entries( hf ) )
					if ( 0 == b.value ) {
						var c = Hf( a ).Pa;
						if ( c || b.required )
							if ( 'function' == typeof c )
								b.value = Bf( c, c.g );
							else if ( 'number' == typeof c ) b.value = c;
							else
								throw Error(
									`bad export type for '${ a }': ${ typeof c }`
								);
					}
			},
			Ig = () => {
				oa.length
					? ( Za( 'loadDylibs' ),
					  oa
							.reduce(
								( a, b ) =>
									a.then( () =>
										Lf( b, {
											H: ! 0,
											global: ! 0,
											oa: ! 0,
											sb: ! 0,
										} )
									),
								Promise.resolve()
							)
							.then( () => {
								Jf();
								$a( 'loadDylibs' );
							} ) )
					: Jf();
			},
			Ue = ! 1,
			Kf = ( a, b, c ) => {
				function d() {
					var e = a();
					if ( e ) {
						var f = {};
						c.mb.forEach( ( g ) => ( f[ g ] = b[ g ] ) );
						Cf( f, e, ! 0 );
					}
				}
				Ne.push( d );
				Qa && d();
			},
			gb = ( a, b, c, d ) =>
				ab(
					`Assertion failed: ${ R( a ) }, at: ` +
						[
							b ? R( b ) : 'unknown filename',
							c,
							d ? R( d ) : 'unknown function',
						]
				);
		gb.g = 'vppip';
		var hb = ( a, b ) => P( a )( b );
		hb.g = 'vpi';
		var Jg = [],
			Kg = 0,
			ib = ( a ) => {
				var b = new Lg( a );
				0 == y[ b.s + 12 ] && ( ( y[ b.s + 12 ] = 1 ), Kg-- );
				y[ b.s + 13 ] = 0;
				Jg.push( b );
				Mg( a );
				return Ng( a );
			};
		ib.g = 'pp';
		var Og = 0,
			jb = () => {
				Q( 0, 0 );
				var a = Jg.pop();
				Pg( a.va );
				Og = 0;
			};
		jb.g = 'v';
		class Lg {
			constructor( a ) {
				this.va = a;
				this.s = a - 24;
			}
			init( a, b ) {
				E[ ( this.s + 16 ) >> 2 ] = 0;
				E[ ( this.s + 4 ) >> 2 ] = a;
				E[ ( this.s + 8 ) >> 2 ] = b;
			}
		}
		var Gf = ( a ) => {
				var b = Og?.va;
				if ( ! b ) return Qg( 0 ), 0;
				var c = new Lg( b );
				E[ ( c.s + 16 ) >> 2 ] = b;
				var d = E[ ( c.s + 4 ) >> 2 ];
				if ( ! d ) return Qg( 0 ), b;
				for ( var e of a ) {
					if ( 0 === e || e === d ) break;
					if ( Rg( e, d, c.s + 16 ) ) return Qg( e ), b;
				}
				Qg( d );
				return b;
			},
			kb = () => Gf( [] );
		kb.g = 'p';
		var lb = ( a ) => Gf( [ a ] );
		lb.g = 'pp';
		var mb = () => {
			var a = Jg.pop();
			a || ab( 'no exception to throw' );
			var b = a.va;
			0 == y[ a.s + 13 ] &&
				( Jg.push( a ),
				( y[ a.s + 13 ] = 1 ),
				( y[ a.s + 12 ] = 0 ),
				Kg++ );
			Og = new ua( b );
			throw Og;
		};
		mb.g = 'v';
		var nb = ( a, b, c ) => {
			new Lg( a ).init( b, c );
			Og = new ua( a );
			Kg++;
			throw Og;
		};
		nb.g = 'vppp';
		var ob = () => Kg;
		ob.g = 'i';
		function rb( ...a ) {
			return G.__lsan_ignore_object( ...a );
		}
		rb.G = ! 0;
		var sb = new WebAssembly.Global( { value: 'i32', mutable: ! 1 }, 1024 );
		function Sg( a, b, c, d ) {
			return t ? O( 2, 1, a, b, c, d ) : tb( a, b, c, d );
		}
		var tb = ( a, b, c, d ) => {
			if ( 'undefined' == typeof SharedArrayBuffer ) return 6;
			var e = [];
			if ( t && 0 === e.length ) return Sg( a, b, c, d );
			a = { mc: c, X: a, Da: d, nb: e };
			return t
				? ( ( a.U = 'spawnThread' ), postMessage( a, e ), 0 )
				: Me( a );
		};
		tb.g = 'ipppp';
		var ub = ( a ) => {
			Og ||= new ua( a );
			throw Og;
		};
		ub.g = 'vp';
		var vb = 3676496,
			wb = 3414352,
			xb = new WebAssembly.Global(
				{ value: 'i32', mutable: ! 0 },
				3676496
			),
			Tg = 5;
		function Ug( a, b, c ) {
			if ( '/' === b.charAt( 0 ) ) return b;
			a = -100 === a ? FS.cwd() : T( a ).path;
			if ( 0 == b.length ) {
				if ( ! c ) throw new FS.h( 44 );
				return a;
			}
			return a + '/' + b;
		}
		function Vg( a, b ) {
			D[ a >> 2 ] = b.xb;
			D[ ( a + 4 ) >> 2 ] = b.mode;
			E[ ( a + 8 ) >> 2 ] = b.Ub;
			D[ ( a + 12 ) >> 2 ] = b.uid;
			D[ ( a + 16 ) >> 2 ] = b.Ib;
			D[ ( a + 20 ) >> 2 ] = b.qa;
			F[ ( a + 24 ) >> 3 ] = BigInt( b.size );
			D[ ( a + 32 ) >> 2 ] = 4096;
			D[ ( a + 36 ) >> 2 ] = b.Ra;
			var c = b.Z.getTime(),
				d = b.N.getTime(),
				e = b.M.getTime();
			F[ ( a + 40 ) >> 3 ] = BigInt( Math.floor( c / 1e3 ) );
			E[ ( a + 48 ) >> 2 ] = ( c % 1e3 ) * 1e6;
			F[ ( a + 56 ) >> 3 ] = BigInt( Math.floor( d / 1e3 ) );
			E[ ( a + 64 ) >> 2 ] = ( d % 1e3 ) * 1e6;
			F[ ( a + 72 ) >> 3 ] = BigInt( Math.floor( e / 1e3 ) );
			E[ ( a + 80 ) >> 2 ] = ( e % 1e3 ) * 1e6;
			F[ ( a + 88 ) >> 3 ] = BigInt( b.Mb );
			return 0;
		}
		var Wg = void 0;
		function yb( a ) {
			if ( t ) return O( 3, 1, a );
			try {
				var b = T( a );
				return yg( b ).$;
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return -c.A;
			}
		}
		yb.g = 'ii';
		function zb( a, b, c, d ) {
			if ( t ) return O( 4, 1, a, b, c, d );
			try {
				b = R( b );
				b = Ug( a, b );
				if ( c & -8 ) return -28;
				var e = FS.lookupPath( b, { follow: ! 0 } ).node;
				if ( ! e ) return -44;
				a = '';
				c & 4 && ( a += 'r' );
				c & 2 && ( a += 'w' );
				c & 1 && ( a += 'x' );
				return a && qg( e, a ) ? -2 : 0;
			} catch ( f ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== f.name )
					throw f;
				return -f.A;
			}
		}
		zb.g = 'iipii';
		var Xg = () => {
			var a = D[ +Wg >> 2 ];
			Wg += 4;
			return a;
		};
		function Ab( a, b, c ) {
			if ( t ) return O( 5, 1, a, b, c );
			Wg = c;
			try {
				var d = T( a );
				switch ( b ) {
					case 0:
						var e = Xg();
						if ( 0 > e ) break;
						for ( ; FS.streams[ e ];  ) e++;
						return yg( d, e ).$;
					case 1:
					case 2:
						return 0;
					case 3:
						return d.flags;
					case 4:
						return ( e = Xg() ), ( d.flags |= e ), 0;
					case 12:
						return ( e = Xg() ), ( A[ ( e + 0 ) >> 1 ] = 2 ), 0;
					case 13:
					case 14:
						return 0;
				}
				return -28;
			} catch ( f ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== f.name )
					throw f;
				return -f.A;
			}
		}
		Ab.g = 'iiip';
		function Bb( a, b ) {
			if ( t ) return O( 6, 1, a, b );
			try {
				var c = T( a ),
					d = c.node,
					e = c.o.R;
				a = e ? c : d;
				e ??= d.m.R;
				wg( e, 63 );
				var f = e( a );
				return Vg( b, f );
			} catch ( g ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== g.name )
					throw g;
				return -g.A;
			}
		}
		Bb.g = 'iip';
		function Cb( a, b ) {
			if ( t ) return O( 7, 1, a, b );
			b =
				-9007199254740992 > b || 9007199254740992 < b
					? NaN
					: Number( b );
			try {
				if ( isNaN( b ) ) return -61;
				FS.ftruncate( a, b );
				return 0;
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return -c.A;
			}
		}
		Cb.g = 'iij';
		function Db( a, b ) {
			if ( t ) return O( 8, 1, a, b );
			try {
				if ( 0 === b ) return -28;
				var c = FS.cwd(),
					d = Wf( c ) + 1;
				if ( b < d ) return -68;
				Xf( c, z, a, b );
				return d;
			} catch ( e ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== e.name )
					throw e;
				return -e.A;
			}
		}
		Db.g = 'ipp';
		function Eb( a, b, c ) {
			if ( t ) return O( 9, 1, a, b, c );
			Wg = c;
			try {
				var d = T( a );
				switch ( b ) {
					case 21509:
						return d.B ? 0 : -59;
					case 21505:
						if ( ! d.B ) return -59;
						if ( d.B.ba.Nb ) {
							a = [
								3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18,
								15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
								0, 0, 0, 0,
							];
							var e = Xg();
							D[ e >> 2 ] = 25856;
							D[ ( e + 4 ) >> 2 ] = 5;
							D[ ( e + 8 ) >> 2 ] = 191;
							D[ ( e + 12 ) >> 2 ] = 35387;
							for ( var f = 0; 32 > f; f++ )
								y[ e + f + 17 ] = a[ f ] || 0;
						}
						return 0;
					case 21510:
					case 21511:
					case 21512:
						return d.B ? 0 : -59;
					case 21506:
					case 21507:
					case 21508:
						if ( ! d.B ) return -59;
						if ( d.B.ba.Ob )
							for ( e = Xg(), a = [], f = 0; 32 > f; f++ )
								a.push( y[ e + f + 17 ] );
						return 0;
					case 21519:
						if ( ! d.B ) return -59;
						e = Xg();
						return ( D[ e >> 2 ] = 0 );
					case 21520:
						return d.B ? -28 : -59;
					case 21531:
						return ( e = Xg() ), FS.Ha( d, b, e );
					case 21523:
						if ( ! d.B ) return -59;
						d.B.ba.Pb &&
							( ( f = [ 24, 80 ] ),
							( e = Xg() ),
							( A[ e >> 1 ] = f[ 0 ] ),
							( A[ ( e + 2 ) >> 1 ] = f[ 1 ] ) );
						return 0;
					case 21524:
						return d.B ? 0 : -59;
					case 21515:
						return d.B ? 0 : -59;
					default:
						return -28;
				}
			} catch ( g ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== g.name )
					throw g;
				return -g.A;
			}
		}
		Eb.g = 'iiip';
		function Fb( a, b ) {
			if ( t ) return O( 10, 1, a, b );
			try {
				return ( a = R( a ) ), Vg( b, FS.lstat( a ) );
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return -c.A;
			}
		}
		Fb.g = 'ipp';
		function Gb( a, b, c, d ) {
			if ( t ) return O( 11, 1, a, b, c, d );
			try {
				b = R( b );
				var e = d & 256;
				b = Ug( a, b, d & 4096 );
				return Vg( c, e ? FS.lstat( b ) : FS.stat( b ) );
			} catch ( f ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== f.name )
					throw f;
				return -f.A;
			}
		}
		Gb.g = 'iippi';
		function Hb( a, b, c, d ) {
			if ( t ) return O( 12, 1, a, b, c, d );
			Wg = d;
			try {
				b = R( b );
				b = Ug( a, b );
				var e = d ? Xg() : 0;
				return FS.open( b, c, e ).$;
			} catch ( f ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== f.name )
					throw f;
				return -f.A;
			}
		}
		Hb.g = 'iipip';
		function Ib( a, b, c ) {
			if ( t ) return O( 13, 1, a, b, c );
			try {
				for ( var d = ( c = 0 ); d < b; d++ ) {
					var e = a + 8 * d,
						f = A[ ( e + 4 ) >> 1 ],
						g = 32,
						h = FS.$a( D[ e >> 2 ] );
					h && ( ( g = Tg ), h.o.cc && ( g = h.o.cc( h, -1 ) ) );
					( g &= f | 24 ) && c++;
					A[ ( e + 6 ) >> 1 ] = g;
				}
				return c;
			} catch ( k ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== k.name )
					throw k;
				return -k.A;
			}
		}
		Ib.g = 'ipii';
		function Jb( a ) {
			if ( t ) return O( 14, 1, a );
			try {
				return ( a = R( a ) ), FS.rmdir( a ), 0;
			} catch ( b ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== b.name )
					throw b;
				return -b.A;
			}
		}
		Jb.g = 'ip';
		function Kb( a, b ) {
			if ( t ) return O( 15, 1, a, b );
			try {
				return ( a = R( a ) ), Vg( b, FS.stat( a ) );
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return -c.A;
			}
		}
		Kb.g = 'ipp';
		function Lb( a, b, c ) {
			if ( t ) return O( 16, 1, a, b, c );
			try {
				b = R( b );
				b = Ug( a, b );
				if ( c )
					if ( 512 === c ) FS.rmdir( b );
					else return -28;
				else FS.unlink( b );
				return 0;
			} catch ( d ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== d.name )
					throw d;
				return -d.A;
			}
		}
		Lb.g = 'iipi';
		var Mb = new WebAssembly.Global( { value: 'i32', mutable: ! 1 }, 1 ),
			Nb = () => ab( '' );
		Nb.g = 'v';
		var Zg = ( a ) => {
				var b = J();
				a = Yf( a );
				Yg( a, 0 );
				K( b );
			},
			$g = ( a, b ) => {
				var c = R( a + 36 ),
					d = D[ ( a + 4 ) >> 2 ];
				c = Rf( c );
				var e = !! ( d & 256 ),
					f = e ? null : {};
				d = { global: e, oa: !! ( d & 4096 ), H: b.H };
				if ( b.H ) return Lf( c, d, f, a );
				try {
					return Lf( c, d, f, a );
				} catch ( g ) {
					return (
						Zg( `Could not load dynamic lib: ${ c }\n${ g }` ), 0
					);
				}
			},
			Ob = ( a ) => $g( a, { H: ! 1 } );
		Ob.g = 'pp';
		var Pb = ( a, b ) => {
			a = sf[ a ].exports;
			b = Object.keys( a )[ b ];
			b = a[ b ];
			return Bf( b, b.g );
		};
		Pb.g = 'ppi';
		var Qb = ( a, b, c ) => {
			b = R( b );
			var d = sf[ a ];
			if ( ! d.exports.hasOwnProperty( b ) || d.exports[ b ].G )
				return (
					Zg(
						`Tried to lookup unknown symbol "${ b }" in dynamic lib: ${ d.name }`
					),
					0
				);
			a = Object.keys( d.exports ).indexOf( b );
			b = d.exports[ b ];
			'function' == typeof b &&
				( ( d = zf( b ) )
					? ( b = d )
					: ( ( b = Bf( b, b.g ) ), ( E[ c >> 2 ] = a ) ) );
			return b;
		};
		Qb.g = 'pppp';
		var ah = {},
			bh = ( a ) => {
				for ( ; a.length;  ) {
					var b = a.pop();
					a.pop()( b );
				}
			};
		function ch( a ) {
			return this.fromWireType( E[ a >> 2 ] );
		}
		var dh = {},
			eh = {},
			fh = {},
			gh = class extends Error {
				constructor( a ) {
					super( a );
					this.name = 'InternalError';
				}
			},
			hh = ( a, b, c ) => {
				function d( h ) {
					h = c( h );
					if ( h.length !== a.length )
						throw new gh( 'Mismatched type converter count' );
					for ( var k = 0; k < a.length; ++k ) U( a[ k ], h[ k ] );
				}
				a.forEach( ( h ) => ( fh[ h ] = b ) );
				var e = Array( b.length ),
					f = [],
					g = 0;
				b.forEach( ( h, k ) => {
					eh.hasOwnProperty( h )
						? ( e[ k ] = eh[ h ] )
						: ( f.push( h ),
						  dh.hasOwnProperty( h ) || ( dh[ h ] = [] ),
						  dh[ h ].push( () => {
								e[ k ] = eh[ h ];
								++g;
								g === f.length && d( e );
						  } ) );
				} );
				0 === f.length && d( e );
			},
			Rb = ( a ) => {
				var b = ah[ a ];
				delete ah[ a ];
				var c = b.Oa,
					d = b.Y,
					e = b.Za,
					f = e.map( ( g ) => g.Hb ).concat( e.map( ( g ) => g.ic ) );
				hh( [ a ], f, ( g ) => {
					var h = {};
					e.forEach( ( k, l ) => {
						var p = g[ l ],
							n = k.la,
							q = k.Gb,
							r = g[ l + e.length ],
							u = k.hc,
							x = k.jc;
						h[ k.Bb ] = {
							read: ( B ) => p.fromWireType( n( q, B ) ),
							write: ( B, L ) => {
								var M = [];
								u( x, B, r.toWireType( M, L ) );
								bh( M );
							},
							optional: g[ l ].optional,
						};
					} );
					return [
						{
							name: b.name,
							fromWireType: ( k ) => {
								var l = {},
									p;
								for ( p in h ) l[ p ] = h[ p ].read( k );
								d( k );
								return l;
							},
							toWireType: ( k, l ) => {
								for ( var p in h )
									if ( ! ( p in l || h[ p ].optional ) )
										throw new TypeError(
											`Missing field: "${ p }"`
										);
								var n = c();
								for ( p in h ) h[ p ].write( n, l[ p ] );
								null !== k && k.push( d, n );
								return n;
							},
							K: ih,
							readValueFromPointer: ch,
							J: d,
						},
					];
				} );
			};
		Rb.g = 'vp';
		var V = ( a ) => {
				for ( var b = ''; ;  ) {
					var c = z[ a++ ];
					if ( ! c ) return b;
					b += String.fromCharCode( c );
				}
			},
			W = class extends Error {
				constructor( a ) {
					super( a );
					this.name = 'BindingError';
				}
			},
			jh = ( a ) => {
				throw new W( a );
			};
		function kh( a, b, c = {} ) {
			var d = b.name;
			if ( ! a )
				throw new W(
					`type "${ d }" must have a positive integer typeid pointer`
				);
			if ( eh.hasOwnProperty( a ) ) {
				if ( c.Lb ) return;
				throw new W( `Cannot register type '${ d }' twice` );
			}
			eh[ a ] = b;
			delete fh[ a ];
			dh.hasOwnProperty( a ) &&
				( ( b = dh[ a ] ), delete dh[ a ], b.forEach( ( e ) => e() ) );
		}
		function U( a, b, c = {} ) {
			return kh( a, b, c );
		}
		var Sb = ( a, b, c, d, e ) => {
			b = V( b );
			if ( d )
				a: switch ( c ) {
					case 4:
						d = Na;
						break a;
					case 8:
						d = Oa;
						break a;
					default:
						throw new TypeError(
							`invalid float width (${ c }): ${ b }`
						);
				}
			else
				a: switch ( c ) {
					case 1:
						d = e ? y : z;
						break a;
					case 2:
						d = e ? A : C;
						break a;
					case 4:
						d = e ? D : E;
						break a;
					case 8:
						d = e ? F : Pa;
						break a;
					default:
						throw new TypeError(
							`invalid integer width (${ c }): ${ b }`
						);
				}
			var f = d,
				g = Math.log2( c );
			U( a, {
				name: b,
				fromWireType: ( h ) => {
					var k = ( h + Math.max( 4, c ) ) >> g;
					k = Array.from( f.subarray( k, k + E[ h >> 2 ] ) );
					X( h );
					return k;
				},
				toWireType: ( h, k ) => {
					'number' == typeof k && ( k = [ k ] );
					if ( ! Array.isArray( k ) )
						throw new W(
							`Cannot pass non-array to C++ vector type ${ b }`
						);
					k = Array.prototype.concat.apply( [], k );
					var l = k.length,
						p = Math.max( 4, c ),
						n = lh( p + l * c );
					p = ( n + p ) >> g;
					E[ n >> 2 ] = l;
					f.set( k, p );
					null !== h && h.push( X, n );
					return n;
				},
				K: ih,
				readValueFromPointer: ch,
				J( h ) {
					X( h );
				},
			} );
		};
		Sb.g = 'vpppii';
		var mh = ( a, b, c ) => {
				switch ( b ) {
					case 1:
						return c ? ( d ) => y[ d ] : ( d ) => z[ d ];
					case 2:
						return c ? ( d ) => A[ d >> 1 ] : ( d ) => C[ d >> 1 ];
					case 4:
						return c ? ( d ) => D[ d >> 2 ] : ( d ) => E[ d >> 2 ];
					case 8:
						return c ? ( d ) => F[ d >> 3 ] : ( d ) => Pa[ d >> 3 ];
					default:
						throw new TypeError(
							`invalid integer width (${ b }): ${ a }`
						);
				}
			},
			Tb = ( a, b, c, d, e ) => {
				b = V( b );
				d = 0n === d;
				let f = ( g ) => g;
				if ( d ) {
					const g = 8 * c;
					f = ( h ) => BigInt.asUintN( g, h );
					e = f( e );
				}
				U( a, {
					name: b,
					fromWireType: f,
					toWireType: ( g, h ) => {
						'number' == typeof h && ( h = BigInt( h ) );
						return h;
					},
					K: ih,
					readValueFromPointer: mh( b, c, ! d ),
					J: null,
				} );
			};
		Tb.g = 'vpppjj';
		var ih = 8,
			Ub = ( a, b, c, d ) => {
				b = V( b );
				U( a, {
					name: b,
					fromWireType: function ( e ) {
						return !! e;
					},
					toWireType: function ( e, f ) {
						return f ? c : d;
					},
					K: ih,
					readValueFromPointer: function ( e ) {
						return this.fromWireType( z[ e ] );
					},
					J: null,
				} );
			};
		Ub.g = 'vppii';
		var nh = ( a ) => {
				throw new W( a.l.C.v.name + ' instance already deleted' );
			},
			oh = ! 1,
			ph = ! 1,
			qh = () => {},
			rh = ( a ) => {
				if ( oh ) return ( rh = ( b ) => b.deleteLater() ), rh( a );
				if ( 'undefined' === typeof FinalizationRegistry )
					return ( rh = ( b ) => b ), a;
				ph = new FinalizationRegistry( ( b ) => {
					b = b.l;
					--b.count.value;
					0 === b.count.value &&
						( b.I ? b.P.Y( b.I ) : b.C.v.Y( b.s ) );
				} );
				rh = ( b ) => {
					var c = b.l;
					c.I && ph.register( b, { l: c }, b );
					return b;
				};
				qh = ( b ) => {
					ph.unregister( b );
				};
				return rh( a );
			},
			sh = [],
			th = () => {
				for ( ; sh.length;  ) {
					var a = sh.pop();
					a.l.ga = ! 1;
					a[ 'delete' ]();
				}
			},
			uh;
		function vh() {}
		var wh = ( a, b ) => Object.defineProperty( b, 'name', { value: a } ),
			xh = {},
			yh = ( a, b, c ) => {
				if ( void 0 === a[ b ].F ) {
					var d = a[ b ];
					a[ b ] = function ( ...e ) {
						if ( ! a[ b ].F.hasOwnProperty( e.length ) )
							throw new W(
								`Function '${ c }' called with an invalid number of arguments (${ e.length }) - expects one of (${ a[ b ].F })!`
							);
						return a[ b ].F[ e.length ].apply( this, e );
					};
					a[ b ].F = [];
					a[ b ].F[ d.ea ] = d;
				}
			},
			zh = ( a, b, c ) => {
				if ( m.hasOwnProperty( a ) ) {
					if (
						void 0 === c ||
						( void 0 !== m[ a ].F && void 0 !== m[ a ].F[ c ] )
					)
						throw new W(
							`Cannot register public name '${ a }' twice`
						);
					yh( m, a, a );
					if ( m[ a ].F.hasOwnProperty( c ) )
						throw new W(
							`Cannot register multiple overloads of a function with the same number of arguments (${ c })!`
						);
					m[ a ].F[ c ] = b;
				} else ( m[ a ] = b ), ( m[ a ].ea = c );
			},
			Ah = ( a ) => {
				a = a.replace( /[^a-zA-Z0-9_]/g, '$' );
				var b = a.charCodeAt( 0 );
				return 48 <= b && 57 >= b ? `_${ a }` : a;
			};
		function Bh( a, b, c, d, e, f, g, h ) {
			this.name = a;
			this.constructor = b;
			this.da = c;
			this.Y = d;
			this.L = e;
			this.Db = f;
			this.ta = g;
			this.yb = h;
			this.dc = [];
		}
		var Ch = ( a, b, c ) => {
				for ( ; b !== c;  ) {
					if ( ! b.ta )
						throw new W(
							`Expected null or instance of ${ c.name }, got an instance of ${ b.name }`
						);
					a = b.ta( a );
					b = b.L;
				}
				return a;
			},
			Dh = ( a ) => {
				if ( null === a ) return 'null';
				var b = typeof a;
				return 'object' === b || 'array' === b || 'function' === b
					? a.toString()
					: '' + a;
			};
		function Eh( a, b ) {
			if ( null === b ) {
				if ( this.Ia )
					throw new W( `null is not a valid ${ this.name }` );
				return 0;
			}
			if ( ! b.l )
				throw new W( `Cannot pass "${ Dh( b ) }" as a ${ this.name }` );
			if ( ! b.l.s )
				throw new W(
					`Cannot pass deleted object as a pointer of type ${ this.name }`
				);
			return Ch( b.l.s, b.l.C.v, this.v );
		}
		function Fh( a, b ) {
			if ( null === b ) {
				if ( this.Ia )
					throw new W( `null is not a valid ${ this.name }` );
				if ( this.za ) {
					var c = this.Oa();
					null !== a && a.push( this.Y, c );
					return c;
				}
				return 0;
			}
			if ( ! b || ! b.l )
				throw new W( `Cannot pass "${ Dh( b ) }" as a ${ this.name }` );
			if ( ! b.l.s )
				throw new W(
					`Cannot pass deleted object as a pointer of type ${ this.name }`
				);
			if ( ! this.ya && b.l.C.ya )
				throw new W(
					`Cannot convert argument of type ${
						b.l.P ? b.l.P.name : b.l.C.name
					} to parameter type ${ this.name }`
				);
			c = Ch( b.l.s, b.l.C.v, this.v );
			if ( this.za ) {
				if ( void 0 === b.l.I )
					throw new W(
						'Passing raw pointer to smart pointer is illegal'
					);
				switch ( this.lc ) {
					case 0:
						if ( b.l.P === this ) c = b.l.I;
						else
							throw new W(
								`Cannot convert argument of type ${
									b.l.P ? b.l.P.name : b.l.C.name
								} to parameter type ${ this.name }`
							);
						break;
					case 1:
						c = b.l.I;
						break;
					case 2:
						if ( b.l.P === this ) c = b.l.I;
						else {
							var d = b.clone();
							c = this.ec(
								c,
								Gh( () => d[ 'delete' ]() )
							);
							null !== a && a.push( this.Y, c );
						}
						break;
					default:
						throw new W( 'Unsupporting sharing policy' );
				}
			}
			return c;
		}
		function Hh( a, b ) {
			if ( null === b ) {
				if ( this.Ia )
					throw new W( `null is not a valid ${ this.name }` );
				return 0;
			}
			if ( ! b.l )
				throw new W( `Cannot pass "${ Dh( b ) }" as a ${ this.name }` );
			if ( ! b.l.s )
				throw new W(
					`Cannot pass deleted object as a pointer of type ${ this.name }`
				);
			if ( b.l.C.ya )
				throw new W(
					`Cannot convert argument of type ${ b.l.C.name } to parameter type ${ this.name }`
				);
			return Ch( b.l.s, b.l.C.v, this.v );
		}
		var Ih = ( a, b, c ) => {
				if ( b === c ) return a;
				if ( void 0 === c.L ) return null;
				a = Ih( a, b, c.L );
				return null === a ? null : c.yb( a );
			},
			Jh = {},
			Kh = ( a, b ) => {
				if ( void 0 === b )
					throw new W( 'ptr should not be undefined' );
				for ( ; a.L;  ) ( b = a.ta( b ) ), ( a = a.L );
				return Jh[ b ];
			},
			Lh = ( a, b ) => {
				if ( ! b.C || ! b.s )
					throw new gh( 'makeClassHandle requires ptr and ptrType' );
				if ( !! b.P !== !! b.I )
					throw new gh(
						'Both smartPtrType and smartPtr must be specified'
					);
				b.count = { value: 1 };
				return rh(
					Object.create( a, { l: { value: b, writable: ! 0 } } )
				);
			};
		function Mh( a, b, c, d, e, f, g, h, k, l, p ) {
			this.name = a;
			this.v = b;
			this.Ia = c;
			this.ya = d;
			this.za = e;
			this.bc = f;
			this.lc = g;
			this.hb = h;
			this.Oa = k;
			this.ec = l;
			this.Y = p;
			e || void 0 !== b.L
				? ( this.toWireType = Fh )
				: ( ( this.toWireType = d ? Eh : Hh ), ( this.J = null ) );
		}
		var Nh = ( a, b, c ) => {
				if ( ! m.hasOwnProperty( a ) )
					throw new gh( 'Replacing nonexistent public symbol' );
				void 0 !== m[ a ].F && void 0 !== c
					? ( m[ a ].F[ c ] = b )
					: ( ( m[ a ] = b ), ( m[ a ].ea = c ) );
			},
			Y = ( a, b ) => {
				a = V( a );
				var c = P( b );
				if ( 'function' != typeof c )
					throw new W(
						`unknown function pointer with signature ${ a }: ${ b }`
					);
				return c;
			};
		class Oh extends Error {}
		var Qh = ( a ) => {
				a = Ph( a );
				var b = V( a );
				X( a );
				return b;
			},
			Rh = ( a, b ) => {
				function c( f ) {
					e[ f ] ||
						eh[ f ] ||
						( fh[ f ]
							? fh[ f ].forEach( c )
							: ( d.push( f ), ( e[ f ] = ! 0 ) ) );
				}
				var d = [],
					e = {};
				b.forEach( c );
				throw new Oh( `${ a }: ` + d.map( Qh ).join( [ ', ' ] ) );
			},
			Vb = ( a, b, c, d, e, f, g, h, k, l, p, n, q ) => {
				p = V( p );
				f = Y( e, f );
				h &&= Y( g, h );
				l &&= Y( k, l );
				q = Y( n, q );
				var r = Ah( p );
				zh( r, function () {
					Rh( `Cannot construct ${ p } due to unbound types`, [ d ] );
				} );
				hh( [ a, b, c ], d ? [ d ] : [], ( u ) => {
					u = u[ 0 ];
					if ( d ) {
						var x = u.v;
						var B = x.da;
					} else B = vh.prototype;
					u = wh( p, function ( ...ja ) {
						if ( Object.getPrototypeOf( this ) !== L )
							throw new W( `Use 'new' to construct ${ p }` );
						if ( void 0 === M.fa )
							throw new W(
								`${ p } has no accessible constructor`
							);
						var N = M.fa[ ja.length ];
						if ( void 0 === N )
							throw new W(
								`Tried to invoke ctor of ${ p } with invalid number of parameters (${
									ja.length
								}) - expected (${ Object.keys(
									M.fa
								).toString() }) parameters instead!`
							);
						return N.apply( this, ja );
					} );
					var L = Object.create( B, { constructor: { value: u } } );
					u.prototype = L;
					var M = new Bh( p, u, L, q, x, f, h, l );
					if ( M.L ) {
						var H;
						( H = M.L ).ua ?? ( H.ua = [] );
						M.L.ua.push( M );
					}
					x = new Mh( p, M, ! 0, ! 1, ! 1 );
					H = new Mh( p + '*', M, ! 1, ! 1, ! 1 );
					B = new Mh( p + ' const*', M, ! 1, ! 0, ! 1 );
					xh[ a ] = { pointerType: H, wb: B };
					Nh( r, u );
					return [ x, H, B ];
				} );
			};
		Vb.g = 'vppppppppppppp';
		function Sh( a ) {
			for ( var b = 1; b < a.length; ++b )
				if ( null !== a[ b ] && void 0 === a[ b ].J ) return ! 0;
			return ! 1;
		}
		function Th( a, b, c, d, e, f ) {
			var g = b.length;
			if ( 2 > g )
				throw new W(
					"argTypes array size mismatch! Must at least get return value and 'this' types!"
				);
			var h = null !== b[ 1 ] && null !== c,
				k = Sh( b );
			c = 'void' !== b[ 0 ].name;
			d = [ a, jh, d, e, bh, b[ 0 ], b[ 1 ] ];
			for ( e = 0; e < g - 2; ++e ) d.push( b[ e + 2 ] );
			if ( ! k )
				for ( e = h ? 1 : 2; e < b.length; ++e )
					null !== b[ e ].J && d.push( b[ e ].J );
			k = Sh( b );
			e = b.length - 2;
			var l = [],
				p = [ 'fn' ];
			h && p.push( 'thisWired' );
			for ( g = 0; g < e; ++g )
				l.push( `arg${ g }` ), p.push( `arg${ g }Wired` );
			l = l.join( ',' );
			p = p.join( ',' );
			l = `return function (${ l }) {\n`;
			k && ( l += 'var destructors = [];\n' );
			var n = k ? 'destructors' : 'null',
				q =
					'humanName throwBindingError invoker fn runDestructors retType classParam'.split(
						' '
					);
			h &&
				( l += `var thisWired = classParam['toWireType'](${ n }, this);\n` );
			for ( g = 0; g < e; ++g )
				( l += `var arg${ g }Wired = argType${ g }['toWireType'](${ n }, arg${ g });\n` ),
					q.push( `argType${ g }` );
			l += ( c || f ? 'var rv = ' : '' ) + `invoker(${ p });\n`;
			if ( k ) l += 'runDestructors(destructors);\n';
			else
				for ( g = h ? 1 : 2; g < b.length; ++g )
					( f = 1 === g ? 'thisWired' : 'arg' + ( g - 2 ) + 'Wired' ),
						null !== b[ g ].J &&
							( ( l += `${ f }_dtor(${ f });\n` ),
							q.push( `${ f }_dtor` ) );
			c &&
				( l +=
					"var ret = retType['fromWireType'](rv);\nreturn ret;\n" );
			let [ r, u ] = [ q, l + '}\n' ];
			b = new Function( ...r, u )( ...d );
			return wh( a, b );
		}
		var Uh = ( a, b ) => {
				for ( var c = [], d = 0; d < a; d++ )
					c.push( E[ ( b + 4 * d ) >> 2 ] );
				return c;
			},
			Vh = ( a ) => {
				a = a.trim();
				const b = a.indexOf( '(' );
				return -1 === b ? a : a.slice( 0, b );
			},
			Wb = ( a, b, c, d, e, f, g, h ) => {
				var k = Uh( c, d );
				b = V( b );
				b = Vh( b );
				f = Y( e, f );
				hh( [], [ a ], ( l ) => {
					function p() {
						Rh( `Cannot call ${ n } due to unbound types`, k );
					}
					l = l[ 0 ];
					var n = `${ l.name }.${ b }`;
					b.startsWith( '@@' ) && ( b = Symbol[ b.substring( 2 ) ] );
					var q = l.v.constructor;
					void 0 === q[ b ]
						? ( ( p.ea = c - 1 ), ( q[ b ] = p ) )
						: ( yh( q, b, n ), ( q[ b ].F[ c - 1 ] = p ) );
					hh( [], k, ( r ) => {
						r = Th(
							n,
							[ r[ 0 ], null ].concat( r.slice( 1 ) ),
							null,
							f,
							g,
							h
						);
						void 0 === q[ b ].F
							? ( ( r.ea = c - 1 ), ( q[ b ] = r ) )
							: ( q[ b ].F[ c - 1 ] = r );
						if ( l.v.ua )
							for ( const u of l.v.ua )
								u.constructor.hasOwnProperty( b ) ||
									( u.constructor[ b ] = r );
						return [];
					} );
					return [];
				} );
			};
		Wb.g = 'vppippppii';
		var Xb = ( a, b, c, d, e, f ) => {
			var g = Uh( b, c );
			e = Y( d, e );
			hh( [], [ a ], ( h ) => {
				h = h[ 0 ];
				var k = `constructor ${ h.name }`;
				void 0 === h.v.fa && ( h.v.fa = [] );
				if ( void 0 !== h.v.fa[ b - 1 ] )
					throw new W(
						`Cannot register multiple constructors with identical number of parameters (${
							b - 1
						}) for class '${
							h.name
						}'! Overload resolution is currently only performed using the parameter count, not actual type info!`
					);
				h.v.fa[ b - 1 ] = () => {
					Rh(
						`Cannot construct ${ h.name } due to unbound types`,
						g
					);
				};
				hh( [], g, ( l ) => {
					l.splice( 1, 0, null );
					h.v.fa[ b - 1 ] = Th( k, l, null, e, f );
					return [];
				} );
				return [];
			} );
		};
		Xb.g = 'vpipppp';
		var Yb = ( a, b, c, d, e, f, g, h, k ) => {
			var l = Uh( c, d );
			b = V( b );
			b = Vh( b );
			f = Y( e, f );
			hh( [], [ a ], ( p ) => {
				function n() {
					Rh( `Cannot call ${ q } due to unbound types`, l );
				}
				p = p[ 0 ];
				var q = `${ p.name }.${ b }`;
				b.startsWith( '@@' ) && ( b = Symbol[ b.substring( 2 ) ] );
				h && p.v.dc.push( b );
				var r = p.v.da,
					u = r[ b ];
				void 0 === u ||
				( void 0 === u.F && u.className !== p.name && u.ea === c - 2 )
					? ( ( n.ea = c - 2 ),
					  ( n.className = p.name ),
					  ( r[ b ] = n ) )
					: ( yh( r, b, q ), ( r[ b ].F[ c - 2 ] = n ) );
				hh( [], l, ( x ) => {
					x = Th( q, x, p, f, g, k );
					void 0 === r[ b ].F
						? ( ( x.ea = c - 2 ), ( r[ b ] = x ) )
						: ( r[ b ].F[ c - 2 ] = x );
					return [];
				} );
				return [];
			} );
		};
		Yb.g = 'vppippppiii';
		var Wh = ( a, b, c ) => {
				if ( ! ( a instanceof Object ) )
					throw new W( `${ c } with invalid "this": ${ a }` );
				if ( ! ( a instanceof b.v.constructor ) )
					throw new W(
						`${ c } incompatible with "this" of type ${ a.constructor.name }`
					);
				if ( ! a.l.s )
					throw new W(
						`cannot call emscripten binding method ${ c } on deleted object`
					);
				return Ch( a.l.s, a.l.C.v, b.v );
			},
			Zb = ( a, b, c, d, e, f, g, h, k, l ) => {
				b = V( b );
				e = Y( d, e );
				hh( [], [ a ], ( p ) => {
					p = p[ 0 ];
					var n = `${ p.name }.${ b }`,
						q = {
							get() {
								Rh(
									`Cannot access ${ n } due to unbound types`,
									[ c, g ]
								);
							},
							enumerable: ! 0,
							configurable: ! 0,
						};
					q.set = k
						? () =>
								Rh(
									`Cannot access ${ n } due to unbound types`,
									[ c, g ]
								)
						: () => {
								throw new W( n + ' is a read-only property' );
						  };
					Object.defineProperty( p.v.da, b, q );
					hh( [], k ? [ c, g ] : [ c ], ( r ) => {
						var u = r[ 0 ],
							x = {
								get() {
									var L = Wh( this, p, n + ' getter' );
									return u.fromWireType( e( f, L ) );
								},
								enumerable: ! 0,
							};
						if ( k ) {
							k = Y( h, k );
							var B = r[ 1 ];
							x.set = function ( L ) {
								var M = Wh( this, p, n + ' setter' ),
									H = [];
								k( l, M, B.toWireType( H, L ) );
								bh( H );
							};
						}
						Object.defineProperty( p.v.da, b, x );
						return [];
					} );
					return [];
				} );
			};
		Zb.g = 'vpppppppppp';
		var Zh = [],
			$h = [ 0, 1, , 1, null, 1, ! 0, 1, ! 1, 1 ],
			zc = ( a ) => {
				9 < a &&
					0 === --$h[ a + 1 ] &&
					( ( $h[ a ] = void 0 ), Zh.push( a ) );
			};
		zc.g = 'vp';
		var Z = ( a ) => {
				if ( ! a )
					throw new W( `Cannot use deleted val. handle = ${ a }` );
				return $h[ a ];
			},
			Gh = ( a ) => {
				switch ( a ) {
					case void 0:
						return 2;
					case null:
						return 4;
					case ! 0:
						return 6;
					case ! 1:
						return 8;
					default:
						const b = Zh.pop() || $h.length;
						$h[ b ] = a;
						$h[ b + 1 ] = 1;
						return b;
				}
			},
			ai = {
				name: 'emscripten::val',
				fromWireType: ( a ) => {
					var b = Z( a );
					zc( a );
					return b;
				},
				toWireType: ( a, b ) => Gh( b ),
				K: ih,
				readValueFromPointer: ch,
				J: null,
			},
			$b = ( a ) => U( a, ai );
		$b.g = 'vp';
		var bi = ( a, b, c ) => {
				switch ( b ) {
					case 1:
						return c
							? function ( d ) {
									return this.fromWireType( y[ d ] );
							  }
							: function ( d ) {
									return this.fromWireType( z[ d ] );
							  };
					case 2:
						return c
							? function ( d ) {
									return this.fromWireType( A[ d >> 1 ] );
							  }
							: function ( d ) {
									return this.fromWireType( C[ d >> 1 ] );
							  };
					case 4:
						return c
							? function ( d ) {
									return this.fromWireType( D[ d >> 2 ] );
							  }
							: function ( d ) {
									return this.fromWireType( E[ d >> 2 ] );
							  };
					default:
						throw new TypeError(
							`invalid integer width (${ b }): ${ a }`
						);
				}
			},
			ac = ( a, b, c, d ) => {
				function e() {}
				b = V( b );
				e.values = {};
				U( a, {
					name: b,
					constructor: e,
					fromWireType: function ( f ) {
						return this.constructor.values[ f ];
					},
					toWireType: ( f, g ) => g.value,
					K: ih,
					readValueFromPointer: bi( b, c, d ),
					J: null,
				} );
				zh( b, e );
			};
		ac.g = 'vpppi';
		var ci = ( a, b ) => {
				var c = eh[ a ];
				if ( void 0 === c )
					throw (
						( ( a = `${ b } has unknown type ${ Qh( a ) }` ),
						new W( a ) )
					);
				return c;
			},
			bc = ( a, b, c ) => {
				var d = ci( a, 'enum' );
				b = V( b );
				a = d.constructor;
				d = Object.create( d.constructor.prototype, {
					value: { value: c },
					constructor: {
						value: wh( `${ d.name }_${ b }`, function () {} ),
					},
				} );
				a.values[ c ] = d;
				a[ b ] = d;
			};
		bc.g = 'vppi';
		var di = ( a, b ) => {
				switch ( b ) {
					case 4:
						return function ( c ) {
							return this.fromWireType( Na[ c >> 2 ] );
						};
					case 8:
						return function ( c ) {
							return this.fromWireType( Oa[ c >> 3 ] );
						};
					default:
						throw new TypeError(
							`invalid float width (${ b }): ${ a }`
						);
				}
			},
			cc = ( a, b, c ) => {
				b = V( b );
				U( a, {
					name: b,
					fromWireType: ( d ) => d,
					toWireType: ( d, e ) => e,
					K: ih,
					readValueFromPointer: di( b, c ),
					J: null,
				} );
			};
		cc.g = 'vppp';
		var dc = ( a, b, c, d, e, f, g ) => {
			var h = Uh( b, c );
			a = V( a );
			a = Vh( a );
			e = Y( d, e );
			zh(
				a,
				function () {
					Rh( `Cannot call ${ a } due to unbound types`, h );
				},
				b - 1
			);
			hh( [], h, ( k ) => {
				Nh(
					a,
					Th(
						a,
						[ k[ 0 ], null ].concat( k.slice( 1 ) ),
						null,
						e,
						f,
						g
					),
					b - 1
				);
				return [];
			} );
		};
		dc.g = 'vpippppii';
		var ec = ( a, b, c, d, e ) => {
			b = V( b );
			let f = ( h ) => h;
			if ( 0 === d ) {
				var g = 32 - 8 * c;
				f = ( h ) => ( h << g ) >>> g;
				e = f( e );
			}
			U( a, {
				name: b,
				fromWireType: f,
				toWireType: ( h, k ) => k,
				K: ih,
				readValueFromPointer: mh( b, c, 0 !== d ),
				J: null,
			} );
		};
		ec.g = 'vpppii';
		var fc = ( a, b, c ) => {
			function d( f ) {
				return new e( y.buffer, E[ ( f + 4 ) >> 2 ], E[ f >> 2 ] );
			}
			var e = [
				Int8Array,
				Uint8Array,
				Int16Array,
				Uint16Array,
				Int32Array,
				Uint32Array,
				Float32Array,
				Float64Array,
				BigInt64Array,
				BigUint64Array,
			][ b ];
			c = V( c );
			U(
				a,
				{ name: c, fromWireType: d, K: ih, readValueFromPointer: d },
				{ Lb: ! 0 }
			);
		};
		fc.g = 'vpip';
		var gc = ( a, b ) => {
			b = V( b );
			U( a, {
				name: b,
				fromWireType: function ( c ) {
					for (
						var d = E[ c >> 2 ], e = c + 4, f, g = e, h = 0;
						h <= d;
						++h
					) {
						var k = e + h;
						if ( h == d || 0 == z[ k ] )
							( g = R( g, k - g ) ),
								void 0 === f
									? ( f = g )
									: ( ( f += String.fromCharCode( 0 ) ),
									  ( f += g ) ),
								( g = k + 1 );
					}
					X( c );
					return f;
				},
				toWireType: function ( c, d ) {
					d instanceof ArrayBuffer && ( d = new Uint8Array( d ) );
					var e = 'string' == typeof d;
					if (
						! (
							e ||
							( ArrayBuffer.isView( d ) &&
								1 == d.BYTES_PER_ELEMENT )
						)
					)
						throw new W( 'Cannot pass non-string to std::string' );
					var f = e ? Wf( d ) : d.length;
					var g = lh( 4 + f + 1 ),
						h = g + 4;
					E[ g >> 2 ] = f;
					e ? Xf( d, z, h, f + 1 ) : z.set( d, h );
					null !== c && c.push( X, g );
					return g;
				},
				K: ih,
				readValueFromPointer: ch,
				J( c ) {
					X( c );
				},
			} );
		};
		gc.g = 'vpp';
		var ei = new TextDecoder( 'utf-16le' ),
			fi = ( a, b ) => {
				a >>= 1;
				b = a + b / 2;
				for ( var c = a; ! ( c >= b ) && C[ c ];  ) ++c;
				return ei.decode(
					C.buffer instanceof ArrayBuffer
						? C.subarray( a, c )
						: C.slice( a, c )
				);
			},
			gi = ( a, b, c ) => {
				c ??= 2147483647;
				if ( 2 > c ) return 0;
				c -= 2;
				var d = b;
				c = c < 2 * a.length ? c / 2 : a.length;
				for ( var e = 0; e < c; ++e )
					( A[ b >> 1 ] = a.charCodeAt( e ) ), ( b += 2 );
				A[ b >> 1 ] = 0;
				return b - d;
			},
			hi = ( a ) => 2 * a.length,
			ii = ( a, b ) => {
				for ( var c = '', d = 0; ! ( d >= b / 4 ); d++ ) {
					var e = D[ ( a + 4 * d ) >> 2 ];
					if ( ! e ) break;
					c += String.fromCodePoint( e );
				}
				return c;
			},
			ji = ( a, b, c ) => {
				c ??= 2147483647;
				if ( 4 > c ) return 0;
				var d = b;
				c = d + c - 4;
				for ( var e = 0; e < a.length; ++e ) {
					var f = a.codePointAt( e );
					65535 < f && e++;
					D[ b >> 2 ] = f;
					b += 4;
					if ( b + 4 > c ) break;
				}
				D[ b >> 2 ] = 0;
				return b - d;
			},
			ki = ( a ) => {
				for ( var b = 0, c = 0; c < a.length; ++c )
					65535 < a.codePointAt( c ) && c++, ( b += 4 );
				return b;
			},
			hc = ( a, b, c ) => {
				c = V( c );
				if ( 2 === b ) {
					var d = fi;
					var e = gi;
					var f = hi;
					var g = ( h ) => C[ h >> 1 ];
				} else
					4 === b &&
						( ( d = ii ),
						( e = ji ),
						( f = ki ),
						( g = ( h ) => E[ h >> 2 ] ) );
				U( a, {
					name: c,
					fromWireType: ( h ) => {
						for (
							var k = E[ h >> 2 ], l, p = h + 4, n = 0;
							n <= k;
							++n
						) {
							var q = h + 4 + n * b;
							if ( n == k || 0 == g( q ) )
								( p = d( p, q - p ) ),
									void 0 === l
										? ( l = p )
										: ( ( l += String.fromCharCode( 0 ) ),
										  ( l += p ) ),
									( p = q + b );
						}
						X( h );
						return l;
					},
					toWireType: ( h, k ) => {
						if ( 'string' != typeof k )
							throw new W(
								`Cannot pass non-string to C++ string type ${ c }`
							);
						var l = f( k ),
							p = lh( 4 + l + b );
						E[ p >> 2 ] = l / b;
						e( k, p + 4, l + b );
						null !== h && h.push( X, p );
						return p;
					},
					K: ih,
					readValueFromPointer: ch,
					J( h ) {
						X( h );
					},
				} );
			};
		hc.g = 'vppp';
		var ic = ( a, b, c, d, e, f ) => {
			ah[ a ] = { name: V( b ), Oa: Y( c, d ), Y: Y( e, f ), Za: [] };
		};
		ic.g = 'vpppppp';
		var jc = ( a, b, c, d, e, f, g, h, k, l ) => {
			ah[ a ].Za.push( {
				Bb: V( b ),
				Hb: c,
				la: Y( d, e ),
				Gb: f,
				ic: g,
				hc: Y( h, k ),
				jc: l,
			} );
		};
		jc.g = 'vpppppppppp';
		var kc = ( a, b ) => {
			b = V( b );
			U( a, {
				Sb: ! 0,
				name: b,
				K: 0,
				fromWireType: () => {},
				toWireType: () => {},
			} );
		};
		kc.g = 'vpp';
		var lc = ( a, b, c, d ) => {
			function e( h ) {
				var k = R( a + 36 );
				Zg( `'Could not load dynamic lib: ${ k }\n${ h }` );
				--I;
				Ze( () => P( c )( a, d ) );
			}
			function f() {
				--I;
				Ze( () => P( b )( a, d ) );
			}
			I += 1;
			var g = $g( a, { H: ! 0 } );
			g ? g.then( f, e ) : e();
		};
		lc.g = 'vpppp';
		var mc = () => {
			for ( const a of Object.keys( Ce ) ) {
				const b = Number( a );
				De.has( b ) || li( b );
			}
		};
		mc.g = 'v';
		function mi( a ) {
			var b = ni,
				c = b.O.pop() || b.ca.length;
			b.ca[ c ] = a;
			return c;
		}
		function oi( a ) {
			var b = ni;
			b.ca[ a ] = void 0;
			b.O.push( a );
		}
		class pi {
			ca = [ void 0 ];
			O = [];
			get( a ) {
				return this.ca[ a ];
			}
			has( a ) {
				return void 0 !== this.ca[ a ];
			}
		}
		var ni = new pi(),
			qi = () => {
				var a = {};
				a.promise = new Promise( ( b, c ) => {
					a.reject = c;
					a.resolve = b;
				} );
				a.id = mi( a );
				return a;
			},
			nc = ( a, b, c ) => {
				const d = [];
				0 === Object.keys( Ee ).length || ab();
				var e = qi();
				d.push( e.promise );
				ri( e.id );
				for ( const f of Object.keys( Ce ) ) {
					const g = Number( f );
					g === a ||
						De.has( g ) ||
						( ( e = qi() ),
						si( g, e.id ),
						( Ee[ g ] = e ),
						d.push( e.promise ) );
				}
				Promise.all( d ).then( () => {
					Ee = {};
					P( b )( c );
				} );
			};
		nc.g = 'vppp';
		function oc() {
			var a = lh( 4 * ( oa.length + 1 ) ),
				b = a;
			oa.forEach( ( c ) => {
				var d = E,
					e = b >> 2,
					f = Wf( c ) + 1,
					g = lh( f );
				g && Xf( c, z, g, f );
				d[ e ] = g;
				b += 4;
			} );
			E[ b >> 2 ] = 0;
			return a;
		}
		oc.g = 'p';
		var pc = ( a ) => {
			Fa( a, ! ba, 1, ! aa, 262144, ! 1 );
			Ga();
		};
		pc.g = 'vp';
		var Ha = ( a ) => {
			'function' === typeof Atomics.qc &&
				( Atomics.qc( D, a >> 2, a ).value.then( Ka ),
				Atomics.store( D, ( a + 128 ) >> 2, 1 ) );
		};
		Ha.g = 'vp';
		var Ka = () => {
				var a = Re();
				a && ( Ha( a ), Ze( ti ) );
			},
			qc = ( a, b ) => {
				a == b
					? setTimeout( Ka )
					: t
					? postMessage( { Ca: a, U: 'checkMailbox' } )
					: ( a = Ce[ a ] ) && a.postMessage( { U: 'checkMailbox' } );
			};
		qc.g = 'vpp';
		var ui = [],
			rc = ( a, b, c, d, e ) => {
				d /= 2;
				ui.length = d;
				c = e >> 3;
				for ( e = 0; e < d; e++ )
					ui[ e ] = F[ c + 2 * e ]
						? F[ c + 2 * e + 1 ]
						: Oa[ c + 2 * e + 1 ];
				return ( b ? If[ b ] : vi[ a ] )( ...ui );
			};
		rc.g = 'dippip';
		var sc = () => {
			Ue = ! 1;
			I = 0;
		};
		sc.g = 'v';
		var tc = ( a ) => {
			t ? postMessage( { U: 'cleanupThread', Qa: a } ) : Ie( a );
		};
		tc.g = 'vp';
		var uc = ( a ) => {
			t
				? postMessage( { U: 'markAsFinished', Qa: a } )
				: ( De.add( a ), a in Ee && Ee[ a ].resolve() );
		};
		uc.g = 'vp';
		var vc = () => {};
		vc.g = 'vp';
		var wc = () => {
			throw new ta();
		};
		wc.g = 'v';
		var wi = ( a, b, c ) => {
				var d = [];
				a = a.toWireType( d, c );
				d.length && ( E[ b >> 2 ] = Gh( d ) );
				return a;
			},
			xc = ( a, b, c ) => {
				a = Z( a );
				b = ci( b, 'emval::as' );
				return wi( b, c, a );
			};
		xc.g = 'dppp';
		var xi = [],
			yc = ( a, b, c, d ) => {
				a = xi[ a ];
				b = Z( b );
				return a( null, b, c, d );
			};
		yc.g = 'dpppp';
		var yi = {},
			zi = ( a ) => {
				var b = yi[ a ];
				return void 0 === b ? V( a ) : b;
			},
			Ac = ( a ) => {
				if ( 0 === a ) return Gh( globalThis );
				a = zi( a );
				return Gh( globalThis[ a ] );
			};
		Ac.g = 'pp';
		var Ai = ( a ) => {
				var b = xi.length;
				xi.push( a );
				return b;
			},
			Bi = ( a, b ) => {
				for ( var c = Array( a ), d = 0; d < a; ++d )
					c[ d ] = ci( E[ ( b + 4 * d ) >> 2 ], `parameter ${ d }` );
				return c;
			},
			Bc = ( a, b, c ) => {
				b = Bi( a, b );
				var d = b.shift();
				a--;
				var e = 'return function (obj, func, destructorsRef, args) {\n',
					f = 0,
					g = [];
				0 === c && g.push( 'obj' );
				for ( var h = [ 'retType' ], k = [ d ], l = 0; l < a; ++l )
					g.push( `arg${ l }` ),
						h.push( `argType${ l }` ),
						k.push( b[ l ] ),
						( e += `  var arg${ l } = argType${ l }.readValueFromPointer(args${
							f ? '+' + f : ''
						});\n` ),
						( f += b[ l ].K );
				e += `  var rv = ${
					1 === c ? 'new func' : 'func.call'
				}(${ g.join( ', ' ) });\n`;
				d.Sb ||
					( h.push( 'emval_returnValue' ),
					k.push( wi ),
					( e +=
						'  return emval_returnValue(retType, destructorsRef, rv);\n' ) );
				a = new Function( ...h, e + '};\n' )( ...k );
				c = `methodCaller<(${ b
					.map( ( p ) => p.name )
					.join( ', ' ) }) => ${ d.name }>`;
				return Ai( wh( c, a ) );
			};
		Bc.g = 'pipi';
		var Cc = ( a ) => {
			a = zi( a );
			return Gh( m[ a ] );
		};
		Cc.g = 'pp';
		var Dc = ( a, b ) => {
			a = Z( a );
			b = Z( b );
			return Gh( a[ b ] );
		};
		Dc.g = 'ppp';
		var Ec = ( a ) => {
			9 < a && ( $h[ a + 1 ] += 1 );
		};
		Ec.g = 'vp';
		var Fc = ( a, b ) => {
			a = Z( a );
			b = Z( b );
			return a instanceof b;
		};
		Fc.g = 'ipp';
		var Gc = ( a ) => {
			a = Z( a );
			return 'number' == typeof a;
		};
		Gc.g = 'ip';
		var Hc = ( a ) => {
			a = Z( a );
			return 'string' == typeof a;
		};
		Hc.g = 'ip';
		var Ic = ( a ) => Gh( zi( a ) );
		Ic.g = 'pp';
		var Jc = ( a ) => {
			var b = Z( a );
			bh( b );
			zc( a );
		};
		Jc.g = 'vp';
		var Kc = ( a, b, c ) => {
			a = Z( a );
			b = Z( b );
			c = Z( c );
			a[ b ] = c;
		};
		Kc.g = 'vppp';
		var Lc = ( a, b ) => {
			a = ci( a, '_emval_take_value' );
			a = a.readValueFromPointer( b );
			return Gh( a );
		};
		Lc.g = 'ppp';
		var Mc = ( a ) => {
			a = Z( a );
			return Gh( typeof a );
		};
		Mc.g = 'pp';
		function Nc( a, b ) {
			a =
				-9007199254740992 > a || 9007199254740992 < a
					? NaN
					: Number( a );
			a = new Date( 1e3 * a );
			D[ b >> 2 ] = a.getUTCSeconds();
			D[ ( b + 4 ) >> 2 ] = a.getUTCMinutes();
			D[ ( b + 8 ) >> 2 ] = a.getUTCHours();
			D[ ( b + 12 ) >> 2 ] = a.getUTCDate();
			D[ ( b + 16 ) >> 2 ] = a.getUTCMonth();
			D[ ( b + 20 ) >> 2 ] = a.getUTCFullYear() - 1900;
			D[ ( b + 24 ) >> 2 ] = a.getUTCDay();
			D[ ( b + 28 ) >> 2 ] =
				( ( a.getTime() -
					Date.UTC( a.getUTCFullYear(), 0, 1, 0, 0, 0, 0 ) ) /
					864e5 ) |
				0;
		}
		Nc.g = 'vjp';
		var Ci = [ 0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335 ],
			Di = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];
		function Oc( a, b ) {
			a =
				-9007199254740992 > a || 9007199254740992 < a
					? NaN
					: Number( a );
			a = new Date( 1e3 * a );
			D[ b >> 2 ] = a.getSeconds();
			D[ ( b + 4 ) >> 2 ] = a.getMinutes();
			D[ ( b + 8 ) >> 2 ] = a.getHours();
			D[ ( b + 12 ) >> 2 ] = a.getDate();
			D[ ( b + 16 ) >> 2 ] = a.getMonth();
			D[ ( b + 20 ) >> 2 ] = a.getFullYear() - 1900;
			D[ ( b + 24 ) >> 2 ] = a.getDay();
			var c = a.getFullYear();
			D[ ( b + 28 ) >> 2 ] =
				( ( 0 !== c % 4 || ( 0 === c % 100 && 0 !== c % 400 )
					? Di
					: Ci )[ a.getMonth() ] +
					a.getDate() -
					1 ) |
				0;
			D[ ( b + 36 ) >> 2 ] = -( 60 * a.getTimezoneOffset() );
			c = new Date( a.getFullYear(), 6, 1 ).getTimezoneOffset();
			var d = new Date( a.getFullYear(), 0, 1 ).getTimezoneOffset();
			D[ ( b + 32 ) >> 2 ] =
				( c != d && a.getTimezoneOffset() == Math.min( d, c ) ) | 0;
		}
		Oc.g = 'vjp';
		function Pc( a, b, c, d, e, f, g ) {
			if ( t ) return O( 17, 1, a, b, c, d, e, f, g );
			e =
				-9007199254740992 > e || 9007199254740992 < e
					? NaN
					: Number( e );
			try {
				var h = T( d ),
					k = FS.ia( h, a, e, b, c ),
					l = k.s;
				D[ f >> 2 ] = k.ca;
				E[ g >> 2 ] = l;
				return 0;
			} catch ( p ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== p.name )
					throw p;
				return -p.A;
			}
		}
		Pc.g = 'ipiiijpp';
		function Qc( a, b, c, d, e, f ) {
			if ( t ) return O( 18, 1, a, b, c, d, e, f );
			f =
				-9007199254740992 > f || 9007199254740992 < f
					? NaN
					: Number( f );
			try {
				var g = T( e );
				if ( c & 2 ) {
					c = f;
					if ( ! FS.isFile( g.node.mode ) ) throw new FS.h( 43 );
					d & 2 || FS.ka( g, z.slice( a, a + b ), c, b, d );
				}
			} catch ( h ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== h.name )
					throw h;
				return -h.A;
			}
		}
		Qc.g = 'ippiiij';
		var Rc = ( a, b, c, d ) => {
			var e = new Date().getFullYear(),
				f = new Date( e, 0, 1 ).getTimezoneOffset();
			e = new Date( e, 6, 1 ).getTimezoneOffset();
			E[ a >> 2 ] = 60 * Math.max( f, e );
			D[ b >> 2 ] = Number( f != e );
			b = ( g ) => {
				var h = Math.abs( g );
				return `UTC${ 0 <= g ? '-' : '+' }${ String(
					Math.floor( h / 60 )
				).padStart( 2, '0' ) }${ String( h % 60 ).padStart( 2, '0' ) }`;
			};
			a = b( f );
			b = b( e );
			e < f
				? ( Xf( a, z, c, 17 ), Xf( b, z, d, 17 ) )
				: ( Xf( a, z, d, 17 ), Xf( b, z, c, 17 ) );
		};
		Rc.g = 'vpppp';
		var Yc = () => performance.timeOrigin + performance.now();
		Yc.g = 'd';
		var Uc = () => Date.now();
		Uc.g = 'd';
		var Ei = 1;
		function Sc( a, b, c ) {
			if ( ! ( 0 <= a && 3 >= a ) ) return 28;
			if ( 0 === a ) a = Date.now();
			else if ( Ei ) a = performance.timeOrigin + performance.now();
			else return 52;
			F[ c >> 3 ] = BigInt( Math.round( 1e6 * a ) );
			return 0;
		}
		Sc.g = 'iijp';
		var Tc = () => {};
		Tc.g = 'v';
		var Vc = ( a ) => v( R( a ) );
		Vc.g = 'vp';
		var Wc = () => {
			I += 1;
			throw 'unwind';
		};
		Wc.g = 'v';
		var Xc = () => z.length;
		Xc.g = 'p';
		var Zc = () => navigator.hardwareConcurrency;
		Zc.g = 'i';
		var $c = ( a ) => {
			oi( a );
		};
		$c.g = 'vp';
		var ad = ( a, b, c ) => {
			a = ni.get( a );
			switch ( b ) {
				case 0:
					a.resolve( c );
					break;
				case 1:
					a.resolve( ni.get( c ).promise );
					break;
				case 2:
					a.resolve( ni.get( c ).promise );
					oi( c );
					break;
				case 3:
					a.reject( c );
			}
		};
		ad.g = 'vpip';
		var bd = () => ! 1;
		bd.g = 'ip';
		var Fi = {},
			Hi = () => {
				if ( ! Gi ) {
					var a = {
							USER: 'web_user',
							LOGNAME: 'web_user',
							PATH: '/',
							PWD: '/',
							HOME: '/home/web_user',
							LANG:
								(
									( 'object' == typeof navigator &&
										navigator.language ) ||
									'C'
								).replace( '-', '_' ) + '.UTF-8',
							_: ea || './this.program',
						},
						b;
					for ( b in Fi )
						void 0 === Fi[ b ]
							? delete a[ b ]
							: ( a[ b ] = Fi[ b ] );
					var c = [];
					for ( b in a ) c.push( `${ b }=${ a[ b ] }` );
					Gi = c;
				}
				return Gi;
			},
			Gi;
		function cd( a, b ) {
			if ( t ) return O( 19, 1, a, b );
			var c = 0,
				d = 0,
				e;
			for ( e of Hi() ) {
				var f = b + c;
				E[ ( a + d ) >> 2 ] = f;
				c += Xf( e, z, f, Infinity ) + 1;
				d += 4;
			}
			return 0;
		}
		cd.g = 'ipp';
		function dd( a, b ) {
			if ( t ) return O( 20, 1, a, b );
			var c = Hi();
			E[ a >> 2 ] = c.length;
			a = 0;
			for ( var d of c ) a += Wf( d ) + 1;
			E[ b >> 2 ] = a;
			return 0;
		}
		dd.g = 'ipp';
		function fd( a ) {
			if ( t ) return O( 21, 1, a );
			try {
				var b = T( a );
				FS.close( b );
				return 0;
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return c.A;
			}
		}
		fd.g = 'ii';
		function gd( a, b ) {
			if ( t ) return O( 22, 1, a, b );
			try {
				var c = T( a ),
					d = c.B
						? 2
						: FS.isDir( c.mode )
						? 3
						: FS.isLink( c.mode )
						? 7
						: 4;
				y[ b ] = d;
				A[ ( b + 2 ) >> 1 ] = 0;
				F[ ( b + 8 ) >> 3 ] = BigInt( 0 );
				F[ ( b + 16 ) >> 3 ] = BigInt( 0 );
				return 0;
			} catch ( e ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== e.name )
					throw e;
				return e.A;
			}
		}
		gd.g = 'iip';
		function hd( a, b, c, d ) {
			if ( t ) return O( 23, 1, a, b, c, d );
			try {
				a: {
					var e = T( a );
					a = b;
					for ( var f, g = ( b = 0 ); g < c; g++ ) {
						var h = E[ a >> 2 ],
							k = E[ ( a + 4 ) >> 2 ];
						a += 8;
						var l = FS.read( e, y, h, k, f );
						if ( 0 > l ) {
							var p = -1;
							break a;
						}
						b += l;
						if ( l < k ) break;
						'undefined' != typeof f && ( f += l );
					}
					p = b;
				}
				E[ d >> 2 ] = p;
				return 0;
			} catch ( n ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== n.name )
					throw n;
				return n.A;
			}
		}
		hd.g = 'iippp';
		function jd( a, b, c, d ) {
			if ( t ) return O( 24, 1, a, b, c, d );
			b =
				-9007199254740992 > b || 9007199254740992 < b
					? NaN
					: Number( b );
			try {
				if ( isNaN( b ) ) return 61;
				var e = T( a );
				FS.llseek( e, b, c );
				F[ d >> 3 ] = BigInt( e.position );
				e.Ea && 0 === b && 0 === c && ( e.Ea = null );
				return 0;
			} catch ( f ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== f.name )
					throw f;
				return f.A;
			}
		}
		jd.g = 'iijip';
		function kd( a, b, c, d ) {
			if ( t ) return O( 25, 1, a, b, c, d );
			try {
				a: {
					var e = T( a );
					a = b;
					for ( var f, g = ( b = 0 ); g < c; g++ ) {
						var h = E[ a >> 2 ],
							k = E[ ( a + 4 ) >> 2 ];
						a += 8;
						var l = FS.write( e, y, h, k, f );
						if ( 0 > l ) {
							var p = -1;
							break a;
						}
						b += l;
						if ( l < k ) break;
						'undefined' != typeof f && ( f += l );
					}
					p = b;
				}
				E[ d >> 2 ] = p;
				return 0;
			} catch ( n ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== n.name )
					throw n;
				return n.A;
			}
		}
		kd.g = 'iippp';
		function md( ...a ) {
			return G.heif_color_conversion_options_ext_copy( ...a );
		}
		md.G = ! 0;
		function nd( ...a ) {
			return G.heif_color_conversion_options_ext_free( ...a );
		}
		nd.G = ! 0;
		function od( ...a ) {
			return G.heif_encoding_options_alloc( ...a );
		}
		od.G = ! 0;
		function pd( ...a ) {
			return G.heif_encoding_options_free( ...a );
		}
		pd.G = ! 0;
		function qd( ...a ) {
			return G.heif_error_success( ...a );
		}
		qd.G = ! 0;
		function rd( ...a ) {
			return G.heif_image_get_bits_per_pixel_range( ...a );
		}
		rd.G = ! 0;
		function sd( ...a ) {
			return G.heif_image_get_chroma_format( ...a );
		}
		sd.G = ! 0;
		function td( ...a ) {
			return G.heif_image_get_nclx_color_profile( ...a );
		}
		td.G = ! 0;
		function ud( ...a ) {
			return G.heif_image_get_plane_readonly2( ...a );
		}
		ud.G = ! 0;
		function vd( ...a ) {
			return G.heif_image_release( ...a );
		}
		vd.G = ! 0;
		function wd( ...a ) {
			return G.heif_nclx_color_profile_free( ...a );
		}
		wd.G = ! 0;
		function xd( ...a ) {
			return G.heif_tai_clock_info_release( ...a );
		}
		xd.G = ! 0;
		function yd( ...a ) {
			return G.heif_tai_timestamp_packet_alloc( ...a );
		}
		yd.G = ! 0;
		function zd( ...a ) {
			return G.heif_tai_timestamp_packet_copy( ...a );
		}
		zd.G = ! 0;
		function Ad( ...a ) {
			return G.heif_tai_timestamp_packet_release( ...a );
		}
		Ad.G = ! 0;
		function xe( a, b ) {
			try {
				return $f( z.subarray( a, a + b ) ), 0;
			} catch ( c ) {
				if ( 'undefined' == typeof FS || 'ErrnoError' !== c.name )
					throw c;
				return c.A;
			}
		}
		xe.g = 'ipp';
		var va = ( a ) => {
			var b = J(),
				c = Se( 4 ),
				d = Se( 4 );
			Ii( a, c, d );
			a = E[ c >> 2 ];
			d = E[ d >> 2 ];
			c = R( a );
			X( a );
			if ( d ) {
				var e = R( d );
				X( d );
			}
			K( b );
			return [ c, e ];
		};
		t || Oe();
		( () => {
			var a = {
				promiseChainEnd: Promise.resolve(),
				canHandle: ( b ) => ! m.noWasmDecoding && b.endsWith( '.so' ),
				handle: ( b, c, d, e ) => {
					a.promiseChainEnd = a.promiseChainEnd
						.then( () => Mf( b, { H: ! 0, oa: ! 0 }, c, {} ) )
						.then(
							( f ) => {
								bf[ c ] = f;
								d( b );
							},
							( f ) => {
								v(
									`failed to instantiate wasm: ${ c }: ${ f }`
								);
								e();
							}
						);
				},
			};
			af.push( a );
		} )();
		FS.createPreloadedFile = og;
		FS.V = Array( 4096 );
		FS.mount( S, {}, '/' );
		FS.mkdir( '/tmp' );
		FS.mkdir( '/home' );
		FS.mkdir( '/home/web_user' );
		( function () {
			FS.mkdir( '/dev' );
			FS.registerDevice( FS.makedev( 1, 3 ), {
				read: () => 0,
				write: ( d, e, f, g ) => g,
				llseek: () => 0,
			} );
			FS.mkdev( '/dev/null', FS.makedev( 1, 3 ) );
			fg( FS.makedev( 5, 0 ), hg );
			fg( FS.makedev( 6, 0 ), ig );
			FS.mkdev( '/dev/tty', FS.makedev( 5, 0 ) );
			FS.mkdev( '/dev/tty1', FS.makedev( 6, 0 ) );
			var a = new Uint8Array( 1024 ),
				b = 0,
				c = () => {
					0 === b && ( $f( a ), ( b = a.byteLength ) );
					return a[ --b ];
				};
			FS.createDevice( '/dev', 'random', c );
			FS.createDevice( '/dev', 'urandom', c );
			FS.mkdir( '/dev/shm' );
			FS.mkdir( '/dev/shm/tmp' );
		} )();
		( function () {
			FS.mkdir( '/proc' );
			var a = FS.mkdir( '/proc/self' );
			FS.mkdir( '/proc/self/fd' );
			FS.mount(
				{
					mount() {
						var b = FS.createNode( a, 'fd', 16895, 73 );
						b.o = { llseek: S.o.llseek };
						b.m = {
							ha( c, d ) {
								c = +d;
								var e = T( c );
								c = {
									parent: null,
									mount: { fb: 'fake' },
									m: { readlink: () => e.path },
									id: c + 1,
								};
								return ( c.parent = c );
							},
							ra() {
								return Array.from( FS.streams.entries() )
									.filter( ( [ , c ] ) => c )
									.map( ( [ c ] ) => c.toString() );
							},
						};
						return b;
					},
				},
				{},
				'/proc/self/fd'
			);
		} )();
		FS.Cb = { MEMFS: S };
		S.Wa = new FS.h( 44 );
		S.Wa.stack = '<generic error, no stack>';
		( () => {
			let a = vh.prototype;
			Object.assign( a, {
				isAliasOf: function ( c ) {
					if ( ! ( this instanceof vh && c instanceof vh ) )
						return ! 1;
					var d = this.l.C.v,
						e = this.l.s;
					c.l = c.l;
					var f = c.l.C.v;
					for ( c = c.l.s; d.L;  ) ( e = d.ta( e ) ), ( d = d.L );
					for ( ; f.L;  ) ( c = f.ta( c ) ), ( f = f.L );
					return d === f && e === c;
				},
				clone: function () {
					this.l.s || nh( this );
					if ( this.l.pa ) return ( this.l.count.value += 1 ), this;
					var c = rh,
						d = Object,
						e = d.create,
						f = Object.getPrototypeOf( this ),
						g = this.l;
					c = c(
						e.call( d, f, {
							l: {
								value: {
									count: g.count,
									ga: g.ga,
									pa: g.pa,
									s: g.s,
									C: g.C,
									I: g.I,
									P: g.P,
								},
							},
						} )
					);
					c.l.count.value += 1;
					c.l.ga = ! 1;
					return c;
				},
				[ 'delete' ]() {
					this.l.s || nh( this );
					if ( this.l.ga && ! this.l.pa )
						throw new W( 'Object already scheduled for deletion' );
					qh( this );
					var c = this.l;
					--c.count.value;
					0 === c.count.value &&
						( c.I ? c.P.Y( c.I ) : c.C.v.Y( c.s ) );
					this.l.pa ||
						( ( this.l.I = void 0 ), ( this.l.s = void 0 ) );
				},
				isDeleted: function () {
					return ! this.l.s;
				},
				deleteLater: function () {
					this.l.s || nh( this );
					if ( this.l.ga && ! this.l.pa )
						throw new W( 'Object already scheduled for deletion' );
					sh.push( this );
					1 === sh.length && uh && uh( th );
					this.l.ga = ! 0;
					return this;
				},
			} );
			const b = Symbol.dispose;
			b && ( a[ b ] = a[ 'delete' ] );
		} )();
		Object.assign( Mh.prototype, {
			Fb( a ) {
				this.hb && ( a = this.hb( a ) );
				return a;
			},
			Ua( a ) {
				this.Y?.( a );
			},
			K: ih,
			readValueFromPointer: ch,
			fromWireType: function ( a ) {
				function b() {
					return this.za
						? Lh( this.v.da, { C: this.bc, s: c, P: this, I: a } )
						: Lh( this.v.da, { C: this, s: a } );
				}
				var c = this.Fb( a );
				if ( ! c ) return this.Ua( a ), null;
				var d = Kh( this.v, c );
				if ( void 0 !== d ) {
					if ( 0 === d.l.count.value )
						return ( d.l.s = c ), ( d.l.I = a ), d.clone();
					d = d.clone();
					this.Ua( a );
					return d;
				}
				d = this.v.Db( c );
				d = xh[ d ];
				if ( ! d ) return b.call( this );
				d = this.ya ? d.wb : d.pointerType;
				var e = Ih( c, this.v, d.v );
				return null === e
					? b.call( this )
					: this.za
					? Lh( d.v.da, { C: d, s: e, P: this, I: a } )
					: Lh( d.v.da, { C: d, s: e } );
			},
		} );
		Je.push( () => {
			Fi.VIPS_MAX_THREADS =
				6 < navigator.hardwareConcurrency
					? navigator.hardwareConcurrency
					: 6;
			Fi.VIPS_CONCURRENCY = 1;
		} );
		Wa.push( () => {
			const a = Object.getOwnPropertyDescriptor(
				m.SourceCustom.prototype,
				'onRead'
			);
			Object.defineProperty( m.SourceCustom.prototype, 'onRead', {
				set( c ) {
					return a.set.call( this, ( d ) => Gh( c( d ) ) );
				},
			} );
			const b = Object.getOwnPropertyDescriptor(
				m.TargetCustom.prototype,
				'onWrite'
			);
			Object.defineProperty( m.TargetCustom.prototype, 'onWrite', {
				set( c ) {
					return b.set.call( this, ( d ) => c( Z( d ) ) );
				},
			} );
		} );
		Object.assign( vh.prototype, {
			preventAutoDelete: function () {
				const a = sh.indexOf( this );
				-1 < a && sh.splice( a, 1 );
				this.l.ga = ! 1;
				return this;
			},
		} );
		if ( ! t ) {
			if ( m.wasmMemory ) Ca = m.wasmMemory;
			else {
				var Ji = m.INITIAL_MEMORY || 1073741824;
				Ca = new WebAssembly.Memory( {
					initial: Ji / 65536,
					maximum: Ji / 65536,
					shared: ! 0,
				} );
			}
			Da();
		}
		m.preloadPlugins && ( af = m.preloadPlugins );
		m.noExitRuntime && ( Ue = m.noExitRuntime );
		m.print && ( na = m.print );
		m.printErr && ( v = m.printErr );
		m.dynamicLibraries && ( oa = m.dynamicLibraries );
		m.wasmBinary && ( pa = m.wasmBinary );
		m.arguments && ( da = m.arguments );
		m.thisProgram && ( ea = m.thisProgram );
		m.addRunDependency = Za;
		m.removeRunDependency = $a;
		m.ENV = Fi;
		m.addFunction = Bf;
		m.FS_createPreloadedFile = og;
		m.FS_unlink = ( ...a ) => FS.unlink( ...a );
		m.FS_createPath = ( ...a ) => FS.createPath( ...a );
		m.FS_createDevice = ( ...a ) => FS.createDevice( ...a );
		m.FS = FS;
		m.FS_createDataFile = ( ...a ) => FS.createDataFile( ...a );
		m.FS_createLazyFile = ( ...a ) => FS.createLazyFile( ...a );
		m.setAutoDeleteLater = ( a ) => {
			oh = a;
		};
		m.deletionQueue = sh;
		m.setDelayFunction = ( a ) => {
			uh = a;
			sh.length && uh && uh( th );
		};
		m.incrementExceptionRefcount = ( a ) => Mg( a );
		m.decrementExceptionRefcount = ( a ) => Pg( a );
		m.getExceptionMessage = ( a ) => va( a );
		var vi = [
				we,
				Ve,
				Sg,
				yb,
				zb,
				Ab,
				Bb,
				Cb,
				Db,
				Eb,
				Fb,
				Gb,
				Hb,
				Ib,
				Jb,
				Kb,
				Lb,
				Pc,
				Qc,
				cd,
				dd,
				fd,
				gd,
				hd,
				jd,
				kd,
			],
			If = {};
		function Ki( a ) {
			for (
				var b = C[ ( a + 6 ) >> 1 ];
				13 === b && ! ( 16 < E[ a >> 2 ] );

			) {
				var c = E[ ( a + 8 ) >> 2 ],
					d = E[ c >> 2 ];
				if ( 0 === d ) {
					b = 0;
					break;
				} else if ( 0 === E[ ( c >> 2 ) + 1 ] )
					( a = d ), ( b = C[ ( d + 6 ) >> 1 ] );
				else break;
			}
			return [ a, b ];
		}
		function ld( a, b, c, d ) {
			var e = E[ ( a >> 2 ) + 1 ],
				f = E[ ( a >> 2 ) + 6 ],
				g = E[ ( a >> 2 ) + 2 ];
			a = Ki( E[ ( a >> 2 ) + 3 ] )[ 1 ];
			var h = J(),
				k = h,
				l = [],
				p = ! 1;
			if ( 15 === a ) throw Error( 'complex ret marshalling nyi' );
			if ( 0 > a || 15 < a ) throw Error( 'Unexpected rtype ' + a );
			if ( 4 === a || 13 === a ) l.push( c ), ( p = ! 0 );
			for ( var n = 0; n < f; n++ ) {
				var q = E[ ( d >> 2 ) + n ],
					r = Ki( E[ ( g >> 2 ) + n ] ),
					u = r[ 0 ];
				r = r[ 1 ];
				switch ( r ) {
					case 1:
					case 10:
					case 9:
					case 14:
						l.push( E[ q >> 2 ] );
						break;
					case 2:
						l.push( Na[ q >> 2 ] );
						break;
					case 3:
						l.push( Oa[ q >> 3 ] );
						break;
					case 5:
						l.push( z[ q ] );
						break;
					case 6:
						l.push( y[ q ] );
						break;
					case 7:
						l.push( C[ q >> 1 ] );
						break;
					case 8:
						l.push( A[ q >> 1 ] );
						break;
					case 11:
					case 12:
						l.push( Pa[ q >> 3 ] );
						break;
					case 4:
						l.push( Pa[ q >> 3 ] );
						l.push( Pa[ ( q >> 3 ) + 1 ] );
						break;
					case 13:
						r = E[ u >> 2 ];
						u = C[ ( u + 4 ) >> 1 ];
						k -= r;
						k &= ~( u - 1 );
						y.subarray( k, k + r ).set( y.subarray( q, q + r ) );
						l.push( k );
						break;
					case 15:
						throw Error( 'complex marshalling nyi' );
					default:
						throw Error( 'Unexpected type ' + r );
				}
			}
			if ( f != e ) {
				var x = [];
				for ( n = e - 1; n >= f; n-- )
					switch (
						( ( q = E[ ( d >> 2 ) + n ] ),
						( r = Ki( E[ ( g >> 2 ) + n ] ) ),
						( u = r[ 0 ] ),
						( r = r[ 1 ] ),
						r )
					) {
						case 5:
						case 6:
							--k;
							k &= -1;
							z[ k ] = z[ q ];
							break;
						case 7:
						case 8:
							k -= 2;
							k &= -2;
							C[ k >> 1 ] = C[ q >> 1 ];
							break;
						case 1:
						case 9:
						case 10:
						case 14:
						case 2:
							k -= 4;
							k &= -4;
							E[ k >> 2 ] = E[ q >> 2 ];
							break;
						case 3:
						case 11:
						case 12:
							k -= 8;
							k &= -8;
							E[ k >> 2 ] = E[ q >> 2 ];
							E[ ( k >> 2 ) + 1 ] = E[ ( q >> 2 ) + 1 ];
							break;
						case 4:
							k -= 16;
							k &= -8;
							E[ k >> 2 ] = E[ q >> 2 ];
							E[ ( k >> 2 ) + 1 ] = E[ ( q >> 2 ) + 1 ];
							E[ ( k >> 2 ) + 2 ] = E[ ( q >> 2 ) + 2 ];
							E[ ( k >> 2 ) + 3 ] = E[ ( q >> 2 ) + 3 ];
							break;
						case 13:
							k -= 4;
							k &= -4;
							x.push( [
								k,
								q,
								E[ u >> 2 ],
								C[ ( u + 4 ) >> 1 ],
							] );
							break;
						case 15:
							throw Error( 'complex arg marshalling nyi' );
						default:
							throw Error( 'Unexpected argtype ' + r );
					}
				l.push( k );
				for ( n = 0; n < x.length; n++ )
					( e = x[ n ] ),
						( d = e[ 0 ] ),
						( q = e[ 1 ] ),
						( r = e[ 2 ] ),
						( u = e[ 3 ] ),
						( k -= r ),
						( k &= ~( u - 1 ) ),
						y.subarray( k, k + r ).set( y.subarray( q, q + r ) ),
						( E[ d >> 2 ] = k );
			}
			K( k );
			Se( 0 );
			b = P( b ).apply( null, l );
			K( h );
			if ( ! p )
				switch ( a ) {
					case 0:
						break;
					case 1:
					case 9:
					case 10:
					case 14:
						E[ c >> 2 ] = b;
						break;
					case 2:
						Na[ c >> 2 ] = b;
						break;
					case 3:
						Oa[ c >> 3 ] = b;
						break;
					case 5:
					case 6:
						z[ c + 0 ] = b;
						break;
					case 7:
					case 8:
						C[ c >> 1 ] = b;
						break;
					case 11:
					case 12:
						Pa[ c >> 3 ] = b;
						break;
					case 15:
						throw Error( 'complex ret marshalling nyi' );
					default:
						throw Error( 'Unexpected rtype ' + a );
				}
		}
		ld.g = 'viiii';
		var Ph,
			Ia,
			Re,
			lh,
			X,
			Xe,
			vf,
			jg,
			We,
			Yg,
			ri,
			qf,
			si,
			li,
			Gg,
			Fa,
			La,
			Te,
			He,
			Ye,
			ti,
			Q,
			Qg,
			lf,
			K,
			Se,
			J,
			Mg,
			Pg,
			Ii,
			Rg,
			Ng;
		m.___THREW__ = 1204;
		m.__ZTISt12length_error = 1441800;
		m.__ZTVSt12length_error = 1441780;
		m.__ZTVN10__cxxabiv120__si_class_type_infoE = 1441472;
		m.__ZTVN10__cxxabiv117__class_type_infoE = 1441432;
		m.__ZTISt20bad_array_new_length = 1441672;
		m.___threwValue = 1208;
		m._stdout = 1427328;
		m._stderr = 1427176;
		m._g_mem_gc_friendly = 3363004;
		m._g_utf8_skip = 1370372;
		m.__ZTVNSt3__215basic_streambufIcNS_11char_traitsIcEEEE = 1444896;
		m.__ZTVNSt3__215basic_stringbufIcNS_11char_traitsIcEENS_9allocatorIcEEEE = 1445304;
		m.__ZTTNSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEEE = 1445720;
		m.__ZTTNSt3__219basic_ostringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEEE = 1445952;
		m.__ZTVNSt3__218basic_stringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEEE = 1445660;
		m.__ZTVNSt3__219basic_ostringstreamIcNS_11char_traitsIcEENS_9allocatorIcEEEE = 1445912;
		m.__ZNSt3__24coutE = 3413456;
		m.__ZNSt3__24cerrE = 3413632;
		m.__ZNSt3__25ctypeIcE2idE = 3410664;
		m.__ZTINSt3__219__shared_weak_countE = 1441956;
		m.__ZTVNSt3__212bad_weak_ptrE = 1441980;
		m.__ZTINSt3__212bad_weak_ptrE = 1442e3;
		m.__ZSt7nothrow = 946532;
		m.__ZTISt12out_of_range = 1441832;
		m.__ZTVSt12out_of_range = 1441812;
		m.__ZTVN10__cxxabiv121__vmi_class_type_infoE = 1441524;
		var G,
			Va = await ( async function () {
				function a( c, d ) {
					Va = c.exports;
					Va = Cf( Va, 1024 );
					var e = of( d );
					Of( Va );
					tf( '__main__', 0, G );
					Ig();
					Kf( Va._emscripten_tls_init, c.exports, e );
					Sa.push( Va.__wasm_apply_data_relocs );
					qa = d;
					c = Va;
					Ph = c.__getTypeName;
					Ia = c._embind_initialize_bindings;
					Re = c.pthread_self;
					lh = c.malloc;
					m._main = c.main;
					X = c.free;
					Xe = c.fflush;
					vf = c.calloc;
					m._emscripten_builtin_free = c.emscripten_builtin_free;
					jg = c.emscripten_builtin_memalign;
					m._emscripten_builtin_malloc = c.emscripten_builtin_malloc;
					We = c.__funcs_on_exit;
					m.___libc_calloc = c.__libc_calloc;
					m.___libc_free = c.__libc_free;
					m.___libc_malloc = c.__libc_malloc;
					Yg = c.__dl_seterr;
					ri = c._emscripten_dlsync_self_async;
					qf = c._emscripten_dlsync_self;
					si = c._emscripten_proxy_dlsync_async;
					li = c._emscripten_proxy_dlsync;
					Gg = c._emscripten_find_dylib;
					Fa = c._emscripten_thread_init;
					La = c._emscripten_thread_crashed;
					Te = c._emscripten_run_on_main_thread_js;
					He = c._emscripten_thread_free_data;
					Ye = c._emscripten_thread_exit;
					m._strndup = c.strndup;
					ti = c._emscripten_check_mailbox;
					m.__ZdaPvm = c._ZdaPvm;
					m.__Znaj = c._Znaj;
					m.__ZnajSt11align_val_t = c._ZnajSt11align_val_t;
					m.__Znwj = c._Znwj;
					m.__ZnwjSt11align_val_t = c._ZnwjSt11align_val_t;
					m.___libc_realloc = c.__libc_realloc;
					m._emscripten_builtin_calloc = c.emscripten_builtin_calloc;
					m._emscripten_builtin_realloc =
						c.emscripten_builtin_realloc;
					m._malloc_size = c.malloc_size;
					m._malloc_usable_size = c.malloc_usable_size;
					m._reallocf = c.reallocf;
					Q = c.setThrew;
					Qg = c._emscripten_tempret_set;
					lf = c.emscripten_stack_set_limits;
					K = c._emscripten_stack_restore;
					Se = c._emscripten_stack_alloc;
					J = c.emscripten_stack_get_current;
					Mg = c.__cxa_increment_exception_refcount;
					Pg = c.__cxa_decrement_exception_refcount;
					Ii = c.__get_exception_message;
					Rg = c.__cxa_can_catch;
					Ng = c.__cxa_get_exception_ptr;
					$a( 'wasm-instantiate' );
					return Va;
				}
				Za( 'wasm-instantiate' );
				var b = fb();
				if ( m.instantiateWasm )
					return new Promise( ( c ) => {
						m.instantiateWasm( b, ( d, e ) => {
							c( a( d, e ) );
						} );
					} );
				if ( t )
					return new Promise( ( c ) => {
						ya = ( d ) => {
							var e = new WebAssembly.Instance( d, fb() );
							c( a( e, d ) );
						};
					} );
				bb ??= m.locateFile
					? ka( 'vips.wasm' )
					: new URL( 'vips.wasm', import.meta.url ).href;
				return ( function ( c ) {
					return a( c.instance, c.module );
				} )( await eb( b ) );
			} )();
		function Xd( a, b ) {
			var c = J();
			try {
				P( a )( b );
			} catch ( d ) {
				K( c );
				if ( ! ( d instanceof w ) ) throw d;
				Q( 1, 0 );
			}
		}
		function ee( a, b, c, d ) {
			var e = J();
			try {
				P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function Id( a, b, c ) {
			var d = J();
			try {
				return P( a )( b, c );
			} catch ( e ) {
				K( d );
				if ( ! ( e instanceof w ) ) throw e;
				Q( 1, 0 );
			}
		}
		function Wd( a ) {
			var b = J();
			try {
				P( a )();
			} catch ( c ) {
				K( b );
				if ( ! ( c instanceof w ) ) throw c;
				Q( 1, 0 );
			}
		}
		function Hd( a, b ) {
			var c = J();
			try {
				return P( a )( b );
			} catch ( d ) {
				K( c );
				if ( ! ( d instanceof w ) ) throw d;
				Q( 1, 0 );
			}
		}
		function Gd( a ) {
			var b = J();
			try {
				return P( a )();
			} catch ( c ) {
				K( b );
				if ( ! ( c instanceof w ) ) throw c;
				Q( 1, 0 );
			}
		}
		function le( a, b, c, d, e ) {
			var f = J();
			try {
				P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function Dd( a, b, c, d ) {
			var e = J();
			try {
				return P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function $d( a, b, c ) {
			var d = J();
			try {
				P( a )( b, c );
			} catch ( e ) {
				K( d );
				if ( ! ( e instanceof w ) ) throw e;
				Q( 1, 0 );
			}
		}
		function Kd( a, b, c, d ) {
			var e = J();
			try {
				return P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function Nd( a, b, c, d, e, f ) {
			var g = J();
			try {
				return P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function me( a, b, c, d, e, f ) {
			var g = J();
			try {
				P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function Od( a, b, c, d, e, f, g ) {
			var h = J();
			try {
				return P( a )( b, c, d, e, f, g );
			} catch ( k ) {
				K( h );
				if ( ! ( k instanceof w ) ) throw k;
				Q( 1, 0 );
			}
		}
		function Ld( a, b, c, d, e ) {
			var f = J();
			try {
				return P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function ae( a, b, c, d ) {
			var e = J();
			try {
				P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function be( a, b, c, d, e ) {
			var f = J();
			try {
				P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function Jd( a, b, c, d ) {
			var e = J();
			try {
				return P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function Yd( a, b, c ) {
			var d = J();
			try {
				P( a )( b, c );
			} catch ( e ) {
				K( d );
				if ( ! ( e instanceof w ) ) throw e;
				Q( 1, 0 );
			}
		}
		function Ed( a, b, c, d, e ) {
			var f = J();
			try {
				return P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function Bd( a, b ) {
			var c = J();
			try {
				return P( a )( b );
			} catch ( d ) {
				K( c );
				if ( ! ( d instanceof w ) ) throw d;
				Q( 1, 0 );
			}
		}
		function re( a, b, c, d, e, f, g, h, k, l, p ) {
			var n = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l, p );
			} catch ( q ) {
				K( n );
				if ( ! ( q instanceof w ) ) throw q;
				Q( 1, 0 );
			}
		}
		function ne( a, b, c, d, e, f, g ) {
			var h = J();
			try {
				P( a )( b, c, d, e, f, g );
			} catch ( k ) {
				K( h );
				if ( ! ( k instanceof w ) ) throw k;
				Q( 1, 0 );
			}
		}
		function oe( a, b, c, d, e, f, g, h ) {
			var k = J();
			try {
				P( a )( b, c, d, e, f, g, h );
			} catch ( l ) {
				K( k );
				if ( ! ( l instanceof w ) ) throw l;
				Q( 1, 0 );
			}
		}
		function Cd( a, b, c ) {
			var d = J();
			try {
				return P( a )( b, c );
			} catch ( e ) {
				K( d );
				if ( ! ( e instanceof w ) ) throw e;
				Q( 1, 0 );
			}
		}
		function de( a, b, c, d, e ) {
			var f = J();
			try {
				P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function fe( a, b, c, d, e ) {
			var f = J();
			try {
				P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function Zd( a, b, c, d, e ) {
			var f = J();
			try {
				P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
			}
		}
		function ie( a, b, c, d, e, f, g, h ) {
			var k = J();
			try {
				P( a )( b, c, d, e, f, g, h );
			} catch ( l ) {
				K( k );
				if ( ! ( l instanceof w ) ) throw l;
				Q( 1, 0 );
			}
		}
		function ge( a, b, c, d, e, f, g, h, k, l ) {
			var p = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l );
			} catch ( n ) {
				K( p );
				if ( ! ( n instanceof w ) ) throw n;
				Q( 1, 0 );
			}
		}
		function he( a, b, c, d, e, f, g, h, k ) {
			var l = J();
			try {
				P( a )( b, c, d, e, f, g, h, k );
			} catch ( p ) {
				K( l );
				if ( ! ( p instanceof w ) ) throw p;
				Q( 1, 0 );
			}
		}
		function ke( a, b, c, d, e, f ) {
			var g = J();
			try {
				P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function je( a, b, c, d, e, f, g ) {
			var h = J();
			try {
				P( a )( b, c, d, e, f, g );
			} catch ( k ) {
				K( h );
				if ( ! ( k instanceof w ) ) throw k;
				Q( 1, 0 );
			}
		}
		function te( a, b, c, d, e, f, g, h, k, l, p, n, q ) {
			var r = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l, p, n, q );
			} catch ( u ) {
				K( r );
				if ( ! ( u instanceof w ) ) throw u;
				Q( 1, 0 );
			}
		}
		function se( a, b, c, d, e, f, g, h, k, l, p, n ) {
			var q = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l, p, n );
			} catch ( r ) {
				K( q );
				if ( ! ( r instanceof w ) ) throw r;
				Q( 1, 0 );
			}
		}
		function qe( a, b, c, d, e, f, g, h, k, l ) {
			var p = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l );
			} catch ( n ) {
				K( p );
				if ( ! ( n instanceof w ) ) throw n;
				Q( 1, 0 );
			}
		}
		function pe( a, b, c, d, e, f, g, h, k ) {
			var l = J();
			try {
				P( a )( b, c, d, e, f, g, h, k );
			} catch ( p ) {
				K( l );
				if ( ! ( p instanceof w ) ) throw p;
				Q( 1, 0 );
			}
		}
		function ue( a, b, c, d, e, f, g, h, k, l, p, n, q, r ) {
			var u = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l, p, n, q, r );
			} catch ( x ) {
				K( u );
				if ( ! ( x instanceof w ) ) throw x;
				Q( 1, 0 );
			}
		}
		function ce( a, b, c, d, e, f ) {
			var g = J();
			try {
				P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function Pd( a, b, c, d, e, f, g, h ) {
			var k = J();
			try {
				return P( a )( b, c, d, e, f, g, h );
			} catch ( l ) {
				K( k );
				if ( ! ( l instanceof w ) ) throw l;
				Q( 1, 0 );
			}
		}
		function Ud( a, b ) {
			var c = J();
			try {
				return P( a )( b );
			} catch ( d ) {
				K( c );
				if ( ! ( d instanceof w ) ) throw d;
				Q( 1, 0 );
				return 0n;
			}
		}
		function Sd( a, b, c, d, e, f, g, h, k, l, p, n, q ) {
			var r = J();
			try {
				return P( a )( b, c, d, e, f, g, h, k, l, p, n, q );
			} catch ( u ) {
				K( r );
				if ( ! ( u instanceof w ) ) throw u;
				Q( 1, 0 );
			}
		}
		function Vd( a, b, c, d, e ) {
			var f = J();
			try {
				return P( a )( b, c, d, e );
			} catch ( g ) {
				K( f );
				if ( ! ( g instanceof w ) ) throw g;
				Q( 1, 0 );
				return 0n;
			}
		}
		function Fd( a, b, c, d ) {
			var e = J();
			try {
				return P( a )( b, c, d );
			} catch ( f ) {
				K( e );
				if ( ! ( f instanceof w ) ) throw f;
				Q( 1, 0 );
			}
		}
		function Qd( a, b, c, d, e, f, g, h, k, l, p ) {
			var n = J();
			try {
				return P( a )( b, c, d, e, f, g, h, k, l, p );
			} catch ( q ) {
				K( n );
				if ( ! ( q instanceof w ) ) throw q;
				Q( 1, 0 );
			}
		}
		function Rd( a, b, c, d, e, f, g, h, k, l, p, n ) {
			var q = J();
			try {
				return P( a )( b, c, d, e, f, g, h, k, l, p, n );
			} catch ( r ) {
				K( q );
				if ( ! ( r instanceof w ) ) throw r;
				Q( 1, 0 );
			}
		}
		function ve( a, b, c, d, e, f, g, h, k, l, p, n, q, r, u, x ) {
			var B = J();
			try {
				P( a )( b, c, d, e, f, g, h, k, l, p, n, q, r, u, x );
			} catch ( L ) {
				K( B );
				if ( ! ( L instanceof w ) ) throw L;
				Q( 1, 0 );
			}
		}
		function Td( a, b, c, d, e, f ) {
			var g = J();
			try {
				return P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function Md( a, b, c, d, e, f ) {
			var g = J();
			try {
				return P( a )( b, c, d, e, f );
			} catch ( h ) {
				K( g );
				if ( ! ( h instanceof w ) ) throw h;
				Q( 1, 0 );
			}
		}
		function Li( a = [] ) {
			var b = Hf( 'main' ).Pa;
			if ( b ) {
				a.unshift( ea );
				var c = a.length,
					d = Se( 4 * ( c + 1 ) ),
					e = d;
				a.forEach( ( g ) => {
					E[ e >> 2 ] = Yf( g );
					e += 4;
				} );
				E[ e >> 2 ] = 0;
				try {
					var f = b( c, d );
					ed( f, ! 0 );
				} catch ( g ) {
					Ae( g );
				}
			}
		}
		function Mi( a = da ) {
			function b() {
				m.calledRun = ! 0;
				if (
					! ra &&
					( Ta(),
					wa?.( m ),
					m.onRuntimeInitialized?.(),
					m.noInitialRun || Li( a ),
					! t )
				) {
					if ( m.postRun )
						for (
							'function' == typeof m.postRun &&
							( m.postRun = [ m.postRun ] );
							m.postRun.length;

						) {
							var c = m.postRun.shift();
							kf.push( c );
						}
					Ua( kf );
				}
			}
			if ( 0 < Xa ) Ya = Mi;
			else if ( t ) wa?.( m ), Ta();
			else {
				if ( m.preRun )
					for (
						'function' == typeof m.preRun &&
						( m.preRun = [ m.preRun ] );
						m.preRun.length;

					)
						Je.push( m.preRun.shift() );
				Ua( Je );
				0 < Xa
					? ( Ya = Mi )
					: m.setStatus
					? ( m.setStatus( 'Running...' ),
					  setTimeout( () => {
							setTimeout( () => m.setStatus( '' ), 1 );
							b();
					  }, 1 ) )
					: b();
			}
		}
		if ( m.preInit )
			for (
				'function' == typeof m.preInit && ( m.preInit = [ m.preInit ] );
				0 < m.preInit.length;

			)
				m.preInit.shift()();
		Mi();
		Qa
			? ( moduleRtn = m )
			: ( moduleRtn = new Promise( ( a, b ) => {
					wa = a;
					xa = b;
			  } ) );

		return moduleRtn;
	};
} )();
export default Vips;
var isPthread = globalThis.self?.name?.startsWith( 'em-pthread' );
// When running as a pthread, construct a new instance on startup
isPthread && Vips();
