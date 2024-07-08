const resultSlot = 0;
const watchSlot = 1;

onmessage = (event: MessageEvent<{ typedArray: Int32Array }>) => {
  const { typedArray } = event.data;

  while (true) {
    Atomics.wait(typedArray, watchSlot, 0);
    Atomics.store(typedArray, watchSlot, 0);

    Atomics.store(typedArray, resultSlot, 0);
    Atomics.notify(typedArray, resultSlot);
  }
};
