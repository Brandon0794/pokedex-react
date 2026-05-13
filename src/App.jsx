import { useState, useEffect } from 'react'

function App() {
  const [pokemon, setPokemon] = useState('')
  const [pokemonData, setPokemonData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pokemonList, setPokemonList] = useState([])// sugerencia o filtro
  const featuredPokemon = ['pikachu', 'charizard', 'bulbasaur', 'squirtle', 'eevee', 'gengar',]// Ejemplos
  //sugerencia 
  useEffect(() => {
    async function cargarPokemones() {
      const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
      const datos = await respuesta.json()

      setPokemonList(datos.results)
    }

    cargarPokemones()
  }, [])// fin del metodo de sugerencia.
  const filteredPokemon = pokemonList.filter((poke) =>
    poke.name.startsWith(pokemon.toLowerCase())
  )
  //--------------------------------------------------------------
  async function buscarPokemon() {
    if (pokemon.trim() === '') {
      alert('Escribe el nombre de un Pokémon')
      return
    }

    try {
      setLoading(true)

      const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`
      )

      if (!respuesta.ok) {
        throw new Error('Pokémon no encontrado')
      }

      const datos = await respuesta.json()

      setPokemonData(datos)
    } catch (error) {
      console.log(error)
      setPokemonData(null)
      alert('Ese Pokémon no existe')
    } finally {
      setLoading(false)
    }
  }// final de la funcion buscar pokemon
  // inicio el diseño 
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8 sm:px-6 md:px-10">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-yellow-400 text-center">
        Pokédex
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md">

        <input
          type="text"
          placeholder="Buscar Pokémon"
          value={pokemon}
          onChange={(event) => {
            setPokemon(event.target.value)

            if (event.target.value === '') {
              setPokemonData(null)
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              buscarPokemon()
            }
          }}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition w-full sm:w-auto"
        />

        <button
          onClick={buscarPokemon}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
        >
          Buscar
        </button>


      </div>

      <div className="mb-8">

        <h2 className="text-xl font-semibold mb-4 text-gray-300">
          Ejemplos de Pokémon
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

          {featuredPokemon.map((name) => (
            <button
              key={name}
              onClick={() => setPokemon(name)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 capitalize hover:bg-gray-700 transition"
            >
              {name}
            </button>
          ))}

        </div>

      </div>

      {pokemon !== '' && pokemon !== pokemonData?.name && (
        <div>
          {filteredPokemon.slice(0, 5).map((poke) => (
            <p
              key={poke.name}
              onClick={async () => {

                setPokemon(poke.name)

                const respuesta = await fetch(
                  `https://pokeapi.co/api/v2/pokemon/${poke.name}`
                )

                const datos = await respuesta.json()

                setPokemonData(datos)
              }}
            >
              {poke.name}
            </p>
          ))}
        </div>
      )}

      {loading && <p>Cargando...</p>}


      {pokemonData && (
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-lg border border-gray-700">

          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="w-40 mx-auto"
          />

          <h2 className="text-3xl font-bold text-center capitalize mb-4">
            {pokemonData.name}
          </h2>
          <p>ID: {pokemonData.id}</p>
          <p>
            Altura: {(pokemonData.height / 10).toFixed(1)} m
          </p>

          <p>
            Peso: {(pokemonData.weight / 10).toFixed(1)} kg
          </p>
        </div>
      )}
    </div>
  )
}

export default App