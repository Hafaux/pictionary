export default function parseColorHex(_color) {
    let colorRGB = _color.replace(/[^\d,]/g, "").split(",").map((str) => parseInt(str));
    colorRGB = '0xFF' + colorRGB.reverse().map( x => {
        x = x.toString(16).toUpperCase();
        return (x.length === 1) ? "0" + x : x;
    }).join('');
    return parseInt(colorRGB);
}