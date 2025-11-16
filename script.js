// select
const addNewBoard = document.getElementById("add-board");
const myBoards = document.getElementById("my-boards");

// board box
const boardBox = document.querySelector(".board-box");
const boardInput = document.getElementById("boardInput");
const createBoard = document.getElementById("new-board");
const cancelBoard = document.getElementById("btnCancel");
const logo = document.getElementById("logo-name");

const defaultBoard = document.getElementById("defaultBoard");

// adding lists
const listBox = document.querySelector(".add-list-box");
const listInput = document.getElementById("listInput");
const createList = document.getElementById("new-list");
const addList = document.getElementById("add-list"); //dynamically added button.
const cancelList = document.getElementById("listCancel");

// adding cards to list
const lists = document.querySelectorAll(".list");
const dialogBox = document.querySelector(".dialog-box");
const cancelCard = document.getElementById("cancelBtn");
const addCard = document.getElementById("addBtn");
const cardInput = document.getElementById("cardInput");
const cardContent = document.getElementById("cardContent");

let cardsContainer = null;
let draggedCard = null;

let editMode = false;
let cardBeingEdited = null;

const createElement = (element) => {
  return document.createElement(element);
};

// board functions
// save baords to localstorage
const saveBoard = () => {
  const boards = [];
  const boardSection = document.querySelectorAll(".board");

  boardSection.forEach((board) => {
    const lists = board.querySelectorAll(".list");
    const listData = [];

    lists.forEach((list) => {
      const cards = Array.from(list.querySelectorAll(".card")).map((card) => {
        const title = card.querySelector("h3")?.textContent || "";
        const text = card.querySelector("span")?.textContent || "";
        return { title, text };
      });

      listData.push({
        id: list.id,
        cards: cards,
      });
    });

    boards.push({
      id: board.id,
      content: board.innerHTML,
      lists: listData,
    });
  });

  localStorage.setItem("boards", JSON.stringify(boards));
};

// laoding board data from local storage
const loadBoards = () => {
  const existingBoards = JSON.parse(localStorage.getItem("boards") || "[]");
  if (!existingBoards.length) return;

  existingBoards.forEach((board) => {
    if (board.id === "defaultBoard") {
      const defaultLists = ["todo", "progress", "done"];
      defaultLists.forEach((listId) => {
        const list = document.getElementById(listId);
        if (list) {
          const cardsContainer = list.querySelector(".cards");
          if (cardsContainer) cardsContainer.innerHTML = "";
        }
      });

      if (board.lists) {
        board.lists.forEach((listData) => loadList(listData));
      }
      return;
    }

    if (document.getElementById(board.id)) return;

    const section = document.createElement("section");
    section.classList.add("board");

    section.id = board.id;
    section.innerHTML = board.content;
    section.style.display = "none";

    section.querySelectorAll(".cards").forEach((container) => {
      container.innerHTML = "";
    });

    document.body.insertBefore(section, boardBox);

    if (board.lists) {
      board.lists.forEach((listData) => loadList(listData));
    }

    const option = document.createElement("option");
    option.value = board.id;
    option.textContent = board.id.replace(/-/g, " ");
    myBoards.appendChild(option);
  });
};

myBoards.addEventListener("change", () => {
  const selectedId = myBoards.value;
  localStorage.setItem("currentBoard", selectedId);

  logo.textContent =
    selectedId === "defaultBoard"
      ? "My Trello Board"
      : selectedId.replace(/-/g, " ");

  const boardSection = document.querySelectorAll(".board");
  boardSection.forEach((section) => {
    section.style.display = "none";
  });
  const selectedSection = document.getElementById(selectedId);
  if (selectedSection) selectedSection.style.display = "flex";
});

window.addEventListener("DOMContentLoaded", () => {
  loadBoards();

  const savedBoard = localStorage.getItem("currentBoard") || "defaultBoard";
  myBoards.value = savedBoard;
  document.querySelectorAll(".board").forEach((section) => {
    section.style.display = "none";
  });
  const selectedSection = document.getElementById(savedBoard);
  if (selectedSection) selectedSection.style.display = "flex";

  logo.textContent =
    savedBoard === "defaultBoard"
      ? "My Trello Board"
      : savedBoard.replace(/-/g, " ");
});

addNewBoard.addEventListener("click", () => {
  showBox(boardBox, boardInput);
});

createBoard.addEventListener("click", () => {
  const boardName = boardInput.value.trim();
  if (!boardName) return;

  const boardId = boardName.replace(/\s+/g, "-");

  const section = createElement("section");
  section.classList.add("board");
  section.id = boardId;
  section.innerHTML = `
  <div class="board-header">
    <button id="add-list">+ Add Lists</button>
    <button class="delete-board">Delete Board</button>
  </div>
`;
  section.style.display = "none";
  document.body.insertBefore(section, boardBox);

  const option = createElement("option");
  option.value = boardId;
  option.textContent = boardName;
  myBoards.appendChild(option);

  boardBox.style.display = "none";

  saveBoard();
});

// delete boards
function deleteBoard(e) {
  if (!e.target.classList.contains("delete-board")) return;

  const boardSection = e.target.closest(".board");
  if (!boardSection || boardSection.id === "defaultBoard") return;

  localStorage.setItem("currentBoard", "defaultBoard");

  const boardId = boardSection.id;

  boardSection.remove();

  const optionToRemove = myBoards.querySelector(`option[value="${boardId}"]`);
  if (optionToRemove) optionToRemove.remove();

  if (myBoards.value === boardId) {
    showDefaultBoard();
  }

  saveBoard();

  window.location.reload();
}

