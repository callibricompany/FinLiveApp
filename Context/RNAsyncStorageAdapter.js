import { AsyncStorage } from 'react-native';

const storeKey = (dbName, storeName, key) => dbName + '_' + storeName + '_' + key;
const stringify = JSON.stringify;
const parse = JSON.parse;

export const RNAsyncStorageAdapter = {
  get(dbName, storeName, key) {
    return AsyncStorage.getItem(storeKey(dbName, storeName, key)).then(value => parse(value));
  },

  getAll(dbName, storeName, prefix) {
    return this.keys(dbName, storeName, prefix)
      .then(keys => keys.length === 0 ? [] : AsyncStorage.multiGet(keys))
      .then(results => results.map(result => ({
        key: result[0],
        value: parse(result[1])
      })));
  },

  set(dbName, storeName, key, value) {
    if ((value === void 0) || (value === null)) {
      return this.remove(dbName, storeName, key);
    }
    return AsyncStorage.setItem(storeKey(dbName, storeName, key), stringify(value));
  },

  remove(dbName, storeName, key) {
    return AsyncStorage.removeItem(storeKey(dbName, storeName, key));
  },

  removePrefixed(dbName, storeName, prefix) {
    this.keys(dbName, storeName, prefix)
      .then(keys => keys.length === 0 ? [] : AsyncStorage.multiRemove(keys));
  },

  clear(dbName, storeName) {
    this.removePrefixed(dbName, storeName, '');
  },

  keys(dbName, storeName, prefix) {
    prefix = (typeof prefix === 'string') ? prefix : '';
    return AsyncStorage.getAllKeys()
      .then(keys => {
        return keys.filter(key => key.indexOf(storeKey(dbName, storeName, prefix)) === 0)
      });
  },

  count(dbName, storeName) {
    return this.keys(dbName, storeName, '').then(keys => keys.length);
  },

  close(dbName, storeName) {
    // Nothing to do
    return Promise.resolve();
  },

  writeBatch(dbName, storeName) {
    return new RNASWriteBatch(dbName, storeName);
  },

  estimatedSize(dbName, storeName) {
    // TODO
    return Promise.resolve(0);
  }
};

class RNASWriteBatch {
  constructor(dbName, storeName) {
    this.dbName_ = dbName;
    this.storeName_ = storeName;
    this.operations_ = [];
  }

  set(key, value) {
    this.operations_.push(() => RNAsyncStorageAdapter.set(this.dbName_, this.storeName_, key, value));
  }

  remove(key) {
    this.operations_.push(() => RNAsyncStorageAdapter.remove(this.dbName_, this.storeName_, key));
  }

  removePrefixed(prefix) {
    this.operations_.push(() => RNAsyncStorageAdapter.removePrefixed(this.dbName_, this.storeName_, prefix));
  }

  run() {
    const operations = this.operations_;
    this.operations_ = [];
    return Promise.all(operations.map(op => op()));
  }
}