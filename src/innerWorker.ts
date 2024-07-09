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

    if (iterationNumber === 2) longerPause();

    Atomics.store(typedArray, resultSlot, value);

    if (iterationNumber === 1) longerPause();

    Atomics.notify(typedArray, resultSlot);
    iterationNumber++;
  }
};
