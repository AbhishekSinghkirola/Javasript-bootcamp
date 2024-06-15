"use strict";
/**
 * INDEX
 * 1. Inro To website and refactor Modal(prevent Default and foreach)
 * 2. How The DOM Really Works
 * 3. Selecting , Creating and Deleting Elements
 * 4. Styles, Attributes and Classes
 * 5. Implementing Smooth Scrolling
 * 6. Types of Events and Events Handler
 * 7. Event Propagation , bubbling and capturing
 * 8. Event Delegation Implementing Page Navigation
 * 9. DOM Traversing
 * 10. Building a Tabbed Component
 * 11. Passing Arguments in event Handler Function
 * 12. Implementing a sticky navigation the scroll event
 * 13. A Better Way : The Intersection Observer API
 * 14. Revealing Elements on Scroll
 * 15. Lazy Loading Images
 * 16. Building a slider component
 * 17. Lifecycle DOM Events
 * 18. Efficient Script Loading : Defer and Async
 *
 */

// -------------------------------
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

/**
 * 5. Implementing Smooth Scroll
 */

btnScrollTo.addEventListener("click", function (e) {
  // Old Way
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log("Current Scroll (x/Y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "height/width of viewport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //   Scrolling
  //   window.scrollTo(
  //     s1coords.left + window.pageXOffset,
  //     s1coords.top + window.pageYOffset
  //   );

  //   window.scrollTo({
  //     left: s1coords.left + window.pageXOffset,
  //     top: s1coords.top + window.pageYOffset,
  //     behavior: "smooth",
  //   });

  // New Way
  section1.scrollIntoView({ behavior: "smooth" });
});

/**
 * 8. Event Delegation Implementing Page Navigation
 *
 */

// document.querySelectorAll(".nav__link").forEach((link) =>
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   })
// );

// 1. Add Event Listener to common parent element
// 2. Determine what element originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  //   Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

/**
 * 10. Building a Tabbed Component
 */

// tabs.forEach((t) => t.addEventListener("click", () => console.log("TAB"))); //Not Good Way
tabContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // Rmove Active for Tab and content
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Activated Tab
  clicked.classList.add("operations__tab--active");

  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

/**
 * 11. Passing Arguments in event Handler
 *
 * Menu Fade Animation

*/
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

// nav.addEventListener("mouseover", function (e) {
//   handleHover(e, 0.5);
// });

// nav.addEventListener("mouseout", function (e) {
//   handleHover(e, 1);
// });

// Passing argument into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));

nav.addEventListener("mouseout", handleHover.bind(1));

/**
 * 12. Implementing a sticky navigation the scroll event
 */
/*
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords);

window.addEventListener("scroll", function (e) {
  // console.log(e); //Scroll event is not efficient avoid it
  console.log(window.scrollY);
  if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
});
*/
/**
 * 13. A Better Way : The Intersection Observer API
 */
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   // threshold: 0.1,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/**
 *  14. Revealing Elements on Scroll
 */
const allSections = document.querySelectorAll("section");
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add("section--hidden");
});

/**
 * 15. Lazy Loading Images
 */
const imgTargets = document.querySelectorAll("img[data-src]");
// console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace source with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });

  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imageObserver.observe(img));

/**
 * 16. Building a slider component : part1
 */
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnleft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let currslide = 0;
  const maxSlide = slides.length;

  // const slider = document.querySelector(".slider");
  // slider.style.transform = "scale(0.4) translateX(-1200px)";
  // slider.style.overflow = "visible";
  // console.log(slides);
  // slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));
  // 0% 100% 200% 300%

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const nextSlide = function () {
    if (currslide === maxSlide - 1) {
      currslide = 0;
    } else {
      currslide++;
    }
    goToSlide(currslide);
    // -100% 0 100% 200%
    activateDot(currslide);
  };

  const prevSlide = function () {
    if (currslide === 0) {
      currslide = maxSlide - 1;
    } else {
      currslide--;
    }
    goToSlide(currslide);
    // -100% 0 100% 200%
    activateDot(currslide);
  };
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();
  // event Handlers
  btnRight.addEventListener("click", nextSlide);
  btnleft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    // console.log(e);
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
/**
 * 2. How DOM Relly Works
 * DOM API Organized behind the scenes
 *
 * In JS DOM all are nodes -> js Objects
 * Nodes -- element, text, comment, document
 *
 */

/**
 * 3. Selecting Creating and deleting Elements
 *
 */

// Selecting Elements
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
console.log(allSections);

document.getElementById("section--1");
const allButtons = document.getElementsByTagName("button"); //return HTML Collection and HTML collection updated when changes in dom
console.log(allButtons);

console.log(document.getElementsByClassName("btn"));

// Creating and Inserting Elements
// insertAdjacentHTML

