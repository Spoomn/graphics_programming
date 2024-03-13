import { initShaderProgram } from "./shader.js";
import {Maze} from "./maze.js"
import {Rat} from "./rat.js"
import {Cheese} from "./cheese.js"

main();
async function main() {
	// console.log('This is working');

	//
	// start gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	gl.clearColor(.82,.914,.925, 1.0);

	//
	// Create shaders
	// 
	const vertexShaderText = await(await fetch("simple.vs")).text();
	const fragmentShaderText = await(await fetch("simple.fs")).text();
	const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);
	//
	// Create content to display
	//
	const WIDTH = 8;
	const HEIGHT = WIDTH;
	const m = new Maze(WIDTH, HEIGHT);
	const rat = new Rat(.5,.5, 90, m);
	const cheese = new Cheese(WIDTH-.5, HEIGHT-.5, 0);

	//
	// load a projection matrix onto the shader
	// 

	const margin = 0.5; 

	let xlow = 0.0-margin;
	let xhigh = WIDTH+margin;
	let ylow = 0.0-margin;
	let yhigh = HEIGHT+margin;

	squareWorld();
	window.addEventListener('resize', squareWorld);

	function squareWorld(){
		const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
		const projectionMatrix = mat4.create();
		const aspect = canvas.clientWidth / canvas.clientHeight;
		const width = xhigh - xlow;
		const height = yhigh - ylow;
		if(aspect >= width/height){
			const newWidth = aspect*height;
			const xmid = (xlow+xhigh)/2;
			const xlowNew = xmid - newWidth/2;
			const xhighNew = xmid + newWidth/2;
			mat4.ortho(projectionMatrix, xlowNew, xhighNew, ylow, yhigh, -1, 1) 

		}else{
			const newHeight = aspect*height;
			const ymid = (ylow+yhigh)/2;
			const ylowNew = ymid - newHeight /2;
			const yhighNew = ymid + newHeight/2;
			mat4.ortho(projectionMatrix, xlow, xhigh, ylowNew, yhighNew, -1, 1) 
		}

		gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
	}

	//
	// load a modelview matrix onto the shader
	// 
	const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	const identityMatrix = mat4.create();
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);

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

	let spinLeft = false;
	let spinRight = false;
	let scurryForward = false;
	let scurryBackward = false;
	let strafeLeft = false;
	let strafeRight = false;
	let solution = false;

	window.addEventListener("keydown", keyDown);
	function keyDown(event){
		if (event.code == 'KeyQ'){
			spinLeft = true;
		}
		if (event.code == 'KeyE'){
			spinRight = true;
		}
		if (event.code == 'KeyW'){
			scurryForward = true;
		}
		if (event.code == 'KeyS'){
			scurryBackward = true;
		}
		if (event.code == "KeyA"){
			strafeLeft = true
		}
		if (event.code == "KeyD"){
			strafeRight = true
		}
		if (event.code == "KeyH"){
			solution = true;
		}
	}
	window.addEventListener("keyup", keyUp);
	function keyUp(event){
		if (event.code == 'KeyQ'){
			spinLeft = false;
		}
		if (event.code == 'KeyE'){
			spinRight = false;
		}
		if (event.code == 'KeyW'){
			scurryForward = false;
		}
		if (event.code == 'KeyS'){
			scurryBackward = false;
		}
		if (event.code == "KeyA"){
			strafeLeft = false
		}
		if (event.code == "KeyD"){
			strafeRight = false
		}
		if (event.code == "KeyH"){
			solution = false;
		}
	}
	//
	// Main render loop
	//
	
	let previousTime = 0;
	function redraw(currentTime){
		gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix)
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if(DT > .1)
			DT = .1;
		previousTime = currentTime;
		console.log(1/DT);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (spinLeft){
			rat.spinLeft(DT);
		}
		if (spinRight){
			rat.spinRight(DT);
		}
		if (scurryForward){
			rat.scurryForward(DT);
		}
		if (scurryBackward){
			rat.scurryBackward(DT);
		}
		if (strafeLeft){
			rat.strafeLeft(DT);
		}
		if (strafeRight){
			rat.strafeRight(DT);
		}
		
		// m.draw(gl, shaderProgram)
		// if (solution){
		// 	m.drawPath(gl, shaderProgram)
		// }
		rat.draw(gl, shaderProgram)
		cheese.draw(gl, shaderProgram)
		
		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);
};