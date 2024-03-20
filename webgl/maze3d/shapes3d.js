// Description: This file contains functions to draw 3D shapes using WebGL.

function drawTriangle3d(gl, shaderProgram, x1,y1,z1, x2,y2,z2, x3,y3,z3, r,g,b){
	let vertices = [x1,y1,z1, r,g,b, x2,y2,z2, r,g,b, x3,y3,z3, r,g,b];
	drawVertices3d(gl, shaderProgram, vertices, gl.TRIANGLES);
}

function drawQuad(gl, shaderProgram, x1,y1,z1, x2,y2,z2, x3,y3,z3, x4,y4,z4, r,g,b){
	drawTriangle3d(gl, shaderProgram, x1,y1,z1, x2,y2,z2, x3,y3,z3, r,g,b);
	drawTriangle3d(gl, shaderProgram, x1,y1,z1, x3,y3,z3, x4,y4,z4, r,g,b);
}

function drawCircle3d(gl, shaderProgram, x,y,z, radius, r,g,b){
	let vertices = [];
	const numSides = 50;
	for(let i = 0; i < numSides; i++){
		let theta = (i/numSides) * 2 * Math.PI;
		let x1 = x + radius * Math.cos(theta);
		let y1 = y + radius * Math.sin(theta);
		vertices.push(x1, y1, z, r,g,b);
	}
	drawLineStrip3d(gl, shaderProgram, vertices);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 6);
}

function drawLineStrip3d(gl, shaderProgram, vertices){
	drawVertices3d(gl, shaderProgram, vertices, gl.LINE_STRIP);
}

function drawbezierCurve3d(gl, shaderProgram, vertices){
	drawVertices3d(gl, shaderProgram, vertices, gl.LINE_STRIP);
}

function drawVertices3d(gl, shaderProgram, vertices, style){
    const vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	// position
	const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	
	// color
	const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'vertColor');
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(colorAttribLocation);

    gl.drawArrays(style, 0, vertices.length/6);
}



export {drawQuad, drawTriangle3d, drawVertices3d, drawCircle3d, drawLineStrip3d, drawbezierCurve3d};