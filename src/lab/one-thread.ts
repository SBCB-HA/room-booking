setInterval(() => console.log("tick"), 300);

setTimeout(() => {
  console.log("Heavy work, 2 seconds...");
  const end = Date.now() + 2000;
  while (Date.now() < end) {}
  console.log("Done");
}, 1000);
