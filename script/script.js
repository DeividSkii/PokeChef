const tipoParaComida = {
  fire: "spicy", water: "seafood", grass: "vegan", electric: "quick",
  ice: "ice", fighting: "beef", psychic: "vegetarian", dark: "chocolate",
  fairy: "dessert", dragon: "asian", rock: "bbq", ground: "burger",
  bug: "salad", poison: "curry", normal: "chicken", steel: "pasta",
  flying: "sandwich", ghost: "chocolate"
};

const pokemonInput = document.getElementById("pokemon-input");
const buscarBtn = document.getElementById("buscar-btn");
const pokemonCard = document.getElementById("pokemon-card");
const receitaCard = document.getElementById("receita-card");


//Buscas na api

async function buscarPokemon(nome) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`)
    if (!res.ok) {
        throw new Error("Pokemon não encontrado")
    }
    return res.json();
}

async function buscarReceita(palavra) {
    const res = await fetch (`https://www.themealdb.com/api/json/v1/1/search.php?s=${palavra}`)
    const data = await res.json()
    if (!data.meals) { 
        return null;
    }
    return data.meals[Math.floor(Math.random() * data.meals.length)]
}

//renderizar

function colocarPokemon(p) {
    const tipo = p.types[0].type.name;

    pokemonCard.innerHTML = `
    <div class="card-header">Pokémon</div>
    <div class="pokemon-main">
      <img src="${p.sprites.front_default}" alt="${p.name}">
      <div class="pokemon-name">${p.name.toUpperCase()}</div>
      <span class="type-pill">${tipo}</span>
    </div>
    <div class="info-row">
      <span>ID: ${p.id}</span>
      <span>H: ${p.height}</span>
      <span>W: ${p.weight}</span>
    </div>
    `;
    return tipo;
}

function renderReceita(meal, tipo, palavra) {
  if (!meal) {
    receitaCard.innerHTML = `
      <div class="card-header">Recipe</div>
      <p class="muted">Nenhuma receita encontrada para: <strong>${palavra}</strong>.</p>
    `;
    return;
  }

  const resumo = (meal.strInstructions || "").split(".").slice(0, 3).join(".") + ".";

  receitaCard.innerHTML = `
    <div class="card-header">Recipe</div>
    <div class="recipe-main">
      <img src="${meal.strMealThumb}">
      <div>
        <h3>${meal.strMeal}</h3>
        <div class="recipe-meta">
          <strong>${meal.strCategory}</strong> • ${meal.strArea}<br>
          Tema: ${palavra} (${tipo})
        </div>
      </div>
    </div>
    <div class="recipe-body">${resumo}</div>
    ${meal.strSource ? `<a class="recipe-link" href="${meal.strSource}" target="_blank">Ver completa</a>` : ""}
  `;
}

//fluxo

async function executarBusca() {
    const nome = pokemonInput.value.trim();
    if (!nome) {
        return alert("Digite o nome de um pokémon correto.")
    }

    pokemonCard.innerHTML = `<div class="card-header">Pokémon</div><p class="muted">Carregando...</p>`;
    receitaCard.innerHTML = `<div class="card-header">Recipe</div><p class="muted">Carregando...</p>`;

    try {
        const pokemon = await buscarPokemon(nome)
        const tipo = colocarPokemon(pokemon);
        
        const palavra = tipoParaComida[tipo] || "random"
        const receita = await buscarReceita(palavra)

        renderReceita(receita,tipo,palavra)
    } catch {
         pokemonCard.innerHTML = `<div class="card-header">Pokémon</div><p class="muted">Pokémon não encontrado.</p>`
         receitaCard.innerHTML = `<div class="card-header">Recipe</div><p class="muted">Nenhuma receita carregada.</p>`
    }
}

// eventos

buscarBtn.addEventListener("click", executarBusca)
pokemonInput.addEventListener("keydown", (e) => e.key === "Enter" && executarBusca())