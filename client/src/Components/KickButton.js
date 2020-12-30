export default function KickButton() {

    function handleClick() {
        const html = document.querySelector("html");
        html.classList.toggle('darkMode');
    }

    return (
        <div 
            onClick={handleClick} 
            className="kickButton bottomButton"
        >
            <span>Toggle Theme</span>
        </div>
    )
}