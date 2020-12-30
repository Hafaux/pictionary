import '../css/GameCanvas.css';
import { Game } from '../js/Game';
import { useEffect, useRef } from 'react';


function GameCanvas({ socket }) {
    const canvas = useRef(null);
    
    useEffect(() => {
        const game = new Game(socket, canvas.current);
        game.init();
    }, []);

    return (
        <div className="gameCanvas">
            <canvas ref={canvas} id="canvas" height="750" width="1000"></canvas>
        </div>
    )
}

export default GameCanvas;