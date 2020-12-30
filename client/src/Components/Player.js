export default function Player({ player, playerID }) {
    const defaultAvatar = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEyLTMwVDE3OjExOjIyKzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIwLTEyLTMwVDE3OjExOjIyKzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0zMFQxNzoxMToyMiswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjI4ODdkNjYtZmYzYS03ZDQyLTgyYmMtYmQwNGZlYWFiNzUzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYyODg3ZDY2LWZmM2EtN2Q0Mi04MmJjLWJkMDRmZWFhYjc1MyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjYyODg3ZDY2LWZmM2EtN2Q0Mi04MmJjLWJkMDRmZWFhYjc1MyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjI4ODdkNjYtZmYzYS03ZDQyLTgyYmMtYmQwNGZlYWFiNzUzIiBzdEV2dDp3aGVuPSIyMDIwLTEyLTMwVDE3OjExOjIyKzAyOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+EGr+OwAAAPZJREFUaIHtmDEKwzAMRZ3Sk+VM2UP3nilDz9S9HQxG2MWJv5LvGv6bErCih5Btken1/oTRuPUWQJA0C0mzkDQLSbOQNAtJs5A0C0mzGFL6DsTMy5qet+eDHB6AStuU5evV4ZEh20PSLJqls63TupOc4ZFJP2tISJoFciNG0r3QtJmwqAyw0thNdtYXkNNjd3iol7PD7GHBUnoaI4IPTJ7cKfZfBibr4W/9n5wsXVpe4Y3PHnU/2zyVlR02Yso9L2tpnHnbxZ6kAR6YKomz4h1feRzXlNd04vqP54RGUxaSZiFpFpJmIWkWkmYhaRaSZiFpFpJm8QXASGOSJ9yxmwAAAABJRU5ErkJggg==';

    let style = {};
    if (player.id === playerID) {
        style = {
            'color': '#0D8585'
        }
    }

    return (
        <li class="player">
            <img 
                src={player.avatar ? player.avatar : defaultAvatar} 
                class="avatar" 
                alt="avatar"
            ></img>
            <span style={style} class="playerName">{player.username}</span>
            <br />
            <span class="score">Score: {player.score}</span>
            <span class="playerPlace">#{player.place || 1}</span>
            <span class="playerStatus">{player.status}</span>
        </li>
    )
}