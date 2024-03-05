import { drawLineLoop, drawLines } from "./shapes2d.js";

class Rat{
    constructor(x,y,degrees,maze){
        this.x = x;
        this.y = y;
        this.degrees = degrees;
        this.maze = maze; // the rat needs to know about the maze

        this.SPIN_SPEED = 100;
        this.MOVE_SPEED = 1.5;
        this.FATNESS = .25; // how fat is the rat?
    }

    draw(gl, shaderProgram){
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (this.degrees*Math.PI/180), [0,0,1]);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        const verticies = [.3,0, -.2,.1, -.2,-.1]; // a triangle
        const color = [0.051, 0.396, 0.176, 1.]; // green
        drawLineLoop(gl, shaderProgram, verticies, color);
        // give the rat whiskers by drawing 4 lines
        drawLines(gl, shaderProgram, [0,.01, .1,.25], color);
        drawLines(gl, shaderProgram, [0,-.01, .1,-.25], color);
        // drawLines(gl, shaderProgram, [.1,.25, .2,.27], color);
        // drawLines(gl, shaderProgram, [0,-.25, .2,-.27], color);
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
    spinRight(DT){
        this.spinLeft(-DT)
    }
    scurryForward(DT){
        
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const newx = this.x + dx;
        const newy = this.y + dy;
        // check for walls and adjust the rat's position
        if (this.maze.isSafe(newx, newy, this.FATNESS)){
            this.x = newx;
            this.y = newy;
        }
        else if (this.maze.isSafe(newx, this.y, this.FATNESS)){
            this.x = newx;
        }
        else if (this.maze.isSafe(this.x, newy, this.FATNESS)){
            this.y = newy;
        }
    }
    scurryBackward(DT){
        this.scurryForward(-DT);
    }
    strafeLeft(DT){
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const newx = this.x - dy;
        const newy = this.y - dx;
        if (this.maze.isSafe(newx, newy, this.FATNESS)){
            this.x = newx;
            this.y = newy;
        }
        else if (this.maze.isSafe(newx, this.y, this.FATNESS)){
            this.x = newx;
        }
        else if (this.maze.isSafe(this.x, newy, this.FATNESS)){
            this.y = newy;
        }
    }
    strafeRight(DT){
        const dx = Math.cos(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const dy = Math.sin(this.degrees*Math.PI/180)*this.MOVE_SPEED*DT;
        const newx = this.x + dy;
        const newy = this.y + dx;
        if (this.maze.isSafe(newx, newy, this.FATNESS)){
            this.x = newx;
            this.y = newy;
        }
        else if (this.maze.isSafe(newx, this.y, this.FATNESS)){
            this.x = newx;
        }
        else if (this.maze.isSafe(this.x, newy, this.FATNESS)){
            this.y = newy;
        }
    }

    
}
export {Rat}