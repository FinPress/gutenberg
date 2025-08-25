/**
 * External dependencies
 */
const { confirm, select } = require( '@inquirer/prompts' );
const { capitalCase } = require( 'change-case' );
const program = require( 'commander' );

/**
 * Internal dependencies
 */
const checkSystemRequirements = require( './check-system-requirements' );
const CLIError = require( './cli-error' );
const log = require( './log' );
const { engines, version } = require( '../package.json' );
const scaffold = require( './scaffold' );
const {
	getDefaultValues,
	getProjectTemplate,
	runPrompts,
} = require( './templates' );

const commandName = `wp-create-project`;
program
	.name( commandName )
	.description(
		'Generates PHP, JS and CSS code for WordPress projects (plugins, themes, blocks).\n\n' +
			'[slug] is optional. When provided, it triggers the quick mode where ' +
			'it is used as the project slug for identification, the output ' +
			'location for scaffolded files, and the name of the WordPress project.' +
			'The rest of the configuration is set to all default values unless ' +
			'overridden with some options listed below.'
	)
	.version( version )
	.arguments( '[slug]' )
	.option(
		'-t, --template <name>',
		'project template type name; allowed values: "standard", "es5", the name of an external npm package, or the path to a local directory',
		'standard'
	)
	.option( '--variant <variant>', 'the variant of the template to use' )
	.option(
		'--type <type>',
		'project type; allowed values: "plugin", "theme", "block"',
		'plugin'
	)
	.option( '--no-plugin', 'scaffold only block files (legacy compatibility)' )
	.option( '--with-blocks', 'include block scaffolding for plugins/themes' )
	.option(
		'--target-dir <directory>',
		'the directory where the files will be scaffolded, defaults to the slug'
	)
	.option( '--namespace <value>', 'internal namespace for the block name' )
	.option( '--title <value>', 'display title for the project' )
	.option(
		'--short-description <value>',
		'short description for the project'
	)
	.option( '--category <name>', 'category name for the block' )
	.option(
		'--wp-scripts',
		'enable integration with `@wordpress/scripts` package'
	)
	.option(
		'--no-wp-scripts',
		'disable integration with `@wordpress/scripts` package'
	)
	.option( '--wp-env', 'enable integration with `@wordpress/env` package' )
	.option( '--textdomain <value>', 'text domain for internationalization' )
	.action(
		async (
			slug,
			{
				plugin,
				category,
				namespace,
				shortDescription: description,
				template: templateName,
				title,
				wpScripts,
				wpEnv,
				variant,
				targetDir,
				textdomain,
				type,
				withBlocks,
			}
		) => {
			try {
				await checkSystemRequirements( engines );

				// Handle legacy --no-plugin flag
				if ( plugin === false ) {
					type = 'block';
				}

				// Validate project type
				const validTypes = [ 'plugin', 'theme', 'block' ];
				if ( ! validTypes.includes( type ) ) {
					throw new CLIError(
						`Invalid project type "${ type }". Allowed values: ${ validTypes.join(
							', '
						) }.`
					);
				}

				const projectTemplate =
					await getProjectTemplate( templateName );
				const availableVariants = Object.keys(
					projectTemplate.variants
				);
				if ( variant && ! availableVariants.includes( variant ) ) {
					if ( ! availableVariants.length ) {
						throw new CLIError(
							`"${ variant }" variant was selected. This template does not have any variants!`
						);
					}
					throw new CLIError(
						`"${ variant }" is not a valid variant for this template. Available variants are: ${ availableVariants.join(
							', '
						) }.`
					);
				}

				// Ensure type is set to default if not provided
				if ( ! type ) {
					type = 'plugin';
				}

				const optionsValues = Object.fromEntries(
					Object.entries( {
						type,
						plugin: type === 'plugin',
						theme: type === 'theme',
						block: type === 'block',
						withBlocks,
						category,
						description,
						namespace,
						title,
						wpScripts,
						wpEnv,
						targetDir,
						textdomain,
					} ).filter( ( [ , value ] ) => value !== undefined )
				);

				if ( slug ) {
					const defaultValues = getDefaultValues(
						projectTemplate,
						variant,
						type,
						optionsValues.blockVariant
					);
					const answers = {
						...defaultValues,
						slug,
						// Transforms slug to title as a fallback.
						title: capitalCase( slug ),
						...optionsValues,
					};
					await scaffold( projectTemplate, answers );
				} else {
					log.info( '' );

					// Project type selection if not specified via --type flag
					if ( ! optionsValues.type ) {
						const projectType = await select( {
							message:
								'What type of project do you want to create?',
							choices: [
								{ name: 'Plugin', value: 'plugin' },
								{ name: 'Theme', value: 'theme' },
								{ name: 'Block', value: 'block' },
							],
							default: 'plugin',
						} );
						type = projectType;
						optionsValues.type = type;
						optionsValues.plugin = type === 'plugin';
						optionsValues.theme = type === 'theme';
						optionsValues.block = type === 'block';
					}

					// Ask about theme variant for themes first (affects other questions)
					if ( type === 'theme' && ! variant ) {
						variant = await select( {
							message:
								'What type of theme do you want to create?',
							choices: [
								{
									name: 'FSE Theme (Block-based)',
									value: 'fse',
								},
								{
									name: 'Classic Theme (PHP templates)',
									value: 'classic',
								},
							],
							default: 'fse',
						} );
					}

					// Handle block variants (static vs dynamic) for standalone blocks
					if ( type === 'block' && ! variant ) {
						variant = await select( {
							message:
								'What type of block do you want to create?',
							choices: [
								{
									name: 'Static Block (saves content to database)',
									value: 'static',
								},
								{
									name: 'Dynamic Block (renders via PHP)',
									value: 'dynamic',
								},
							],
							default: 'static',
						} );
					}

					if ( type === 'plugin' ) {
						log.info( "Let's customize your WordPress plugin:" );
					} else if ( type === 'theme' ) {
						log.info(
							`Let's customize your WordPress ${
								variant === 'classic' ? 'classic' : 'FSE'
							} theme:`
						);
					} else {
						log.info( "Let's create your block:" );
					}

					const defaultValues = getDefaultValues(
						projectTemplate,
						variant,
						type,
						optionsValues.blockVariant
					);

					// Step 1: Collect project-specific details (no block details yet)
					const projectPromptFields = [
						'slug',
						'title',
						'description',
					];

					// Add textdomain for standalone blocks
					if ( type === 'block' && ! textdomain ) {
						projectPromptFields.push( 'textdomain' );
					}

					const projectAnswers = await runPrompts(
						projectTemplate,
						projectPromptFields,
						variant,
						optionsValues
					);

					// Step 2: Ask about blocks for plugins/themes
					if (
						( type === 'plugin' ||
							( type === 'theme' && variant === 'classic' ) ) &&
						withBlocks === undefined
					) {
						withBlocks = await confirm( {
							message: `Do you want to include block scaffolding in your ${ type }?`,
							default: type === 'plugin',
						} );
						optionsValues.withBlocks = withBlocks;
					} else if (
						type === 'theme' &&
						variant === 'fse' &&
						withBlocks === undefined
					) {
						withBlocks = await confirm( {
							message:
								'Do you want to add custom blocks to your FSE theme?',
							default: false,
						} );
						optionsValues.withBlocks = withBlocks;
					}

					// Step 3: Ask about block variant and details if including blocks
					let blockAnswers = {};
					if ( withBlocks || type === 'block' ) {
						// Ask about block variant if including blocks
						if ( withBlocks && ! optionsValues.blockVariant ) {
							const blockVariant = await select( {
								message:
									'What type of blocks do you want to create?',
								choices: [
									{
										name: 'Static Blocks (save content to database)',
										value: 'static',
									},
									{
										name: 'Dynamic Blocks (render via PHP)',
										value: 'dynamic',
									},
								],
								default: 'static',
							} );
							optionsValues.blockVariant = blockVariant;
						}

						// Collect block-specific details
						log.info( '' );
						log.info( "Now let's configure your block details:" );

						const blockPromptFields = [
							'namespace',
							'dashicon',
							'category',
						];

						blockAnswers = await runPrompts(
							projectTemplate,
							blockPromptFields,
							variant,
							optionsValues
						);
					}

					// Plugin/theme specific customization
					const metadataAnswers =
						( type === 'plugin' || type === 'theme' ) &&
						( await confirm( {
							message: `Do you want to customize the WordPress ${ type } metadata?`,
							default: false,
						} ) )
							? await runPrompts(
									projectTemplate,
									[
										...( type === 'plugin'
											? [ 'pluginURI' ]
											: [] ),
										'version',
										'author',
										'license',
										'licenseURI',
										...( type === 'plugin'
											? [ 'domainPath', 'updateURI' ]
											: [] ),
									],
									variant,
									optionsValues
							  )
							: {};

					await scaffold( projectTemplate, {
						...defaultValues,
						...optionsValues,
						variant,
						blockVariant: optionsValues.blockVariant,
						...projectAnswers,
						...blockAnswers,
						...metadataAnswers,
					} );
				}
			} catch ( error ) {
				if ( error instanceof CLIError ) {
					log.error( error.message );
					process.exit( 1 );
				} else if ( error.name === 'ExitPromptError' ) {
					log.info( 'Cancelled.' );
					process.exit( 1 );
				} else {
					throw error;
				}
			}
		}
	)
	.on( '--help', () => {
		log.info( '' );
		log.info( 'Examples:' );
		log.info( `  $ ${ commandName }` );
		log.info( `  $ ${ commandName } my-plugin` );
		log.info( `  $ ${ commandName } my-theme --type theme` );
		log.info( `  $ ${ commandName } my-block --type block` );
		log.info(
			`  $ ${ commandName } my-plugin --type plugin --with-blocks`
		);
		log.info(
			`  $ ${ commandName } todo-list --template es5 --title "TODO List"`
		);
	} )
	.parse( process.argv );
