import { setShaderAttributes, loadTexture } from "./helpers.js";

class ChessSet {
    constructor(gl) {
        this.pieces = [];
        this.gl = gl;
        this.buffers = {};
    }

    addPiece(piece) {
        this.pieces.push(piece);
    }

    draw(shaderProgram) {
        this.pieces.forEach(piece => piece.draw(this.gl, shaderProgram));
    }

    async init() {
        const textures = {
            "black": loadTexture(this.gl, 'pieces/PiezasAjedrezDiffuseMarmolBlackBrighter.png', [80, 80, 80, 255]),
            "white": loadTexture(this.gl, 'pieces/PiezasAjedrezDiffuseMarmol.png', [220, 220, 220, 255]),
            "board": loadTexture(this.gl, 'pieces/TableroDiffuse01.png', [255, 171, 0, 255])
        };
        const buffers = await readObj(this.gl, "pieces/PiezasAjedrezAdjusted.obj");

        // Example initialization of a few pieces
        this.addPiece(new Piece("pawnG7", "pawn", buffers["pawn"], [2.5, 0, -2.5]));
        // Initialize other pieces similarly
    }

    drawPiece(gl, shaderProgram, buffer, name, tx, ty, tz, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0, degree = 0) {
        const modelviewMatrix = mat4.create();
        mat4.translate(
            modelviewMatrix,
            modelviewMatrix,
            [tx, ty, tz]
        );
        mat4.rotate(
            modelviewMatrix,
            modelviewMatrix,
            degree * Math.PI / 180,
            [rx, ry, rz]
        );
        mat4.scale(
            modelviewMatrix,
            modelviewMatrix,
            [sx, sy, sz]
        );
        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelViewMatrix"), false, modelviewMatrix);

        const normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelviewMatrix);
        gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, "uNormalMatrix"), false, normalMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        setShaderAttributes(gl, shaderProgram);
        gl.drawArrays(gl.TRIANGLES, 0, buffer.vertexCount);
    }

    // basic linear interpolation
    interpolate(t, t0, t1, v0, v1) {
        let ratio = (t-t0)/(t1-t0);
        ratio = Math.max(ratio, 0);
        ratio = Math.min(ratio, 1.0);
        const v = v0 + ratio * (v1 - v0);
        return v;
    }

    // complex bezier interpolation
    bezierInterpolate(t, t0, t1, v0, v1, v2, v3) {
        let ratio = (t-t0)/(t1-t0);
        ratio = Math.max(ratio, 0);
        ratio = Math.min(ratio, 1.0);
        const v = v0 * Math.pow(1-ratio,3) + 3*v1*ratio*Math.pow(1-ratio,2) + 3*v2*Math.pow(ratio,2)*(1-ratio) + v3*Math.pow(ratio,3);
        return v;
    }

    //more complex bezier interpolation
    complexBezierInterpolate(t, t0, t1, v0, v1, v2, v3, v4, v5, v6, v7) {
        let ratio = (t-t0)/(t1-t0);
        ratio = Math.max(ratio, 0);
        ratio = Math.min(ratio, 1.0);
        const v = v0 * Math.pow(1-ratio,3) + 3*v1*ratio*Math.pow(1-ratio,2) + 3*v2*Math.pow(ratio,2)*(1-ratio) + v3*Math.pow(ratio,3) + 3*v4*Math.pow(1-ratio,2)*ratio + 6*v5*(1-ratio)*Math.pow(ratio,2) + 3*v6*Math.pow(ratio,2)*(1-ratio) + v7*Math.pow(ratio,3);
        return v;
    }

    draw(gl, shaderProgram, currentTime) {
        this.pieces.forEach(piece => piece.draw(gl, shaderProgram));
        // // this function should just draw the entire board and pieces in their initial positions
        // // each piece needs an identifier so that it can be animated later
        // pawnG7 = new Piece("pawnG7", "pawn", [2.5, 0, -2.5], [1, 1, 1], [0, 0, 1, 0]);
        // pawnG7.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnG7", 2.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // pawnG7.position = [2.5, this.bezierInterpolate(currentTime, 4, 4.5, 0, .5, 1, 0), this.bezierInterpolate(currentTime, 4, 4.5, -2.5, -3, 0, -.5), 1];
        // // draw board
        // gl.bindTexture(gl.TEXTURE_2D, this.boardTexture);
        // this.drawPiece(gl, shaderProgram, this.buffers["cube"], "board", 0, 0, 0, 1,1,1, 0,0,0,0);
        
        // // // draw White pieces
        // gl.bindTexture(gl.TEXTURE_2D, this.whiteTexture);
        // // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnG7", 2.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnH7", 3.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnA7", -3.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnB7", -2.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnC7", -1.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnD7", -.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnE7", .5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnF7", 1.5, 0, -2.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["rook"], "rookH8", 3.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["knight"], "knightG8", 2.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["bishop"], "bishopF8", 1.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["queen"], "queenE8", .5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["king"], "kingD8", -.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["bishop"], "bishopC8", -1.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["knight"], "knightB8", -2.5, 0, -3.5 ,1,1,1, 0,0,1,0);
        // this.drawPiece(gl, shaderProgram, this.buffers["rook"], "rookA8", -3.5, 0, -3.5 ,1,1,1, 0,0,1,0);


        // // draw Black pieces
        // gl.bindTexture(gl.TEXTURE_2D, this.blackTexture);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnG2", 2.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnH2", 3.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnA2", -3.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnB2", -2.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnC2", -1.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnD2", -.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnE2", .5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["pawn"], "pawnF2", 1.5, 0, 2.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["rook"], "rookH1", 3.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["knight"], "knightG1", 2.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["bishop"], "bishopF1", 1.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["queen"], "queenE1", .5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["king"], "kingD1", -.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["bishop"], "bishopC1", -1.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["knight"], "knightB1", -2.5, 0, 3.5 ,1,1,1, 0,1,0,180);
        // this.drawPiece(gl, shaderProgram, this.buffers["rook"], "rookA1", -3.5, 0, 3.5 ,1,1,1, 0,1,0,180);


    }
}

