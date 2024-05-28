const planetsLi = document.querySelectorAll("ul.planets li");
const nav = document.querySelector("nav");
const mobilePlanets = document.querySelector("ul.mobile-planets");
const mobilePlanetsLi = document.querySelectorAll("ul.mobile-planets li");
const toggleIcon = document.querySelector("i.toggle");
const btns = document.querySelectorAll(".catogries button");
const mobileCatogries = document.querySelectorAll(".mobile-catogries li");
const planetName = document.querySelector("h1.planet-name");
const planetImage = document.querySelector("img.planet-img");
const alternativeImg = document.querySelector("img.alternative-img");
const planetDescription = document.querySelector("p.planet-description");
const rotationTime = document.querySelector("h1.rotation-time");
const revolutionTime = document.querySelector("h1.revolution-time");
const radius = document.querySelector("h1.radius");
const temp = document.querySelector("h1.temp");
let isAnimating = false;

planetsLi.forEach((li, index) => {
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
      fetchPlanet(li.textContent);
      document.body.className = li.textContent.toLowerCase();
    }
  });
});

toggleIcon.addEventListener("click", () => {
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

mobilePlanetsLi.forEach((li, index) => {
  li.addEventListener("click", () => {
    if (!isAnimating) {
      mobilePlanets.classList.toggle("d-none");
      fetchPlanet(li.querySelector("h2").textContent);
      nav.classList.toggle("margin");
    }
    planetsLi.forEach((li) => {
      li.classList.remove("active");
    });
    planetsLi[index].classList.add("active");
    mobilePlanetsLi.forEach((li) => {
      li.classList.remove("active");
    });
    li.classList.add("active");
    mobileCatogries.forEach((catogery) => {
      catogery.classList.remove("active");
    });
    mobilePlanetsLi.forEach((li) => {
      li.style.transform = "translateX(100%)";
    });
    mobileCatogries[0].classList.add("active");
    document.body.className = li.querySelector("h2").textContent.toLowerCase();
  });
});

btns.forEach((btn, index) => {
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
        name = li.textContent;
      }
    });
    changeImg(name, btn.dataset.catogry);
    fetchDesc(name, btn.dataset.catogry);
  });
});

mobileCatogries.forEach((catogery, index) => {
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
        name = li.querySelector("h2").textContent;
      }
    });
    changeImg(name, catogery.dataset.catogry);
    fetchDesc(name, catogery.dataset.catogry);
  });
});

function fetchPlanet(value) {
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

function fetchDesc(name, catogery) {
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

function animatePlanetName(newName) {
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

function changeImg(name, catogery) {
  fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      alternativeImg.src = "";
      if (catogery == "structure") {
        planetImage.style.transition = "transform .3s";
        planetImage.style.transform = "scale(0)";
        setTimeout(() => {
          planetImage.style.transform = "scale(1)";
          planetImage.src = data[name]["img"].replace(".svg", "-internal.svg");
        }, 400);
      } else if (catogery == "overview") {
        planetImage.style.transition = "transform .3s";
        planetImage.style.transform = "scale(0)";
        setTimeout(() => {
          planetImage.style.transform = "scale(1)";
          planetImage.src = data[name]["img"];
        }, 400);
      } else {
        planetImage.style.transition = "transform .3s";
        planetImage.style.transform = "scale(0)";
        setTimeout(() => {
          planetImage.style.transform = "scale(1)";
          planetImage.src = data[name]["img"];
        }, 400);
        setTimeout(() => {
          alternativeImg.src = `imgs/${name.toLowerCase()}-geology.png`;
        }, 500);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
