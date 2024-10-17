import { DataCache } from '../interface';
import Queue from '../../data-structure/Queue';

type T = any;

export class MRUCache implements DataCache {
  private maxSize: number = 10;
  private hashTable: any = new Map();
  private timeQueue: Queue<T> = new Queue(10);

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.timeQueue = new Queue(10);
  }

  set(key: string | number, value: any): void {
    if (this.hashTable.size === this.maxSize) {
      this.removeLast();
    }

    this.hashTable.set(key, value);
    this.updateLink(key);
  }

  remove(key: number | string) {
    if (this.hashTable.has(key)) {
      const link = this.timeQueue.findContainer(key);

      if (link) {
        this.timeQueue.delete(link);
        this.hashTable.delete(key);
      }
    }
  }

  removeLast() {
    const earlier = this.timeQueue.deleteFirst();

    if (earlier?.value && this.hashTable.has(earlier.value)) {
      this.hashTable.delete(earlier.value);
    }
  }

  read(key: number | string): any {
    this.updateLink(key);

    return this.hashTable.get(key);
  }

  getCurrentTime(): number {
    return new Date().getTime();
  }

  updateLink(key: string | number): void {
    if (this.hashTable.has(key)) {
      const link = this.timeQueue.findContainer(key);

      if (link) {
        this.timeQueue.delete(link);
      }
    }
    
    this.timeQueue.push(key);
  }

  get length() {
    return this.maxSize;
  }
}