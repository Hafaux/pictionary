import { useState, createContext, useContext } from 'react';

export const GameContext = createContext();

export function usePlayers() {
    return useContext(GameContext);
}

export function PlayersProvider({ children }) {
    const [players, setPlayers] = useState([]);

    return (
        <GameContext.Provider value ={[players, setPlayers]}>
            {children}
        </GameContext.Provider>
    )
} 