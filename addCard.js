// popup
const lists = document.querySelectorAll(".list");
const dialogBox = document.querySelector(".dialog-box");
const cancelBtn = document.getElementById("cancelBtn");
const addBtn = document.getElementById("addBtn");
const cardInput = document.getElementById("cardInput");
const cardContent = document.getElementById("cardContent");
// const defaultBoard = document.querySelector(".trello-board");

let cardsContainer = null;
let draggedCard = null;

let editMode = false;
let cardBeingEdited = null;

// const saveList = (listId) => {
//   const list = document.getElementById(listId);
//   const cards = Array.from(list.querySelectorAll(".card")).map((card) => {
//     const title = card.querySelector("h2")?.textContent || "";
//     const text = card.querySelector("span")?.textContent || "";
//     return { title, text };
//   });
//   localStorage.setItem(listId, JSON.stringify(cards));
// };

function loadList(listData) {
  const { id: listId, cards = [] } = listData;
  console.log(listData);
  const list = document.getElementById(listId);
  const container = list.querySelector(".cards");

  container.innerHTML = "";

  cards.forEach(({ title, text }) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);

    const cardTitle = document.createElement("h2");
    cardTitle.textContent = title;

    const cardText = document.createElement("span");
    cardText.textContent = text;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    card.appendChild(cardTitle);
    card.appendChild(cardText);
    card.appendChild(btnContainer);

    dragAndDrop(card);
    container.appendChild(card);

    deleteBtn.addEventListener("click", () => {
      card.remove();
      saveList(listId);
    });

    editBtn.addEventListener("click", () => {
      dialogBox.style.display = "flex";
      cardInput.value = cardTitle.textContent;
      cardContent.value = cardText.textContent;
      addBtn.value = "Save";

      editMode = true;
      cardBeingEdited = card;
    });
  });
}


["todo", "progress", "done"].forEach(loadList);

lists.forEach((list) => {
  const addCard = list.querySelector(".add-btn");
  const cards = list.querySelector(".cards");

  addCard.addEventListener("click", () => {
    cardsContainer = cards;
    dialogBox.style.display = "flex";
  });
});

cancelBtn.addEventListener("click", () => {
  dialogBox.style.display = "none";
  cardInput.value = "";
  cardContent.value = "";
});

const add = () => {
  let cardTitleValue = cardInput.value.trim();
  let cardValue = cardContent.value.trim();

  if (cardTitleValue === "" || !cardsContainer) return;

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", true);

  const cardTitle = document.createElement("h2");
  cardTitle.textContent = cardTitleValue;

  const cardText = document.createElement("span");
  cardText.textContent = cardValue;

  const btnContainer = document.createElement("div");
  btnContainer.classList.add("btn-container");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  card.appendChild(cardTitle);
  card.appendChild(cardText);
  card.appendChild(btnContainer);

  dragAndDrop(card);

  cardsContainer.appendChild(card);

  const parentListId = cardsContainer.parentElement.id;
  saveList(parentListId);

  cardInput.value = "";
  cardContent.value = "";
  dialogBox.style.display = "none";

  deleteBtn.addEventListener("click", () => {
    card.remove();
    saveList(parentListId);
  });

  editBtn.addEventListener("click", () => {
    dialogBox.style.display = "flex";
    cardInput.value = cardTitleValue;
    cardContent.value = cardValue;
    addBtn.value = "Save";

    editMode = true;
    cardBeingEdited = card;
  });
};

addBtn.addEventListener("click", () => {
  if (editMode && cardBeingEdited) {
    const newTitle = cardInput.value.trim();
    const newContent = cardContent.value.trim();

    if (newTitle !== "") {
      const titleEl = cardBeingEdited.querySelector("h2");
      const textEl = cardBeingEdited.querySelector("span");

      titleEl.textContent = newTitle;
      textEl.textContent = newContent;

      const parentListId = cardBeingEdited.closest(".list").id;
      saveList(parentListId);
    }
    resetDialog();
  } else {
    add();
  }
});

const resetDialog = () => {
  cardInput.value = "";
  cardContent.value = "";
  dialogBox.style.display = "none";
  addBtn.value = "Add";
  editMode = false;
  cardBeingEdited = null;
};

function dragAndDrop(card) {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    setTimeout(() => card.classList.add("hide"), 0);
  });

  card.addEventListener("dragend", () => {
    draggedCard.classList.remove("hide");
    draggedCard = null;
  });
}

lists.forEach((list) => {
  const container = list.querySelector(".cards");

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  container.addEventListener("drop", () => {
    if (draggedCard) {
      const sourceListId = draggedCard.parentElement.parentElement.id;
      container.appendChild(draggedCard);

      const targetListId = list.id;
      saveList(sourceListId);
      saveList(targetListId);
    }
  });
});

cardInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    add();
  }
});
