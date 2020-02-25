"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
let filteredAnimals;

// The prototype for all animals:
const Animal = {
  name: "",
  desc: "-unknown animal-",
  type: "",
  age: 0,
  star: "☆",
  winner: "false"
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
    .querySelector("[data-action='sort'][data-sort='winner']")
    .addEventListener("click", selected => {
      sortAnimals(selected.originalTarget.dataset);
    });
  document
    .querySelector("[data-action='sort'][data-sort='star']")
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
  allAnimals = jsonData.map(prepareObject);
  filteredAnimals = allAnimals;

  // TODO: This might not be the function we want to call first
  displayList(allAnimals);
}

function filterAnimals(filterThis) {
  filteredAnimals = allAnimals.filter(isFilteredAnimal);

  function isFilteredAnimal(animal) {
    if (filterThis === "*") {
      return true;
    } else if (animal.type === filterThis) {
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
    allAnimals.sort(compareFunction);
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
    allAnimals.sort(compareFunction);
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

function prepareObject(jsonObject) {
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
  clone.querySelector("[data-field=star]").textContent = animal.star;
  clone.querySelector("[data-field=winner").dataset.winner = animal.winner;

  // set evenlisteners
  clone
    .querySelector("[data-field=star]")
    .addEventListener("click", function() {
      toggleStar(animal);
    });

  clone
    .querySelector("[data-field=winner]")
    .addEventListener("click", function() {
      toggleWinner(animal);
    });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function toggleStar(thisStar) {
  thisStar.star = thisStar.star === "☆" ? "⭐" : "☆";
  displayList(allAnimals);
}

function toggleWinner(thisAnimal) {
  const totalWinners = allAnimals.filter(animal =>
    animal.winner === "true" ? true : false
  );
  const sameTypeWinners = totalWinners.filter(animal =>
    animal.type === thisAnimal.type ? true : false
  );
  console.log(sameTypeWinners.length);

  if (thisAnimal.winner === "true") {
    thisAnimal.winner = "false";
    displayList(allAnimals);
  } else if (sameTypeWinners.length > 0) {
    console.log("two of same kind");
    callAlertSameType(sameTypeWinners[0], thisAnimal);
  } else if (totalWinners.length === 2) {
    console.log("more than two");
    callAlertMoreThan2(totalWinners, thisAnimal);
  } else {
    thisAnimal.winner = "true";
    displayList(allAnimals);
  }
}

function callAlertMoreThan2(winners, newWinner) {
  document.querySelector("#onlytwowinners").classList.add("show");

  for (let i = 0; i < 2; i++) {
    document.querySelector(
      `.animal${1 + i}`
    ).textContent = `${winners[i].name}, the ${winners[i].type}`;
  }
  initRemoveBtns(winners, newWinner);
}

function callAlertSameType(sameType, newWinner) {
  document.querySelector("#onlyonekind").classList.add("show");
  document.querySelector(
    "#onlyonekind .animal1"
  ).textContent = `${sameType.name}, the ${sameType.type}`;
  document
    .querySelector("#onlyonekind [data-action=remove1]")
    .addEventListener("click", removeCurrentWinner);
  document
    .querySelector("#onlyonekind .closebutton")
    .addEventListener("click", keepCurrentWinner);
  function removeCurrentWinner() {
    sameType.winner = "false";
    newWinner.winner = "true";
    displayList(allAnimals);
    document.querySelector("#onlyonekind").classList.remove("show");
    document
      .querySelector("#onlyonekind [data-action=remove1]")
      .removeEventListener("click", removeCurrentWinner);
    document
      .querySelector("#onlyonekind .closebutton")
      .removeEventListener("click", keepCurrentWinner);
  }
  function keepCurrentWinner() {
    console.log("do nothing");
    document.querySelector("#onlyonekind").classList.remove("show");
    document
      .querySelector("#onlyonekind [data-action=remove1]")
      .removeEventListener("click", removeCurrentWinner);
    document
      .querySelector("#onlyonekind .closebutton")
      .removeEventListener("click", keepCurrentWinner);
  }
}

function initRemoveBtns(winners, newWinner) {
  const removeBtnArray = [
    document.querySelector(`[data-action=remove1`),
    document.querySelector(`[data-action=remove2`)
  ];
  removeBtnArray[0].addEventListener("click", removeFirst);
  removeBtnArray[1].addEventListener("click", removeSecond);
  function removeFirst() {
    winners[0].winner = "false";
    document.querySelector("#onlytwowinners").classList.remove("show");
    console.log(`remove ${winners[0].name}`);
    newWinner.winner = "true";
    displayList(allAnimals);
    removeBtnArray[0].removeEventListener("click", removeFirst);
    removeBtnArray[1].removeEventListener("click", removeSecond);
  }
  function removeSecond() {
    winners[1].winner = "false";
    document.querySelector("#onlytwowinners").classList.remove("show");
    console.log(`remove ${winners[1].name}`);
    newWinner.winner = "true";
    displayList(allAnimals);
    removeBtnArray[0].removeEventListener("click", removeFirst);
    removeBtnArray[1].removeEventListener("click", removeSecond);
  }
  document.querySelector(".closebutton").addEventListener("click", () => {
    document.querySelector("#onlytwowinners").classList.remove("show");
    removeBtnArray[0].removeEventListener("click", removeFirst);
    removeBtnArray[1].removeEventListener("click", removeSecond);
  });
}
