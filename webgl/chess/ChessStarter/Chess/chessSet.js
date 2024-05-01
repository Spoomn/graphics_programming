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
        // Initialize pawns for rank 2
        let pawnA2 = new ChessPiece("pawnA2", "pawn", {x: -3.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnA2);
        let pawnB2 = new ChessPiece("pawnB2", "pawn", {x: -2.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnB2);
        let pawnC2 = new ChessPiece("pawnC2", "pawn", {x: -1.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnC2);
        let pawnD2 = new ChessPiece("pawnD2", "pawn", {x: -0.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnD2);
        let pawnE2 = new ChessPiece("pawnE2", "pawn", {x: 0.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnE2);
        let pawnF2 = new ChessPiece("pawnF2", "pawn", {x: 1.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnF2);
        let pawnG2 = new ChessPiece("pawnG2", "pawn", {x: 2.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnG2);
        let pawnH2 = new ChessPiece("pawnH2", "pawn", {x: 3.5, y: 0, z: 2.5});
        this.whiteChessPieces.push(pawnH2);

        // Initialize other pieces for rank 1
        let rookA1 = new ChessPiece("rookA1", "rook", {x: -3.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(rookA1);
        let knightB1 = new ChessPiece("knightB1", "knight", {x: -2.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(knightB1);
        let bishopC1 = new ChessPiece("bishopC1", "bishop", {x: -1.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(bishopC1);
        let queenD1 = new ChessPiece("queenD1", "queen", {x: -0.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(queenD1);  // Queen on D1 for white
        let kingE1 = new ChessPiece("kingE1", "king", {x: 0.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(kingE1);    // King on E1 for white
        let bishopF1 = new ChessPiece("bishopF1", "bishop", {x: 1.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(bishopF1);
        let knightG1 = new ChessPiece("knightG1", "knight", {x: 2.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(knightG1);
        let rookH1 = new ChessPiece("rookH1", "rook", {x: 3.5, y: 0, z: 3.5});
        this.whiteChessPieces.push(rookH1);

            // White's 1st Move: Pawn E2 to E4
            pawnE2.addBezierAnimation(2, 3, 
                {x: 0.5, y: 0, z: 2.5}, 
                {x: 0.5, y: .5, z: 3}, 
                {x: 0.5, y: 2, z: 2}, 
                {x: 0.5, y: 0, z: .5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
            );
        
            // White's 2nd Move: Knight G1 to F3
            knightG1.addBezierAnimation(6, 7, 
                {x: 2.5, y: 0, z: 3.5}, 
                {x: 2.5, y: 2, z: 3.25}, 
                {x: 2, y: 4, z: 1.5}, 
                {x: 1.5, y: 0, z: 1.5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: .1, y: 0, z: .25},
                {x: 0, y: 0, z: 0},

            );
        
            // White's 3rd Move: Bishop F1 to B5
            bishopF1.addBezierAnimation(10, 11, 
                {x: 1.5, y: 0, z: 3.5}, 
                {x: 1.5, y: 3, z: 2}, 
                {x: -2.5, y: 3.5, z: 2}, 
                {x: -2.5, y: 0, z: -.5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: .1, y: 0, z: .25},
                {x: 0, y: 0, z: 0},
            );

            // White's 4th Move: Take pawn at A6
            bishopF1.addBezierAnimation(14, 15, 
                {x: -2.5, y: 0, z: -.5}, 
                {x: -2, y: 2, z: 0}, 
                {x: -1.0, y: 3, z: 0}, 
                {x: -3.5, y: 0, z: -1.5}, // A6
                undefined,{x: 2, y: 2, z: 2},{x: 2, y: 2, z: 2},undefined,
            );
        }
        
        
    
    

    setupBlackChessPieces() {
        // Initialize pawns for rank 7
        let pawnA7 = new ChessPiece("pawnA7", "pawn", {x: -3.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnA7);
        let pawnB7 = new ChessPiece("pawnB7", "pawn", {x: -2.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnB7);
        let pawnC7 = new ChessPiece("pawnC7", "pawn", {x: -1.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnC7);
        let pawnD7 = new ChessPiece("pawnD7", "pawn", {x: -0.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnD7);
        let pawnE7 = new ChessPiece("pawnE7", "pawn", {x: 0.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnE7);
        let pawnF7 = new ChessPiece("pawnF7", "pawn", {x: 1.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnF7);
        let pawnG7 = new ChessPiece("pawnG7", "pawn", {x: 2.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnG7);
        let pawnH7 = new ChessPiece("pawnH7", "pawn", {x: 3.5, y: 0, z: -2.5});
        this.blackChessPieces.push(pawnH7);

        
        // Initialize other pieces for rank 8
        let rookA8 = new ChessPiece("rookA8", "rook", {x: -3.5, y: 0, z: -3.5});
        this.blackChessPieces.push(rookA8);
        let knightB8 = new ChessPiece("knightB8", "knight", {x: -2.5, y: 0, z: -3.5});
        this.blackChessPieces.push(knightB8);
        let bishopC8 = new ChessPiece("bishopC8", "bishop", {x: -1.5, y: 0, z: -3.5});
        this.blackChessPieces.push(bishopC8);
        let queenD8 = new ChessPiece("queenD8", "queen", {x: -0.5, y: 0, z: -3.5});
        this.blackChessPieces.push(queenD8);  // Queen on D8 for black
        let kingE8 = new ChessPiece("kingE8", "king", {x: 0.5, y: 0, z: -3.5});
        this.blackChessPieces.push(kingE8);    // King on E8 for black
        let bishopF8 = new ChessPiece("bishopF8", "bishop", {x: 1.5, y: 0, z: -3.5}, {x: 5, y: 1, z: 1}, {x: 0, y: 0, z: 0}, 1);
        this.blackChessPieces.push(bishopF8);
        let knightG8 = new ChessPiece("knightG8", "knight", {x: 2.5, y: 0, z: -3.5},{x: 5, y: 1, z: 1}, {x: 0, y: 0, z: 0}, 1);
        this.blackChessPieces.push(knightG8);
        let rookH8 = new ChessPiece("rookH8", "rook", {x: 3.5, y: 0, z: -3.5});
        this.blackChessPieces.push(rookH8);

            // Black's 1st Move: Pawn E7 to E5
            pawnE7.addBezierAnimation(4, 4.8, 
                {x: 0.5, y: 0, z: -2.5}, 
                {x: 0.75, y: 1, z: -2}, 
                {x: 0.8, y: 0.25, z: -1}, 
                {x: 0.5, y: 0, z: -.5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: -.1, y: 0, z: 1},
                {x: -.2, y: 0, z: -.2},
                {x: 0, y: 0, z: 0},
                18
            );
        
            // Black's 2nd Move: Knight B8 to C6
            knightB8.addBezierAnimation(8, 9, 
                {x: -2.5, y: 0, z: -3.5}, 
                {x: -2, y: 2, z: -3}, 
                {x: -2.25, y: 1, z: -2.5}, 
                {x: -1.5, y: 0, z: -1.5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: .1, y: 0, z: .25},
                {x: 0, y: 0, z: 0},
            );
        
            // Black's 3rd Move: Pawn A7 to A6
            pawnA7.addBezierAnimation(12, 13, 
                {x: -3.5, y: 0, z: -2.5}, // A7
                {x: -3.5, y: 1, z: -2}, 
                {x: -3.5, y: 0.25, z: -1.5}, 
                {x: -3.5, y: 0, z: -1.5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 0},
                {x: .1, y: 0, z: 0},
                {x: .1, y: 0, z: .25},
                {x: 0, y: 0, z: 0},
            );

            // pawnA7 gets knocked out
            pawnA7.addBezierAnimation(14.95, 16.5,
                {x: -3.5, y: 0, z: -1.5}, // A6
                {x: -7, y: 3, z: -5}, //
                {x: -8, y: -10, z: -5}, //
                {x: -8, y: -60, z: -5},
                {x: 1, y: 1, z: 1},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},{x: 0, y: 0, z: 0},
                {x: 0, y: 0, z: 2},
                {x: 1, y: 0, z: 0},
                {x: 1, y: 0, z: 4},
                {x: 0, y: 0, z: 0},
                

            )
        }
        
        
    

        drawPiece(gl, shaderProgram, buffer, name, tx, ty, tz, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0, degree = 0) {
            const modelviewMatrix = mat4.create();
        
            // Translate first
            mat4.translate(modelviewMatrix, modelviewMatrix, [tx, ty, tz]);
        
            // Then scale
            mat4.scale(modelviewMatrix, modelviewMatrix, [sx, sy, sz]);
        
            // Then rotate
            mat4.rotate(modelviewMatrix, modelviewMatrix, degree * Math.PI / 180, [rx, ry, rz]);
        
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
        const drawPieces = (piecesArray, texture, degree=0) => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            for (let piece of piecesArray) {
                const { tx, ty, tz, rx, ry, rz } = piece.getCurrentState(currentTime);
                this.drawPiece(gl, shaderProgram, this.buffers[piece.type], piece.name, tx, ty, tz, 1, 1, 1, rx, 1, rz, degree);
            }
        };
    
        // Draw White and Black pieces
        drawPieces(this.whiteChessPieces, this.whiteTexture, 180);
        drawPieces(this.blackChessPieces, this.blackTexture, 0);
        // log the current time, rounded down to the nearest 1 second
        console.log("Time:", Math.floor(currentTime));
        
    }

}


class ChessPiece {
    constructor(name, type, initialPosition, initialScale = { x: 1, y: 1, z: 1 }, initialRotation = { x: 0, y: 0, z: 0 }, degree=0) {
        this.name = name;
        this.type = type;
        this.position = initialPosition;  
        this.scale = initialScale;      
        this.rotation = initialRotation;
        this.degree = degree;
        this.animations = [];
    }

    addBezierAnimation(startT, endT, 
        startPos, controlPos1, controlPos2, endPos, 
        startScale = this.scale, controlScale1 = this.scale, controlScale2 = this.scale, endScale = this.scale, 
        startRot = this.rotation, controlRot1 = this.rotation, controlRot2 = this.rotation, endRot = this.rotation, degree = this.degree) {
        this.animations.push({
            startT, endT,
            startPos, controlPos1, controlPos2, endPos,
            startScale, controlScale1, controlScale2, endScale,
            startRot, controlRot1, controlRot2, endRot, degree
        });
    }

    getCurrentState(currentTime) {
        let hasActiveAnimation = false;
        for (let anim of this.animations) {
            if (currentTime >= anim.startT && currentTime < anim.endT) {
                hasActiveAnimation = true;
                this.position.x = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.x, anim.controlPos1.x, anim.controlPos2.x, anim.endPos.x);
                this.position.y = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.y, anim.controlPos1.y, anim.controlPos2.y, anim.endPos.y);
                this.position.z = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startPos.z, anim.controlPos1.z, anim.controlPos2.z, anim.endPos.z);
                this.scale.x = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startScale, anim.controlScale1, anim.controlScale2, anim.endScale);
                this.scale.y = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startScale, anim.controlScale1, anim.controlScale2, anim.endScale);
                this.scale.z = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startScale, anim.controlScale1, anim.controlScale2, anim.endScale);
                this.rotation.x = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.x, anim.controlRot1.x, anim.controlRot2.x, anim.endRot.x);
                this.rotation.y = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.y, anim.controlRot1.y, anim.controlRot2.y, anim.endRot.y);
                this.rotation.z = this.bezierInterpolate(currentTime, anim.startT, anim.endT, anim.startRot.z, anim.controlRot1.z, anim.controlRot2.z, anim.endRot.z);
                break;
            }
        }
        // If there are no active animations, set the position, scale, and rotation to the end values of the last animation
        if (!hasActiveAnimation && this.animations.length > 0 && currentTime >= this.animations[this.animations.length - 1].endT) {
            this.position = {...this.animations[this.animations.length - 1].endPos};
            this.scale = {...this.animations[this.animations.length - 1].endScale};
            this.rotation = {...this.animations[this.animations.length - 1].endRot};
        }

        return {
            tx: this.position.x,
            ty: this.position.y,
            tz: this.position.z,
            sx: this.scale.x,
            sy: this.scale.y,
            sz: this.scale.z,
            rx: this.rotation.x,
            ry: this.rotation.y,
            rz: this.rotation.z,
            degree: this.degree
        };
    }

    bezierInterpolate(t, t0, t1, v0, v1, v2, v3) {
        let ratio = (t - t0) / (t1 - t0);
        ratio = Math.max(0, Math.min(ratio, 1)); // Clamp the ratio to [0, 1]
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

export { ChessSet, ChessPiece};