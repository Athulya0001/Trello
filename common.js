// escape key function for cancel box function
function showBox(targetBox,inputBtn) {
  targetBox.style.display = "flex";
  inputBtn.focus();

  const escHandler = (e) => {
    if (e.key === "Escape") {
      targetBox.style.display = "none";
      window.removeEventListener("keydown", escHandler);
    }
  };

  window.addEventListener("keydown", escHandler);
}

// cancel function
function cancel(btn, targetBox) {
  btn.addEventListener("click", () => {
    targetBox.style.display = "none";
  });
}