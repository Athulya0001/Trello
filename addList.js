// adding lists
const listBox = document.querySelector(".add-list-box");
const listInput = document.getElementById("listInput");
const createList = document.getElementById("new-list");
const addList = document.getElementById("add-list"); //dynamically added button.
const cancelList = document.getElementById("listCancel");

cancel(cancelList, listBox); //listBox display = none

// adding list
document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-list") {
    listBox.style.display = "flex";
    listInput.value = "";
  }
});


createList.addEventListener("click", () => {
  const listTitle = listInput.value.trim();
  if (!listTitle) return;

  const currentBoard = document.querySelector(
    ".board:not([style*='display: none'])"
  );
  if (!currentBoard) return;

  const listBoxEl = document.createElement("div");
  listBoxEl.classList.add("list-box");

  const listEl = document.createElement("div");
  listEl.classList.add("list");

  const h2 = document.createElement("h2");
  h2.textContent = listTitle;

  const cards = document.createElement("div");
  cards.classList.add("cards");

  const addButton = document.createElement("button");
  addButton.classList.add("add-btn");
  addButton.textContent = "+ Add Card";

  listEl.appendChild(h2);
  listEl.appendChild(cards);
  listEl.appendChild(addButton);

  listBoxEl.appendChild(listEl);

  currentBoard.appendChild(listBoxEl);

  listBox.style.display = 'none';
  listInput.value = '';

  saveBoard()
});
