import Interface from './Interface';
import Playerlist from './Playerlist';
import GameCanvas from './GameCanvas';
import Chat from './Chat';
import KickButton from './KickButton';
import Tools from './Tools';
import DownloadButton from './DownloadButton';
import '../css/GameContainer.css';
import '../css/BottomRow.css';

function GameContainer(props) {
    return (
        <div className="gameContainer">
            <Interface />
            <Playerlist players={props.players} playerID={props.playerID} />
            <GameCanvas socket={props.socket} />
            <Chat socket={props.socket} />
            <KickButton />
            <Tools />
            <DownloadButton />
        </div>
    )
}

export default GameContainer;