import { myCreateCard, createTicket } from "./utils.js";

const main = document.querySelector("#app-main");
const addCardForm = document.querySelector("#addCardForm");

// fetching savedTasks obj and converting
const savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || {};

// Displaying the tasks already saved in localStorage
for (const category in savedTasks) {
  const card = myCreateCard(category);

  savedTasks[category].forEach((task) => {
    card.insertBefore(createTicket(task), card.lastElementChild);
  });

  main.insertBefore(card, addCardForm);
}

addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const cardTitle = event.target.children[0].value;

  const card = myCreateCard(cardTitle);

  main.insertBefore(card, addCardForm);
});

// data structure of localStorage
//  {
//    "work todo": ["task 1", "task 2"],
//    progress: ["task 3"],
//  };
