
// Simple toast
function toast(msg){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{ el.classList.remove('show'); el.addEventListener('transitionend', ()=> el.remove()); }, 2200);
}

// App state
const state = {
  recipe: null,
  isLoading: false,
  uploadedImageURL: null
};

// Elements
const landing = () => document.getElementById('landing');
const result = () => document.getElementById('result');
const loader = () => document.getElementById('loader');
const dropArea = () => document.getElementById('drop-area');
const fileInput = () => document.getElementById('file-input');
const genBtn = () => document.getElementById('generate-btn');
const sampleGrid = () => document.getElementById('sample-grid');
const recipeRoot = () => document.getElementById('recipe-root');
const tryAnother = () => document.getElementById('try-another');

// Sample images
const samples = [
  {src:'../imgs/sample-pizza.jpg', name:'Margherita Pizza'},
  {src:'assets/sample-pasta.jpg', name:'Creamy Pasta'},
  {src:'assets/sample-salad.jpg', name:'Fresh Salad'}
];

function renderSamples(){
  sampleGrid().innerHTML = '';
  samples.forEach((s, i)=>{
    const card = document.createElement('button');
    card.className = 'group overflow-hidden rounded-xl bg-white shadow-warm transition-smooth hover:-translate-y-0.5';
    card.innerHTML = `
      <div class="relative">
        <img src="${s.src}" alt="${s.name}" class="w-full h-40 object-cover group-hover:scale-105 transition-smooth"/>
        <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-smooth flex items-center justify-center">
          <span class="px-3 py-1 rounded-full bg-white/90 text-sm font-medium">${s.name}</span>
        </div>
      </div>
    `;
    card.addEventListener('click', ()=> {
      state.uploadedImageURL = s.src;
      startGeneration();
    });
    sampleGrid().appendChild(card);
  });
}

function show(section){
  landing().classList.add('hidden');
  result().classList.add('hidden');
  loader().classList.add('hidden');
  section.classList.remove('hidden');
}

function resetApp(){
  state.recipe = null;
  state.uploadedImageURL = null;
  fileInput().value = '';
  show(landing());
}

function attachUploader(){
  ['dragenter','dragover'].forEach(evt=>{
    dropArea().addEventListener(evt, e=>{ e.preventDefault(); e.stopPropagation(); dropArea().classList.add('dropzone-hover'); });
  });
  ['dragleave','drop'].forEach(evt=>{
    dropArea().addEventListener(evt, e=>{ e.preventDefault(); e.stopPropagation(); dropArea().classList.remove('dropzone-hover'); });
  });
  dropArea().addEventListener('drop', e=>{
    const file = e.dataTransfer.files?.[0];
    if(file) handleFile(file);
  });
  dropArea().addEventListener('click', ()=> fileInput().click());
  fileInput().addEventListener('change', (e)=>{
    const file = e.target.files?.[0];
    if(file) handleFile(file);
  });
}

function handleFile(file){
  if(!file.type.startsWith('image/')){
    toast('Please upload an image');
    return;
  }
  const url = URL.createObjectURL(file);
  state.uploadedImageURL = url;
  startGeneration();
}

function startGeneration(){
  state.isLoading = true;
  show(loader());
  // Simulate AI call (replace with real API later)
  setTimeout(()=>{
    state.recipe = generateMockRecipe();
    state.isLoading = false;
    renderRecipe();
    show(result());
    toast('Recipe generated!');
  }, 1500);
}

function generateMockRecipe(){
  // A friendly fake recipe that looks like the React one
  return {
    title: "Restaurant-Style Margherita Pizza",
    description: "A classic thin-crust pizza with fresh tomatoes, mozzarella, and basil.",
    cookTime: "25 mins",
    servings: "2-3",
    difficulty: "Easy",
    ingredients: [
      "2 cups all-purpose flour",
      "1 tsp instant yeast",
      "1/2 tsp sugar",
      "3/4 cup warm water",
      "2 tbsp olive oil",
      "1 cup crushed tomatoes",
      "200g fresh mozzarella, sliced",
      "Fresh basil leaves",
      "Salt & pepper"
    ],
    instructions: [
      "Preheat oven to 250°C (480°F) with a tray inside.",
      "Mix flour, yeast, sugar, water, and oil. Knead 5–7 mins.",
      "Roll dough thin, spread tomatoes, season lightly.",
      "Top with mozzarella. Bake 8–12 mins until blistered.",
      "Finish with basil and a drizzle of olive oil."
    ],
    tips: [
      "Chill the dough 1–2 hours for better flavor.",
      "Brush the crust with garlic oil before baking."
    ]
  };
}

function renderRecipe(){
  const r = state.recipe;
  if(!r) return;

  const diffClass = r.difficulty === 'Easy' ? 'badge-easy' : r.difficulty==='Medium' ? 'badge-medium' : 'badge-hard';

  recipeRoot().innerHTML = `
    <div class="w-full max-w-4xl mx-auto space-y-6">
      <div class="rounded-2xl bg-white shadow-elegant">
        <div class="p-6 flex items-start justify-between">
          <div class="flex-1">
            <h2 class="text-2xl font-bold mb-2">${r.title}</h2>
            <p class="text-neutral-600 text-lg">${r.description}</p>
          </div>
          <span class="px-2.5 py-1.5 rounded-full text-sm font-medium ${diffClass}">${r.difficulty}</span>
        </div>
        <div class="px-6 pb-6 grid grid-cols-3 gap-4 text-sm">
          <div class="rounded-lg bg-orange-50 p-3"><div class="font-semibold">Cook Time</div><div>${r.cookTime}</div></div>
          <div class="rounded-lg bg-orange-50 p-3"><div class="font-semibold">Servings</div><div>${r.servings}</div></div>
          <div class="rounded-lg bg-orange-50 p-3"><div class="font-semibold">Difficulty</div><div>${r.difficulty}</div></div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-white shadow-elegant">
          <div class="p-6 border-b"><h3 class="text-xl font-semibold">Ingredients</h3></div>
          <div class="p-6"><ul class="space-y-2">
            ${r.ingredients.map(i=>`
              <li class="flex items-start gap-3">
                <span class="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></span>
                <span class="text-sm">${i}</span>
              </li>`).join('')}
          </ul></div>
        </div>
        <div class="rounded-2xl bg-white shadow-elegant">
          <div class="p-6 border-b"><h3 class="text-xl font-semibold">Instructions</h3></div>
          <div class="p-6"><ol class="space-y-3 list-decimal list-inside">
            ${r.instructions.map(step=>`<li class="text-sm leading-relaxed">${step}</li>`).join('')}
          </ol></div>
        </div>
      </div>

      ${r.tips && r.tips.length ? `
      <div class="rounded-2xl bg-white shadow-elegant">
        <div class="p-6 border-b"><h3 class="text-xl font-semibold">Chef Tips</h3></div>
        <div class="p-6">
          <ul class="space-y-2">
            ${r.tips.map(t=>`
              <li class="flex items-start gap-3">
                <span class="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0"></span>
                <span class="text-sm">${t}</span>
              </li>`).join('')}
          </ul>
        </div>
      </div>`: ''}
    </div>
  `;
}

// Wire up
document.addEventListener('DOMContentLoaded', ()=>{
  renderSamples();
  attachUploader();
  genBtn().addEventListener('click', ()=> fileInput().click());
  tryAnother().addEventListener('click', resetApp);
});
