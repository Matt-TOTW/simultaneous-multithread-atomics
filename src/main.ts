import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Out-of-sync threads</h1>
    <div class="card">
      <button id="goWorker" type="button">Do it</button>
    </div>
    <p class="read-the-docs">
      Minimal reproduction of unexpected behaviour when using Atomics on a SharedArrayBuffer.<br /><br />
      Open the console to see the logs
    </p>
  </div>
`;

const outerWorker = new Worker(new URL('./outerWorker.ts', import.meta.url), { type: 'module' });

const button = document.querySelector<HTMLButtonElement>('#goWorker')!;

button.addEventListener('click', () => {
  outerWorker.postMessage({ workerNumber: 1 });
});
