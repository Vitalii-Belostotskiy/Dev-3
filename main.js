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
    ? toggleSelect(event.target)  // Якщо натиснуто Ctrl, виділяється кілька елементів
    : singleSelect(event.target);  // В іншому випадку - лише один
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

let draggedSpans = [];  // Масив для збереження виділених елементів

h1.addEventListener("dragstart", function (event) {
  if (event.target.tagName === "SPAN") {
    draggedSpans = getSelectedSpans(); // Збираємо всі виділені елементи
    event.dataTransfer.setData("text/plain", JSON.stringify(draggedSpans.map(span => span.dataset.index)));
  }
});

h1.addEventListener("dragover", (event) => event.preventDefault());  // Дозволяємо падіння елементів

h1.addEventListener("drop", function (event) {
  event.preventDefault();

  if (event.target.tagName === "SPAN" && draggedSpans.length > 0) {
    const dropTarget = event.target;

    // Отримуємо всіх дітей (літер) та їхні індекси
    const parent = h1;
    const children = Array.from(parent.children);
    const fromIndexes = draggedSpans.map(span => children.indexOf(span)); // Індекси переміщуваних літер
    const toIndex = children.indexOf(dropTarget);

    draggedSpans.forEach((draggedSpan, idx) => {
      const fromIndex = fromIndexes[idx];
      parent.insertBefore(draggedSpan, fromIndex > toIndex ? dropTarget : dropTarget.nextSibling);
    });

    // Оновлюємо індекси для всіх символів у DOM
    Array.from(h1.children).forEach((span, index) => (span.dataset.index = index));

    draggedSpans = []; // Очищаємо масив переміщених елементів
  }
});

function getSelectedSpans() {
  return Array.from(h1.querySelectorAll('.selected'));
}
