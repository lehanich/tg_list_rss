export default function Semaphore(max: any) {
  let counter = 0;
  let waiting: any = [];
  
  const take = function() {
    if (waiting.length > 0 && counter < max){
      counter++;
      const promise = waiting.shift();
      promise.resolve();
    }
  };
  
  this.acquire = function() {
    if(counter < max) {
      counter++;
      return new Promise(resolve => {
        resolve('good');
      });
    } else {
      return new Promise((resolve, err) => {
        waiting.push({resolve: resolve, err: err});
      });
    }
  };
    
  this.release = function() {
    counter--;
    take();
  };
  
  this.purge = function() {
    const unresolved = waiting.length;
  
    for (let i = 0; i < unresolved; i++) {
      waiting[i].err('Task has been purged.');
    }
  
    counter = 0;
    waiting = [];
    
    return unresolved;
  };
}
