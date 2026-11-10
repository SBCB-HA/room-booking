const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const work = (ms: number) => {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // keeps V8 busy
};

// A. Three waits, one after another
console.time("A. 3 waits, one by one");
await wait(1000);
await wait(1000);
await wait(1000);
console.timeEnd("A. 3 waits, one by one"); // about 3 s

// B. Three waits, all at the same time
console.time("B. 3 waits, together");
await Promise.all([wait(1000), wait(1000), wait(1000)]);
console.timeEnd("B. 3 waits, together"); // about 1 s

// C. Three computations, "at the same time"
console.time("C. 3 computations, together");
await Promise.all([1, 2, 3].map(async () => work(1000)));
console.timeEnd("C. 3 computations, together"); // still about 3 s
