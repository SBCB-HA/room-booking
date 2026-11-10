setTimeout(() => console.log("2: timer, 0 ms"), 0);

const end = Date.now() + 1000;
while (Date.now() < end) {} // V8 busy for 1 s
console.log("1: synchronous code done");
