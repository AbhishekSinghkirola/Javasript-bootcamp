// Importing Module
// import { addToCart, totalPrice as price, tq } from "./shoppingCart.js";

// console.log("Importing Module");

// // console.log(shippingCost); // if we dont export we cannot use becz in modules all top level were private to it

// addToCart("bread", 5);
// console.log(price);
// console.log(tq);

// import * as shoppingCart from "./shoppingCart.js";
// // console.log(shoppingCart);
// shoppingCart.addToCart("bread", 5);
// console.log(shoppingCart.totalPrice);
// console.log(shoppingCart.tq);

// import add, { addToCart, totalPrice as price, tq } from "./shoppingCart.js";
// console.log(price);

// import add, { cart } from "./shoppingCart.js";

// add("bread", 5);
// // add("pizza", 2);
// // add("aplles", 4);

// console.log(cart);

/**
 * 4. Top Level Await
 *
 * It Blocks The Execution becz it is outside the async function
 */

// const res = await fetch("https://jsonplaceholder.typicode.com/posts");
// const data = await res.json();

// console.log(data);
// console.log("something");

// const getLastPost = async function () {
//   const res = await fetch("https://jsonplaceholder.typicode.com/posts");
//   const data = await res.json();

//   return { title: data.at(-1).title, text: data.at(-1).body };
// };

// const lastPost = getLastPost();
// console.log(lastPost);

// // Not very Claean
// // lastPost.then((last) => console.log(last));

// const lastPost2 = await getLastPost();
// console.log(lastPost2);

/**
 * 5. Module Pattern
 */

// const shoppingCart2 = (function () {
//   const cart = [];
//   const shippingCost = 10;
//   const totalPrice = 237;
//   const totalQuantity = 23;

//   const addToCart = function (product, quantity) {
//     cart.push(product, quantity);
//     console.log(
//       `${quantity} ${product} added to cart (shipping cost is ${shippingCost})`
//     );
//   };

//   const orderStock = function (product, quantity) {
//     cart.push(product, quantity);
//     console.log(`${quantity} ${product} ordered ffrom supplier`);
//   };

//   return {
//     addToCart,
//     cart,
//     totalPrice,
//     totalQuantity,
//   };
// })();

// shoppingCart2.addToCart("apple", 4);
// shoppingCart2.addToCart("pizza", 2);

// console.log(shoppingCart2);
// console.log(shoppingCart2.shippingCost);

/**
 * 6. Common JS Module
 */

// Export
// export.addToCart = function (product, quantity) {
//     cart.push(product, quantity);
//     console.log(
//       `${quantity} ${product} added to cart (shipping cost is ${shippingCost})`
//     );
//   };

// Import
// const { addToCart } = require("./shoppingCart.js");

/**
 * 7. A brief Introduction to command Line
 *
 * -- dir
 * -- cd ../..
 * -- cd ..
 * -- cd filename
 * -- touch
 *
 */

/**
 * 8. Introduction to NPM
 */

// import cloneDeep from "./node_modules/lodash-es/cloneDeep.js";

// const state = {
//   caer: [
//     { product: "bread", quantity: 5 },
//     { product: "pizza", quantity: 2 },
//   ],
//   user: { loggedIn: true },
// };

// const stateClone = Object.assign({}, state);

// console.log(stateClone);

// const stateDeepClone = cloneDeep(state);
// state.user.loggedIn = false;
// console.log(stateDeepClone);

/**
 * 9. Bundling With Parcel and NPM Scripts
 */

// import cloneDeep from "lodash-es";
// const state = {
//   caer: [
//     { product: "bread", quantity: 5 },
//     { product: "pizza", quantity: 2 },
//   ],
//   user: { loggedIn: true },
// };

// const stateClone = Object.assign({}, state);

// console.log(stateClone);

// const stateDeepClone = cloneDeep(state);
// state.user.loggedIn = false;
// console.log(stateDeepClone);

// if (module.hot) {
//   module.hot.accept();
// }

/**
 * 10. Configuring Babel and Polyfiling
 */

// import "core-js/stable";
// import "core-js/stable/array/find"
// import "core-js/stable/promise"

// Polyfilling async functions
// import "regenerator-runtime/runtime"