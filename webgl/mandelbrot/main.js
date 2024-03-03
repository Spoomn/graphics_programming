import { initShaderProgram } from "./shader.js";
import { drawCircle, drawRectangle, drawTriangle, drawLineStrip } from "./shapes2d.js";
import { randomDouble } from "./random.js";

main();
async function main() {
	console.log('This is working');

	//
	// start gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaders
	// 
	const vertexShaderText = await(await fetch("simple.vs")).text();
	const fragmentShaderText = await(await fetch("simple.fs")).text();
	const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);

	//
	// load a projection matrix onto the shader
	// 
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const projectionMatrix = mat4.create();
	let yhigh = 1.5;
	let ylow = -1.5;
	let xlow = -2.5;
	let xhigh = .5;
	mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

	// variables for dragging
	let isDragging = false;
	let lastPosX = 0;
	let lastPosY = 0;
	
	//
	// Register Listeners
	//
	addEventListener("click", click);
	function click(event) {
		console.log("click");
		const xWorld = xlow + event.clientX / gl.canvas.clientWidth * (xhigh - xlow);
		const yWorld = ylow + (gl.canvas.clientHeight - event.clientY) / gl.canvas.clientHeight * (yhigh - ylow);
		// Do whatever you want here, in World Coordinates.
	}
	
	addEventListener("mousewheel", mouseWheel);
	const zoomDelta = 0.1
	function mouseWheel(event) {
		console.log("zoomie zoom");
		const zoomDirection = event.deltaY > 0 ? 1 : -1;
		const zoomFactor = 1 + zoomDirection * zoomDelta; 
		const xWorld = xlow + event.clientX / gl.canvas.clientWidth * (xhigh - xlow); 
		const yWorld = ylow + (gl.canvas.clientHeight - event.clientY) / gl.canvas.clientHeight * (yhigh - ylow); 
		const newXRange = (xhigh - xlow) * zoomFactor; 
		const newYRange = (yhigh - ylow) * zoomFactor; 
		xlow = xWorld - (xWorld - xlow) * zoomFactor; 
		xhigh = xlow + newXRange;
		ylow = yWorld - (yWorld - ylow) * zoomFactor;
		yhigh = ylow + newYRange;
		mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
		requestAnimationFrame(redraw);
	}
	let colorMode = 0;

	document.addEventListener('keydown', (event) => {
		if (event.key === 'c') {
			colorMode = 1 - colorMode;
			updateColorModeUniform();
		}
	});
	canvas.addEventListener('mousedown', (event) => {
		isDragging = true;
		lastPosX = event.clientX;
		lastPosY = event.clientY;
	});
	
	canvas.addEventListener('mousemove', (event) => {
		if (isDragging) {
			const deltaX = event.clientX - lastPosX;
			const deltaY = event.clientY - lastPosY;
			lastPosX = event.clientX;
			lastPosY = event.clientY;
	
			updateView(deltaX, deltaY);
		}
	});
	
	canvas.addEventListener('mouseup', () => {
		isDragging = false;
	});
	
	canvas.addEventListener('mouseleave', () => {
		isDragging = false;
	});

	function updateView(deltaX, deltaY) {
		const worldDeltaX = (deltaX / canvas.width) * (xhigh - xlow);
		const worldDeltaY = (deltaY / canvas.height) * (yhigh - ylow);
	
		xlow -= worldDeltaX;
		xhigh -= worldDeltaX;
		ylow += worldDeltaY;
		yhigh += worldDeltaY;
	
		mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
		gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
	
		requestAnimationFrame(redraw);
	}
	
	
	function updateColorModeUniform() {
		const colorModeLocation = gl.getUniformLocation(shaderProgram, 'colorMode');
		gl.uniform1i(colorModeLocation, colorMode);
		requestAnimationFrame(redraw);
	}
	
	//
	// Main render loop
	//
	let previousTime = 0;
	function redraw(currentTime){
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if(DT > .1)
			DT = .1;
		previousTime = currentTime;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		drawRectangle(gl, shaderProgram, xlow,ylow,xhigh,yhigh, [1,0,0,1]);
		
	}
	requestAnimationFrame(redraw);
};

