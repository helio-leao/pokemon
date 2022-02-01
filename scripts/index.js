/* API Info Fetch */

async function fetchPokemonList() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=26&offset=0')
    const jsonResponse = await response.json()

    return jsonResponse.results
}

async function fetchPokemonDataByUrl(url) {
    const response = await fetch(url)
    const jsonResponse = await response.json()

    return jsonResponse
}

async function fetchPokemonDataList(pokemonList) {
    const pokemonDataList = []

    for (const pokemon of pokemonList) {
        pokemonData = await fetchPokemonDataByUrl(pokemon.url)
        pokemonDataList.push(pokemonData)
    }

    return pokemonDataList
}

/* HTML Manipulation */

// async function addPokemonListToHtml(pokemonList) {
//     for (const pokemon of pokemonList) {
//         const pokemonData = await fetchPokemonDataByUrl(pokemon.url)

//         addPokemonDataToHtml(pokemonData)
//     }
// }

function addPokemonDataListToHtml(pokemonDataList) {
    pokemonDataList.forEach(pokemonData => {
        addPokemonDataToHtml(pokemonData)
    })
}

function addPokemonDataToHtml(pokemonData) {
    const pokemonsListHtml = document.querySelector('.pokemons-list')

    const hpStat = pokemonData.stats.find(item => item.stat.name === 'hp')
    const attackStat = pokemonData.stats.find(item => item.stat.name === 'attack')
    const defenseStat = pokemonData.stats.find(item => item.stat.name === 'defense')
    const specialAttackStat = pokemonData.stats.find(item => item.stat.name === 'special-attack')

    const pokemonHtml = `
        <li class="pokemons-list-item">
            <div class="pokemon-icon">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="pokemon-section-list-item-icon">
            </div>

            <div class="pokemon-description">
                <div class="pokemon-description-info">
                    <h2 class="pokemon-description-info-name">${pokemonData.name}</h2>
                    <span class="pokemon-description-info-category">${pokemonData.types[0].type.name}</span>
                </div>

                <ul class="pokemon-stats-list">
                    <li class="pokemon-stats-item">
                        <span>HP</span>
                        <div class="pokemons-list-item-stats-bar">
                            <div class="pokemons-list-item-stats-bar-inside" style="width:${hpStat.base_stat}%"></div>
                        </div>
                    </li>

                    <li class="pokemon-stats-item">
                        <span>Attack</span>
                        <div class="pokemons-list-item-stats-bar">
                            <div class="pokemons-list-item-stats-bar-inside" style="width:${attackStat.base_stat}%"></div>
                        </div>
                    </li>

                    <li class="pokemon-stats-item">
                        <span>Defense</span>
                        <div class="pokemons-list-item-stats-bar">
                            <div class="pokemons-list-item-stats-bar-inside" style="width:${defenseStat.base_stat}%"></div>
                        </div>
                    </li>

                    <li class="pokemon-stats-item">
                        <span>Special Attack</span>
                        <div class="pokemons-list-item-stats-bar">
                            <div class="pokemons-list-item-stats-bar-inside" style="width:${specialAttackStat.base_stat}%"></div>
                        </div>
                    </li>
            </div>
        </li>
    `

    pokemonsListHtml.insertAdjacentHTML("beforeend", pokemonHtml)
}

function clearPokemonsToHtml() {
    const pokemonListHtml = document.querySelector('.pokemons-list')
    pokemonListHtml.innerHTML = ''
}

/* Listeners and Handlers */

function handleSearchInput(event, pokemonDataList) {
    clearPokemonsToHtml()

    const value = event.target.value

    if (!value) {
        return addPokemonDataListToHtml(pokemonDataList)
    }

    pokemonDataList.forEach(pokemonData => {
        if (pokemonData.name.includes(value.toLowerCase())) {
            addPokemonDataToHtml(pokemonData)
        }
    })
}

function handleFilterClicked(event, pokemonDataList) {
    clearPokemonsToHtml()

    const filterButtons = document.querySelectorAll('.filter-button')
    const filterValue = event.target.innerHTML

    filterButtons.forEach(element => {
        element.classList.remove("active")
    })
    event.target.classList.add("active")

    if(filterValue === 'all') {
        return addPokemonDataListToHtml(pokemonDataList)
    }

    pokemonDataList.forEach(pokemonData => {
        if(pokemonData.types[0].type.name === filterValue) {
            addPokemonDataToHtml(pokemonData)
        }
    })
}

function setEventListeners(pokemonDataList) {
    const searchInput = document.querySelector('.search-bar-input')
    searchInput.addEventListener('change', (event) => handleSearchInput(event, pokemonDataList))

    const filterButtons = document.querySelectorAll('.filter-button')
    filterButtons.forEach(element => {
        element.addEventListener('click', event => handleFilterClicked(event, pokemonDataList))
    })
}

/* Main Function */

async function main() {
    const pokemonList = await fetchPokemonList()
    const pokemonDataList = await fetchPokemonDataList(pokemonList)
    addPokemonDataListToHtml(pokemonDataList)

    setEventListeners(pokemonDataList)
}

main()