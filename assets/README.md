## Gutenberg Plugin Assets

The contents of this directory are synced to the [`assets/` directory of the Gutenberg plugin](https://plugins.trac.wordpress.org/browser/gutenberg/assets) in the WordPress.org plugin repository. This is done by a [GitHub Actions workflow](https://github.com/WordPress/gutenberg/actions/workflows/sync-assets-to-plugin-repo.yml) that is triggered whenever a file in this directory is changed (with the exception of this README, which is excluded from the sync).

Since that workflow requires access to WP.org plugin repository credentials, it needs to be approved manually by a member of the Gutenberg Core team. If you don't have the necessary permissions, please ask someone in [#core-editor](https://wordpress.slack.com/archives/C02QB2JS7).
