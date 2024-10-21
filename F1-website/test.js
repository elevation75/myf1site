//let sourcePath = "https://keho.nl/mb/codepenfiles/f1";
//let sourcePath = "";
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  sourcePath = "http://127.0.0.1:5500";
}

const jsonfile = `${sourcePath}/data/f1data.json`;
const imagePath = `${sourcePath}/img`;
let drivers = {};
let teams = {};
let countries = {};
let driverCards = document.querySelector(".driver-cards");

loadData();

async function loadData() {
  response = await fetch(jsonfile);
  data = await response.json();
  drivers = data.drivers;
  teams = data.teams;
  countries = data.countries;
  for (driver in drivers) {
    let driverCard = buildCard(drivers[driver]);
    driverCards.append(driverCard);
  }
}

let activeCard = false;
function buildCard(driver) {
  let flipCard = document.createElement("div");
  flipCard.classList.add("flip-card");
  flipCard.setAttribute(
    "style",
    `--team-color: ${teams[driver.team].color.hex}`
  );

  flipCard.addEventListener("click", (e) => {
    if (e.currentTarget.classList.contains("active")) {
      e.currentTarget.classList.remove("active");
      activeCard = false;
    } else {
      e.currentTarget.classList.add("active");
      if (activeCard) activeCard.classList.remove("active");
      activeCard = e.currentTarget;
    }
  });

  let flipCardInner = document.createElement("div");
  flipCardInner.classList.add("flip-card-inner");

  //front
  let driverCard = document.createElement("div");
  driverCard.classList.add("driver-card", "card-background");

  //helmetImageLayer
  let helmetImageLayer = document.createElement("div");
  helmetImageLayer.classList.add("helmet-image-layer");
  let helmetImg = new Image();
  helmetImg.src = `${imagePath}/drivers/${driver.abbr}_helmet.png`;
  helmetImageLayer.append(helmetImg);

  //driverImageLayer
  let driverImageLayer = document.createElement("div");
  driverImageLayer.classList.add("driver-image-layer");
  let driverImg = new Image();
  driverImg.src = `${imagePath}/drivers/${driver.abbr}.png`;
  driverImageLayer.append(driverImg);

  //overlay layer
  let overlay = document.createElement("div");
  overlay.classList.add("overlay");

  let overlayNr = document.createElement("div");
  overlayNr.classList.add("number");
  overlayNr.textContent = driver.nr;

  let overlayAbbr = document.createElement("div");
  overlayAbbr.classList.add("abbr");
  overlayAbbr.textContent = driver.abbr;

  let overlayFlag = new Image();
  overlayFlag.classList.add("flag");
  overlayFlag.src = `${imagePath}/flags/${driver.country}.png`;

  let overlayTeam = new Image();
  overlayTeam.classList.add("team");
  overlayTeam.src = `${imagePath}/teams/${driver.team}_logo.png`;

  overlay.append(overlayNr, overlayAbbr, overlayFlag, overlayTeam);

  //name layer
  let namelayer = document.createElement("div");
  namelayer.classList.add("overlay-name");

  let fname = document.createElement("div");
  fname.classList.add("first-name");
  fname.textContent = driver.fname;

  let lname = document.createElement("div");
  lname.classList.add("last-name");
  lname.textContent = driver.lname;

  namelayer.append(fname, lname);

  driverCard.append(helmetImageLayer, driverImageLayer, overlay, namelayer);

  //backside
  detailsCard = document.createElement("div");
  detailsCard.classList.add("details-card");

  detailBackground = document.createElement("div");
  detailBackground.classList.add("card-background");

  detailsCardInner = document.createElement("div");
  detailsCardInner.classList.add("details-inner");

  //name
  detailName = document.createElement("div");
  detailName.classList.add("detail-name");
  detailName.innerHTML = `${driver.fname}<br>${driver.lname}`;
  //helmet
  detailHelmet = new Image();
  detailHelmet.classList.add("detail-helmet");
  detailHelmet.src = `${imagePath}/drivers/${driver.abbr}_helmet.png`;
  //Number
  detailNumber = new Image();
  detailNumber.classList.add("detail-number");
  detailNumber.src = `${imagePath}/drivers/${driver.abbr}_nr.png`;
  //Car
  detailCar = new Image();
  detailCar.classList.add("detail-car");
  detailCar.src = `${imagePath}/teams/${driver.team}_car.png`;
  //Bio
  bioWrap = document.createElement("div");
  bioWrap.classList.add("bio-wrap");
  //Country
  let countryLabel = document.createElement("div");
  countryLabel.textContent = "Country:";
  let countryValue = document.createElement("div");
  countryValue.textContent = countries[driver.country];
  //DOB
  let dobAge = getAge(driver.dob);
  let dobDate = formatDate(driver.dob);
  let dobLabel = document.createElement("div");
  dobLabel.textContent = "Dob:";
  let dobValue = document.createElement("div");
  dobValue.innerHTML = `${dobDate} <span>(${dobAge})</span>`;
  //TEAM
  let teamLabel = document.createElement("div");
  teamLabel.textContent = "Team:";
  let teamValue = document.createElement("div");
  teamValue.textContent = teams[driver.team].nameFull;

  bioWrap.append(
    countryLabel,
    countryValue,
    dobLabel,
    dobValue,
    teamLabel,
    teamValue
  );

  detailsCardInner.append(
    detailName,
    detailHelmet,
    detailNumber,
    detailCar,
    bioWrap
  );

  detailsCard.append(detailBackground, detailsCardInner);

  flipCardInner.append(driverCard, detailsCard);
  flipCard.append(flipCardInner);
  return flipCard;
}

function getAge(dateString) {
  let today = new Date();
  let birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateString) {
  let date = new Date(dateString);
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);

  return day + "/" + month + "/" + year;
}