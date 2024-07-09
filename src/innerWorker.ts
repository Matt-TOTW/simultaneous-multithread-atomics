// SECOND THREAD

const resultSlot = 0;
const watchSlot = 1;

const longerPause = () => {
  for (let j = 0; j < 1_000_000_000; j++);
};

onmessage = (event: MessageEvent<{ typedArray: Int32Array }>) => {
  const { typedArray } = event.data;

  let iterationNumber = 1;
  while (true) {
    Atomics.wait(typedArray, watchSlot, 0);
    const value = Atomics.load(typedArray, watchSlot);
    Atomics.store(typedArray, watchSlot, 0);

    // On the second loop through, pause here so that this thread doesn't catch up
    if (iterationNumber === 2) longerPause();

    Atomics.store(typedArray, resultSlot, value);

    // On the first run, simulate a very long pause here so that the frst thread gets ahead
    if (iterationNumber === 1) longerPause();

    // This notification will fire when the first thread is waiting ON ITS SECOND RUN
    Atomics.notify(typedArray, resultSlot);
    iterationNumber++;
  }
};
