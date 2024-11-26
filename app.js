// on load render html and set current selection
let currentPlanet = 'mercury';
let currentSection = 'overview';
renderHtml(currentPlanet);

// construct variables for main DOM elements
const mainText = document.getElementById('js__main-text');
const mainImage = document.getElementById('js__main-image');
const navbarPrimary = document.getElementById('js__navbar-primary');
const navbarSecondaryMobile = document.getElementById('js__navbar-secondary--mobile');
const navbarSecondaryDesktop = document.getElementById('js__navbar-secondary--desktop');
const footer = document.getElementById('js__footer');

navbarSecondaryDesktop.querySelector('li').style.backgroundColor = returnPlanetColor();

// add event listener logic to primary navigation links
document.querySelectorAll('.navbar--mobile__planets ~ a')
.forEach((e) => {
  e.addEventListener('click', () => {
    // render data for planet requested
    renderHtml(e.innerHTML);
    // close the navbar
    navbarPrimary.querySelector('.collapse').classList.toggle('show');
    // remove active class from previous planet
    navbarPrimary.querySelector(`.${currentPlanet} ~ a`).classList.toggle('active');
    // add active class to new planet
    e.classList.toggle('active');
    // set current planet to new planet
    currentPlanet = e.innerHTML.toLowerCase();
    // reset current section to 'overview'
    currentSection = 'overview';
    // resets secondary menu to 'overview' section
    setSecondary('#overview');
  });
});

// add event listener to secondary navigation links
navbarSecondaryMobile.querySelectorAll('a')
.forEach((e) => {
    e.addEventListener('click', () => {
      let sectionName = e.innerHTML.toLowerCase();
      if (sectionName === 'surface') {
        sectionName = 'geology';
      }
      // render data for section requested
      renderHtml(currentPlanet, sectionName);
      // sets mobile and desktop secondary menus to section requested
      setSecondary(`#${sectionName}`);
    })
})


navbarSecondaryDesktop.querySelectorAll('a')
.forEach((e) => {
  e.addEventListener('click', () => {
    let sectionName = e.innerHTML.toLowerCase();
    if (sectionName.includes('overview')) {
      sectionName = 'overview';
    } else if (sectionName.includes('structure')) {
      sectionName = 'structure';
    } else if (sectionName.includes('geology')) {
      sectionName = 'geology';
    }
    // render data for section requested
    renderHtml(currentPlanet, sectionName);
    // sets mobile and desktop secondary menus to section requested
    setSecondary(`#${sectionName}`);
  })
})

// sets mobile and desktop secondary menus to section requested
function setSecondary(sectionRequested) {
  if (sectionRequested != currentSection) {
    // sets secondary menu (mobile) to sectionRequested
    navbarSecondaryMobile.querySelectorAll('a').forEach((element) => {
      if (element.classList.contains('active')) {
        element.classList.remove('active');
      }
    })
    navbarSecondaryMobile.querySelector(sectionRequested).classList.add('active');
    
    // sets secondary menu (desktop) to sectionRequested
    navbarSecondaryDesktop.querySelectorAll('li').forEach((element) => {
      if (element.style.backgroundColor != 'transparent') {
        element.style.backgroundColor = 'transparent';
      };
    });
    navbarSecondaryDesktop.querySelector(sectionRequested).parentElement.style.backgroundColor = returnPlanetColor();
  }
}

// returns colour using currentPlanet
function returnPlanetColor() {
  return `var(--${currentPlanet}`;
}

// read data from json file and return as objects
async function readJsonFile() {
  const data = await fetch('./data.json')
  return data.json();
}

// search through array of objects using
// return single object where key name matches planet name
async function searchJson(key, value) {
  const json = await readJsonFile();
  for (let i = 0; i < json.length; i++) {
    if (json[i][key].toLowerCase() === value.toLowerCase()) {
      return json[i];
    };
  };
};

// refactor planetObject to match placeholders in mustache template
// returns newObject where data matches section called by click
function processObject(section, object) {
  let image = section === 'structure' ? 'internal' : 'planet';

  const {name, [section]: {content, source}, images, height} = object;
  return {
    name, 
    content: content, 
    source: source, 
    imageSource: images[`${image}`], 
    imageHeight: height
  };
}

// fetch mustache template from file using fileName
// convert to text and return
async function renderTemplate(templateName) {
  const response = await fetch(`./${templateName}.mustache`);
  const template = await response.text();
  return template;
}

// use template and object to modify innerHTML
async function renderHtml(planetName, sectionName = 'overview') {
  const data = await searchJson('name', planetName);
  const refactoredObject = processObject(sectionName, data);
  mainText.innerHTML = Mustache.render(await renderTemplate('main_text'), refactoredObject);
  mainImage.innerHTML = Mustache.render(await renderTemplate('main_image'), refactoredObject);
  footer.innerHTML = Mustache.render(await renderTemplate('footer'), data);

  const {images: {geology: geologyImageUrl}} = data;
  console.log(geologyImageUrl);
  const imageContainer = mainImage.querySelector('div');
  const geologyImage = document.createElement("img");
  geologyImage.setAttribute('src', geologyImageUrl);
  geologyImage.setAttribute('class', "position-absolute top-50 h-50");
    
    if (sectionName === 'geology') {
      imageContainer.appendChild(geologyImage);
    }
};