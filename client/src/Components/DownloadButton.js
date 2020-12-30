export default function KickButton() {
    function handleClick() {
        downloadDrawing('mew-' + Date.now());
    }

    function downloadDrawing(name) {
        const canvas = document.querySelector('#canvas');
        const a = document.createElement('a');
        a.download = name + '.png';
        a.href = canvas.toDataURL();
        a.click();
    }

    return (
        <div onClick={handleClick} class="downloadButton bottomButton"><span>Download Drawing</span></div>
    )
}