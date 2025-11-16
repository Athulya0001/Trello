// select
const addNewBoard = document.getElementById("add-board");
const myBoards = document.getElementById("my-boards");

// board box
const boardBox = document.querySelector(".board-box");
const boardInput = document.getElementById("boardInput");
const createBoard = document.getElementById("new-board");
const cancelBoard = document.getElementById("btnCancel");

const defaultBoard = document.getElementById("defaultBoard");

const saveBoard = () => {
  const boards = [];
  const boardSection = document.querySelectorAll(".board");
  boardSection.forEach((board) => {
    boards.push({
      id: board.id,
      content: board.innerHTML,
    });
  });
  localStorage.setItem("boards", JSON.stringify(boards));
};

const loadBoards = () => {
  const existingBoards = JSON.parse(localStorage.getItem("boards") || "[]");
  if (!existingBoards.length) return;

  existingBoards.forEach((board) => {
    if (document.getElementById(board.id)) return;

    if (board.id === "defaultBoard") {
      defaultBoard.innerHTML = board.content;
      return;
    }

    const section = document.createElement("section");
    section.classList.add("board");

    section.id = board.id;
    section.innerHTML = board.content;
    section.style.display = "none";
    document.body.insertBefore(section, boardBox);

    const option = document.createElement("option");
    option.value = board.id;
    option.textContent = board.id.replace(/-/g, " ");
    myBoards.appendChild(option);
  });
};

myBoards.addEventListener("change", () => {
  const selectedId = myBoards.value;
  localStorage.setItem("currentBoard", selectedId);
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
});

addNewBoard.addEventListener("click", () => {
  boardBox.style.display = "flex";
  boardInput.value = "";
});

// cancel function
function cancel(btn, targetBox) {
  const escHandler = (e) => {
    if (e.key === "Escape") {
      targetBox.style.display = "none";
      window.removeEventListener("keydown", escHandler);
    }
  };

  btn.addEventListener("click", () => {
    targetBox.style.display = "none";
    window.removeEventListener("keydown", escHandler);
  });

  window.addEventListener("keydown", escHandler);
}

cancel(cancelBoard, boardBox); //boardBox display = none;

createBoard.addEventListener("click", () => {
  const boardName = boardInput.value.trim();
  if (!boardName) return;

  const boardId = boardName.replace(/\s+/g, "-");

  const section = document.createElement("section");
  section.classList.add("board");
  section.id = boardId;
  section.innerHTML = `<div class="list-add">
    <button id = "add-list">+ Add Lists</button>

    </div>`;
  section.style.display = "none";
  document.body.insertBefore(section, boardBox);

  const option = document.createElement("option");
  option.value = boardId;
  option.textContent = boardName;
  myBoards.appendChild(option);

  boardBox.style.display = "none";

  saveBoard();
});

window.addEventListener("DOMContentLoaded", () => {
  loadBoards();
});
