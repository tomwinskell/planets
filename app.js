renderHtml('mercury');

const mainElement = document.getElementById('js__main');
const footer = document.getElementById('js__footer');

document.querySelectorAll('.navbar--mobile__planets ~ a')
.forEach((e) => {
  e.addEventListener('click', () => {
    renderHtml(e.innerHTML);
    document.getElementById('navbarNav').classList.toggle('show');
  })
});

async function readJsonFile() {
  const data = await fetch('./data.json')
  return response = data.json();
}

// search through the data for the planet
async function searchJson(key, value) {
  const json = await readJsonFile();
  for (let i = 0; i < json.length; i++) {
    if (json[i][key].toLowerCase() === value.toLowerCase()) {
      return json[i];
    };
  };
};

async function renderHtml(value) {
  const data = await searchJson('name', value);
  mainElement.innerHTML = Mustache.render(await renderTemplate('overview'), data);
  footer.innerHTML = Mustache.render(await renderTemplate('footer'), data);
};

async function renderTemplate(templateName) {
  const response = await fetch(`./${templateName}.mustache`);
  const template = await response.text();
  return template;
}