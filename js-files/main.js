// Selecting DOM elements
const planetsLi = document.querySelectorAll("ul.planets li"); // List items for planets
const nav = document.querySelector("nav"); // Navigation element
const mobilePlanets = document.querySelector("ul.mobile-planets"); // Mobile planets list
const mobilePlanetsLi = document.querySelectorAll("ul.mobile-planets li"); // Mobile planets list items
const toggleIcon = document.querySelector("i.toggle"); // Toggle icon
const btns = document.querySelectorAll(".catogries button"); // Buttons for categories
const mobileCatogries = document.querySelectorAll(".mobile-catogries li"); // Mobile category list items
const planetName = document.querySelector("h1.planet-name"); // Planet name heading
const planetImage = document.querySelector("img.planet-img"); // Planet image
const alternativeImg = document.querySelector("img.alternative-img"); // Alternative image
const planetDescription = document.querySelector("p.planet-description"); // Planet description paragraph
const rotationTime = document.querySelector("h1.rotation-time"); // Rotation time heading
const revolutionTime = document.querySelector("h1.revolution-time"); // Revolution time heading
const radius = document.querySelector("h1.radius"); // Radius heading
const temp = document.querySelector("h1.temp"); // Temperature heading
let isAnimating = false; // Animation flag

// Adding click event listeners to planet list items
planetsLi.forEach((li, index) => {
  // Perform actions when a planet is clicked
  li.addEventListener("click", () => {
    if (!isAnimating) {
      planetsLi.forEach((li) => {
        li.classList.remove("active");
      });
      li.classList.add("active");
      mobilePlanetsLi.forEach((li) => {
        li.classList.remove("active");
      });
      mobilePlanetsLi[index].classList.add("active");
      btns.forEach((btn) => {
        btn.classList.remove("active");
      });
      btns[0].classList.add("active");
      fetchPlanet(li.dataset.planet);
      document.body.className = li.dataset.planet;
    }
  });
});

// Adding click event listener to toggle icon
toggleIcon.addEventListener("click", () => {
  // Toggle visibility of mobile planets and apply animations
  mobilePlanets.classList.toggle("d-none");
  mobilePlanetsLi.forEach((li, index) => {
    if (mobilePlanets.classList.contains("d-none")) {
      li.style.transform = "translateX(100%)";
    } else {
      setTimeout(() => {
        li.style.transform = "translateX(0)";
      }, index * 30);
    }
  });
  nav.classList.toggle("margin");
});

// Adding click event listeners to mobile planet list items
mobilePlanetsLi.forEach((li) => {
  // Perform actions when a mobile planet is clicked
  li.addEventListener("click", () => {
    if (!isAnimating) {
      mobilePlanets.classList.toggle("d-none");
      mobilePlanetsLi.forEach((li, index) => {
        if (mobilePlanets.classList.contains("d-none")) {
          li.style.transform = "translateX(100%)";
        } else {
          setTimeout(() => {
            li.style.transform = "translateX(0)";
          }, index * 30);
        }
        fetchPlanet(li.dataset.planet);
        nav.classList.remove("margin");
      });
      fetchPlanet(li.dataset.planet);
      nav.classList.remove("margin");
    }
    mobilePlanetsLi.forEach((li) => {
      li.classList.remove("active");
    });
    li.classList.add("active");
    mobileCatogries.forEach((catogery) => {
      catogery.classList.remove("active");
    });
    mobileCatogries[0].classList.add("active");
  });
});

// Adding click event listeners to category buttons
btns.forEach((btn, index) => {
  // Perform actions when a category button is clicked
  btn.addEventListener("click", () => {
    btns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btn.classList.add("active");
    mobileCatogries.forEach((catogery) => {
      catogery.classList.remove("active");
    });
    mobileCatogries[index].classList.add("active");
    let name;
    planetsLi.forEach((li) => {
      if (li.classList.contains("active")) {
        name = li.dataset.planet;
      }
    });
    changeImg(name, btn.dataset.catogry);
    fetchDesc(name, btn.dataset.catogry);
  });
});

// Adding click event listeners to mobile category list items
mobileCatogries.forEach((catogery, index) => {
  // Perform actions when a mobile category is clicked
  catogery.addEventListener("click", () => {
    mobileCatogries.forEach((catogery) => {
      catogery.classList.remove("active");
    });
    catogery.classList.add("active");
    btns.forEach((btn) => {
      btn.classList.remove("active");
    });
    btns[index].classList.add("active");
    let name;
    mobilePlanetsLi.forEach((li) => {
      if (li.classList.contains("active")) {
        name = li.dataset.planet;
      }
    });
    changeImg(name, catogery.dataset.catogry);
    fetchDesc(name, catogery.dataset.catogry);
  });
});

// Function to fetch planet data
function fetchPlanet(value) {
  // Fetch planet data based on the provided value
  alternativeImg.src = "";
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (!isAnimating) {
        animatePlanetName(data[value]["name"]);

        btns.forEach((btn) => {
          if (btn.classList.contains("active")) {
            planetDescription.textContent =
              data[value][btn.dataset.catogry]["description"];
          }
        });
        planetImage.style.transition = "transform 0.3s";
        planetImage.style.transform = `translate(20vh, -20vh) scale(0)`;
        setTimeout(() => {
          planetImage.style.transition = "transform 0.3s";
          planetImage.style.transform = `translate(-100vw, 100vh) scale(0)`;
          setTimeout(() => {
            planetImage.style.transition = "transform 0.3s";
            planetImage.style.transform = `translate(0, 0) scale(1)`;
          }, 500);
        }, 700);

        planetImage.src = data[value]["img"];
        rotationTime.textContent = data[value]["rotation time"];
        revolutionTime.textContent = data[value]["revolution time"];
        radius.textContent = data[value]["radius"];
        temp.textContent = data[value]["average temp"];
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to fetch planet description
function fetchDesc(name, catogery) {
  // Fetch planet description based on the provided name and category
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      planetDescription.textContent = data[name][catogery]["description"];
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to animate planet name
function animatePlanetName(newName) {
  // Animate the planet name with a typewriter-like effect
  const existingName = planetName.textContent;
  const totalCharacters = existingName.length;
  const totalNewCharacters = newName.length;

  isAnimating = true;

  const removeCharacters = (index) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        planetName.textContent = existingName.slice(0, -1 * (index + 1));
        resolve();
      }, index * 100);
    });
  };

  const addCharacters = (index) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        planetName.textContent += newName[index];
        resolve();
      }, index * 100);
    });
  };

  const removePromise = Array.from({ length: totalCharacters }, (_, i) =>
    removeCharacters(i)
  ).reduce((prevPromise, currentPromise) =>
    prevPromise.then(() => currentPromise)
  );

  removePromise.then(() => {
    Array.from({ length: totalNewCharacters }, (_, i) => addCharacters(i))
      .reduce((prevPromise, currentPromise) =>
        prevPromise.then(() => currentPromise)
      )
      .then(() => {
        isAnimating = false;
      });
  });
}

// Function to change planet image
function changeImg(name, category) {
  // Change the planet image based on the provided name and category

  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alternativeImg.src = "";
      planetImage.style.transition = "transform .3s";
      planetImage.style.transform = "scale(0)";
      setTimeout(() => {
        planetImage.style.transform = "scale(1)";
        if (category === "structure") {
          planetImage.src = data[name]["img"].replace(".svg", "-internal.svg");
        } else {
          planetImage.src = data[name]["img"];
          if (category !== "overview") {
            alternativeImg.src = `imgs/${name}-geology.png`;
          }
        }
      }, 400);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
