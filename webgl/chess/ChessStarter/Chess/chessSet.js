import { setShaderAttributes, loadTexture } from "./helpers.js";

class ChessSet {
    constructor(gl) {
        this.gl = gl;
        this.whiteChessPieces = [];
        this.blackChessPieces = [];
        this.setupWhiteChessPieces()
        this.setupBlackChessPieces();
    }

    async init(gl) {
        this.blackTexture = loadTexture(gl, 'pieces/PiezasAjedrezDiffuseMarmolBlackBrighter.png', [80, 80, 80, 255]);
        this.whiteTexture = loadTexture(gl, 'pieces/PiezasAjedrezDiffuseMarmol.png', [220, 220, 220, 255]);
        this.boardTexture = loadTexture(gl, 'pieces/TableroDiffuse01.png', [255, 171, 0, 255]);
        this.buffers = {};
        await readObj(gl, "pieces/PiezasAjedrezAdjusted.obj", this.buffers);

    }

    setupWhiteChessPieces() {
        let pawnG7 = new ChessPiece("pawnG7", "pawn", {x: 2.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnG7);
        // this.whiteChessPieces.push(new ChessPiece("pawnG7", "pawn", {x: 2.5, y: 0, z: -2.5}));
        let pawnH7 = new ChessPiece("pawnH7", "pawn", {x: 3.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnH7);
        let pawnA7 = new ChessPiece("pawnA7", "pawn", {x: -3.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnA7);
        let pawnB7 = new ChessPiece("pawnB7", "pawn", {x: -2.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnB7);
        let pawnC7 = new ChessPiece("pawnC7", "pawn", {x: -1.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnC7);
        let pawnD7 = new ChessPiece("pawnD7", "pawn", {x: -.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnD7);
        let pawnE7 = new ChessPiece("pawnE7", "pawn", {x: .5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnE7);
        let pawnF7 = new ChessPiece("pawnF7", "pawn", {x: 1.5, y: 0, z: -2.5});
        this.whiteChessPieces.push(pawnF7);
        let rookH8 = new ChessPiece("rookH8", "rook", {x: 3.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(rookH8);
        let knightG8 = new ChessPiece("knightG8", "knight", {x: 2.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(knightG8);
        let bishopF8 = new ChessPiece("bishopF8", "bishop", {x: 1.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(bishopF8);
        let queenE8 = new ChessPiece("queenE8", "queen", {x: .5, y: 0, z: -3.5});
        this.whiteChessPieces.push(queenE8);
        let kingD8 = new ChessPiece("kingD8", "king", {x: -.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(kingD8);
        let bishopC8 = new ChessPiece("bishopC8", "bishop", {x: -1.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(bishopC8);
        let knightB8 = new ChessPiece("knightB8", "knight", {x: -2.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(knightB8);
        let rookA8 = new ChessPiece("rookA8", "rook", {x: -3.5, y: 0, z: -3.5});
        this.whiteChessPieces.push(rookA8);

        // add animations to the white pieces
        // pawn G7 to G5
        pawnG7.addBezierAnimation(2, 2.5, {x: 2.5, y: 0, z: -2.5}, {x: 2.5, y: 1, z: -1.5}, {x: 2.5, y: .25, z: -1.5}, {x: 2.5, y: 0, z: -.5}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
        // pawn G5 to F4
        pawnG7.addBezierAnimation(4, 4.5, {x: 2.5, y: 0, z: -.5}, {x: 1.5, y: 1, z: .5}, {x: 1.5, y: .25, z: .5}, {x: 1.5, y: 0, z: .5}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
    }

    setupBlackChessPieces() {
        let pawnG2 = new ChessPiece("pawnG2", "pawn", {x: 2.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnG2);
        let pawnH2 = new ChessPiece("pawnH2", "pawn", {x: 3.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnH2);
        let pawnA2 = new ChessPiece("pawnA2", "pawn", {x: -3.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnA2);
        let pawnB2 = new ChessPiece("pawnB2", "pawn", {x: -2.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnB2);
        let pawnC2 = new ChessPiece("pawnC2", "pawn", {x: -1.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnC2);
        let pawnD2 = new ChessPiece("pawnD2", "pawn", {x: -.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnD2);
        let pawnE2 = new ChessPiece("pawnE2", "pawn", {x: .5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnE2);
        let pawnF2 = new ChessPiece("pawnF2", "pawn", {x: 1.5, y: 0, z: 2.5});
        this.blackChessPieces.push(pawnF2);
        let rookH1 = new ChessPiece("rookH1", "rook", {x: 3.5, y: 0, z: 3.5});
        this.blackChessPieces.push(rookH1);
        let knightG1 = new ChessPiece("knightG1", "knight", {x: 2.5, y: 0, z: 3.5});
        this.blackChessPieces.push(knightG1);
        let bishopF1 = new ChessPiece("bishopF1", "bishop", {x: 1.5, y: 0, z: 3.5});
        this.blackChessPieces.push(bishopF1);
        let queenE1 = new ChessPiece("queenE1", "queen", {x: .5, y: 0, z: 3.5});
        this.blackChessPieces.push(queenE1);
        let kingD1 = new ChessPiece("kingD1", "king", {x: -.5, y: 0, z: 3.5});
        this.blackChessPieces.push(kingD1);
        let bishopC1 = new ChessPiece("bishopC1", "bishop", {x: -1.5, y: 0, z: 3.5});
        this.blackChessPieces.push(bishopC1);
        let knightB1 = new ChessPiece("knightB1", "knight", {x: -2.5, y: 0, z: 3.5});
        this.blackChessPieces.push(knightB1);
        let rookA1 = new ChessPiece("rookA1", "rook", {x: -3.5, y: 0, z: 3.5});
        this.blackChessPieces.push(rookA1);

        // add animations to the black pieces
        // pawn F2 to F4
        pawnF2.addBezierAnimation(3, 3.5, {x: 1.5, y: 0, z: 2.5}, {x: 1.5, y: 1, z: 1.5}, {x: 1.5, y: 1, z: 1.5}, {x: 1.5, y: 0, z: .5} , {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
        // pawn F4 eliminated
        pawnF2.addBezierAnimation(4.25, 6, {x: 1.5, y: 0, z: .5}, {x: 1.5, y: 1, z: -.5}, {x: 1.5, y: 10, z: -.5}, {x: 1.5, y: -100, z: -1.5} ,  {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0}, {x: 0, y: 0, z: 0});
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
        
        gl.bindTexture(gl.TEXTURE_2D, this.boardTexture);
        this.drawPiece(gl, shaderProgram, this.buffers["cube"], "board", 0, 0, 0, 1,1,1, 0,0,0,0);
        
        // // draw White pieces
        const drawPieces = (piecesArray, texture) => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            for (let piece of piecesArray) {
                const { tx, ty, tz, rx, ry, rz } = piece.getCurrentState(currentTime);
                this.drawPiece(gl, shaderProgram, this.buffers[piece.type], piece.name, tx, ty, tz, 1, 1, 1, rx, ry, rz, 0);
            }
        };
    
        // Draw White and Black pieces
        drawPieces(this.whiteChessPieces, this.whiteTexture);
        drawPieces(this.blackChessPieces, this.blackTexture);
        
    }

}


class ChessPiece {
    constructor(name, type, initialPosition) {
        this.name = name;
        this.type = type;
        this.position = initialPosition;
        this.rotation = { x: 0, y: 0, z: 0 };
        this.animations = [];
    }

    addBezierAnimation(startT, endT, startPos, controlPos1, controlPos2, endPos, startRot, controlRot1, controlRot2, endRot) {
        this.animations.push({ startT, endT, startPos, controlPos1, controlPos2, endPos, startRot, controlRot1, controlRot2, endRot });
    }

    addAnimation(startT, endT, startPos, endPos, startRot, endRot) {
        this.animations.push({ startT, endT, startPos, endPos, startRot, endRot });
    }

    getCurrentState(currentTime) {
        let hasActiveAnimation = false;
        for (let anim of this.animations) {
            if (currentTime >= anim.startT && currentTime < anim.endT) {
                hasActiveAnimation = true;
                this.position.x = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.x, anim.controlPos1.x, anim.controlPos2.x, anim.endPos.x);
                this.position.y = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.y, anim.controlPos1.y, anim.controlPos2.y, anim.endPos.y);
                this.position.z = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.z, anim.controlPos1.z, anim.controlPos2.z, anim.endPos.z);
                this.rotation.x = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.x, anim.controlRot1.x, anim.controlRot2.x, anim.endRot.x);
                this.rotation.y = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.y, anim.controlRot1.y, anim.controlRot2.y, anim.endRot.y);
                this.rotation.z = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.z, anim.controlRot1.z, anim.controlRot2.z, anim.endRot.z);
                break;
            }
        }

        if (!hasActiveAnimation && this.animations.length > 0 && currentTime >= this.animations[this.animations.length - 1].endT) {
            this.position = {...this.animations[this.animations.length - 1].endPos};
            this.rotation = {...this.animations[this.animations.length - 1].endRot};
        }

        return {
            tx: this.position.x,
            ty: this.position.y,
            tz: this.position.z,
            rx: this.rotation.x,
            ry: this.rotation.y,
            rz: this.rotation.z
        };
    }

    bezierInterpolate(t, t0, t1, v0, v1, v2, v3) {
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(0, Math.min(ratio, 1.0));
        const v = v0 * Math.pow(1-ratio, 3) + 3 * v1 * ratio * Math.pow(1-ratio, 2) + 3 * v2 * Math.pow(ratio, 2) * (1-ratio) + v3 * Math.pow(ratio, 3);
        return v;
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

export { ChessSet, ChessPiece};