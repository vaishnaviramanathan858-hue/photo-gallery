import { useReducer, useEffect, useState, useCallback, useMemo } from "react";
import useFetchPhotos from "../hooks/useFetchPhotos";
import { favouritesReducer } from "../hooks/favouritesReducer";

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState("");

  const [favourites, dispatch] = useReducer(favouritesReducer, [], () => {
    try {
      return JSON.parse(localStorage.getItem("favourites")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [photos, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 mt-10 text-lg">Error: {error}</p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by author name..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img
              src={`https://picsum.photos/id/${photo.id}/400/300`}
              alt={photo.author}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-medium">{photo.author}</span>
              <button
                onClick={() => dispatch({ type: "TOGGLE_FAVOURITE", id: photo.id })}
                className="text-2xl text-red-500"
                aria-label="Toggle favourite"
              >
                {favourites.includes(photo.id) ? "♥" : "♡"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}