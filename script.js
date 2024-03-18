const popUp = document.getElementById("modal");

document.querySelector(".set-limit").addEventListener("click",showPopUp);
document.querySelector("#modal #close").addEventListener("click",hidePopUp);
document.querySelector("#modal #save-btn").addEventListener("click",hidePopUp);
document.querySelector("#forms #show-meal-form").addEventListener("click",toggleMealForm);
document.querySelector("#forms #show-workout-form").addEventListener("click",toggleWorkoutForm);

function showPopUp(){
popUp.style.display = "flex";
document.body.style.overflow = 'hidden';
}

function hidePopUp(){
    popUp.style.display = "none";
    document.body.style.overflow = 'auto'

}

function toggleMealForm(){
    const form = document.querySelector("#left-form form");
    form.classList.toggle("active");
}

function toggleWorkoutForm(){
    const form = document.querySelector("#right-form form");
    form.classList.toggle("active");
}


// Calorie Tracker 
class CalorieTracker{
    constructor(){
        this._calorieLimit = 2200;
        this._totalCalories = 0;
        this._meals = [];
        this._workouts = [];

        this._displayCalorieLimit();
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displaycalorieProgress();
    }

    // Public Methods
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;

        this._displayMeal(meal);

        this._renderStats();

    }

    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;

        this._displayWorkout(workout);

        this._renderStats();

    }

    // Private Methods
    _displayCalorieLimit(){
        const calorieLimitEl = document.getElementById("dly-cal-lmt");
        calorieLimitEl.innerHTML = this._calorieLimit;
    }

    _displayCaloriesTotal(){
        const caloriesTotalEl = document.getElementById("gn-loss");
        caloriesTotalEl.innerHTML = this._totalCalories;
    }

    _displayCaloriesConsumed(){
        const caloriesConsumedEl = document.getElementById("cal-consumed");
        const consumed = this._meals.reduce((total,meal)=>
            total + meal.calories,0);
        caloriesConsumedEl.innerHTML = consumed;
    }

    _displayCaloriesBurned(){
        const caloriesBurnedEl = document.getElementById("cal-burned");
        const burned = this._workouts.reduce((total,workout)=>
            total + workout.calories,0);
        caloriesBurnedEl.innerHTML = burned;
    }

    _displayCaloriesRemaining(){
        const calorieProgressEl = document.querySelector("#cd3 #progress-bar .progress-stats");

        const caloriesRemainingEl = document.getElementById("cal-remaining");
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining;
        if(remaining <= 0){
            caloriesRemainingEl.parentElement.style.backgroundColor = "#BB2D3B";
            calorieProgressEl.style.backgroundColor = "#BB2D3B";
        }
        else{
            caloriesRemainingEl.parentElement.style.backgroundColor = "#F8F9FA";
            calorieProgressEl.style.backgroundColor = "#599F3D";
        }
    }

    _displaycalorieProgress(){
        const calorieProgressEl = document.querySelector("#cd3 #progress-bar .progress-stats");
        const percentage = (this._totalCalories / this._calorieLimit) * 100;
        const width = Math.min(percentage,100);
        calorieProgressEl.style.width = `${width}%`;
    }

    _displayMeal(meal){
        const mealEls = document.querySelector("#left-form .meal-form ul");

        const mealEl = document.createElement("li");
        mealEl.classList.add("card");
        mealEl.id = "meal-li";

        mealEl.setAttribute("data-id",meal.id);

        mealEl.innerHTML = `<p id="item">${meal.name}</p>
        <strong id="calorie">${meal.calories}</strong>
        <div><button id="delete"><i class="ri-close-line"></i></button></div>`;

        mealEls.appendChild(mealEl);

    }

    _displayWorkout(workout){
        const workoutEls = document.querySelector("#right-form ul");

        const workoutEl = document.createElement("li");
        workoutEl.classList.add("card");

        workoutEl.setAttribute("data-id",workout.id);

        workoutEl.innerHTML = `<p id="item">${workout.name}</p>
        <strong id="calorie">${workout.calories}</strong>
        <div><button id="delete"><i class="ri-close-line"></i></button></div>`;

        workoutEls.appendChild(workoutEl);

    }

    _renderStats(){
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
        this._displaycalorieProgress();
    }
}

class Meal{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }

}

class Workout{
    constructor(name,calories){
        this.id = Math.random().toString(16).slice(2);
        this.name = name;
        this.calories = calories;
    }

}


class App{
    constructor(){
        this._tracker = new CalorieTracker();

       document.querySelector("#left-form form").addEventListener("submit",this._newItem.bind(this,"#left-form form"));
       document.querySelector("#right-form form").addEventListener("submit",this._newItem.bind(this,"#right-form form"));

       document.getElementById("meal-li").addEventListener("click",this._removeItem.bind(this));
    }
    
    _newItem(formType,e){
        e.preventDefault();

        const name = document.querySelector(`${formType} #name`);
        const calories = document.querySelector(`${formType} #calorie`);

        // Validate inputs
        if(name.value === "" || calories.value === ""){
            alert("Please fill all details.");
            return;
        }

        if(formType === "#left-form form"){
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        }
        else if(formType === "#right-form form"){
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

    _removeItem(e){
        if(e.target.classList.contains("ri-close-line")){
            if(confirm("You sure want to delete ?")){
                const id = e.target.closest(".card").getAttribute("data-id");
                console.log(id);
                e.target.closest(".card").remove();
            }       
        }
        else{
            console.log(false);
        }


    }

}

const app = new App();
