"use strict";

class Character {
  constructor(
    name,
    gender,
    height,
    mass,
    hairColor,
    skinColor,
    movies,
    pictureUrl,
    homeWorld,
    moviesNames = [],
    movieDates = [],
    planetName,
    vehicle = [],
    starship = [],
    mostExpensiveCraft = ""
  ) {
    this.name = name;
    this.gender = gender;
    this.height = height;
    this.mass = mass;
    this.hairColor = hairColor;
    this.skinColor = skinColor;
    this.movies = movies;
    this.pictureUrl = pictureUrl;
    this.homeWorld = homeWorld;
    this.moviesNames = moviesNames;
    this.movieDate = movieDates;
    this.planetName = planetName;
    this.vehicle = vehicle;
    this.starship = starship;
    this.mostExpensiveCraft = mostExpensiveCraft;
  }
  async getMoviesName() {
    return this.moviesNames;
  }
  async getFirstDate() {
    let FirstDate = this.movieDate.sort(function (a, b) {
      return Date.parse(a) > Date.parse(b);
    });
    return FirstDate;
  }
  async getHomePlanet() {
    return this.planetName;
  }

  async mostExpensiveVehicle() {
    let pricesOfVehicles = [];
    let pricesOfStarship = [];

    if (this.vehicle.length === 0) {
      pricesOfVehicles.push("0");
    } else {
      this.vehicle.forEach(async (vehicle) => {
        if (vehicle.cost_in_credits !== "unknown") {
          pricesOfVehicles.push(vehicle.cost_in_credits);
        } else {
          let index = vehicle.cost_in_credits.indexOf("unknown");
          if (index > -1) {
            pricesOfVehicles.splice(index, 1);
            pricesOfVehicles.push("0");
          }
        }
      });
    }

    if (this.starship.length === 0) {
      pricesOfStarship.push("0");
    } else {
      this.starship.forEach(async (star) => {
        if (star.cost_in_credits !== "unknown") {
          pricesOfStarship.push(star.cost_in_credits);
        } else {
          let index = star.cost_in_credits.indexOf("unknown");
          if (index > -1) {
            pricesOfStarship.splice(index, 1);
            pricesOfStarship.push("0");
          }
        }
      });
    }

    console.log(pricesOfVehicles);
    console.log(pricesOfStarship);

    let theMostexpensiveVehicles = Math.max(...pricesOfVehicles);
    let theMostexpensiveStarship = Math.max(...pricesOfStarship);
    
    console.log(
      `${this.name} most expensive vechicle costs ${Math.max(
        ...pricesOfVehicles
      )}`
    );
    console.log(
      `${this.name} most expensive starship costs ${Math.max(
        ...pricesOfStarship
      )}`
    );

    let dyrasteFordonsPris = "";
    let noVehiclesAtall = false;
    if (theMostexpensiveVehicles > theMostexpensiveStarship) {
      dyrasteFordonsPris = theMostexpensiveVehicles;
    } else {
      dyrasteFordonsPris = theMostexpensiveStarship;
    };
    console.log(dyrasteFordonsPris);
    if (dyrasteFordonsPris == 0) {
      noVehiclesAtall = true;
    };
    
    let dyrasteFordon = "";
    let dyrasteStarskepp = "";
    if (noVehiclesAtall === false) {
      try {
        dyrasteFordon = await this.vehicle.find(
          (item) => item.cost_in_credits == dyrasteFordonsPris
        );
        this.mostExpensiveCraft = dyrasteFordon;
        console.log(dyrasteFordon);
      } catch (error) {
        console.log(error);
      }
      try {
        dyrasteStarskepp = await this.starship.find(
          (item) => item.cost_in_credits == dyrasteFordonsPris
        );
        if (dyrasteStarskepp !== undefined) {
          this.mostExpensiveCraft = dyrasteStarskepp;
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.mostExpensiveCraft = `there is no vechine :(`;
    }
  }
};

const fetchData = async (url) => {
  let response = await fetch(url);
  let json = await response.json();
  return json;
};

let selectedChar = [];
let pageParam = "";
let allCharacters = [];

function movieNames(movies) {
  let movieNames = [];
  movies.forEach(async (film) => {
    let theMovie = await fetch(film);
    let movieName = await theMovie.json();
    movieNames.push(movieName.title);
  });
  return movieNames;
}

function movieDates(movies) {
  let movieDates = [];
  movies.forEach(async (film) => {
    let theMovie = await fetch(film);
    let movieName = await theMovie.json();
    movieDates.push(movieName.release_date);
  });
  return movieDates;
}

async function homePlanet(home) {
  let planet = await fetch(home);
  let planetName = await planet.json();
  return await planetName;
}

async function getVehicle(url) {
  let vehicleArr = [];
  await url.forEach(async (item) => {
    let vehicle = await fetch(item);
    let allVehicle = await vehicle.json();
    vehicleArr.push(allVehicle);
  });
  return vehicleArr;
}

async function getStarship(url) {
  let starshipArr = [];
  await url.forEach(async (item) => {
    let starship = await fetch(item);
    let allStarship = await starship.json();
    starshipArr.push(allStarship);
  });
  return starshipArr;
}

let getAllchar = async () => {
  for (let i = 1; i < 17; i++) {
    console.log(i);
    let data = await fetchData(`https://swapi.dev/api/people/${i}`);
    console.log(data);
    let getMovieNames = movieNames(await data.films);
    //console.log(getMovieNames);

    let getMovieDates = movieDates(await data.films);
    //console.log(getMovieDates);

    let getHomeWorld = await homePlanet(data.homeworld);
    //console.log(getHomeWorld);

    let vehicles = await getVehicle(data.vehicles);
    //console.log(vehicles);

    let starship = await getStarship(data.starships);
    //console.log(starship);

    let pictureUrl = data.name + `.jpg`;
    let newChar = new Character(
      data.name,
      data.gender,
      data.height,
      data.mass,
      data.hair_color,
      data.skin_color,
      data.films,
      pictureUrl,
      data.homeworld,
      getMovieNames,
      getMovieDates,
      getHomeWorld.name,
      vehicles,
      starship
    );

    allCharacters.push(newChar);

    let options1 = document.createElement("option");
    options1.innerHTML = `<option value="${data.name}">${data.name}</option>`;
    dropdown1.append(options1);

    let options2 = document.createElement("option");
    options2.innerHTML = `<option>${data.name}</option>`;
    dropdown2.append(options2);
  }
};

let container = document.querySelector(".profileContainer");
let char1Div = document.querySelector("#char1");
let char1PicDiv = document.createElement("div");
char1PicDiv.setAttribute("id","char1PicDiv");
let char1InfoDiv = document.createElement("div");
let char2Div = document.querySelector("#char2");
let char2PicDiv = document.createElement("div");
char2PicDiv.setAttribute("id","char2PicDiv");
let char2InfoDiv = document.createElement("div");

let onRender = (char1, char2) => {
  char1Div.innerHTML = "";
  char2Div.innerHTML = "";

  char1PicDiv.innerHTML = `<h2>${char1.name}</h3><br> <img src="img/${char1.pictureUrl}" alt="${char1.name} picture">`;
  char2PicDiv.innerHTML = `<h2>${char2.name}</h3><br> <img src="img/${char2.pictureUrl}" alt="${char2.name} picture">`;

  char1Div.append(char1PicDiv);
  char2Div.append(char2PicDiv);
};

let dropdown1 = document.querySelector("#charList1");
let dropdown2 = document.querySelector("#charList2");

let compare = () => {
  console.log(selectedChar);

  let tallestChar = "";
  let heaviestChar = "";
  let mostMoviesChar = "";
  let genderCompare = "";
  let hairColorCompare = "";
  let skinColorCompare = "";
  let char1 = selectedChar[0];
  let char2 = selectedChar[1];
  onRender(char1, char2);
  
  char1InfoDiv.innerHTML = `<p><b>Name:</b> ${char1.name}<br> 
  <b>Gender:</b> ${char1.gender} <br> <b>Height:</b>${char1.height} <br> <b>Mass:</b> ${char1.mass} <br>
  <b>Hair Color:</b> ${char1.hairColor} <br> <b>Skin Color:</b> ${char1.skinColor} <br> 
  <b>Films:</b> ${char1.movies.length}</p>`;

  char2InfoDiv.innerHTML = `<p><b>Name:</b> ${char2.name}<br> 
  <b>Gender:</b> ${char2.gender} <br> <b>Height:</b>${char2.height} <br><b> Mass:</b> ${char2.mass} <br>
  <b>Hair Color:</b> ${char2.hairColor} <br> <b>Skin Color:</b> ${char2.skinColor} <br> 
  <b>Films:</b> ${char2.movies.length}</p>`;

  char1PicDiv.append(char1InfoDiv);
  char2PicDiv.append(char2InfoDiv);

  if (char1.name === char2.name) {
    compareResult.innerHTML = `<p>You can't compare same char!!!</p>`;
  } else {
    //Compare height
    if (Number(char1.height) === Number(char2.height)) {
      tallestChar = `${char1.name} and ${char2.name} have same height!`;
    } else if (Number(char1.height) > Number(char2.height)) {
      tallestChar = `${char1.name} is tallest.`;
    } else {
      tallestChar = `${char2.name} is tallest.`;
    }

    //Compare weight
    if (char1.mass === "unknown" || char2.mass === "unknown") {
      heaviestChar = "There is missing info, can't compare!";
    } else if (Number(char1.mass) === Number(char2.mass)) {
      heaviestChar = `${char1.name} and ${char2.name} have same weight!`;
    } else if (
      Number(char1.mass.replace(",", "")) > Number(char2.mass.replace(",", ""))
    ) {
      heaviestChar = `${char1.name} is heaviest.`;
    } else {
      heaviestChar = `${char2.name} is heaviest.`;
    }

    //Compare movies
    if (char1.movies.length === char2.movies.length) {
      mostMoviesChar = `${char1.name} and ${char2.name} have been same amount of films.`;
    } else if (char1.movies.length > char2.movies.length) {
      mostMoviesChar = `${char1.name} has been in most films.`;
    } else {
      mostMoviesChar = `${char2.name} has been in most films.`;
    }

    //Compare gender
    if (char1.gender === "n/a" || char2.gender === "n/a") {
      genderCompare = `Gender : There is missing info, can't compare!`;
    } else if (char1.gender === char2.gender) {
      genderCompare = `${char1.name} and ${char2.name} have same gender.`;
    } else {
      genderCompare = `${char1.name} and ${char2.name} have a different gender.`;
    }

    //Compare hair color
    if (char1.hairColor === "n/a" || char2.hairColor === "n/a") {
      hairColorCompare = `hair color : There is missing info, can't compare!`;
    } else if (char1.hairColor === char2.hairColor) {
      hairColorCompare = `${char1.name} and ${char2.name} have same hair color.`;
    } else {
      hairColorCompare = `${char1.name} and ${char2.name} have a different hair color.`;
    }

    //Compare skin color
    if (char1.skinColor === "n/a" || char2.skinColor === "n/a") {
      skinColorCompare = `Skin color : There is missing info, can't compare!`;
    } else if (char1.skinColor === char2.skinColor) {
      skinColorCompare = `${char1.name} and ${char2.name} have same skin color.`;
    } else {
      skinColorCompare = `${char1.name} and ${char2.name} have a different skin color.`;
    }

  compareResult.innerHTML = `<h3>Comparing results:</h3><p>${tallestChar}<br> ${heaviestChar}<br> ${mostMoviesChar}<br>
  ${genderCompare}<br> ${hairColorCompare}<br> ${skinColorCompare}</p>`;

}
  compareResultContainer.append(compareResult);
};

///// BUTTONS /////
let getInfoBtn = document.querySelector("#getInfoBtn");
let compareResultContainer = document.querySelector(".compareResult");
let compareResult = document.createElement("div");
compareResult.setAttribute("id","compareResultDiv");
getInfoBtn.addEventListener("click", () => {
  selectedChar = [];
  compareBtn.disabled = false;
  movieNameBtn.disabled = false;
  firstAppearBtn.disabled = false;
  homePlanetBtn.disabled = false;
  vehicleBtn.disabled = false;
  compareResultContainer.innerHTML = "";
  let selectedOne = allCharacters.find((item) => item.name === dropdown1.value);
  let selectedTwo = allCharacters.find((item) => item.name === dropdown2.value);
  console.log(selectedOne);
  console.log(selectedTwo);
  selectedChar.push(selectedOne, selectedTwo);
  onRender(selectedOne, selectedTwo);
});


let compareBtn = document.querySelector("#compareBtn");
compareBtn.addEventListener("click", () => {
  compareResultContainer.innerHTML = "";

  compare();
  compareBtn.disabled = true;
});


let movieNameBtn = document.querySelector("#moviesName");
movieNameBtn.addEventListener("click", async () => {
  let moivesName1 = document.createElement("div");
  let moivesName2 = document.createElement("div");
  moivesName1.setAttribute("id", "char1MoviesDiv");
  moivesName2.setAttribute("id", "char2MoviesDiv");

  selectedChar[0].moviesNames.forEach((movie) => {
    let renderMoviesName1 = document.createElement("ul");
    renderMoviesName1.innerHTML = `<li>${movie}</li>`;
    console.log(`Char1 movies: ${movie}`);
    moivesName1.append(renderMoviesName1);
  });

  selectedChar[1].moviesNames.forEach((movie) => {
    let renderMoviesName2 = document.createElement("ul");
    renderMoviesName2.innerHTML = `<li>${movie}</li>`;
    console.log(`Char2 movies: ${movie}`);
    moivesName2.append(renderMoviesName2);
  });

  char1PicDiv.append(moivesName1);
  char2PicDiv.append(moivesName2);

  movieNameBtn.disabled = true;
});


let firstAppearBtn = document.querySelector("#moviesDate");
firstAppearBtn.addEventListener("click", async () => {
  let char1FirstDate = await selectedChar[0].getFirstDate();
  let char2FirstDate = await selectedChar[1].getFirstDate();

  console.log(`${char1FirstDate}`);
  let char1DateText = document.createElement("p");
  char1DateText.innerText = `${selectedChar[0].name} first appeared in a movie ${char1FirstDate[0]}`;

  console.log(`${char2FirstDate}`);
  let char2DateText = document.createElement("p");
  char2DateText.innerText = `${selectedChar[1].name} first appeared in a movie ${char2FirstDate[0]}`;

  char1PicDiv.append(char1DateText);
  char2PicDiv.append(char2DateText);
  firstAppearBtn.disabled = true;
});


let homePlanetBtn = document.querySelector("#planet");
homePlanetBtn.addEventListener("click", async () => {
  let char1Home = await selectedChar[0].getHomePlanet();
  let char2Home = await selectedChar[1].getHomePlanet();
  console.log(`${char1Home}`);
  let char1HomeText = document.createElement("p");
  char1HomeText.innerText = `${selectedChar[0].name} lives in ${char1Home}.`;

  console.log(`${char2Home}`);
  let char2HomeText = document.createElement("p");
  char2HomeText.innerText = `${selectedChar[1].name} lives in ${char2Home}.`;

  if (char1Home === char2Home) {
    let samePlanetText = document.createElement("p");
    samePlanetText.style.color = "green";
    samePlanetText.innerText = `${selectedChar[0].name} and ${selectedChar[1].name} live on the same planet!`;
    compareResult.append(samePlanetText);
  } 

  char1PicDiv.append(char1HomeText);
  char2PicDiv.append(char2HomeText);
  homePlanetBtn.disabled = true;
});


let vehicleBtn = document.querySelector("#expensiveVehicle");
vehicleBtn.addEventListener("click", async () => {
  await selectedChar[0].mostExpensiveVehicle();
  await selectedChar[1].mostExpensiveVehicle();

  console.log(selectedChar[0].mostExpensiveCraft);
  let char1Expensivevehicle = document.createElement("p");
  if (selectedChar[0].mostExpensiveCraft.name === undefined) {
    char1Expensivevehicle.innerText = `${selectedChar[0].name} doesn't have any vehicle or the vehicle has an unknown price.`;
  } else {
    char1Expensivevehicle.innerText = `${selectedChar[0].name}'s most expensive vehicle is ${selectedChar[0].mostExpensiveCraft.name}, and it costs ${selectedChar[0].mostExpensiveCraft.cost_in_credits}.`;
  }

  console.log(selectedChar[1].mostExpensiveCraft);
  let char2Expensivevehicle = document.createElement("p");
  if (selectedChar[1].mostExpensiveCraft.name === undefined) {
    char2Expensivevehicle.innerText = `${selectedChar[1].name} doesn't have any vehicle or the vehicle has an unknown price.`;
  } else {
    char2Expensivevehicle.innerText = `${selectedChar[1].name}'s most expensive vehicle is ${selectedChar[1].mostExpensiveCraft.name}, and it costs ${selectedChar[1].mostExpensiveCraft.cost_in_credits}.`;
  }

  char1PicDiv.append(char1Expensivevehicle);
  char2PicDiv.append(char2Expensivevehicle);
  vehicleBtn.disabled = true;
});

getAllchar();
