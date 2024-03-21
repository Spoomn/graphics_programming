class Line{
    constructor(xlow, xhigh, ylow, yhigh){ // make the rectangles inside these World Coordinates
        this.x1 = x1;
        this.x1 = x1;
        this.x1 = x1;
        this.x1 = x1;
    }
    draw(gl, shaderProgram){
        drawLine(gl, shaderProgram, this.x1, this.y1, this.x2, this.y2);
    }
}


function drawLine(gl, shaderProgram, x1, y1, x2, y2){
    //
    // Create the vertexBufferObject
    //
    const vertices = [x1,y1,x2,y2];

	const vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	//
	// Set Vertex Attributes
	//
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

	//
	// Set Uniform uColor
	//
	const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
	gl.uniform4fv(colorUniformLocation, [0,0,0,1]);

	//
	// Set Uniform uModelViewMatrix
	//
    const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    const modelViewMatrix = mat4.create();

    gl.uniformMatrix4fv( modelViewMatrixUniformLocation, false, modelViewMatrix);	  	

    //
    // Starts the Shader Program, which draws the current object to the screen.
    //
    gl.drawArrays(gl.LINES, 0, 2);
}

export { Line, drawLine };