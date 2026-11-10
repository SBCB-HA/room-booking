const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loadData(): Promise<void> {
  console.log("A: loadData starts, waits 1 s...");
  await wait(1000);
  console.log("D: loadData continues after await");
}

loadData();
console.log("B: the program did not stop");
setTimeout(() => console.log("C: still doing other work"), 300);
