import React, { useState } from 'react';

const GameNames = {
  "endless-siege-2": 'Endless Siege',
  "candy-fiesta": 'Candy Fiesta',
  "templok": 'Templok',
  "ringy-dingy": 'RingyDingy',
  "rug-pool": 'Rug Pool',
  "maze": 'The Maze'
};

function SelectGameDropdown({ game, setGame }) {
  const [isActive, setIsActive] = useState(false);

  const handleGameSelect = (selectedGame) => {
    setGame(selectedGame);
    setIsActive(false);
  };

  const renderDropdownItems = () => {
    const gameKeys = Object.keys(GameNames);

    return (
      <>
        <a
          className={`dropdown-item ${!game ? 'is-active' : ''}`}
          onClick={() => handleGameSelect(undefined)}
        >
          All Games
        </a>
        {gameKeys.map((gameKey) => (
          <a
            key={gameKey}
            className={`dropdown-item ${game === gameKey ? 'is-active' : ''}`}
            onClick={() => handleGameSelect(gameKey)}
          >
            {GameNames[gameKey]}
          </a>
        ))}
      </>
    );
  };

  return (
    <div className={`dropdown mt-0 mb-0 ${isActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <button
          className="custom-button"
          aria-haspopup="true"
          style={{ minWidth: '140px' }}
          onClick={() => setIsActive(!isActive)}
          aria-controls="dropdown-menu"
        >
          <span>{!game ? 'All Games' : GameNames[game]}</span>
          <div className={`arrow ${!isActive ? 'down' : ''}`}></div>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div
          className="dropdown-content"
          style={{ maxWidth: '140px', minHeight: '240px', overflow: 'hidden' }}
        >
          {renderDropdownItems()}
        </div>
      </div>
    </div>
  );
}

export default SelectGameDropdown;
