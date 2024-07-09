const innerWorker = new Worker(new URL('./innerWorker.ts', import.meta.url), { type: 'module' });

const sharedArray = new SharedArrayBuffer(8);
const typedArray = new Int32Array(sharedArray); // typedArray has 2 slots
const resultSlot = 0;
const watchSlot = 1;

innerWorker.postMessage({ typedArray });

const longPause = () => {
  for (let j = 0; j < 1_000_000; j++);
};

const opRun = (workerNumber: number, runNumber: number) => {
  Atomics.store(typedArray, resultSlot, -1);
  Atomics.store(typedArray, watchSlot, 1);
  Atomics.notify(typedArray, watchSlot);

  if (runNumber === 1) longPause();

  const waitResult = Atomics.wait(typedArray, resultSlot, -1);
  const result = Atomics.load(typedArray, resultSlot);

  if (result === -1) {
    throw new Error(
      `Atomics.load() should be 1, but it is ${result}.
      Wait result was '${waitResult}': in worker ${workerNumber} on iteration ${runNumber}. ${typedArray}`
    );
  }
};

onmessage = (event: MessageEvent<{ workerNumber: number }>) => {
  const { workerNumber } = event.data;
  console.log('Starting in worker', workerNumber);

  opRun(workerNumber, 1); // First run
  opRun(workerNumber, 2); // Second run

  console.log('Done in worker', workerNumber);
};
