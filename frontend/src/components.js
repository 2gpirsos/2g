import React, { useState, useEffect } from 'react';

const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Header Component
const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`netflix-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-left">
        <img src="https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png" alt="Netflix" className="netflix-logo" />
        <nav className="header-nav">
          <a href="#home">Home</a>
          <a href="#tv-shows">TV Shows</a>
          <a href="#movies">Movies</a>
          <a href="#new">New & Popular</a>
          <a href="#my-list">My List</a>
        </nav>
      </div>
      <div className="header-right">
        <div className="search-icon">🔍</div>
        <div className="notifications-icon">🔔</div>
        <div className="profile-dropdown">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Profile" className="profile-avatar" />
          <div className="dropdown-content">
            <a href="#profile">Manage Profiles</a>
            <a href="#account">Account</a>
            <a href="#help">Help Center</a>
            <a href="#signout">Sign out of Netflix</a>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Component
const Hero = ({ movie, onPlay }) => {
  if (!movie) return null;

  const backgroundImage = movie.backdrop_path 
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : 'https://images.pexels.com/photos/2763927/pexels-photo-2763927.jpeg';

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>
        <p className="hero-description">{movie.overview}</p>
        <div className="hero-buttons">
          <button className="play-button" onClick={onPlay}>
            ▶️ Play
          </button>
          <button className="info-button">
            ℹ️ More Info
          </button>
        </div>
      </div>
      <div className="hero-fade"></div>
    </div>
  );
};

// Movie Row Component
const MovieRow = ({ title, movies, onMovieClick }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.querySelector(`[data-row="${title}"]`);
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button className="scroll-button left" onClick={() => scroll('left')}>
          ❮
        </button>
        <div className="movie-list" data-row={title}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scroll('right')}>
          ❯
        </button>
      </div>
    </div>
  );
};

// Movie Card Component
const MovieCard = ({ movie, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = movie.poster_path 
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : 'https://images.pexels.com/photos/3137890/pexels-photo-3137890.jpeg';

  return (
    <div 
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imageUrl} alt={movie.title || movie.name} />
      {isHovered && (
        <div className="movie-card-hover">
          <div className="hover-buttons">
            <button className="hover-play">▶️</button>
            <button className="hover-add">➕</button>
            <button className="hover-like">👍</button>
            <button className="hover-dislike">👎</button>
          </div>
          <div className="hover-info">
            <h4>{movie.title || movie.name}</h4>
            <div className="movie-meta">
              <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              <span className="year">{movie.release_date?.split('-')[0]}</span>
            </div>
            <div className="genres">
              <span className="genre-tag">Action</span>
              <span className="genre-tag">Drama</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ movie, onClose }) => {
  const [videoKey, setVideoKey] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        const trailer = data.results?.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
          setVideoKey(trailer.key);
        }
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [movie.id]);

  const backgroundImage = movie.backdrop_path 
    ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
    : 'https://images.pexels.com/photos/2763927/pexels-photo-2763927.jpeg';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-hero" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="modal-hero-content">
            <h1>{movie.title || movie.name}</h1>
            <div className="modal-buttons">
              <button className="modal-play">▶️ Play</button>
              <button className="modal-add">➕ My List</button>
              <button className="modal-like">👍</button>
              <button className="modal-dislike">👎</button>
            </div>
          </div>
        </div>

        <div className="modal-details">
          <div className="modal-main">
            <div className="movie-stats">
              <span className="match-score">98% Match</span>
              <span className="release-year">{movie.release_date?.split('-')[0]}</span>
              <span className="rating-badge">HD</span>
            </div>
            <p className="modal-description">{movie.overview}</p>
          </div>
          
          <div className="modal-sidebar">
            <div className="cast-info">
              <p><strong>Cast:</strong> Sample Actor, Another Actor, Third Actor</p>
              <p><strong>Genres:</strong> Action, Drama, Thriller</p>
              <p><strong>This movie is:</strong> Exciting, Suspenseful, Action-packed</p>
            </div>
          </div>
        </div>

        {videoKey && (
          <div className="video-section">
            <h3>Trailer</h3>
            <div className="video-container">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoKey}`}
                title="Movie Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
export { Hero, MovieRow, Modal };