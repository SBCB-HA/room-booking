// When a promise fails: someone must catch it.
const failLater = () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error("bookings.json not found")), 500));

// 1. With a catcher: the failure is handled, the program goes on
try {
  await failLater();
} catch (err) {
  console.log("1. Caught:", (err as Error).message);
}
console.log("2. Still running after a caught failure");

// 2. Without a catcher: Node stops the whole program
failLater();
console.log("3. This line runs... then the uncaught failure arrives");
