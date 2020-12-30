export default function Tools() {
    const colors = ["#ffffff","#000000","#12173D","#293268","#464B8C","#6B74B2","#909EDD","#C1D9F2","#FFCCD0","#F29FAA","#C37289","#994C69","#723352","#3F1F3C","#B22E69","#E54286","#FF6EAF","#FFA5D5","#8CFF9B","#42BC7F","#22896E","#14665B","#0F4A4C","#0A2A33","#1D1A59","#322D89","#354AB2","#3E83D1","#50B9EB","#8CDAFF","#B483EF","#854CBF","#5D2F8C","#431E66","#FFE091","#FFAA6E","#FF695A","#B23C40","#721C2F", "#FF0000"];
    
    const colorNodes = colors.map((color, index) => {
        return <div className="color" style={{"background": color}}></div>
    })

    return (
        <div className="tools">
            <div class="icons">
                <div id="brushTool"><i className="fas fa-paint-brush"></i></div>
                <div id="fillTool"><i className="fas fa-fill"></i></div>
                <div id="eraserTool"><i className="fas fa-eraser"></i></div>
                <div id="undoButton"><i className="fas fa-undo-alt"></i></div>
                <div id="trashButton"><i className="fas fa-trash"></i></div>
            </div>
            <input type="range" min="2" max="62" step="4" id="brushSlider" />
            <div class="colors">
                {colorNodes}
            </div>
        </div>
    )
}