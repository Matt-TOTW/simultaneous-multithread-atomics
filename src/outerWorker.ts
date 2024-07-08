const innerWorker = new Worker(new URL('./innerWorker.ts', import.meta.url), { type: 'module' });

const sharedArray = new SharedArrayBuffer(8);
const typedArray = new Int32Array(sharedArray); // typedArray has 2 slots
const resultSlot = 0;
const watchSlot = 1;

innerWorker.postMessage({ typedArray });

const opRun = (workerNumber: number, i: number) => {
  Atomics.store(typedArray, resultSlot, -1);
  Atomics.store(typedArray, watchSlot, 1);
  Atomics.notify(typedArray, watchSlot);

  const waitResult = Atomics.wait(typedArray, resultSlot, -1);
  const result = Atomics.load(typedArray, resultSlot);

  if (result === -1) {
    throw new Error(
      `Atomics.load() should not be -1, but it is. Wait result was '${waitResult}': in worker ${workerNumber} on iteration ${i}.`
    );
  }
};

onmessage = (event: MessageEvent<{ workerNumber: number }>) => {
  const { workerNumber } = event.data;
  console.log('Starting in worker', workerNumber);

  for (let i = 0; i < 10_000; i++) {
    opRun(workerNumber, i);
  }

  console.log('Done in worker', workerNumber);
};
