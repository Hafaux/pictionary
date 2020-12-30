import floodFill from "./FloodFill";
import PxBrush from "./PxBrush";
import parseColorHex from "./ParseColorHex";
import scroll from "./disableScroll";

export class Game {
	constructor(socket, canvas = null) {
		this.socket = socket;
		this.canvas = canvas || document.querySelector("#canvas");
		this.ctx = this.canvas.getContext("2d", { alpha: false });
		this.pxBrush = new PxBrush(this.canvas);
		this.maxUndos = 20;
		this.drawingHistory = [];
		this.maxBrushSize = 64;
		this.minBrushSize = 2;
		this.pointerDown = false;
		this.startPos = null;
		this.gameStarted = false;
		this.color = "rgb(0, 0, 0)";
		this.size = 10;
		this.tools = {
			brush: "BRUSH",
			fill: "FILL",
			eraser: "ERASER",
		};
		this.tool = this.tools.brush;
	}

	setTool(toolStr) {
		switch (toolStr) {
			case "ERASER":
				this.tool = this.tools.eraser;
				break;
			case "BRUSH":
				this.tool = this.tools.brush;
				break;
			case "FILL":
				this.tool = this.tools.fill;
				break;
			default:
				break;
		}
		this.updateCursor();
	}

	loadDataURL(data) {
		const canvasImage = new Image(this.canvas.width, this.canvas.height);
		canvasImage.src = data;
		canvasImage.onload = () => {
			this.ctx.drawImage(canvasImage, 0, 0);
			this.drawingHistory.push(
				this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
			);
		};
	}

	loadCanvasState(state) {
		if (state) {
			this.loadDataURL(state);
		} else {
			this.clearCanvas();
		}
	}

	emitClear() {
		this.socket.emit("drawCommand", [3]);
		this.clearCanvas();
		this.sendCanvasState();
	}

	sendCanvasState() {
		this.socket.emit("canvasState", this.canvas.toDataURL());
	}

	undo() {
		if (this.drawingHistory.length <= 1) return;

		this.drawingHistory.pop();
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.putImageData(
			this.drawingHistory[this.drawingHistory.length - 1],
			0,
			0
		);
		this.sendCanvasState();
		this.socket.emit("drawCommand", [4, this.canvas.toDataURL()]);
	}

	clearCanvas() {
		this.ctx.fillStyle = "#fff";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.saveCanvas();
	}

	saveCanvas() {
		if (this.drawingHistory.length > this.maxUndos) this.drawingHistory.shift();
		this.drawingHistory.push(
			this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
		);
    }
    
    clamp(value, min, max) {
        return value > max ? max : value < min ? min : value;
    }

	getSizePressure(e) {
		if (e.pointerType !== "mouse") {
			this.size = this.clamp(
				Math.round(70 * e.pressure ** 2 - 6),
				this.minBrushSize,
				this.maxBrushSize
			);
		}
	}

	canDraw() {
		return true;
		// return (!roundIntermission && gameStarted && currentDrawerId === playerID)
	}

	getPosition(canvas, event) {
		const canvasRect = canvas.getBoundingClientRect();
		const canvasScale = canvas.width / canvasRect.width;
		return {
			x: ((event.clientX - canvasRect.left) * canvasScale) | 0,
			y: ((event.clientY - canvasRect.top) * canvasScale) | 0,
		};
	}

	drawLine(fromPos, toPos, size, color) {
		this.pxBrush.draw({
			from: fromPos,
			to: toPos,
			size,
			color,
		});
	}

