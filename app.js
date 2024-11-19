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
    
    renderHtml(e.innerHTML);
    // close the navbar
    navbarPrimary.querySelector('.collapse').classList.toggle('show');
    // remove active class from previous planet
    navbarPrimary.querySelector(`.${currentPlanet} ~ a`).classList.toggle('active');
    // add active class to new planet
    e.classList.toggle('active');
    // set current planet to new planet
    currentPlanet = e.innerHTML.toLowerCase();

    // resets secondary menu (mobile) to 'overview' section
    let id = `#${currentSection}`;
    navbarSecondaryMobile.querySelector(id).classList.toggle('active');
    navbarSecondaryMobile.querySelector('#overview').classList.toggle('active');
    
    // resets secondary menu (desktop) to 'overview' section
    navbarSecondaryDesktop.querySelector(id).parentElement
    .style.backgroundColor = 'transparent';
    navbarSecondaryDesktop.querySelector('li').style.backgroundColor = returnPlanetColor();
    currentSection = 'overview';
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
      renderHtml(currentPlanet, sectionName);

      // sets active class for active html element
      let id = `#${currentSection}`;
      navbarSecondaryMobile.querySelector(id).classList.toggle('active');
      e.classList.toggle('active');
      currentSection = sectionName;
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
    renderHtml(currentPlanet, sectionName);

    // sets background color for active section
    let id = `#${currentSection}`;
    e.parentElement.style.backgroundColor = returnPlanetColor();
    navbarSecondaryDesktop.querySelector(id).parentElement.style.backgroundColor = 'transparent';
    currentSection = sectionName;
  })
})

// returns colour using currentPlanet
function returnPlanetColor() {
  return currentPlanet === 'mercury' ? '#DEF4FC' : 
  currentPlanet === 'venus' ? '#F7CC7F' :
  currentPlanet === 'earth' ? '#545BFE' :
  currentPlanet === 'mars' ? '#FF6A45' :
  currentPlanet === 'jupiter' ? '#ECAD7A' :
  currentPlanet === 'saturn' ? '#FCCB6B' :
  currentPlanet === 'uranus' ? '#65F0D5' : '#497EFA';
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
  let image;
  switch (section) {
    case 'overview':
      image = 'planet'
      break;
    case 'structure':
      image = 'internal'
      break;
    case 'geology':
      image = 'geology'
      break;
    default:
      break;
  }
  const newObject = {};
  newObject['name'] = object.name;
  newObject['content'] = object[`${section}`]['content'];
  newObject['source'] = object[`${section}`]['source'];
  newObject['imageSource'] = object['images'][`${image}`];
  newObject['imageHeight'] = object.height;
  return newObject;
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
  const refactoredObject = await processObject(sectionName, data);
  mainText.innerHTML = Mustache.render(await renderTemplate('main_text'), refactoredObject);
  mainImage.innerHTML = Mustache.render(await renderTemplate('main_image'), refactoredObject);
  footer.innerHTML = Mustache.render(await renderTemplate('footer'), data);
};