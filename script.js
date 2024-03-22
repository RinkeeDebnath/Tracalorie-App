const popUp = document.getElementById("modal");

document.querySelector(".set-limit").addEventListener("click", showPopUp);
document.querySelector("#modal #close").addEventListener("click", hidePopUp);
document.querySelector("#modal #save-btn").addEventListener("click", hidePopUp);
document
  .querySelector("#forms #show-meal-form")
  .addEventListener("click", toggleMealForm);
document
  .querySelector("#forms #show-workout-form")
  .addEventListener("click", toggleWorkoutForm);

function showPopUp() {
  popUp.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function hidePopUp() {
  popUp.style.display = "none";
  document.body.style.overflow = "auto";
}

function toggleMealForm() {
  const form = document.querySelector("#left-form form");
  form.classList.toggle("active");
}

function toggleWorkoutForm() {
  const form = document.querySelector("#right-form form");
  form.classList.toggle("active");
}

// Calorie Tracker - DOM Manipulation
class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCalorieLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displaycalorieProgress();

    document.getElementById("limit").value = this._calorieLimit;
  }

  // Public Methods
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeals(meal);
    this._displayMeal(meal);
    this._renderStats();
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);

    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._renderStats();
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveWorkouts(workout);
    this._displayWorkout(workout);
    this._renderStats();
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);

    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      Storage.removeWorkout(id);
      this._renderStats();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    Storage.clearAll();
    this._renderStats();
  }

  setLimit(limit) {
    this._calorieLimit = limit;
    Storage.setCalorieLimit(limit);
    this._displayCalorieLimit();
    this._renderStats();
  }

  loadItems() {
    this._meals.forEach((meal) => {
      this._displayMeal(meal);
    });

    this._workouts.forEach((workout) => {
      this._displayWorkout(workout);
    });
  }

  // Private Methods
  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById("dly-cal-lmt");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }

  _displayCaloriesTotal() {
    const caloriesTotalEl = document.getElementById("gn-loss");
    caloriesTotalEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("cal-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumedEl.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("cal-burned");
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurnedEl.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const calorieProgressEl = document.querySelector(
      "#cd3 #progress-bar .progress-stats"
    );

    const caloriesRemainingEl = document.getElementById("cal-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;
    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.style.backgroundColor = "#BB2D3B";
      calorieProgressEl.style.backgroundColor = "#BB2D3B";
    } else {
      caloriesRemainingEl.parentElement.style.backgroundColor = "#F8F9FA";
      calorieProgressEl.style.backgroundColor = "#599F3D";
    }
  }

  _displaycalorieProgress() {
    const calorieProgressEl = document.querySelector(
      "#cd3 #progress-bar .progress-stats"
    );
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    calorieProgressEl.style.width = `${width}%`;
  }

  _displayMeal(meal) {
    const mealEls = document.querySelector("#left-form .meal-form ul");

    const mealEl = document.createElement("li");
    mealEl.classList.add("card");
    mealEl.id = "meal-li";

    mealEl.setAttribute("data-id", meal.id);

    mealEl.innerHTML = `<p id="item">${meal.name}</p>
        <strong id="calorie">${meal.calories}</strong>
        <div><button id="delete" class="delete" onClick="app._removeMeal(event)"><i class="ri-close-line"></i></button></div>`;

    mealEls.appendChild(mealEl);
  }

  _displayWorkout(workout) {
    const workoutEls = document.querySelector("#right-form ul");

    const workoutEl = document.createElement("li");
    workoutEl.classList.add("card");

    workoutEl.setAttribute("data-id", workout.id);

    workoutEl.innerHTML = `<p id="item">${workout.name}</p>
        <strong id="calorie">${workout.calories}</strong>
        <div><button id="delete" class="delete" onClick="app._removeWorkout(event)"><i class="ri-close-line"></i></button></div>`;

    workoutEls.appendChild(workoutEl);
  }

  _renderStats() {
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displaycalorieProgress();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

// Local Storage Manipulation
class Storage {
  // Calorie Limit
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit") === null) {
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = +localStorage.getItem("calorieLimit");
    }
    return calorieLimit;
  }

  static setCalorieLimit(calorieLimit) {
    localStorage.setItem("calorieLimit", calorieLimit);
  }

  // Total calories
  static getTotalCalories(defaultCalories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories") === null) {
      totalCalories = defaultCalories;
    } else {
      totalCalories = +localStorage.getItem("totalCalories");
    }
    return totalCalories;
  }

  static updateTotalCalories(totalCalories) {
    localStorage.setItem("totalCalories", totalCalories);
  }

  //  Meals
  static getMeals() {
    let meals;
    if (localStorage.getItem("meals") === null) {
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem("meals"));
    }
    return meals;
  }

  static saveMeals(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  // Workouts
  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts") === null) {
      workouts = [];
    } else {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    }
    return workouts;
  }

  static saveWorkouts(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

// app Initiate
class App {
  constructor() {
    this._tracker = new CalorieTracker();
    this._loadEventListeners();
    this._tracker.loadItems();
  }

  _loadEventListeners() {
    document
      .querySelector("#left-form form")
      .addEventListener("submit", this._newItem.bind(this, "#left-form form"));
    document
      .querySelector("#right-form form")
      .addEventListener("submit", this._newItem.bind(this, "#right-form form"));

    document
      .getElementById("filter-meals")
      .addEventListener(
        "keyup",
        this._filterItem.bind(this, "#left-form .card")
      );

    document
      .getElementById("filter-workouts")
      .addEventListener(
        "keyup",
        this._filterItem.bind(this, "#right-form .card")
      );

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .querySelector("#modal #save-btn")
      .addEventListener("click", this._setLimit.bind(this));
  }

  _newItem(formType, e) {
    e.preventDefault();

    const name = document.querySelector(`${formType} #name`);
    const calories = document.querySelector(`${formType} #calorie`);

    // Validate inputs
    if (name.value === "" || calories.value === "") {
      alert("Please fill all details.");
      return;
    }

    if (formType === "#left-form form") {
      const meal = new Meal(name.value, +calories.value);
      this._tracker.addMeal(meal);
    } else if (formType === "#right-form form") {
      const workout = new Workout(name.value, +calories.value);
      this._tracker.addWorkout(workout);
    }

    // Clearing form inputs
    name.value = "";
    calories.value = "";

    // Collapsing form
    const form = document.querySelector(`${formType}`);
    form.classList.remove("active");
  }

  _removeMeal(e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("ri-close-line")
    ) {
      if (confirm("You sure want to delete ?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        console.log(id);
        this._tracker.removeMeal(id);
        e.target.closest(".card").remove();
      }
    } else {
      console.log(false);
    }
  }

  _removeWorkout(e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("ri-close-line")
    ) {
      if (confirm("You sure want to delete ?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        console.log(id);
        this._tracker.removeWorkout(id);
        e.target.closest(".card").remove();
      }
    } else {
      console.log(false);
    }
  }

  _filterItem(formType, e) {
    e.preventDefault();

    const text = e.target.value.toLowerCase();
    console.log(text);

    document.querySelectorAll(`${formType}`).forEach((item) => {
      const name = item.firstElementChild.textContent;
      if (name.toLowerCase().indexOf(text) !== -1) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    document.querySelector("#left-form ul").innerHTML = "";
    document.querySelector("#right-form ul").innerHTML = "";
    document.getElementById("filter-meals").value = "";
    document.getElementById("filter-workouts").value = "";
  }

  _setLimit(e) {
    e.preventDefault();
    const dailyCalorieLimit = document.querySelector("#modal #form input");
    if (dailyCalorieLimit.value === "") {
      alert("Please add a limit");
      return;
    } else {
      this._tracker.setLimit(+dailyCalorieLimit.value);
      dailyCalorieLimit.value = "";
    }
  }
}

const app = new App();
