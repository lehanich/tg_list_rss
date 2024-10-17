import {describe, expect, it} from '@jest/globals';
import {LRUCache} from './lru-cache';

describe('LRU Cache create', function () {

  it('empty cache', () => {
    const cache = new LRUCache(3);
    expect(cache.length === 3);
  });

  it('get value by key', () => {
    const cache = new LRUCache(3);

    cache.set('test1', '1');
    cache.set('test2', '2');
    cache.set('test3', '3');

    expect(cache.read('test2') === '2');
  });

  it('old key replaced by new pair of key-value', () => {
    const cache = new LRUCache(3);

    cache.set('test1', '1');
    cache.set('test2', '2');
    cache.set('test3', '3');
    cache.set('test4', '4');

    expect(cache.read('test1') === undefined && cache.read('test4') === '4');
  });

});