class Piece {
    constructor(name, type, buffer, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 1, 0]) {
        this.name = name;
        this.type = type;
        this.buffer = buffer;
        this.position = position;
        this.scale = scale;
        this.rotation = rotation; // Assuming rotation is [rx, ry, rz, angle]
    }

    draw(gl, shaderProgram) {
        const modelviewMatrix = mat4.create();
        mat4.translate(modelviewMatrix, modelviewMatrix, this.position);
        const angleRad = this.rotation[3] * Math.PI / 180; // Convert angle to radians
        mat4.rotate(modelviewMatrix, modelviewMatrix, angleRad, this.rotation.slice(0, 3));
        mat4.scale(modelviewMatrix, modelviewMatrix, this.scale);

        gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uModelViewMatrix"), false, modelviewMatrix);

        const normalMatrix = mat3.create();
        mat3.normalFromMat4(normalMatrix, modelviewMatrix);
        gl.uniformMatrix3fv(gl.getUniformLocation(shaderProgram, "uNormalMatrix"), false, normalMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        setShaderAttributes(gl, shaderProgram);
        gl.drawArrays(gl.TRIANGLES, 0, this.buffer.vertexCount);
    }

    updatePosition(newPosition) {
        this.position = newPosition;
    }

    updateRotation(newRotation) {
        this.rotation = newRotation;
    }

    updateScale(newScale) {
        this.scale = newScale;
    }
}

class Animation {
    constructor(start, end, startPos, endPos, startScale, endScale, startRot, endRot, interpolationType) {
        this.start = start;
        this.end = end;
        this.startPos = startPos;
        this.endPos = endPos;
        this.startScale = startScale;
        this.endScale = endScale;
        this.startRot = startRot;
        this.endRot = endRot;
        this.interpolationType = interpolationType
    }