	updateCursor() {
		if (this.tool === "FILL") {
			this.canvas.style.cursor = `
                url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTEyLTI5VDIzOjAwOjMxKzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0xMi0yOVQyMzoxNTowNiswMjowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0xMi0yOVQyMzoxNTowNiswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowMzMyYTlhNS1iYWFjLTNhNDUtOWFhYS1lYWY1MWIzOGVkOTciIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDoyOGRkYjhhOC04NzllLWM4NDctOThmOC03MTZlMGU3NmFkYWMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxN2UwOGE5MS0zYjJmLWY0NGUtYjFlNi1hYTYzYjczZGEwY2IiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjE3ZTA4YTkxLTNiMmYtZjQ0ZS1iMWU2LWFhNjNiNzNkYTBjYiIgc3RFdnQ6d2hlbj0iMjAyMC0xMi0yOVQyMzowMDozMSswMjowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowMzMyYTlhNS1iYWFjLTNhNDUtOWFhYS1lYWY1MWIzOGVkOTciIHN0RXZ0OndoZW49IjIwMjAtMTItMjlUMjM6MTU6MDYrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5irE6qAAAEsUlEQVR4nO2bu27bMBSGfzpC46RAgCBohhgw0JcwPHcvUKBDBHRxH6GDunTuUj1EPcpDpuyZ8xQdDCRL92YxwA6OFIri4UUkRSXIP9myzMun/xxeJDHOOZ6xfBvPqB8mngW/WGWpG9BDSpcwRl789p/bEVJ/6fyZPZNQ8oLRKUzd51Zhz8ExrV70haEqQ2eKsTomOAyyonb/m4rG5pjOVXKEojvZyQFjckwvl9TtZ/YEOx0WGIzOMU8t6ze6gHPOazjyb1KZDBbuGYNjnKF0Cuj2QVmQUH57zFY4JvUEzxsK8V/l1XYxQUowQaCIZUjleMFJnmN0UBhjyLIMWbZv5m63w263088/GHNyBqVUYDighsIYw+HhIU5OTnB2dobpdIqDg4MGjqjb21tl4QIcDv0QTipF8iWhTCYTLBYLPDw8YDqdWoUYBQdowqa7DmLMmHyTOIbq8GKxAAAcHR2FrK6Xa4ZMvhya+cNyuQxeoWp4tk30Q4HRNiwGFEV9HIaLI2oIMINCWa1WnWOWLmmdNFgoxYBCJV4KjqoN1OATe1Qi3aKDcnx13fr+7/NH5XkyGBnIer02N5BzMMY6HGI6ptfMVoZCHQshnSmih5JLCOkAyL/p5i+1VCElS+UWIMFaySev6MBREKjjphQSCww5u5V1fHXddJjKJfL5LqLyjLDvqyQ0qGNkt4idFOGYANmEEWBOvtT+DBBnSWDtllDqMxrVohacgzlGlVtEZ4ifdeFyM3unrYeCslqtyHyjXDoEnseQbrFNuq5QxM7qoIhSnSevsAdxTAgoOq3Xa2so1DHZNSHBeOUWExQqhHT5xGYeQylkKCnBmNxi4xJTXlHJBooMVQynJBtVLiHjCsXHJaKCgtGFUZ/84QIlFJBaocAo43G5XDoDSeUQWVFD6TmEDKWk95ViJVUbmWbHUcHczN7hw93fzrE+iu0QeXQOCuZxN6x1bKwgNGJAODBWj1bYKCGQlpLfuwaGh2Gz+g4ORhVOosbiCFGxtzafVmHpH0YiZXBLtP0YIxyXTaSUinFfyekhwyFDy7APAwgXNtYNN+cnMGMDsoACDAAG8HhmNzQkKnwptwAD3qJtKnTYyPIFpMtnOijAcE9UBXtJwhaWAxTAFcx8PgeAC+nwPQBst1urBortoX7wudWiAmUZOk31qoOmCd5FWZZ34oGiKGZlWd4b/mfTgKaVYoNdIdkO/y5QAINjNpsNB4A8zwEAVVU1/7u8vLRqkIV8X6wwV2D55LioMayVxEbubwnq3wVwUh8owDjAiFKu0smnnjTAFHCdBpqxgQHUV9T33QDn0TcDnkYfOdFqxDebTfOlTsgB805yMc455vO5DsofAD8BnAL4DuBcdVJRFLPtdttntPKRyQa9k1MrlOrRR1RVVb8A/H78eprn+Q/FOX3r91W0Z01scsx77LcnMgCzWA0Zm1pgiCv/FcAb7EPoU0J3DKp6o+q+KArKDed5nn/L8/wLgLeqEzxmw6NV45jHjpHTdkmt88qyDNys9Er9TuRolQH0Slmcq8h6SXMWlV4dQ0gLpk7IVVU1I5YmSb8oaecxZVl2RquXNvpQGsOb+qPUa44h9AqG0H/nFPxcTdcNiQAAAABJRU5ErkJggg==') 10 58, default
            `;
			return;
		}

		const canvasRect = this.canvas.getBoundingClientRect();
		const canvasScale = this.canvas.width / canvasRect.width / window.devicePixelRatio;

		const cursorCanvas = document.createElement("canvas");
		const canvasSize = this.size / canvasScale + 3;
		cursorCanvas.width = canvasSize;
		cursorCanvas.height = canvasSize;
		const cursorCtx = cursorCanvas.getContext("2d");

		const circleRadius = Math.max(this.size / 2 / canvasScale + 1, 2);
		const pos = circleRadius;

		cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
		cursorCtx.fillStyle = this.tool === "BRUSH" ? this.color : "white";
		cursorCtx.beginPath();
		cursorCtx.arc(pos, pos, circleRadius, 0, 2 * Math.PI);
		cursorCtx.fill();

		cursorCtx.beginPath();
		cursorCtx.arc(pos, pos, circleRadius - 2, 0, 2 * Math.PI);
		cursorCtx.strokeStyle = "black";
		cursorCtx.stroke();

		cursorCtx.beginPath();
		cursorCtx.arc(pos, pos, circleRadius - 1, 0, 2 * Math.PI);
		cursorCtx.strokeStyle = "white";
		cursorCtx.stroke();

		this.canvas.style.cursor = `
            url(${cursorCanvas.toDataURL()}) ${pos} ${pos}, default
        `;
		// console.log(cursorCanvas.toDataURL());
	}

