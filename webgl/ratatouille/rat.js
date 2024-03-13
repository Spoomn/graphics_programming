import { drawLineLoop, drawLines, drawLineStrip, drawCircle, drawTriangle } from "./shapes2d.js";
import {Bezier, Point2} from "./bezier.js";
class Rat{
    constructor(x,y,degrees,maze){
        this.x = x;
        this.y = y;
        this.degrees = degrees;
        this.maze = maze; // the rat needs to know about the maze

        this.SPIN_SPEED = 120;
        this.MOVE_SPEED = 1.7;
        this.FATNESS = .31; // how fat is the rat?
    }

    draw(gl, shaderProgram){
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (this.degrees*Math.PI/180), [0,0,1]);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        // draw the rat's body
        const verticies = [.3,0, -.2,.2, -.2,-.2]; // a triangle
        const color = [.42,.42,.42, 1.]; // grey
        drawTriangle(gl, shaderProgram, .3,0, -.2,.2, -.2,-.2, color); 

        // draw fat rat belly
        drawCircle(gl, shaderProgram, -.2,0,.2, color);

        // give the rat whiskers by drawing 4 lines
        drawLineStrip(gl, shaderProgram, [0,.01, .1,.25], [0,0,0,1]);
        drawLineStrip(gl, shaderProgram, [0,-.01, .1,-.25], [0,0,0,1]);
        drawLineStrip(gl, shaderProgram, [.05,.005, .2,.2], [0,0,0,1]);
        drawLineStrip(gl, shaderProgram, [.05,-.005, .2,-.2], [0,0,0,1]);

        // draw the rat's tail
        let p0 = new Point2(-.4, 0);
        let p1 = new Point2(-.5, 0);
        let p2 = new Point2(-.6, .1);
        let p3 = new Point2(-.7, 0);
        let b = new Bezier(p0, p1, p2, p3);
        b.drawCurve(gl, shaderProgram, [0,0,0,1]);

        // draw the rat's eye
        drawCircle(gl, shaderProgram, -.1, -.04, .06, [0,0,0,1]); // outline
        drawCircle(gl, shaderProgram, -.1, -.04, .05, [1,1,1,1]); // white
        drawCircle(gl, shaderProgram, -.07, -.04, .02, [0,0,0,1]); // pupil
        // second eye
        drawCircle(gl, shaderProgram, -.1, .04, .06, [0,0,0,1]); // outline
        drawCircle(gl, shaderProgram, -.1, .04, .05, [1,1,1,1]); // white
        drawCircle(gl, shaderProgram, -.07, .04, .02, [0,0,0,1]); // pupil
        
        // rat's nose triangle
        drawTriangle(gl, shaderProgram, .2,.025, .2,-.025, .3,0, [.99,.42,.75,1]);

        // rat's ears
        drawTriangle(gl, shaderProgram, -.2,.2, -.4,.15, -.4,.25, color);
        drawTriangle(gl, shaderProgram, -.2,-.2, -.4,-.15, -.4,-.25, color);
        drawTriangle(gl, shaderProgram, -.22,.2, -.39,.235, -.39,.175, [.99,.42,.75,1]);
        drawTriangle(gl, shaderProgram, -.22,-.2, -.39,-.235, -.39,-.175, [.99,.42,.75,1]);
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