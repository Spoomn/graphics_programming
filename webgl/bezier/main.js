import { initShaderProgram } from "./shader.js";
import { drawCircle, drawRectangle, drawTriangle, drawLineStrip } from "./shapes2d.js";
import { Point2, Bezier } from "./bezier.js";
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
	gl.clearColor(1,1,1, 1.0);
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
	const aspect = canvas.clientWidth / canvas.clientHeight;
	const projectionMatrix = mat4.create();
	let yhigh = 10;
	let ylow = -yhigh;
	let xhigh = yhigh;
	let xlow = ylow;
	if(aspect>=1){
		xlow *= aspect;
		xhigh *= aspect;
	}
	else{
		ylow /= aspect;
		yhigh /= aspect;
	}
	mat4.ortho(projectionMatrix, xlow, xhigh, ylow, yhigh, -1, 1);
	gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

	//
	// load a modelview matrix onto the shader
	// 
	const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
	const modelViewMatrix = mat4.create();
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

	//
	// Create content to display
	//

	let bezierCurves = [];
	let currentCurveIndex = -1;
	
	// Initial Bezier curve
	bezierCurves.push(new Bezier(new Point2(-5, 0), new Point2(-2, 5), new Point2(2, -5), new Point2(5, 0)));
	
	document.getElementById('addCurve').addEventListener('click', function() {
		const lastCurve = bezierCurves[bezierCurves.length - 1];
		const offset = .5;
		const newCurve = new Bezier(
			new Point2(lastCurve.points[0].x + offset, lastCurve.points[0].y + offset),
			new Point2(lastCurve.points[1].x + offset, lastCurve.points[1].y + offset),
			new Point2(lastCurve.points[2].x + offset, lastCurve.points[2].y + offset),
			new Point2(lastCurve.points[3].x + offset, lastCurve.points[3].y + offset)
		);
		bezierCurves.forEach(curve => {
			curve.isSelected = false;
		});

		bezierCurves.push(newCurve);
		newCurve.isSelected = true;
		currentCurveIndex = bezierCurves.length - 1;
	});

	function getCanvasRelativePosition(event) {
		const rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	}

	let currentlyDragging = false;

	canvas.addEventListener("mousedown", function(event) {
		const position = getCanvasRelativePosition(event);
		const xWorld = xlow + (position.x / canvas.clientWidth) * (xhigh - xlow);
		const yWorld = yhigh - (position.y / canvas.clientHeight) * (yhigh - ylow);
	
		bezierCurves.forEach((curve, index) => {
			const pickedPointIndex = curve.isPicked(xWorld, yWorld);
			if (pickedPointIndex !== -1) {
				currentCurveIndex = index;
				curve.selectedPointIndex = pickedPointIndex;
				curve.isSelected = true;
				currentlyDragging = true;

				bezierCurves.forEach((c, i) => {
					if (i !== index) c.isSelected = false;
				});
				return;
			}
		});
	});
		
	canvas.addEventListener("mouseup", function(event) {
		currentlyDragging = false;
	});
	
	canvas.addEventListener("mousemove", function(event) {
		if (currentlyDragging && currentCurveIndex !== -1) {
			const curve = bezierCurves[currentCurveIndex];
			const position = getCanvasRelativePosition(event);
			const xWorld = xlow + (position.x / canvas.clientWidth) * (xhigh - xlow);
			const yWorld = yhigh - (position.y / canvas.clientHeight) * (yhigh - ylow);
			if (curve.selectedPointIndex !== -1) {
				curve.setPoint(curve.selectedPointIndex, xWorld, yWorld);
			}
		}
	});
	
	
	addEventListener("click", click);
	function click(event) {
		const xWorld = xlow + event.clientX / gl.canvas.clientWidth * (xhigh - xlow);
		const yWorld = ylow + (gl.canvas.clientHeight - event.clientY) / gl.canvas.clientHeight * (yhigh - ylow);
		// popSound.play();
		// Do whatever you want here, in World Coordinates.
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

		bezierCurves.forEach(curve => {
			curve.drawCurve(gl, shaderProgram);
			curve.drawControlPoints(gl, shaderProgram);
		});

		
		requestAnimationFrame(redraw);
	}
	requestAnimationFrame(redraw);
};

