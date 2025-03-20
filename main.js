const myBtn = document.querySelector(".button");
const h1 = document.querySelector(".string");
let input = document.querySelector(".input");

myBtn.addEventListener("click", function () {
  h1.innerHTML = input.value
    .split("")
    .map(
      (char, index) =>
        `<span draggable="true" data-index="${index}">${char}</span>`
    )
    .join("");
  input.value = "";
});

function toggleSelect(span) {
  span.classList.toggle("selected");
}

function singleSelect(span) {
  let selected = h1.querySelectorAll(".selected");
  selected.forEach((char) => char.classList.remove("selected"));
  span.classList.add("selected");
}

let isSelecting = false;

h1.addEventListener("mousedown", function (event) {
  if (event.target.tagName !== "SPAN") {
    return;
  }

  isSelecting = true;
  event.ctrlKey || event.metaKey
    ? toggleSelect(event.target)
    : singleSelect(event.target);
});

h1.addEventListener("mouseup", () => (isSelecting = false));
h1.addEventListener("mouseleave", () => (isSelecting = false));

h1.addEventListener("mousemove", function (event) {
  if (!isSelecting) return;
  const span = event.target;
  if (span.tagName === "SPAN") {
    toggleSelect(span);
  }
});

let draggedSpan = null;

h1.addEventListener("dragstart", function (event) {
  if (event.target.tagName === "SPAN") {
    draggedSpan = event.target;
    event.dataTransfer.setData("text/plain", draggedSpan.dataset.index);
    setTimeout(() => {
      draggedSpan.style.visibility = "hidden";
    }, 0);
  }
});

h1.addEventListener("dragover", (event) => event.preventDefault());

h1.addEventListener("drop", function (event) {
  event.preventDefault();
  if (event.target.tagName === "SPAN" && draggedSpan) {
    const dropTarget = event.target;

    if (draggedSpan !== dropTarget) {
      // Міняємо місцями елементи в DOM
      let parent = h1;
      let children = Array.from(parent.children);
      let fromIndex = children.indexOf(draggedSpan);
      let toIndex = children.indexOf(dropTarget);

      parent.insertBefore(
        draggedSpan,
        fromIndex > toIndex ? dropTarget : dropTarget.nextSibling
      );

      // Оновлюємо індекси
      Array.from(h1.children).forEach(
        (span, index) => (span.dataset.index = index)
      );

      draggedSpan.style.visibility = "visible";
      draggedSpan = null;
    }
  }
});
