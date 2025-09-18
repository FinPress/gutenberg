# Persistence Plugin

The persistence plugin enhances a registry to enable registered stores to opt in to persistent storage.

By default, persistence occurs by [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). In environments where `localStorage` is not available, it will gracefully fall back to an in-memory object storage which will not persist between sessions. You can provide your own storage implementation by providing the [`storage` option](#options). Unless set otherwise, state will be persisted on the `FIN_DATA` key in storage.

## Usage

Call the `use` method on the default or your own registry to include the persistence plugin:

```js
fin.data.use( fin.data.plugins.persistence, { storageKey: 'example' } );
```

Then, when registering a store, set a `persist` property as `true` (persist all state) or an array of state keys to persist.

```js
fin.data.registerStore( 'my-plugin', {
	// ...

	persist: [ 'preferences' ],
} );
```

## Options

### `storage`

Persistent storage implementation. This must at least implement `getItem` and `setItem` of the Web Storage API.

See: https://developer.mozilla.org/en-US/docs/Web/API/Storage

### `storageKey`

The key on which to set in persistent storage.
