export type CollectionItem = Record<string, string>;

class IndexMap {
  private _collection: CollectionItem[] = [];
  private _size: number = 0;
  private _keys: string[] = [];

  get size(): number {
    return this._collection.length;
  }

  set(key: string, value: string) {
    if (this._keys.some((el) => el === key)) {
      const idx = this._collection.findIndex((el) => key in el);
      this._collection[idx] = { [key]: value };
      return this;
    }
    this._collection = [...this._collection, { [key]: value }];
    this._keys = [...this._keys, key]
    this._size++;
    return this;
  }

  has(key: string | number): boolean {
    if (typeof key === 'number') {
      return !!this._collection[key];
    }

    if (typeof key === 'string') {
      return this._keys.some((el) => el === key);
    }

    return false;
  }

  /**
   *
   * @param key if number => Value gets by index, else gets by key
   * @param idx
   */
  get(key: string | number, idx?: number): string {
    if (typeof key === 'number') {
      return getFirstKey(this._collection[key]);
      // return Object.values(this._collection[key])[0];
    }

    if (typeof key === 'string') {
      const el = this._collection.find((el) => key in el);
      if (el) return el[key];
    }
  }

  remove(key: string | number) {
    if (typeof key === 'string') {
      const idx = this._collection.findIndex((el) => key in el);
      if (idx >= 0) this._collection.splice(idx, 1);
      this._size = this._collection.length;
      return this;
    }

    if (typeof key === 'number') {
      if (key < this._size) {
        this._collection.splice(key, 1);
        return this;
      }
    }
  }

  /**
   * Concat collections
   */
  union(...maps) {
    const newMap: CollectionItem[] = maps.reduce((acc, cur) => [...acc, ...cur]);
    if (newMap) {
      this._collection = [...this._collection, ...newMap]
      this._keys = [...this._keys, ...newMap.map((el) => getFirstKey(el))]
      this._size += newMap.length;
    }
    return this;
  }

  /**
   * get uniq values
   */
  uniq(): string[] {
    const uniqValues = new Set(this._collection.map((el) => getFirstValue(el)));
    return [...uniqValues];
  }

  /**
   * sort by values
   */
  sort(fn: (value1, value2, key1, key2) => void) {
    this._collection.sort((a, b) => getFirstValue(a) > getFirstValue(b) ? 1 : -1)
    this._collection = this._collection.sort();
    const length: number = this._collection.length;
    const val1 = getFirstValue(this._collection[0]);
    const val2 = getFirstValue(this._collection[length - 1]);
    const key1 = getFirstKey(this._collection[0]);
    const key2 = getFirstKey(this._collection[length - 1]);

    fn(val1, val2, key1, key2);
    return this;
  }

  /**
   * add after index
   */
  setTo(index: number, key: string, value: string) {
    this._collection.splice(index, 0, { [key]: value });
    this._keys.splice(index, 0, key);
    this._size++;

    return this;
  }

  /**
   * remove after index
   */
  removeAt(index: number, count = 1) {
    if (index > -1 && index < this._size) {
      this._collection.splice(index, count);
      this._size = this._collection.length;
      this._keys = this._collection.map((el) => getFirstKey(el));
    }
    return this;
  }
}

function sortByValue(val1: string, val2: string, key1: string, key2: string) {
  console.log('sort by value', arguments);
}

function sortByIndex(val1: string, val2: string, idx1: number, idx2: number) {
  console.log('sort by index value', arguments);
}

function getFirstKey(obj: Record<string, string>): string {
  return Object.keys(obj)[0];
}

function getFirstValue(obj: Record<string, string>): string {
  return Object.values(obj)[0];
}

const collection = new IndexMap();

collection
  .set('key1', 'value1')
  .set('key1', 'value1')
  .set('key2', 'value2')
  .set('key3', 'value3')
  .set('key4', 'value4')
  .set('key5', 'value4');

// console.log('b.get by key1', b.get('key1', 1));
// console.log('b.get by key11', b.get('key11'));
// console.log('b.get by index', b.get(1));
// console.log('has 1', b.has(1));
// console.log('has 100', b.has(100));
// console.log('has 0', b.has(0));
// console.log('has -1', b.has(-1));
// console.log('has key1', b.has('key1'));
// console.log('has unknown', b.has('unknown'));
// console.log('size:' , b.size);
// console.log(collection)
// console.log('remove idx 2:', collection.remove(2));
// console.log('remove idx 22:', collection.remove(22));
// console.log('remove key2:', collection.remove('key2'));
// console.log('remove key2:', collection.remove('key22'));

console.log(collection.union([{ 'key3': 'sd' }], [{ 'key4': 'sd' }]));
console.log(collection.setTo(0, 'key0', 'sd'));
console.log(collection.removeAt(1, 1));
console.log(collection.sort(sortByValue));
console.log(collection.uniq());
