import React, { useState, useEffect } from 'react';
import './App.css';

// Components
import Header from './components';
import Hero from './components';
import MovieRow from './components';
import Modal from './components';

const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  const [movies, setMovies] = useState({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    documentary: []
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);

  const fetchMovies = async (endpoint, category) => {
    try {
      const response = await fetch(`${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
      const data = await response.json();
      setMovies(prev => ({
        ...prev,
        [category]: data.results || []
      }));
      
      // Set hero movie from trending
      if (category === 'trending' && data.results && data.results.length > 0) {
        setHeroMovie(data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
    }
  };

  useEffect(() => {
    // Fetch different categories of movies
    fetchMovies('trending/movie/week', 'trending');
    fetchMovies('movie/popular', 'popular');
    fetchMovies('movie/top_rated', 'topRated');
    fetchMovies('movie/upcoming', 'upcoming');
    fetchMovies('discover/movie?with_genres=28', 'action');
    fetchMovies('discover/movie?with_genres=35', 'comedy');
    fetchMovies('discover/movie?with_genres=27', 'horror');
    fetchMovies('discover/movie?with_genres=10749', 'romance');
    fetchMovies('discover/movie?with_genres=99', 'documentary');
  }, []);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  return (
    <div className="App">
      <Header />
      {heroMovie && <Hero movie={heroMovie} onPlay={() => handleMovieClick(heroMovie)} />}
      
      <div className="movie-rows">
        <MovieRow title="Trending Now" movies={movies.trending} onMovieClick={handleMovieClick} />
        <MovieRow title="Popular Movies" movies={movies.popular} onMovieClick={handleMovieClick} />
        <MovieRow title="Top Rated" movies={movies.topRated} onMovieClick={handleMovieClick} />
        <MovieRow title="Coming Soon" movies={movies.upcoming} onMovieClick={handleMovieClick} />
        <MovieRow title="Action Movies" movies={movies.action} onMovieClick={handleMovieClick} />
        <MovieRow title="Comedy Movies" movies={movies.comedy} onMovieClick={handleMovieClick} />
        <MovieRow title="Horror Movies" movies={movies.horror} onMovieClick={handleMovieClick} />
        <MovieRow title="Romance Movies" movies={movies.romance} onMovieClick={handleMovieClick} />
        <MovieRow title="Documentaries" movies={movies.documentary} onMovieClick={handleMovieClick} />
      </div>

      {showModal && selectedMovie && (
        <Modal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default App;