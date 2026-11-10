console.log("Hi from", typeof window === "undefined" ? "Node.js" : "the browser");

let x = 5;
x = "five";
console.log("x is now:", x, `(${typeof x})`);

const rooms = [{ id: "Sky" }, { id: "Ocean" }];
console.log(rooms.map((r) => r.id));
