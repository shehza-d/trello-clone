import { myCreateCard, createTicket } from "./utils.js";

const main = document.querySelector("#app-main");
const addCardForm = document.querySelector("#addCardForm");

// fetching savedTasks obj and converting
const savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || {};

//

// Displaying the tasks already saved in localStorage
for (const category in savedTasks) {
  const card = myCreateCard(category);

  savedTasks[category].forEach((task) => {
    card.insertBefore(createTicket(task), card.lastElementChild);
  });

  main.insertBefore(card, addCardForm);
}

// creating new cards
addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.target;

  const cardTitle = form.children[0].value;
  const card = myCreateCard(cardTitle);

  main.insertBefore(card, addCardForm);

  form.reset();
});

// data structure of localStorage
//  {
//    "work todo": ["task 1", "task 2"],
//    progress: ["task 3"],
//  };

let onTheMoveElm = null;

const allTickets = document.querySelectorAll(".ticket");

allTickets.forEach((ticketElm) => {
  ticketElm.addEventListener("mousedown", (event) => {
    // console.log("🚀 ~ ticketElm.addEventListener ~ event:", event);

    const draggedTicket = event.target;
    onTheMoveElm = draggedTicket;
  });
});

const columns = document.querySelectorAll(".column");

columns.forEach((columnElm) => {
  columnElm.addEventListener("dragover", (event) => {
    // prevent default to allow drop
    event.preventDefault();
    if (event.target.className === "column") {
      event.target.classList.add("column-dropable");
    }
  });

  columnElm.addEventListener("dragleave", (event) => {
    event.preventDefault();
    if (event.target.className.includes("column")) {
      event.target.classList.remove("column-dropable");
    }
  });

  columnElm.addEventListener("drop", (e) => {
    const droppedOver = e.target;

    if (droppedOver.className.includes("column")) {
      const form = e.target.lastElementChild;
      e.target.insertBefore(onTheMoveElm, form);
      event.target.classList.remove("column-dropable");
    }

    if (droppedOver.className.includes("ticket")) {
      const ticketDroppedOver = e.target;
      ticketDroppedOver.parentElement.insertBefore(
        onTheMoveElm,
        ticketDroppedOver
      );
      event.target.classList.remove("column-dropable");
    }
  });
});
