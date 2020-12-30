import '../css/Playerlist.css';
import Player from './Player';

function Playerlist(props) {
    const players = props.players.map((player, index) => {
        return (
            <Player
                key={index} 
                player={player} 
                playerID={props.playerID}
            />
        )
    });

    return (
        <div className="playerlist">
            <ul>
                {players}
            </ul>
        </div>
    );
}

export default Playerlist;