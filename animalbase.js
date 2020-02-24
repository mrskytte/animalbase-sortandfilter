"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAnimals;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0
};

function start() {
  console.log("ready");

  // TODO: Add event-listeners to filter and sort buttons

  // Filter buttons
  document
    .querySelector(".filter[data-filter='cat'")
    .addEventListener("click", selected => {
      filterAnimals(selected.originalTarget.dataset.filter);
    });
  document
    .querySelector(".filter[data-filter='dog'")
    .addEventListener("click", selected => {
      filterAnimals(selected.originalTarget.dataset.filter);
    });
  document
    .querySelector("[data-filter='*'")
    .addEventListener("click", selected => {
      filterAnimals(selected.originalTarget.dataset.filter);
    });

  // Sort buttons
  document
    .querySelector("[data-action='sort'][data-sort='name']")
    .addEventListener("click", selected => {
      sortAnimals(selected.originalTarget.dataset);
    });

  document
    .querySelector("[data-action='sort'][data-sort='type']")
    .addEventListener("click", selected => {
      sortAnimals(selected.originalTarget.dataset);
    });

  document
    .querySelector("[data-action='sort'][data-sort='desc']")
    .addEventListener("click", selected => {
      sortAnimals(selected.originalTarget.dataset);
    });

  document
    .querySelector("[data-action='sort'][data-sort='age']")
    .addEventListener("click", selected => {
      sortAnimals(selected.originalTarget.dataset);
    });

  loadJSON();
}

async function loadJSON() {
  const response = await fetch("animals.json");
  const jsonData = await response.json();

  // when loaded, prepare data objects
  prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
  allAnimals = jsonData.map(preapareObject);
  filteredAnimals = allAnimals;

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function filterAnimals(filterThis) {
  if (filterThis === "cat") {
    filteredAnimals = allAnimals.filter(isFilteredAnimal);
  }
  if (filterThis === "dog") {
    filteredAnimals = allAnimals.filter(isFilteredAnimal);
  }
  if (filterThis === "*") {
    filteredAnimals = allAnimals;
  }
  function isFilteredAnimal(animal) {
    if (animal.type === filterThis) {
      return true;
    } else {
      return false;
    }
  }
  displayList(filteredAnimals);
}

function sortAnimals(dataset) {
  const sortThis = dataset.sort;

  if (dataset.sortDirection === "asc") {
    filteredAnimals.sort(compareFunction);
    function compareFunction(a, b) {
      if (a[sortThis] < b[sortThis]) {
        return -1;
      } else {
        return 1;
      }
    }
    dataset.sortDirection = "des";
  } else if (dataset.sortDirection === "des") {
    filteredAnimals.sort(compareFunction);
    function compareFunction(a, b) {
      if (a[sortThis] < b[sortThis]) {
        return 1;
      } else {
        return -1;
      }
    }
    dataset.sortDirection = "asc";
  }
  displayList(filteredAnimals);
}

function preapareObject(jsonObject) {
  const animal = Object.create(Animal);

  const texts = jsonObject.fullname.split(" ");
  animal.name = texts[0];
  animal.desc = texts[2];
  animal.type = texts[3];
  animal.age = jsonObject.age;

  return animal;
}

function displayList(animals) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
  // create clone
  const clone = document
    .querySelector("template#animal")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=name]").textContent = animal.name;
  clone.querySelector("[data-field=desc]").textContent = animal.desc;
  clone.querySelector("[data-field=type]").textContent = animal.type;
  clone.querySelector("[data-field=age]").textContent = animal.age;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
