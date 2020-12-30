import '../css/Home.css';
import RoomItem from './RoomItem';

function Home(props) {
    const rooms = props.rooms.map(room => {
        return <RoomItem key={room.id} room={room} joinRoom={props.joinRoom}/>
    })

    return (
        <div className="join-container">
            <header className="join-header">
                <h1>Pictionary</h1>
            </header>
            <main className="join-main">
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        maxLength="16"
                        name="username"
                        id="username"
                        placeholder="Enter username..."
                        required
                    />
                </div>
                <div className="form-control">
                    <table id="rooms" style={{"width": "100%"}}>
                        <thead>
                            <tr>
                                <th>Room Name</th>
                                <th>Players</th>
                                <th>Rounds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms} 
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    )
}

export default Home;