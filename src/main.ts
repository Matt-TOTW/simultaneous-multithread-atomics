import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Simultaneous Atomics</h1>
    <div class="card">
      <button id="goWorker1" type="button">Go worker 1</button>
      <button id="goWorker2" type="button">Go worker 2</button>
      <button id="goWorker3" type="button">Go both</button>
    </div>
    <p class="read-the-docs">
      Minimal reproduction of unexpected behaviour when using Atomics on distinct SharedArrayBuffers simultaneously.<br /><br />
      Open the console to see the logs
    </p>
  </div>
`;

const outerWorker1 = new Worker(new URL('./outerWorker.ts', import.meta.url), { type: 'module' });
const outerWorker2 = new Worker(new URL('./outerWorker.ts', import.meta.url), { type: 'module' });

const button1 = document.querySelector<HTMLButtonElement>('#goWorker1')!;
const button2 = document.querySelector<HTMLButtonElement>('#goWorker2')!;
const button3 = document.querySelector<HTMLButtonElement>('#goWorker3')!;

button1.addEventListener('click', () => {
  outerWorker1.postMessage({ workerNumber: 1 });
});
button2.addEventListener('click', () => {
  outerWorker2.postMessage({ workerNumber: 2 });
});
button3.addEventListener('click', () => {
  outerWorker1.postMessage({ workerNumber: 1 });
  outerWorker2.postMessage({ workerNumber: 2 });
});
