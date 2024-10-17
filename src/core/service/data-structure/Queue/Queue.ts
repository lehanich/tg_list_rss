// Очередь на основе связного списка
import {
  Queue as IQueue
} from './interface';
import LinkedList from '../LinkedList/LinkedList';
// import LinkedListNode from '../LinkedList/LinkedListNode';
import {
  // ListNodeVal,
  // LinkedList as ILinkedList,
  ListNodeLink
} from '../LinkedList/interface';

export default class Queue<T> implements IQueue<T> {
  public maxSize: number = 10;
  public length: number = 0;
  protected queue: LinkedList<T> = new LinkedList<T>;
  public first: ListNodeLink<T> = null;
  public last: ListNodeLink<T> = null;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.first = null;
    this.last = null;
  }

  public push(value: T): void {

    if (this.length < this.maxSize) {
      this.queue.add(value);

      this.syncQueue();
      this.length++;
    }
  }

  public pop(): T {
    if (!this.first) {
      throw new Error('Queue is empty');
      // return <T>"error";
    }

    // const value = this.first?.value;
    const oldFirst = this.queue.deleteFirst();

    this.length--;
    this.syncQueue();

    return <T>oldFirst;
  }

  insertFirst(value: T): LinkedList<T> {
    return this.queue.insertFirst(value);
  }

  deleteLast(): ListNodeLink<T> {
    return this.queue.deleteLast();
  }

  deleteFirst(): ListNodeLink<T> {
    return this.queue.deleteFirst();
  }

  *[Symbol.iterator](): Iterator<T> {
    yield <T>this.first?.value;

    let currentNode = this.first;

    while (currentNode) {
      currentNode = currentNode.next;
      yield <T>currentNode?.value;
    }
  }

  protected syncQueue() {
    this.first = this.queue.first;
    this.last = this.queue.last;
  }

  findContainer(key: any): ListNodeLink<T> {
    let current: ListNodeLink<any> = <ListNodeLink<T>>this.queue.first;

    if (!current) {
      return undefined;
    }

    do {
      if (current?.value![0] === key) {
        return current;
      }

      current = current?.next;
    } while (current && current!.next);

    if (current?.value![0] === key) {
      return current;
    }

    return undefined;
  }

  delete(link: ListNodeLink<T>): void {
    if (this.last === link) {
      this.deleteLast();
    } else if (this.first === link) {
      this.deleteFirst();
    } else {
      const prev = link?.prev;
      const next = link?.next;

      prev!.next = next;
      next!.prev = prev;
    }
  }

  find(value: T): ListNodeLink<T> {
    return this.queue.find(value);
  }
}
