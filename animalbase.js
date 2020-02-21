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
      sortName(selected.originalTarget.dataset.sortDirection);
    });

  document
    .querySelector("[data-action='sort'][data-sort='type']")
    .addEventListener("click", selected => {
      sortType(selected.originalTarget.dataset.sortDirection);
    });

  document
    .querySelector("[data-action='sort'][data-sort='desc']")
    .addEventListener("click", selected => {
      sortDesc(selected.originalTarget.dataset.sortDirection);
    });

  document
    .querySelector("[data-action='sort'][data-sort='age']")
    .addEventListener("click", selected => {
      sortAge(selected.originalTarget.dataset.sortDirection);
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
    filteredAnimals = allAnimals.filter(isCat);
  }
  if (filterThis === "dog") {
    filteredAnimals = allAnimals.filter(isDog);
  }
  if (filterThis === "*") {
    filteredAnimals = allAnimals;
  }
  displayList(filteredAnimals);
}

function isDog(animal) {
  if (animal.type === "dog") {
    return true;
  } else {
    return false;
  }
}
function isCat(animal) {
  if (animal.type === "cat") {
    return true;
  } else {
    return false;
  }
}

function sortName(direction) {
  if (direction === "asc") {
    filteredAnimals.sort(compareNamesAZ);
    document.querySelector(
      "[data-action='sort'][data-sort='name']"
    ).dataset.sortDirection = "des";
    document.querySelector("[data-action='sort'][data-sort='name']");
    console.log("ascend");
  }
  if (direction === "des") {
    filteredAnimals.sort(compareNamesZA);
    document.querySelector(
      "[data-action='sort'][data-sort='name']"
    ).dataset.sortDirection = "asc";
    console.log("descend");
  }
  displayList(filteredAnimals);
}

function compareNamesAZ(a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
}

function compareNamesZA(a, b) {
  if (b.name < a.name) {
    return -1;
  } else {
    return 1;
  }
}

function sortType(direction) {
  if (direction === "asc") {
    filteredAnimals.sort(compareTypeAZ);
    document.querySelector(
      "[data-action='sort'][data-sort='type']"
    ).dataset.sortDirection = "des";
    document.querySelector("[data-action='sort'][data-sort='type']");
    console.log("ascend");
  }
  if (direction === "des") {
    filteredAnimals.sort(compareTypeZA);
    document.querySelector(
      "[data-action='sort'][data-sort='type']"
    ).dataset.sortDirection = "asc";
    console.log("descend");
  }
  displayList(filteredAnimals);
}

function compareTypeAZ(a, b) {
  if (a.type < b.type) {
    return -1;
  } else {
    return 1;
  }
}

function compareTypeZA(a, b) {
  if (b.type < a.type) {
    return -1;
  } else {
    return 1;
  }
}

function sortDesc(direction) {
  if (direction === "asc") {
    filteredAnimals.sort(compareDescAZ);
    document.querySelector(
      "[data-action='sort'][data-sort='desc']"
    ).dataset.sortDirection = "des";
    document.querySelector("[data-action='sort'][data-sort='desc']");
    console.log("ascend");
  }
  if (direction === "des") {
    filteredAnimals.sort(compareDescZA);
    document.querySelector(
      "[data-action='sort'][data-sort='desc']"
    ).dataset.sortDirection = "asc";
    console.log("descend");
  }
  displayList(filteredAnimals);
}

function compareDescAZ(a, b) {
  if (a.desc < b.desc) {
    return -1;
  } else {
    return 1;
  }
}

function compareDescZA(a, b) {
  if (b.desc < a.desc) {
    return -1;
  } else {
    return 1;
  }
}

function sortAge(direction) {
  if (direction === "asc") {
    filteredAnimals.sort(compareAge1to9);
    document.querySelector(
      "[data-action='sort'][data-sort='age']"
    ).dataset.sortDirection = "des";
    document.querySelector("[data-action='sort'][data-sort='age']");
    console.log("ascend");
  }
  if (direction === "des") {
    filteredAnimals.sort(compareAge9to1);
    document.querySelector(
      "[data-action='sort'][data-sort='age']"
    ).dataset.sortDirection = "asc";
    console.log("descend");
  }
  displayList(filteredAnimals);
}

function compareAge1to9(a, b) {
  if (a.age < b.age) {
    return -1;
  } else {
    return 1;
  }
}

function compareAge9to1(a, b) {
  if (b.age < a.age) {
    return -1;
  } else {
    return 1;
  }
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
