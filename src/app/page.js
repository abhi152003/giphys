"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css'
import { useRouter } from 'next/navigation';
import { auth } from './firebase';

const PAGE_LIMIT = 10;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState([]);
  const [user, setUser] = useState(null); 
  const router = useRouter();
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(gifs.length / PAGE_LIMIT);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    if (!user) {
      setShowLoginMessage(true);
      return;
    }

    try {
      if (user && searchQuery) {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${searchQuery}&api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=${PAGE_LIMIT}&offset=${(currentPage -1 ) * PAGE_LIMIT}`);
        const data = await response.json();
        setGifs(data.data);
      }
    } catch (error) {
      console.error('Error fetching GIFs:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    handleSearch();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      handleSearch();
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const offset = (pageNumber - 1) * PAGE_LIMIT;
    handleSearch(offset);
  };

  useEffect(() => {
    handleSearch();
  }, [currentPage]);

  const [favoriteGifs, setFavoriteGifs] = useState([]);

  const isFavorite = (gifId) => {
    return favoriteGifs.includes(gifId);
  };

  const handleFavoriteClick = (gifId) => {
    if (!isFavorite(gifId)) {
      const updatedFavorites = [...favoriteGifs, gifId];
      setFavoriteGifs(updatedFavorites);
      localStorage.setItem('favoriteGifs', JSON.stringify(updatedFavorites));
    }
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteGifs');
    if (storedFavorites) {
      setFavoriteGifs(JSON.parse(storedFavorites));
    }
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setFavoriteGifs([]); 
        localStorage.removeItem('favoriteGifs'); 
      }
    });
  
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push('/login'); 
  };

  const fetchFavoriteGifs = () => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favoriteGifs');
      if (storedFavorites) {
        const favoriteGifIds = JSON.parse(storedFavorites);
        const favoriteGifsFromStorage = favoriteGifIds.map((gifId) =>
          gifs.find((gif) => gif.id === gifId)
        );
        return favoriteGifsFromStorage.filter((gif) => gif !== undefined);
      }
    }
    return [];
  };

  useEffect(() => {
    const storedFavoriteGifs = fetchFavoriteGifs();
    setFavoriteGifs(storedFavoriteGifs);
  }, []);

  
  const favoriteGifsFromStorage = fetchFavoriteGifs();

  return (
    <main className={styles.main}>
      <div className={styles.searchContainer}>
        <button className={styles.searchButton} onClick={handleSearch}>
          Search
        </button>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for GIFs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            handleSearch(); 
          }}
        />
        {!user && (
            <button className={styles.searchButton} onClick={handleLoginClick}>Login</button>
          )
        }
        
      </div>
      {showLoginMessage && !user && (
          <span className={styles.loginMessage}>Please log in to search GIFs</span>
      )}
      <div className={styles.gifContainer}>
        {gifs.map((gif) => (
          <>
          <img 
            key={gif.id} 
            src={gif.images.fixed_height.url} 
            alt={gif.title} 
            className={styles.gif} 
          />
          <button onClick={() => handleFavoriteClick(gif.id)}>
            {isFavorite(gif.id) ? "🌟" : "⭐"}
          </button>
          </>
        ))}
      </div>
      {gifs.length > 0 && (
        <div className={styles.paginationButtons}>
          {currentPage > 1 && (
            <button onClick={handlePreviousPage}>Previous</button>
          )}
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          ))}
          <button onClick={handleNextPage}>Next</button>
        </div>
      )}
      {favoriteGifsFromStorage.length > 0 && (
        <div className={styles.favoritesSection}>
          <h2>Favorites</h2>
          {favoriteGifsFromStorage.map((gif) => (
            <img
              key={gif.id}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className={styles.gif}
            />
          ))}
        </div>
      )}
    </main>
  )
}