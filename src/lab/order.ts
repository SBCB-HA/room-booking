// Backup puzzle: inside the queue, promises jump ahead of timers.
// Predict the order. Answer: 1, 4, 3, 2
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
