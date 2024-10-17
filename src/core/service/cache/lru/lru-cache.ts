import { DataCache } from '../interface';
import Queue from '../../data-structure/Queue';

type Container = [value: any, priority: number];

export class LRUCache implements DataCache {
  private maxSize: number = 10;
  private hashTable: any = new Map();
  private timeQueue: Queue<Container> = new Queue(10);

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.timeQueue = new Queue(10);
  }

  set(key: string | number, value: any): void {
    if (this.hashTable.size === this.maxSize) {
      this.removeOldest();
    }

    this.updateLinkTime(key);
    this.hashTable.set(key, value);
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

  removeOldest() {
    const earlier = this.timeQueue.deleteFirst();

    if (earlier?.value && this.hashTable.has(earlier.value[0])) {
      this.hashTable.delete(earlier.value[0]);
    }
  }

  read(key: number | string): any {
    this.updateLinkTime(key);

    return this.hashTable.get(key);
  }

  getCurrentTime(): number {
    return new Date().getTime();
  }

  updateLinkTime(key: string | number): void {
    if (this.hashTable.has(key)) {
      const link = this.timeQueue.findContainer(key);

      if (link) {
        this.timeQueue.delete(link);
      }
    }
    
    this.timeQueue.push([key, this.getCurrentTime()]);
  }

  get length() {
    return this.maxSize;
  }
}