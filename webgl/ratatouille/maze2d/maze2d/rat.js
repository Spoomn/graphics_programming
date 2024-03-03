import { drawLineLoop } from "./shapes2d.js";

class Rat{
    constructor(x,y,degrees){
        this.x = x;
        this.y = y;
        this.degrees = degrees;

        this.SPIN_SPEED = 90;
        this.MOVE_SPEED = 1.0;
        this.FATNESS = .3; // how fat is the rat?
    }

    draw(gl, shaderProgram){
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (this.degrees*Math.PI/180), [0,0,1]);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        const verticies = [.3,0, -.2,.1, -.2,-.1];
        drawLineLoop(gl, shaderProgram, verticies, [0.051, 0.396, 0.176, 1.]);
    }
    spinLeft(DT){
        this.degrees += this.SPIN_SPEED*DT;
        if(this.degrees >= 360){
            this.degrees -= 360;
        }
        if(this.degrees < 0){
            this.degrees += 360;
        }
    }
    scurryForward(DT){
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        this.x += dx;
        this.y += dy;
    }
    scurryBackwards(DT){
        this.scurryForward(-DT);
    }
    strafeLeft(DT){
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        this.x += dy;
        this.y += -dx;
    }

    
}
export {Rat}