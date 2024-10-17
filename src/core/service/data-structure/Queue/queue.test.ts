import {describe, expect, it} from '@jest/globals';
import Queue from './Queue';

describe('Queue create', function () {

  it('empty queue', () => {
    const queue = new Queue(3);
    expect(queue.length === 3);
  });
});

describe('Queue functions', function () {
  const queue = new Queue(4);

  queue.push(10);
  queue.push(11);
  queue.push(12);

  it('Queue read first element without pop', () => {
    expect(queue.first?.value === 10);
  });

  it('Queue can pop first element', () => {
    const first = queue.pop();
    expect(first === 10);
  });

  it('first element changed to 11', () => {
    expect(queue.first?.value === 11);
  });

  it('Queue can pop first element', () => {
    const first = queue.pop();
    expect(first === 11);
  });

  it('Queue can pop first element', () => {
    const first = queue.pop();
    expect(first === 12);
  });

  it('Queue is empty', () => {
    const t = () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const last = queue.pop();
    };
    expect(t).toThrow(Error);
  });
});
