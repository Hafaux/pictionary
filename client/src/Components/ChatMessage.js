import Twemoji from 'react-twemoji';

export default function ChatMessage({ msg }) {
    return (
        <li>
            {msg.admin ? 
                <b style={{"color": msg.color}}>{msg.text}</b> :
                <span><b>{msg.user}</b>: <Twemoji noWrapper={true}><span>{msg.text}</span></Twemoji></span>}
        </li>
    )
}