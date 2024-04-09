function drawCircle(gl, shaderProgram, x, y, radius, color=[0,0,1,1]){
    const sides = 64;
    const vertices = CreateCircleVertices(x,y,radius,sides);
	drawVertices(gl, shaderProgram, vertices, color, gl.TRIANGLE_FAN);
}

function CreateCircleVertices(x,y,radius,sides){
	const vertices = [];
	vertices.push(x);
	vertices.push(y);
	for(let i=0; i<sides+1; i++){
		const radians = i/sides *2*Math.PI;
        vertices.push(x+radius*Math.cos(radians));
        vertices.push(y+radius*Math.sin(radians));
	}
	return vertices;
}

function drawRectangle(gl, shaderProgram, x1, y1, x2, y2, color=[0,1,0,1]){
    const vertices = [x1,y1, x2,y1, x1,y2, x2,y2]; // triangle strip order
	drawVertices(gl, shaderProgram, vertices, color, gl.TRIANGLE_STRIP);
}

function drawTriangle(gl, shaderProgram, x1, y1, x2, y2, x3, y3, color=[1,1,0,1]){
    const vertices = [x1, y1, x2, y2, x3, y3]; 
	drawVertices(gl, shaderProgram, vertices, color, gl.TRIANGLES);
}

function drawLineStrip(gl, shaderProgram, vertices, color=[0,0,0,1]){
	drawVertices(gl, shaderProgram, vertices, color, gl.LINE_STRIP);
}

function drawLineLoop(gl, shaderProgram, vertices, color=[0,0,0,1]){
	drawVertices(gl, shaderProgram, vertices, color, gl.LINE_LOOP);
}

function drawLines(gl, shaderProgram, vertices, color=[0,0,0,1]){
	drawVertices(gl, shaderProgram, vertices, color, gl.LINES);
}

function drawVertices(gl, shaderProgram, vertices, color, style){
    const vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
	gl.uniform4fv(colorUniformLocation, color);

    gl.drawArrays(style, 0, vertices.length/2);
}


function storeQuad(vertices, 								
	x1, y1, z1, nx1, ny1, nz1,
	x2, y2, z2, nx2, ny2, nz2,
	x3, y3, z3, nx3, ny3, nz3,
	x4, y4, z4, nx4, ny4, nz4, 
	r, g, b, a) {
vertices.push(x1, y1, z1, r, g, b, a, nx1, ny1, nz1,
x2, y2, z2, r, g, b, a, nx2, ny2, nz2,
x3, y3, z3, r, g, b, a, nx3, ny3, nz3)
vertices.push(x1, y1, z1, r, g, b, a, nx1, ny1, nz1,
x3, y3, z3, r, g, b, a, nx3, ny3, nz3,
x4, y4, z4, r, g, b, a, nx4, ny4, nz4)
}

function drawColorNormalVertices(gl, shaderProgram, vertices, style) {
const vertexBufferObject = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
gl.vertexAttribPointer(
positionAttribLocation, // Attribute location
3, // Number of elements per attribute
gl.FLOAT, // Type of elements
gl.FALSE,
10 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
0 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(positionAttribLocation);

const colorAttribLocation = gl.getAttribLocation(shaderProgram, 'vertColor');
gl.vertexAttribPointer(
colorAttribLocation, // Attribute location
4, // Number of elements per attribute
gl.FLOAT, // Type of elements
gl.FALSE,
10 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(colorAttribLocation);

const normalAttribLocation = gl.getAttribLocation(shaderProgram, 'vertNormal');
gl.vertexAttribPointer(
normalAttribLocation, // Attribute location
3, // Number of elements per attribute
gl.FLOAT, // Type of elements
gl.FALSE,
10 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
7 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
);
gl.enableVertexAttribArray(normalAttribLocation);

gl.drawArrays(style, 0, vertices.length / (3 + 4 + 3));

return vertexBufferObject;
}

function crossProduct(x1,y1,z1,x2,y2,z2,x3,y3,z3){
const ux = x2-x1;
const uy = y2-y1;
const uz = z2-z1;
const vx = x3-x1;
const vy = y3-y1;
const vz = z3-z1;
const nx = uy*vz-uz*vy;
const ny = -(ux*vz-uz*vx);
const nz = ux*vy-uy*vx;
return [nx,ny,nz];
}

function rgbToFloat(r, g, b) {
const rFloat = r / 255.0;
const gFloat = g / 255.0;
const bFloat = b / 255.0;
return { r: rFloat, g: gFloat, b: bFloat };
}

export {
storeQuad, drawColorNormalVertices, crossProduct, rgbToFloat,
drawCircle, drawRectangle, drawTriangle, drawLineStrip, drawLineLoop, drawLines};
