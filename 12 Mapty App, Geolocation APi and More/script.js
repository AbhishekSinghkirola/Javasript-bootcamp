"use strict";

/**
 * Mapty App
 *
 * 1. Project Planning
 * 2. Using Geolocation API
 * 3. Display a map using leaflet library
 * 4. Display a Map Marker
 * 5. REndering Workout Input Form
 * 6. Project Architecture
 * 7. Refactoring For Project Architecture
 * 8. Managing Workout Data : Creating Classes
 * 9. Creating a New Workout
 * 10. Rendering Workouts
 * 11. Move to Marker On Click
 * 12. Working With Local Storage API
 * 13. Final Considerations
 *
 */

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// let map, mapEvent;

/**
 * 8. Managing Workout Data : Creating Classes
 */
class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);
  clicks = 0;
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; //in km
    this.duration = duration; //in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }

  click() {
    this.clicks++;
  }
}

class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;

    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    //  min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178);
// const cycling1 = new Cycling([39, -12], 27, 95, 520);

// console.log(run1, cycling1);

/**
 * 7. Refactoring For Project Architecture
 */
// Application Architecture
class App {
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  constructor() {
    // Get User's Position
    this._getPosition();

    // Get data from Local Storage
    this._getLocalStorage();

    // Attach Event Handlers
    form.addEventListener("submit", this._newWorkout.bind(this));
    inputType.addEventListener("change", this._toggleElevationFeild);
    containerWorkouts.addEventListener("click", this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Could not get yout position");
        }
      );
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    // Show Leaflet Map
    this.#map = L.map("map").setView(coords, this.#mapZoomLevel);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));

    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationFeild() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    e.preventDefault();
    /**
     * 9. Creating a New Workout
     */

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === "running") {
      const cadence = +inputCadence.value;
      console.log(distance);

      // Check if data is valid
      //   if (
      //     !Number.isFinite(distance) ||
      //     !Number.isFinite(duration) ||
      //     !Number.isFinite(cadence)
      //   )
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert("Inputs have to be positive Numbers");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // If workout cycling, create cycling object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      // Check if data is valid
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      )
        return alert("Inputs have to be positive Numbers");
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);
    console.log(this.#workouts);

    // Render workout on a map as marker
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    //  Hide Form +  Clear input feilds
    this._hideForm();

    // Set Local Storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"} ${workout.description}`
      )
      .openPopup();
  }

  /**
   *
   * 10. Rendering Workouts
   */
  _renderWorkout(workout) {
    let html = `
    <li class="workout workout--${workout.type}" data-id="${workout.id}">
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">${
          workout.type === "running" ? "🏃‍♂️" : "🚴‍♀️"
        }</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    if (workout.type === "running") {
      html += `
          <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;
    }

    if (workout.type === "cycling") {
      html += `
       <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevation}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      `;
    }

    form.insertAdjacentHTML("afterend", html);
  }

  /**
   * 11. Move to Marker On Click
   */
  _moveToPopup(e) {
    const workoutEl = e.target.closest(".workout");
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      (work) => work.id === workoutEl.dataset.id
    );

    // console.log(workout);

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // Using Public Interface
    // workout.click();
    // console.log(workout);
  }

  /**
   * 12. Working With Local Storage API
   */
  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts"));
    // console.log(data);

    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach((work) => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem("workouts");
    location.reload();
  }
}

const app = new App();

// /**
//  * 2. Geolocation API
//  */
// if (navigator.geolocation)
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       //   console.log(position);
//       const { latitude, longitude } = position.coords;

//       //   console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
//       const coords = [latitude, longitude];

//       /**
//        * 3. Display a Map Using Leaflet Library
//        */
//       // Show Leaflet Map
//       map = L.map("map").setView(coords, 13);
//       //   console.log(map);

//       L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       /**
//        * 4. Display a Map Marker
//        */
//       //   Hadling Click on map
//       map.on("click", function (mapE) {
//         mapEvent = mapE;
//         form.classList.remove("hidden");
//         inputDistance.focus();
//       });
//     },

//     function () {
//       alert("Could not get yout position");
//     }
//   );

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   //   Clear input feilds
//   inputDistance.value =
//     inputDuration.value =
//     inputCadence.value =
//     inputElevation.value =
//       "";
//   // Display Marker
//   //   console.log(mapEvent);
//   const { lat, lng } = mapEvent.latlng;
//   L.marker([lat, lng])
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         maxWidth: 250,
//         minWidth: 100,
//         autoClose: false,
//         closeOnClick: false,
//         className: "running-popup",
//       })
//     )
//     .setPopupContent("Workout")
//     .openPopup();
// });

// inputType.addEventListener("change", function () {
//   inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
//   inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
// });

/**
 * 1. user stories
 *
 * Description of the applications's functionality from the user's perspective. All user stories put together describe the entire application
 *
 *
 * 2. Features
 *
 * 3. Flowchart
 *
 * what we build
 *
 * 4. Architecture
 *
 * How we will build it
 *
 * 5. Development Step
 *
 * Implemention of our plan code
 *
 *
 * User Stories :
 *
 * 1. As a user, I want to log my running workouts with location, distance, time, pace and steps/minutes, so i can log of all my running
 * 2. As a user, I want to log my cycling workout with location, distance, time , speed and elevation gain. so i can keep a log of all my cycling
 * 3. As a user, I want to see all my workouts at a glance , so i can easily track my progress over time
 * 4. As a user, I want to also see my workouts on a map,so i can easily check where i work out the most
 * 5. As a user, I want to see all my workoutes when i leave the app and come bck later. so that i can keep using the over time
 *
 *
 *
 * Features:
 *
 * 1. User story
 * 1.1. Map where user clicks to add new workout (best way to get location coordinates)
 * 1.2. Geoloaction to display map at current location (more user freindly)
 * 1.3. Form to input distance, time, pace, steps/minutes
 *
 * 2. User Story
 * 2.1. Form to input distance, time, speed, eleveation gain
 *
 * 3. user Story
 * 3.1. Display all workouts in a list
 *
 * 4. User story
 * 4.1. Diplay all workouts on map
 *
 * 5. user story
 * 5.1. store workout data in the browser using local storeage APi
 *
 *
 * Flow Chart :
 * 1. Geoloaction to display map at current location
 * 2. Map where user clicks to add new workout
 * 3. Form to input distance, time , pace, steps/minutes
 * 4. Form to input distance, time , pace, elevation gain
 * 5. Display Workouts in a list
 * 6. Display Workouts on the map
 * 7. Store workout data in the browser
 * 8. on page load, read the saved data and display
 * 9. Move the map to workout location on click
 *
 *
 *
 * Architecture :
 *
 */

/**
 * 6. Project Architecture
 *
 */

/**
 * 13. Final Considerations
 *
 * challenges
 *
 * -- Ability to edit a workout
 * -- Ability to delete a workou
 * -- Ability to delete all workouts
 * -- Ability to sort workouts by a certain deild (eg: distance)
 * -- Re-build Running and Cycling objects coming from Local Storage
 * -- More Realstic error and confirmation messages
 *
 * -- Ability to position the map to show all the workout
 * -- Ability to draw lines and shapes instead of just points
 *
 * -- Geocode location from coordinates ("Run in Faro, protugal")
 * -- Display weather data for workout time and place
 */
