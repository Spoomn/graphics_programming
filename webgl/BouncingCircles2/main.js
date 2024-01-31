import { Circle } from "./circle.js";
import { initShaderProgram } from "./shader.js";
import { collideParticles } from './collisions.js';

main();
async function main() {
	console.log('This is working');

	//
	// Init gl
	// 
	const canvas = document.getElementById('glcanvas');
	const gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	gl.clearColor(1, 1, 1, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//
	// Create shaderProgram
	// 
	const vertexShaderText = await (await fetch("simple.vs")).text();
    const fragmentShaderText = await (await fetch("simple.fs")).text();
	let shaderProgram = initShaderProgram(gl, vertexShaderText, fragmentShaderText);
	gl.useProgram(shaderProgram);


	//
	// Set Uniform uProjectionMatrix
	//	
	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const projectionMatrix = mat4.create();
	const yhigh = 10;
	const ylow = -yhigh;
	const xlow = ylow * aspect;
	const xhigh = yhigh * aspect;
	mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
	gl.uniformMatrix4fv(
		projectionMatrixUniformLocation,
		false,
		projectionMatrix
	);

	//
	// Create the objects in the scene:
	//
	const NUM_CIRCLES = 8;
	const circleList = []
	for (let i = 0; i < NUM_CIRCLES; i++) {
	  let c = new Circle(xlow, xhigh, ylow, yhigh);
	  circleList.push(c);
	}

	//
	// Main render loop
	//
	let previousTime = 0;
	function redraw(currentTime) {
		currentTime*= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		previousTime = currentTime;
		if(DT > .1){
			DT = .1;
		}
	
		// Clear the canvas before we start drawing on it.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		const collisionFriction = 0.85;
		for (let i = 0; i < NUM_CIRCLES - 1; i++) {
            for (let j = i + 1; j < NUM_CIRCLES; j++) {
                let circle1 = circleList[i];
                let circle2 = circleList[j];

                const dx = circle2.x - circle1.x;
                const dy = circle2.y - circle1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = circle1.size + circle2.size;

                if (distance < minDistance) {
                    // Circles are colliding
                    collideParticles(circle1, circle2, DT, collisionFriction);

                    const overlap = minDistance - distance;
                    const separationX = (overlap / 2) * (dx / distance);
                    const separationY = (overlap / 2) * (dy / distance);
                    circle1.x -= separationX;
                    circle1.y -= separationY;
                    circle2.x += separationX;
                    circle2.y += separationY;
                }
            }
        }

		// Update the scene
		for (let i = 0; i < NUM_CIRCLES; i++) {
			circleList[i].update(DT);
		}

		// Draw the scene
		for (let i = 0; i < NUM_CIRCLES; i++) {
			circleList[i].draw(gl, shaderProgram);
		}
	  
	
		requestAnimationFrame(redraw);
	  }	
	  requestAnimationFrame(redraw);
};
