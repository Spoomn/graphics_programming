import { initShaderProgram } from "./shader.js";
import { drawCircle, drawRectangle, drawTriangle, drawLineStrip } from "./shapes2d.js";
import { randomDouble } from "./random.js";
import {Maze} from "./maze.js"
import {Rat} from "./rat.js"
import {Cheese} from "./cheese.js"
import { TOP_VIEW, OBSERVATION_VIEW, RATS_VIEW } from "./constants.js";

main();
async function main() {
	//
	// start gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');
	if (!gl) {
		alert('Your browser does not support WebGL');
	}
	const vertexShaderText = await(await fetch("simple.vs")).text();
	const fragmentShaderText = await(await fetch("simple.fs")).text();
	const shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);
	gl.clearColor(1,1,1, 1.0);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	//
	// Create shaders
	// 

	// load a texture and move it to the gpu
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, loadTexture(gl, "Textures/brick.jpg"));
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uTexture0"), 0);


	//
	// Create content to display
	//
	const WIDTH = 8;
	const HEIGHT = WIDTH;
	const m = new Maze(WIDTH, HEIGHT);
	const rat = new Rat(.5,.5, 90, m);
	const cheese = new Cheese(WIDTH-.5, HEIGHT-.5, 0);
	let currentView = OBSERVATION_VIEW;

	//
	// load a projection matrix onto the shader
	// 
	const margin = 0.5; 
	let xlow = 0.0-margin;
	let xhigh = WIDTH+margin;
	let ylow = 0.0-margin;
	let yhigh = HEIGHT+margin;

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
		if (event.code == "KeyO"){
			currentView = OBSERVATION_VIEW;
		}
		if (event.code == "KeyT"){
			currentView = TOP_VIEW;
		}
		if (event.code == "KeyR"){
			currentView = RATS_VIEW;
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
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if(DT > .1)
			DT = .1;
		previousTime = currentTime;

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		const vertices = [];
		let H = 1;
		let u1 = 0; let v1 = H;
		let u2 = H; let v2 = H;
		let u3 = H; let v3 = 0;
		let u4 = 0; let v4 = 0;
		storeQuad(vertices,
			0,0,0, u1, v1, 
			10, 0, 0, u2, v2, 
			10, 10, 0, u3, v3,
			0, 10, 0, u4, v4)
		//  update the rat's position
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

		// choose the view mode
		if (currentView == TOP_VIEW) {
			setTopView(gl, shaderProgram, WIDTH, HEIGHT, canvas);
		} else if (currentView == OBSERVATION_VIEW) {
			setObservationView(gl, shaderProgram, WIDTH, HEIGHT, canvas);
		} else if (currentView == RATS_VIEW) {
			setRatsView(gl, shaderProgram, WIDTH, HEIGHT, canvas, rat);
		}

		gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix)
		m.draw(gl, shaderProgram)
		m.drawOptimized(gl, shaderProgram)
		if (solution){
			m.drawPath(gl, shaderProgram)
		}
		rat.draw(gl, shaderProgram)
		cheese.draw(gl, shaderProgram)
		

		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);
};

function setObservationView(gl, shaderProgram, WIDTH, HEIGHT, canvas){ 
	const projectionMatrix = mat4.create();
	const fov = Math.PI / 2; // 90 degrees
	const canvasAspect = canvas.clientWidth / canvas.clientHeight;
	const near = 1;
	const far = 20;
	mat4.perspective(projectionMatrix, fov, canvasAspect, near, far);

	const lookAtMatrix = mat4.create();
	const eye = [WIDTH/4, -HEIGHT/7, WIDTH];
	const at = [WIDTH/2, HEIGHT/2, 0];
	const up = [0, 0, 1]
	mat4.lookAt(lookAtMatrix, eye, at, up);
	mat4.multiply(projectionMatrix, projectionMatrix, lookAtMatrix);
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

}

function setTopView(gl, shaderProgram, WIDTH, HEIGHT, canvas){
	const margin = 0.5; 
	let xlow = 0.0-margin;
	let xhigh = WIDTH+margin;
	let ylow = 0.0-margin;
	let yhigh = HEIGHT+margin;

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

function setRatsView(gl ,shaderProgram, WIDTH, HEIGHT, canvas, rat){
	const projectionMatrix = mat4.create();
	const fov = Math.PI / 2; // 90 degrees
	const canvasAspect = canvas.clientWidth / canvas.clientHeight;
	const near = .1;
	const far = WIDTH+HEIGHT+1;
	mat4.perspective(projectionMatrix, fov, canvasAspect, near, far);

	const lookAtMatrix = mat4.create();
	const eye = [rat.x, rat.y, rat.TALLNESS+.2];
	const at = [rat.x+Math.cos(rat.degrees*Math.PI/180), rat.y+Math.sin(rat.degrees*Math.PI/180), 0.5];
	const up = [0, 0, 1]
	mat4.lookAt(lookAtMatrix, eye, at, up);
	mat4.multiply(projectionMatrix, projectionMatrix, lookAtMatrix);
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
}

function loadTexture(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));

	const image = new Image();
	image.onLoad = function(){
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	image.src = url;

	return texture;
}

function storeQuad(vertices, x1,y1,z1, u1,v1, x2,y2,z2, u2,v2, x3,y3,z3, u3,v3, x4,y4,z4, u4,v4){
	vertices.push(x1,y1,z1, u1,v1);
	vertices.push(x2,y2,z2, u2,v2);
	vertices.push(x3,y3,z3, u3,v3);
	vertices.push(x1,y1,z1, u1,v1);
	vertices.push(x3,y3,z3, u3,v3);
	vertices.push(x4,y4,z4, u4,v4);
}