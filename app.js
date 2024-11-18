renderHtml('mercury');

const mainElement = document.getElementById('js__main');

const mainTemplate = `
  <div class="p-5">
    <img class="img-fluid" src="{{{images.planet}}}" alt="" />
  </div>
  <h2 class="font-antonio fw-500 mb-3 fs-1" id="js__name">
    {{name}}
  </h2>
  <div class="font-spartan fw-400 fs-6 px-4">
    {{overview.content}}
    <div class="mt-3">
      Source : <a href="{{{overview.source}}}">Wikipedia</a>
    </div>
  </div>
`;

document.querySelectorAll('.navbar--mobile__planets ~ a')
.forEach((e) => {
  e.addEventListener('click', () => {
    renderHtml(e.innerHTML);
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
  mainElement.innerHTML = Mustache.render(mainTemplate, data);
  document.getElementById('navbarNav').classList.toggle('show');
};