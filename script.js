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
