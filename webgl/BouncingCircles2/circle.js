class Circle {
    constructor(xlow, xhigh, ylow, yhigh){ // make the circles inside these World Coordinates
        this.xlow = xlow;
        this.xhigh = xhigh;
        this.ylow = ylow;
        this.yhigh = yhigh;
        const customColors = [
            [.558,.269,.91,1], //purpleish
            [.262,.856,.527,1], //greenish
            [.984,.703,.0195,1], //mustard
            [.0312,.5859,.8085,1], //cool blue gatorade
            [.214,.703,.625,1], //arctic
            [.7265,.109,.1289,1], //blood
            [.542,.757,.855,1], //cavalry blue
            [.984,.737,.016,1], //google yellow
            [.051,.396,.176,1], //google green
            [.647,.055,.055,1], //google red
            [.090,.306,.651,1], //google blue
        ]
        this.color = customColors[Math.floor(Math.random() * customColors.length)];
        this.size = 1.0 + Math.random(); // half edge between 1.0 and 2.0
        const minx = xlow+this.size;
        const maxx = xhigh-this.size;
        this.x = minx + Math.random()*(maxx-minx);
        const miny = ylow+this.size;
        const maxy = yhigh-this.size;
        this.y = miny + Math.random()*(maxy-miny);
        this.degrees = Math.random()*90;
        this.dx = (Math.random() - 0.5) * 100; 
        this.dy = (Math.random() - 0.5) * 100;
    }
    update(DT){
        const gravity = -9.815;
        this.dy += gravity * DT;

        const airFriction = 0.99
        this.dx *= airFriction;
        this.dy *= airFriction;

        this.x += this.dx * DT;
        this.y += this.dy * DT;
        
        const degreesPerSecond = 45;
        this.degrees += degreesPerSecond*DT;
        this.degrees = 0.0;

        if(this.x+this.dx*DT +this.size > this.xhigh){
            this.dx = -Math.abs(this.dx);
        }
        if(this.x+this.dx*DT -this.size < this.xlow){
            this.dx = Math.abs(this.dx);
        }
        if(this.y+this.dy*DT +this.size > this.yhigh){
            this.dy = -Math.abs(this.dy);
        }
        if(this.y+this.dy*DT -this.size < this.ylow){
            this.dy = Math.abs(this.dy);
        }


        this.x += this.dx*DT;
        this.y += this.dy*DT;
    }    draw(gl, shaderProgram) {
        drawCircle(gl, shaderProgram, this.color, this.degrees, this.x, this.y, this.size);
    }
}

function drawCircle(gl, shaderProgram, color, degrees, x, y, size) {
    const numSegments = 100; 
    const vertices = [0, 0]; 
    for (let i = 0; i <= numSegments; i++) {
        const theta = (i / numSegments) * 2 * Math.PI;
        vertices.push(Math.cos(theta), Math.sin(theta));
    }

    const vertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        2 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "uColor");
    gl.uniform4fv(colorUniformLocation, color);

    const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [x, y, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [size, size, 1]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, (degrees * Math.PI / 180), [0, 0, 1]);
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments + 2);
}

export { Circle, drawCircle };