    interpolate(currentTime) {
        let t = currentTime;
        let t0 = this.start;
        let t1 = this.end;
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(0, Math.min(1, ratio));  // Clamping 't' to the range [0, 1]

        if (this.interpolationType === 'linear') {
            return {
                position: this.startPos.map((v0, i) => this.interpolate(t, t0, t1, v0, this.endPos[i])),
                scale: this.startScale.map((v0, i) => this.interpolate(t, t0, t1, v0, this.endScale[i])),
                rotation: [this.startRot[0], this.interpolate(t, t0, t1, this.startRot[1], this.endRot[1])]
            };
        } else if (this.interpolationType === 'bezier') {
            // Assuming bezier interpolation uses same control points for all components, adjust if different
            return {
                position: this.startPos.map((v0, i) => this.bezierInterpolate(t, t0, t1, v0, (v0 + this.endPos[i]) / 2, (v0 + this.endPos[i]) / 2, this.endPos[i])),
                scale: this.startScale.map((v0, i) => this.bezierInterpolate(t, t0, t1, v0, (v0 + this.endScale[i]) / 2, (v0 + this.endScale[i]) / 2, this.endScale[i])),
                rotation: [this.startRot[0], this.bezierInterpolate(t, t0, t1, this.startRot[1], (this.startRot[1] + this.endRot[1]) / 2, (this.startRot[1] + this.endRot[1]) / 2, this.endRot[1])]
            };
        }
    }

    interpolate(t, t0, t1, v0, v1) {
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(0, Math.min(1.0, ratio));
        return v0 + ratio * (v1 - v0);
    }

    bezierInterpolate(t, t0, t1, v0, v1, v2, v3) {
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(0, Math.min(1.0, ratio));
        return v0 * Math.pow(1 - ratio, 3) + 3 * v1 * ratio * Math.pow(1 - ratio, 2) + 3 * v2 * Math.pow(ratio, 2) * (1 - ratio) + v3 * Math.pow(ratio, 3);
    }
}


// filename to dictionary this.buffers
async function readObj(gl, filename, buffers) {
    const response = await fetch(filename);
    const text = await response.text()

    //    const output = {};
    const lines = text.split("\n");
    let objectName = "";
    const vertexList = [];
    const normalList = [];
    const uvList = [];
    let currentFaceList = [];
    //    output.objectList = {};

    for (const line of lines) {
        const values = line.split(' ');
        if (values[0] == 'o') {
            if (currentFaceList.length > 0) {
                //output.objectList[objectName] = currentFaceList
                AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList)
                currentFaceList = []
            }
            objectName = values[1];
        }
        else if (values[0] == 'v') {
            vertexList.push(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]))
        }
        else if (values[0] == 'vn') {
            normalList.push(parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]))
        }
        else if (values[0] == 'vt') {
            uvList.push(parseFloat(values[1]), 1 - parseFloat(values[2]))
        }
        else if (values[0] == 'f') {
            const numVerts = values.length - 1;
            const fieldsV0 = values[1].split('/');
            for (let i = 2; i < numVerts; i++) {
                const fieldsV1 = values[i].split('/');
                const fieldsV2 = values[i + 1].split('/');
                currentFaceList.push(parseInt(fieldsV0[0]) - 1, parseInt(fieldsV0[1]) - 1, parseInt(fieldsV0[2]) - 1);
                currentFaceList.push(parseInt(fieldsV1[0]) - 1, parseInt(fieldsV1[1]) - 1, parseInt(fieldsV1[2]) - 1);
                currentFaceList.push(parseInt(fieldsV2[0]) - 1, parseInt(fieldsV2[1]) - 1, parseInt(fieldsV2[2]) - 1);
            }
        }
    }
    if (currentFaceList.length > 0) {
        //output.objectList[objectName] = currentFaceList
        AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList)
    }
    //    output.vertexList = vertexList;
    //    output.normalList = normalList;
    //    output.uvList = uvList;
    //    return output;
}


function AddVertexBufferObject(gl, buffers, objectName, vertexList, uvList, normalList, currentFaceList) {
    const vertices = [];
    for (let i = 0; i < currentFaceList.length; i += 3) {
        const vertexIndex = currentFaceList[i] * 3;
        const uvIndex = currentFaceList[i + 1] * 2;
        const normalIndex = currentFaceList[i + 2] * 3;
        vertices.push(vertexList[vertexIndex + 0], vertexList[vertexIndex + 1], vertexList[vertexIndex + 2], // x,y,x
            uvList[uvIndex + 0], uvList[uvIndex + 1], // u,v
            normalList[normalIndex + 0], normalList[normalIndex + 1], normalList[normalIndex + 2] // nx,ny,nz
        );
    }

    const vertexBufferObject = gl.createBuffer();
    vertexBufferObject.vertexCount = vertices.length / 8;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    buffers[objectName] = vertexBufferObject;
}

export { ChessSet, Piece};