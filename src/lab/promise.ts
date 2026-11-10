// Principle 5: a Promise is a promise of a future result.
const promise = new Promise<string>((resolve) => {
  setTimeout(() => resolve("5 bookings"), 1000); // the result arrives in 1 s
});

console.log("1:", promise); // the promise right now
promise.then((value) => console.log("3:", promise, "->", value));
console.log("2: the rest of the code keeps going");