	initTools() {
		const brushTool = document.querySelector('#brushTool');
		const fillTool = document.querySelector('#fillTool');
		const eraserTool = document.querySelector('#eraserTool');
		const undoButton = document.querySelector('#undoButton');
		const trashButton = document.querySelector('#trashButton');
		const brushSlider = document.querySelector('#brushSlider');

		brushTool.addEventListener('click', () => this.setTool('BRUSH'));
		fillTool.addEventListener('click', () => this.setTool('FILL'));
		eraserTool.addEventListener('click', () => this.setTool('ERASER'));
		undoButton.addEventListener('click', () => this.undo());
		trashButton.addEventListener('click', () => this.clearCanvas());
		brushSlider.addEventListener('input', e => {
			this.size = +e.target.value;
			this.updateCursor();
		});

		const colors = document.querySelector('.colors');
		colors.addEventListener('click', e => {
			this.color = e.target.style.backgroundColor;
			this.updateCursor(); 
		});
	}

	init() {
		this.initTools();
		console.log("game init a");
		this.updateCursor();
		this.ctx.imageSmoothingEnabled = false;

		this.socket.on("canvasState", this.loadCanvasState.bind(this));
		this.socket.emit("getCanvasState");

		window.addEventListener("focus", () => {
			this.socket.emit("getCanvasState", 1);
		});

		window.addEventListener('resize', this.updateCursor);

		this.canvas.addEventListener("pointerdown", (e) => {
			if (!this.canDraw()) return;
			switch (this.tool) {
				case "BRUSH":
					this.pointerDown = true;
					this.getSizePressure(e);

					// if (e.pointerType != "mouse")
					//     cursorCanvas.hidden = true;

					this.startPos = this.getPosition(this.canvas, e);
					this.socket.emit("drawCommand", [
						1,
						this.startPos,
						this.startPos,
						this.size,
						this.color,
					]);

					this.drawLine(this.startPos, this.startPos, this.size, this.color);
					break;

				case "FILL":
					const pos = this.getPosition(this.canvas, e);
					const fillColorHex = parseColorHex(this.color);

					this.socket.emit("drawCommand", [2, pos.x, pos.y, fillColorHex]);
					floodFill(this.ctx, pos.x, pos.y, fillColorHex);

					this.saveCanvas();
					this.sendCanvasState();
					this.socket.emit("drawCommand", [5]);
					break;

				case "ERASER":
					this.pointerDown = true;
					this.getSizePressure(e);

					// if (e.pointerType != "mouse")
					//     cursorCanvas.hidden = true;

					this.startPos = this.getPosition(this.canvas, e);

					const whiteRGB = "rgb(255, 255, 255)";

					this.socket.emit("drawCommand", [
						1,
						this.startPos,
						this.startPos,
						this.size,
						whiteRGB,
					]);
					this.drawLine(this.startPos, this.startPos, this.size, whiteRGB);
					break;
				default:
					break;
			}
		});

		document.addEventListener("pointermove", (event) => {
			if (!this.canDraw()) return;
			if (!this.pointerDown) {
				return;
			}

			this.getSizePressure(event);

			if (this.tool === "BRUSH") {
				let position = this.getPosition(this.canvas, event);
				this.socket.emit("drawCommand", [
					1,
					this.startPos,
					position,
					this.size,
					this.color,
				]);
				this.drawLine(this.startPos, position, this.size, this.color);
				this.startPos = position;
			} else if (this.tool === "ERASER") {
				let position = this.getPosition(this.canvas, event);
				const whiteRGB = "rgb(255, 255, 255)";
				this.socket.emit("drawCommand", [
					1,
					this.startPos,
					position,
					this.size,
					whiteRGB,
				]);
				this.drawLine(this.startPos, position, this.size, whiteRGB);
				this.startPos = position;
			}
		});

		document.addEventListener("pointerup", () => {
			// if (!roundIntermission && gameStarted && currentDrawerId !== playerID) return;
			if (!this.pointerDown) {
				return;
			}

			setTimeout(() => {
				this.saveCanvas();
				this.sendCanvasState();
				this.socket.emit("drawCommand", [5]);
			}, 10);

			this.pointerDown = false;
			this.updateCursor();
		});

		document.addEventListener("keydown", (e) => {
			if (document.activeElement.tagName === "INPUT") return;

			switch (e.key.toLowerCase()) {
				case "c":
					this.emitClear();
					break;
				case "z":
					this.undo();
					break;
				case "e":
					this.setTool("ERASER");
					break;
				case "f":
					this.setTool("FILL");
					break;
				case "b":
					this.setTool("BRUSH");
					break;
				default:
					break;
			}
		});

		document.addEventListener("wheel", (e) => {
			if (e.target.id !== 'canvas') return;
			if (e.deltaY > 0 && this.size > this.minBrushSize) this.size -= 4;
			else if (e.deltaY < 0 && this.size < this.maxBrushSize) this.size += 4;
            this.size = this.clamp(this.size, this.minBrushSize, this.maxBrushSize);
			const brushSlider = document.querySelector('#brushSlider');
			brushSlider.value = this.size;
			this.updateCursor();
		});

		this.canvas.addEventListener("pointerenter", scroll.disable);
		this.canvas.addEventListener("pointerleave", scroll.enable);

		this.socket.on("drawCommand", (message) => {
			switch (message[0]) {
				case 1:
					let [, fromPos, toPos, size, color] = message;
					this.drawLine(fromPos, toPos, size, color);
					break;
				case 2:
					let [, x, y, fillColor] = message;
					floodFill(this.ctx, x, y, fillColor);
					break;
				case 3:
					this.clearCanvas();
					break;
				case 4:
					this.loadDataURL(message[1]);
					// undo();
					break;
				case 5:
					this.saveCanvas();
					break;
				default:
					break;
			}
		});
	}
}

export class gamePlayer {
	constructor(ID) {
		this.id = ID;
	}
}