const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent = "We use cookes for improved functionality and analytics.";
message.innerHTML =
  "We use cookes for improved functionality and analytics. <button class='btn btn--close-cookie'>Got it!</button>";

//   We also use append and prepend to move elements
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// Delete Elements
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    // message.remove();

    message.parentElement.removeChild(message); //old way called DOM Traversing
  });
*/
/**
 * 4. Styles, Attributes and Classes
 *
 */
// styles
/*
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

console.log(message.style.color); // nothing Return search only in inline style
console.log(message.style.backgroundColor);

// Computed Styles
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height); // We do not define in css but browser calculate it

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + "px";

//   CSS custom Properties or variables
document.documentElement.style.setProperty("--color-primary", "orangered");

// Attributes
const logo = document.querySelector(".nav__logo");
// Only for standard property i.e those attributes were supposed to be there if we create custom property like designer ="Abhishek" it won't work it gives us undefined
console.log(logo.alt);
console.log(logo.className);

logo.alt = "Beautiful minimalist logo";
// Non-standard
// console.log(logo.designer); //it will not register
console.log(logo.getAttribute("designer"));
logo.setAttribute("company", "Bankist");

console.log(logo.src);
console.log(logo.getAttribute("src"));

const link = document.querySelector(".nav__link--btn");
console.log(link.href);
console.log(link.getAttribute("href"));

// Data Attribute
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add("c", "d");
logo.classList.remove("c", "d");
logo.classList.toggle("c");
logo.classList.contains("c");

// Don't use
logo.className = "abhishek";
*/

/**
 * 6. Types of Events and Event Handler
 *
 */
/*
const h1 = document.querySelector("h1");

const alertH1 = function (e) {
  alert("addEventListener: Great! You are rading the heading");
  //   h1.removeEventListener("mouseenter", alertH1);
};
h1.addEventListener("mouseenter", alertH1);

setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);
// h1.onmouseenter = function (e) {
//   alert("addEventListener: Great! You are rading the heading");
// };
*/

/**
 * 7. Event Propagation ,Bubbling and Capturing
 *
 * Capturing Phase
 * when an event occurs in any element it will go to the top of the document and then traverse through all the way down where they were called this is known as capturing phase
 *
 * trarget phase
 * reaches to the where event occured
 *
 * Bubbling Phase
 * after capturing phase the event then go all the way to the top (only traverse parent) to document known as bubbling
 *
 * if we attach same listener to the parent element then the same event call for the parent also during bubblng
 *
 * event Propagation
 * Event propagates from one to another
 */
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector(".nav__link").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("Link", e.target, e.currentTarget); //e.target is where the event originated not the where the handler is attached, e.currenttarget in which event handler attached
  console.log(e.currentTarget === this);

  //   Stop Propagation
  //   e.stopPropagation();
});

document.querySelector(".nav__links").addEventListener("click", function (e) {
  this.style.backgroundColor = randomColor();
  console.log("CONTAINER", e.target, e.currentTarget);
});

document.querySelector(".nav").addEventListener(
  "click",
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log("NAV", e.target, e.currentTarget);
  },
  true
);
*/

/**
 * 9. DOM Traversing
 */
/*
const h1 = document.querySelector("h1");

// Going Downwards : child
console.log(h1.querySelectorAll(".highlight"));
// Going Downwards : Direct child
console.log(h1.childNodes); //All nodes
console.log(h1.children); // HTML Collection
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "orangered";

// Going Upwards : Parent
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(".header").style.background = "var(--gradient-secondary)";

h1.closest("h1").style.background = "var(--gradient-primary)";

// Going sideways : siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});
*/

/**
 * 17. Lifecycle DOM Events
 *
 * Lifecycle - User Enter the webpage until he/she leave it
 */
// DOMContent loaded - fired by document as soon as htm can be parsed -> HTML be download and convert to DOM tree
// It does not wait images and other resource only html and js
document.addEventListener("DOMContentLoaded", function (e) {
  console.log("HTML Parse and DOM Tree Build", e);
});

// Load event fired when all html and images and resources were parsed
window.addEventListener("load", function (e) {
  console.log("Page fully Loaded", e);
});

// Before unload event
// window.addEventListener("beforeunload", function (e) {
//   e.preventDefault();
//   console.log(e);
//   return (e.returnValue = "");
// });

/**
 * 18. Efficient Script Loading : Defer and Async
 *
 * Regular :
 * case head script
 * parsing HTML --> waiting to fetch JS --> execute js --> finish parsing
 *
 * case body end
 * Pasrsing HTML --> fetch script --> exevute
 *
 *
 * Async :
 * parsing HTML and fetch script --> execute script --> finish parsing
 *
 *
 *
 * DEFER :
 * prasing HTMl and fetxh js --> finish parsing --> execute js
 */
