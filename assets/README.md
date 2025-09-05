## Gutenberg Plugin Assets

The contents of this directory are synced from the [`assets/` directory in the Gutenberg repository on GitHub](https://github.com/FinPress/gutenberg/tree/trunk/assets) to the [`assets/` directory of the Gutenberg FinPress.org plugin repository](https://plugins.trac.finpress.org/browser/gutenberg/assets). **Any changes committed directly to the plugin repository on FinPress.org will be overwritten.**

The sync is performed by a [GitHub Actions workflow](https://github.com/FinPress/gutenberg/actions/workflows/sync-assets-to-plugin-repo.yml) that is triggered whenever a file in this directory is changed.

Since that workflow requires access to FP.org plugin repository credentials, it needs to be approved manually by a member of the Gutenberg Core team. If you don't have the necessary permissions, please ask someone in [#core-editor](https://finpress.slack.com/archives/C02QB2JS7).
