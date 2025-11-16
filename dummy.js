

// new one==============

// DOM Elements
const boardSelect = document.getElementById("my-boards");
const addBoardBtn = document.getElementById("add-board");
const boardBox = document.querySelector(".board-box");
const newBoardInput = document.getElementById("boardInput");
const newBoardSubmit = document.getElementById("new-board");
const btnCancel = document.getElementById("btnCancel");

const defaultBoard = document.getElementById("defaultBoard");

// -----------------------
// LOCAL STORAGE HELPERS
// -----------------------
function saveBoardsToLocalStorage() {
  const boards = [];
  document.querySelectorAll(".trello-board").forEach((board) => {
    boards.push({
      id: board.id,
      content: board.innerHTML,
    });
  });
  localStorage.setItem("boards", JSON.stringify(boards));
}

function loadBoardsFromLocalStorage() {
  const savedBoards = JSON.parse(localStorage.getItem("boards") || "[]");
  if (!savedBoards.length) return;

  // Clear existing boards except default
  document.querySelectorAll(".trello-board").forEach((board) => {
    if (board.id !== "defaultBoard") board.remove();
  });

  // Clear select options except default
  while (boardSelect.options.length > 1) {
    boardSelect.remove(1);
  }

  savedBoards.forEach((board) => {
    // Skip default board (already exists)
    if (board.id === "defaultBoard") {
      defaultBoard.innerHTML = board.content;
      return;
    }

    // Create section
    const section = document.createElement("section");
    section.classList.add("trello-board");
    section.id = board.id;
    section.innerHTML = board.content;
    section.style.display = "none";
    document.body.insertBefore(section, boardBox);

    // Add option to select
    const option = document.createElement("option");
    option.value = board.id;
    option.textContent = board.id.replace(/-/g, " ");
    boardSelect.appendChild(option);
  });
}

// -----------------------
// BOARD SWITCH FUNCTION
// -----------------------
boardSelect.addEventListener("change", () => {
  const selectedBoardId = boardSelect.value;
  document.querySelectorAll(".trello-board").forEach((section) => {
    section.style.display = "none";
  });
  const selectedSection = document.getElementById(selectedBoardId);
  if (selectedSection) selectedSection.style.display = "flex";
});

// -----------------------
// ADD NEW BOARD
// -----------------------
addBoardBtn.addEventListener("click", () => {
  boardBox.style.display = "flex";
  newBoardInput.value = "";
});

btnCancel.addEventListener("click", () => {
  boardBox.style.display = "none";
});

newBoardSubmit.addEventListener("click", () => {
  const boardName = newBoardInput.value.trim();
  if (!boardName) return;

  const boardId = boardName.replace(/\s+/g, "-");

  // Create new board section (empty)
  const section = document.createElement("section");
  section.classList.add("trello-board");
  section.id = boardId;
  section.innerHTML = `<div class="list-box"><p>No lists yet. Add your cards!</p></div>`;
  section.style.display = "none";
  document.body.insertBefore(section, boardBox);

  // Add new option to select
  const option = document.createElement("option");
  option.value = boardId;
  option.textContent = boardName;
  boardSelect.appendChild(option);

  // Hide dialog
  boardBox.style.display = "none";

  // Save boards to localStorage
  saveBoardsToLocalStorage();
});

// -----------------------
// INITIAL LOAD
// -----------------------
window.addEventListener("DOMContentLoaded", () => {
  loadBoardsFromLocalStorage();
});

// second onee========
