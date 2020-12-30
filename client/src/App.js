import "./css/App.css";
import GameContainer from "./Components/GameContainer";
import Home from "./Components/Home";
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// const socket = io();
const socket = io('http://localhost:5000');

function App() {
	// const [messages, setMessages] = useState([]);
	const [rooms, setRooms] = useState([]);
	const [connected, setConnected] = useState(false);
	const [players, setPlayers] = useState([]);
	const [playerID, setPlayerID] = useState(null);

	function onRooms(_rooms) {
		setRooms([..._rooms]);
	}

	function joinRoom(e) {
		const username = document.querySelector('#username').value.trim();
		const roomID = e.target.parentElement.dataset.id;
		if (!roomID) return;

		socket.emit('join', username, roomID);
	}

	function onRoomJoin(_playerID, roomData) {
		console.log('Player ID: ', _playerID);
		setPlayerID(_playerID);
		console.log('Room data:', roomData);
		
		setConnected(true);
	}

	function onPlayerList(players) {
		setPlayers(players);
	}

	useEffect(() => {
		socket.on('rooms', onRooms);
		socket.on('roomJoin', onRoomJoin);
		socket.on('playerList', onPlayerList);
	}, []);

	return (
		<div>
			{ connected ? 
				<GameContainer 
					playerID={playerID} 
					players={players} 
					socket={socket} 
				/> :
				<Home 
					rooms={rooms} 
					joinRoom={joinRoom} 
				/>
			}
		</div>
	)
}

export default App;
