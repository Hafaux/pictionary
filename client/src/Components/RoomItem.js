export default function RoomItem({ room, joinRoom }) {

    return (
        <tr data-id={room.id} className="room" onClick={joinRoom}> 
            <td>{room.name}</td>
			<td>{room.players.length}/{room.maxPlayers}</td>
			<td>{room.currentRound}/{room.maxRounds}</td>
        </tr>
    )
}

