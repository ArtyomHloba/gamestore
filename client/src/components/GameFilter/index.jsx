import { useState, useEffect } from "react";
import GameSlider from "./../GameSlider/index";
import styles from "./GameFilter.module.css";

function GameFilter({ onFilterChange }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [maxPrice, setMaxPrice] = useState(100);

  useEffect(() => {
    onFilterChange({ search, genre, maxPrice });
  }, [search, genre, maxPrice, onFilterChange]);

  return (
    <>
      <GameSlider />
      <div className={styles.filterContainer}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className={styles.selectGames}
          value={genre}
          onChange={e => setGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="RPG">RPG</option>
          <option value="Strategy">Strategy</option>
          <option value="Shooter">Shooter</option>
        </select>

        <input
          className={styles.maxPriceInput}
          type="range"
          min="0"
          max="100"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
        />
        <span>Max Price: ${maxPrice}</span>
      </div>
    </>
  );
}

export default GameFilter;