function showDefaultBoard() {
  myBoards.value = "defaultBoard";
  localStorage.setItem("currentBoard", "defaultBoard");

  logo.textContent = "My Trello Board";

  document
    .querySelectorAll(".board")
    .forEach((b) => (b.style.display = "none"));

  const defaultBoardEl = document.getElementById("defaultBoard");
  if (defaultBoardEl) defaultBoardEl.style.display = "flex";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

cancel(cancelBoard, boardBox); //boardBox display = none;
cancel(cancelList, listBox); //listBox display = none;
cancel(cancelCard, dialogBox); //dialogBox display - none;

// diaplaying popup box for list and cards
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-list") {
    showBox(listBox, listInput);
  }
  if (e.target && e.target.classList.contains("add-btn")) {
    const listBox = e.target.closest(".list-box");
    if (listBox) {
      cardsContainer = listBox.querySelector(".cards");
      showBox(dialogBox, cardInput);
    }
  }
});

createList.addEventListener("click", () => {
  const listTitle = listInput.value.trim();
  if (!listTitle) return;

  const currentBoard = document.querySelector(
    ".board:not([style*='display: none'])"
  );
  if (!currentBoard) return;

  const listBoxEl = createElement("div");
  listBoxEl.classList.add("list-box");

  const listEl = createElement("div");
  listEl.classList.add("list");
  listEl.id = listTitle.toLowerCase();

  const header = createElement("div");
  header.classList.add("list-header");

  const h2 = createElement("h2");
  h2.textContent = listTitle;

  const deleteListBtn = createElement("button");
  deleteListBtn.classList.add("delete-list");
  deleteListBtn.textContent = "X";

  header.appendChild(h2);
  header.appendChild(deleteListBtn);

  const cards = createElement("div");
  cards.classList.add("cards");

  const addButton = createElement("button");
  addButton.classList.add("add-btn");
  addButton.textContent = "+ Add Card";

  listEl.appendChild(header);
  listEl.appendChild(cards);
  listEl.appendChild(addButton);

  listBoxEl.appendChild(listEl);

  currentBoard.appendChild(listBoxEl);

  listBox.style.display = "none";
  listInput.value = "";

  saveBoard();
});

// delete lists
function deleteList(e) {
  if (!e.target.classList.contains("delete-list")) return;

  const listBoxEl = e.target.closest(".list-box");
  const currentBoard = document.querySelector(
    ".board:not([style*='display: none'])"
  );

  if (currentBoard && currentBoard.id !== "defaultBoard" && listBoxEl) {
    listBoxEl.remove();
    saveBoard();
  }
}

// const saveCards = (listId) => {
//   const list = document.getElementById(listId);
//   if(list){
//     const cards = Array.from(list.querySelectorAll(".card")).map((card) => {
//       const title = card.querySelector("h2")?.textContent || "";
//       const text = card.querySelector("span")?.textContent || "";
//       return { title, text };
//     });
//     localStorage.setItem(listId, JSON.stringify(cards));
//   }
// };

function loadList(listData) {
  const { id: listId, cards = [] } = listData;
  const list = document.getElementById(listId);
  if (!list) return;

  const container = list.querySelector(".cards");
  container.innerHTML = "";

  cards.forEach(({ title, text }) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", true);

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = title;

    const cardText = document.createElement("span");
    cardText.textContent = text;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
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
      saveBoard();
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

// adding cards
const addNewCard = () => {
  let cardTitleValue = cardInput.value.trim();
  let cardValue = cardContent.value.trim();

  if (cardTitleValue === "" || cardValue === "") return;

  const card = createElement("div");
  card.classList.add("card");
  card.setAttribute("draggable", true);

  const cardTitle = createElement("h3");
  cardTitle.textContent = cardTitleValue;

  const cardText = createElement("span");
  cardText.textContent = cardValue;

  const btnContainer = createElement("div");
  btnContainer.classList.add("btn-container");

  const editBtn = createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");

  const deleteBtn = createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("delete-btn");

  btnContainer.appendChild(editBtn);
  btnContainer.appendChild(deleteBtn);

  card.appendChild(cardTitle);
  card.appendChild(cardText);
  card.appendChild(btnContainer);

  dragAndDrop(card);

  cardsContainer.appendChild(card);

  cardInput.value = "";
  cardContent.value = "";
  dialogBox.style.display = "none";

  saveBoard();

  deleteBtn.addEventListener("click", () => {
    card.remove();
    saveBoard();
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
      const titleEl = cardBeingEdited.querySelector("h3");
      const textEl = cardBeingEdited.querySelector("span");

      titleEl.textContent = newTitle;
      textEl.textContent = newContent;

      saveBoard();
    }
    resetDialog();
  } else {
    addNewCard();
  }
});

const resetDialog = () => {
  cardInput.value = "";
  cardContent.value = "";
  dialogBox.style.display = "none";
  addBtn.value = "Add Card";
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
      container.appendChild(draggedCard);
      saveBoard();
    }
  });
});

document.addEventListener("dragover", (e) => {
  if (e.target.classList.contains("cards")) {
    e.preventDefault();
  }
});

document.addEventListener("drop", (e) => {
  if (e.target.classList.contains("cards") && draggedCard) {
    e.target.appendChild(draggedCard);
    saveBoard();
  }
});

cardInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addNewCard();
  }
});

document.addEventListener("click", (e) => {
  deleteBoard(e);
  deleteList(e);
});
