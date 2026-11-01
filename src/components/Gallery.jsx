import { useReducer, useEffect, useState, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos'
import favoritesReducer from '../reducer/favoritesReducer'

function Gallery() {
  const { photos, loading, error } = useFetchPhotos()

  const [favorites, dispatch] = useReducer(
    favoritesReducer,
    [],
    () => {
      const savedFavorites = localStorage.getItem('favorites')
      return savedFavorites ? JSON.parse(savedFavorites) : []
    }
  )

  const [search, setSearch] = useState('')

  // Save favorites in localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  // Toggle favorite
  const toggleFavorite = (photo) => {
    dispatch({
      type: 'TOGGLE_FAVORITE',
      payload: photo,
    })
  }

  // Search handler using useCallback
  const handleSearch = useCallback((event) => {
    setSearch(event.target.value)
  }, [])

  // Filter photos using useMemo
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    )
  }, [photos, search])

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="mt-4 text-gray-600 font-medium">
            Loading beautiful photos...
        </p>
        </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">

      <h1 className="text-3xl font-bold text-center text-gray-800">
        Celebrare Photo Gallery
      </h1>

      <p className="text-center text-gray-500 mt-2">
        Explore beautiful photos
      </p>

      <p className="text-center mt-4 font-semibold text-red-500">
        ❤️ Favorites: {favorites.length}
      </p>

      {/* Search Input */}
      <div className="max-w-md mx-auto mt-6">
        <input
          type="text"
          placeholder="Search photos by author..."
          value={search}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Photo Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {filteredPhotos.length > 0 ? (
          filteredPhotos.map((photo) => {
            const isFavorite = favorites.some(
              (item) => item.id === photo.id
            )

            return (
              <div
                key={photo.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                <img
                    src={photo.download_url}
                    alt={`Photo by ${photo.author}`}
                    className="w-full h-56 object-cover"
                />

                <div className="p-4 flex justify-between items-center">

                  <h2 className="font-semibold text-gray-800">
                    {photo.author}
                  </h2>

                  <button
                    onClick={() => toggleFavorite(photo)}
                    className="text-2xl hover:scale-125 transition duration-200"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>

                </div>

              </div>
            )
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No photos found.
          </p>
        )}

      </div>

    </div>
  )
}

export default Gallery