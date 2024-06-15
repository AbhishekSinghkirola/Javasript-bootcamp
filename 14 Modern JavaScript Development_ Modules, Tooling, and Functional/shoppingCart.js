// Exporting Module
console.log("Exporting Module");

// Blocking Code
// console.log("Start Fetching Users");
// await fetch("https://jsonplaceholder.typicode.com/users");
// console.log("Finish Fetching Users");

const shippingCost = 10;
export const cart = [];

// It is not Possible
// if (true) {
//   export const addToCart = function (product, quantity) {
//     cart.push(product, quantity);
//     console.log(`${quantity} ${product} added to cart`);
//   };
// }

export const addToCart = function (product, quantity) {
  cart.push(product, quantity);
  console.log(`${quantity} ${product} added to cart`);
};

const totalPrice = 237;
const totalQuantity = 23;

export { totalPrice, totalQuantity as tq };

export default function (product, quantity) {
  cart.push(product, quantity);
  console.log(`${quantity} ${product} added to cart`);
}
