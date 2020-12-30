
function preventDefault(e) {
	e.preventDefault();
}

const keys = { 32: 1, 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefaultForScrollKeys(e) {
	if (keys[e.keyCode]) {
		preventDefault(e);
		return false;
	}
}
 
let supportsPassive = false;
try {
	window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
		get: function() {
			supportsPassive = true;
			return true;
		}
	}));
}
catch(e) {
	console.log(e);
}
 
const wheelOpt = supportsPassive ? { passive: false } : false;
const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
 
function disableScroll() {
	window.addEventListener('DOMMouseScroll', preventDefault, false);
	window.addEventListener(wheelEvent, preventDefault, wheelOpt);
	window.addEventListener('touchmove', preventDefault, wheelOpt);
	window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}
 
function enableScroll() {
	window.removeEventListener('DOMMouseScroll', preventDefault, false);
	window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
	window.removeEventListener('touchmove', preventDefault, wheelOpt);
	window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}

const scroll = {
    disable: disableScroll,
    enable: enableScroll,
}

export default scroll;