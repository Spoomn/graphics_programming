import { initShaderProgram } from "./shader.js";
import { storeQuad, drawColorNormalVertices, crossProduct, rgbToFloat } from "./shapes2d.js";
import { Terrain } from "./terrain.js";

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
	gl.clearColor(113/255,192/255,223/255, 1.0);
	gl.enable(gl.DEPTH_TEST); // Enable depth testing
	gl.depthFunc(gl.LEQUAL); // Near things obscure far things
	gl.enable(gl.CULL_FACE);

	//
	// Create shaders
	// 

	const shaderProgram = initShaderProgram(gl, await (await fetch("colorNormalTriangles.vs")).text(), await (await fetch("colorNormalTriangles.fs")).text());

	//
	// Create content to display
	//
	const WIDTH = 100;
	const HEIGHT = 100;
	const t = new Terrain(WIDTH, HEIGHT);
	
	//
	// load a modelview matrix onto the shader
	// 
	const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	const identityMatrix = mat4.create();
	gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, identityMatrix);


	//
	// Other shader variables:
	// 
	function setLightDirection(x, y, z) {
		gl.uniform3fv(
			gl.getUniformLocation(shaderProgram, "uLightDirection"),
		  [x, y, z]
		);
	  }
	  setLightDirection(0, 0, -1);

	  function setEye(x, y, z) {
		gl.uniform3fv(
			gl.getUniformLocation(shaderProgram, "uEyePosition"),
		  [x, y, z]
		);
	  }
	  let eye = [0, 0, 15];
	  setEye(eye[0], eye[1], eye[2]);


	  const normalMatrix = mat3.create();
	  mat3.normalFromMat4(normalMatrix, identityMatrix);
	  gl.uniformMatrix3fv(
		gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
		false,
		normalMatrix
	  );


	//
	// Main render loop
	//
	let previousTime = 0;
	let frameCounter = 0;
	function redraw(currentTime) {
		currentTime *= .001; // milliseconds to seconds
		let DT = currentTime - previousTime;
		if (DT > .5)
			DT = .5;
		frameCounter += 1;
		if (Math.floor(currentTime) != Math.floor(previousTime)) {
			console.log(frameCounter);
			frameCounter = 0;
		}
		previousTime = currentTime;

		//
		// Setup projection matrix
		//

		setObservationView(gl, shaderProgram, canvas.clientWidth / canvas.clientHeight, eye, t)


		//
		// Draw
		//
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// drawSphere(gl, shaderProgram);
		t.draw(gl, shaderProgram);

		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);
};

// polar goes from 0 to PI (North pole to south pole)
// alpha goes from 0 to 2PI (such as around the equator)
function polarToCartesian(polar, alpha){
	// alpha is the horizontal angle from the positive X axis
	// polar is the vertical angle from the positive Z axis
	const x = Math.sin(polar) * Math.cos(alpha);
	const y = Math.sin(polar) * Math.sin(alpha);
	const z = Math.cos(polar);
	return [x,y,z];
}




function drawSphere(gl, shaderProgram) {
	const vertices = [];
	const strips = 50;
	for (let i = 0; i < strips; i++) {
		const polar1 = (i / strips ) * Math.PI; // 0 to PI (as z goes +1 to -1)
		const polar2 = ((i + 1) / strips) * Math.PI;
		for (let j = 0; j < strips; j++) {
			const alpha1 = j / strips * Math.PI * 2;
			const alpha2 = (j + 1) / strips * Math.PI * 2;
			let a = 1;
			// draw a sphere
			const [x1,y1,z1] = polarToCartesian(polar1, alpha1);
			const [x2,y2,z2] = polarToCartesian(polar2, alpha1);
			const [x3,y3,z3] = polarToCartesian(polar2, alpha2);
			const [x4,y4,z4] = polarToCartesian(polar1, alpha2);
			// let r = Math.sin(i * 3712 + j * 34857 + 1) * .5 + .5;
            // let g = Math.sin(i * 9321 + j * 27543 + 2) * .5 + .5;
            // let b = Math.sin(i * 1268 + j * 12771 + 7) * .5 + .5;
			const {r, g, b} = rgbToFloat(191,217,204);


			// let [nx,ny,nz] = crossProduct(x1,y1,z1,x2,y2,z2,x3,y3,z3);
			// if (j==strips-1){
			// 	[nx,ny,nz] = crossProduct(x1,y1,z1,x2,y2,z2,x4,y4,z4);
			// }
			// storeQuad(vertices, x1, y1, z1, nx, ny, nz,
			// 	x2, y2, z2, nx, ny, nz,
			// 	x3, y3, z3, nx, ny, nz,
			// 	x4, y4, z4, nx, ny, nz,
			// 	r, g, b);

				
			// /*
			const nx1 = x1;
			const ny1 = y1;
			const nz1 = z1;			
			const nx2 = x2;
			const ny2 = y2;
			const nz2 = z2;
			const nx3 = x3;
			const ny3 = y3;
			const nz3 = z3;
			const nx4 = x4;
			const ny4 = y4;
			const nz4 = z4;	
			storeQuad(vertices, x1, y1, z1, nx1, ny1, nz1,
								x2, y2, z2, nx2, ny2, nz2,
								x3, y3, z3, nx3, ny3, nz3,
								x4, y4, z4, nx4, ny4, nz4,
								r, g, b, 1);	
								
		}
	}
	drawColorNormalVertices(gl, shaderProgram, vertices, gl.TRIANGLES);
}


function setObservationView(gl, shaderProgram, canvasAspect, eye, terrain) {
	const projectionMatrix = mat4.create();
	const fov = 90 * Math.PI / 180;
	const near = 1;
	const far = 200;
	mat4.perspective(projectionMatrix, fov, canvasAspect, near, far);

	const lookAtMatrix = mat4.create();
	const at = [terrain.WIDTH / 2, terrain.HEIGHT / 2, 0];
	mat4.lookAt(lookAtMatrix, eye, at, [0, 0, 1]);
	mat4.multiply(projectionMatrix, projectionMatrix, lookAtMatrix);

	const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
}
