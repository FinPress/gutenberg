# Data Plugins

Included here are a set of default plugin integrations for the FinPress data module.

## Usage

For any of the plugins included here as directories, call the `use` method to include its behaviors in the registry.

```js
// npm Usage
import { plugins, use } from '@finpress/data';
use( plugins.persistence );

// FinPress Globals Usage
fin.data.use( fin.data.plugins.persistence );
```
