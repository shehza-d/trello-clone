// fetching savedTasks obj and converting
const savedTasks = JSON.parse(localStorage.getItem("savedTasks")) || {};

let onTheMoveElm = null;

const addTask = (event) => {
  event.preventDefault();

  const currentForm = event.target; // current form element
  const value = currentForm.elements[0].value; // value written in form's input
  const parent = currentForm.parentElement; // parent of form i.e div.column
  const ticket = createTicket(value); // div to be added

  if (!value) return; // null check

  parent.insertBefore(ticket, currentForm); // adding new task before the form

  const h3Value = parent.children[0].innerText;

  if (!Array.isArray(savedTasks[h3Value])) {
    // agar array nhi hy tw khali array set karwa do kyu ky undefined ma .push() nhi ho sagta
    savedTasks[h3Value] = [];
  }

  savedTasks[h3Value].push(value);

  localStorage.setItem("savedTasks", JSON.stringify(savedTasks)); // saving data after adding each task

  currentForm.reset(); // clearing form
};

const handleDropOver = (event) => {
  // prevent default to allow drop
  event.preventDefault();
  if (event.target.className === "column") {
    event.target.classList.add("column-droppable");
  }
};

const handleDragLeave = (event) => {
  event.preventDefault();

  // console.log("event.target.className :>> ", event.target.className);
  if (event.target.className.includes("column")) {
    event.target.classList.remove("column-droppable");
  }
};

const handleDrop = (event) => {
  const droppedOver = event.target;

  const movedFrom = onTheMoveElm.parentElement.firstChild.innerText;

  if (droppedOver.className.includes("column")) {
    const form = event.target.lastElementChild;

    // todo clean up left below

    event.target.insertBefore(onTheMoveElm, form);
    event.target.classList.remove("column-droppable");
    // after shifting the ticket we will update localStorage as-well
    const movedTo = onTheMoveElm.parentElement.firstChild.innerText;

    // console.log(`🚀 ~ movedFrom: ${movedFrom} to movedTo ${movedTo}`);

    // removing task from object
    savedTasks[movedFrom] = savedTasks[movedFrom].filter(
      (task) => task !== onTheMoveElm.innerText
    );
    // adding task to new place in object
    !Array.isArray(savedTasks[movedTo])
      ? (savedTasks[movedTo] = [onTheMoveElm.innerText])
      : savedTasks[movedTo].push(onTheMoveElm.innerText);

    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  }

  if (droppedOver.className.includes("ticket")) {
    const ticketDroppedOver = event.target;
    const parentOfTicketDropped = ticketDroppedOver.parentElement;

    parentOfTicketDropped.insertBefore(onTheMoveElm, ticketDroppedOver);
    event.target.classList.remove("column-droppable");
    // after shifting the ticket we will update localStorage as-well
    let oldArr = savedTasks[movedFrom];
    const movedTo = onTheMoveElm.parentElement.firstChild.innerText;

    oldArr = oldArr.filter((task) => task !== onTheMoveElm.innerText);
    console.log("🚀 ~ handleDrop ~ oldArr:", oldArr);

    const index = Array.prototype.indexOf.call(
      parentOfTicketDropped.children,
      ticketDroppedOver
    );
    console.log("🚀 ~ handleDrop ~ index:", index);
    // removing task from object
    const newArr = [
      ...oldArr.slice(0, index),
      onTheMoveElm.innerText,
      ...oldArr.slice(index),
    ];

    console.log("🚀 ~ handleDrop ~ newArr:", newArr);

    savedTasks[movedTo] = newArr;

    localStorage.setItem("savedTasks", JSON.stringify(savedTasks));
  }
};

export const myCreateCard = (cardTitle) => {
  // This function will return a div like one below
  /* <div class="column">
			 <h3>smit</h3>
	
			 <form>
				 <input type="text" placeholder="add task" />
			 </form>
	   </div> */

  const myDiv = document.createElement("div");
  const myH3 = document.createElement("h3");
  const myForm = document.createElement("form");
  const myInput = document.createElement("input");

  const h3Text = document.createTextNode(cardTitle);

  myDiv.setAttribute("class", "column");
  myInput.setAttribute("type", "text");
  myInput.setAttribute("placeholder", "Add task");
  myInput.setAttribute("class", "box");

  myH3.appendChild(h3Text);
  myForm.appendChild(myInput);
  myDiv.appendChild(myH3);
  myDiv.appendChild(myForm);

  myDiv.addEventListener("dragover", handleDropOver);
  myDiv.addEventListener("dragleave", handleDragLeave);
  myDiv.addEventListener("drop", handleDrop);

  myForm.addEventListener("submit", addTask);

  return myDiv;
};

export const createTicket = (value) => {
  //
  const ticket = document.createElement("span");
  const elementText = document.createTextNode(value);

  ticket.setAttribute("draggable", "true");
  ticket.setAttribute("class", "ticket box");
  ticket.appendChild(elementText);

  ticket.addEventListener("mousedown", (event) => {
    // console.log("🚀 ~ ticketElm.addEventListener ~ event:", event);

    const draggedTicket = event.target;
    onTheMoveElm = draggedTicket;
  });

  return ticket;
};
