function getPixel(pixelData, x, y) {
	if (x < 0 || y < 0 || x >= pixelData.width || y >= pixelData.height) {
		return -1; // impossible color
	} else {
		return pixelData.data[y * pixelData.width + x];
	}
}

export default function floodFill(ctx, x, y, fillColor) {
	const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	const pixelData = {
		width: imageData.width,
		height: imageData.height,
		data: new Uint32Array(imageData.data.buffer),
	};

	const targetColor = getPixel(pixelData, x, y);

	if (targetColor !== fillColor) {
		const pixelsToCheck = [x, y];
		while (pixelsToCheck.length > 0) {
			const y = pixelsToCheck.pop();
			const x = pixelsToCheck.pop();

			const currentColor = getPixel(pixelData, x, y);
			if (currentColor === targetColor) {
				pixelData.data[y * pixelData.width + x] = fillColor;
				pixelsToCheck.push(x + 1, y);
				pixelsToCheck.push(x - 1, y);
				pixelsToCheck.push(x, y + 1);
				pixelsToCheck.push(x, y - 1);
			}
		}

		ctx.putImageData(imageData, 0, 0);
	}
}