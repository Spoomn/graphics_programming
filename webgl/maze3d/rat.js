import { drawLineLoop, drawLines, drawLineStrip, drawCircle, drawTriangle } from "./shapes2d.js";
import {drawQuad, drawTriangle3d, drawVertices3d, drawCircle3d, drawLineStrip3d, drawbezierCurve3d} from "./shapes3d.js";
import {Bezier, Point2, Point3} from "./bezier.js";
class Rat{
    constructor(x,y,degrees,maze){
        this.x = x;
        this.y = y;
        this.degrees = degrees;
        this.maze = maze; // the rat needs to know about the maze

        this.SPIN_SPEED = 120;
        this.MOVE_SPEED = 1.7;
        this.FATNESS = .35; // how fat is the rat?
        this.TALLNESS = .3; // how tall is the rat?
    }

    draw(gl, shaderProgram){
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0]);
        mat4.rotate(modelViewMatrix, modelViewMatrix, (this.degrees*Math.PI/180), [0,0,1]);
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        // draw the rat's body in 3d
        const color = [.42,.42,.42, 1.]; // grey
        const greyR = color[0];
        const greyG = color[1];
        const greyB = color[2];
        drawTriangle3d(gl, shaderProgram, .35,0,this.TALLNESS, -.2,.2,this.TALLNESS, -.2,-.2,this.TALLNESS, greyR,greyG,greyB);

        // draw fat rat belly
        drawCircle3d(gl, shaderProgram, -.2,0,this.TALLNESS, .2, greyR,greyG,greyB);    

        // give the rat whiskers by drawing 4 lines
        drawLineStrip3d(gl, shaderProgram, [0,.01,this.TALLNESS, .1,.25,this.TALLNESS+.04], [0,0,0,1]);
        drawLineStrip3d(gl, shaderProgram, [0,-.01,this.TALLNESS, .1,-.25,this.TALLNESS+.05], [0,0,0,1]);
        drawLineStrip3d(gl, shaderProgram, [.05,.005,this.TALLNESS, .2,.2,this.TALLNESS+.06], [0,0,0,1]);
        drawLineStrip3d(gl, shaderProgram, [.05,-.005,this.TALLNESS, .2,-.2,this.TALLNESS+.03], [0,0,0,1]);

        // draw the rat's tail
        let p0 = new Point3(-.4, 0, this.TALLNESS);
        let p1 = new Point3(-.5, 0, this.TALLNESS-.1);
        let p2 = new Point3(-.6, .1, this.TALLNESS-.2);
        let p3 = new Point3(-.7, 0, this.TALLNESS-.3);
        let bez = new Bezier(p0, p1, p2, p3);
        bez.drawCurve3d(gl, shaderProgram);

        const eyeBlack = [0,0,0,1];
        const eyeBlackR = eyeBlack[0];
        const eyeBlackG = eyeBlack[1];
        const eyeBlackB = eyeBlack[2];
        const eyeWhite = [1,1,1,1];
        const eyeWhiteR = eyeWhite[0];
        const eyeWhiteG = eyeWhite[1];
        const eyeWhiteB = eyeWhite[2];
        // draw the rat's eye
        drawCircle3d(gl, shaderProgram, -.1, -.04,this.TALLNESS+.001, .06, eyeBlackR, eyeBlackG, eyeBlackB); // outline
        drawCircle3d(gl, shaderProgram, -.1, -.04,this.TALLNESS+.003, .05, eyeWhiteR, eyeWhiteG, eyeWhiteB); // white
        drawCircle3d(gl, shaderProgram, -.07, -.04,this.TALLNESS+.004, .02, eyeBlackR, eyeBlackG, eyeBlackB); // pupil
        // second eye
        drawCircle3d(gl, shaderProgram, -.1, .04,this.TALLNESS+.001, .06, eyeBlackR, eyeBlackG, eyeBlackB); // outline
        drawCircle3d(gl, shaderProgram, -.1, .04,this.TALLNESS+.003, .05, eyeWhiteR, eyeWhiteG, eyeWhiteB); // white
        drawCircle3d(gl, shaderProgram, -.07, .04,this.TALLNESS+.004, .02, eyeBlackR, eyeBlackG, eyeBlackB); // pupil
        
        const noseColor = [.99,.42,.75,1];
        const noseR = noseColor[0];
        const noseG = noseColor[1];
        const noseB = noseColor[2];
        // rat's nose triangle
        drawTriangle3d(gl, shaderProgram, .2,.025,this.TALLNESS+.001, .2,-.025,this.TALLNESS+.001, .3,0,this.TALLNESS+.001, noseR,noseG,noseB);

        // rat's ears
        drawTriangle3d(gl, shaderProgram, -.2,.2,this.TALLNESS, -.4,.15,this.TALLNESS, -.4,.25,this.TALLNESS, greyR,greyG,greyB);
        drawTriangle3d(gl, shaderProgram, -.2,-.2,this.TALLNESS, -.4,-.15,this.TALLNESS, -.4,-.25,this.TALLNESS, greyR,greyG,greyB);
        drawTriangle3d(gl, shaderProgram, -.22,.2,this.TALLNESS+.001, -.39,.235,this.TALLNESS+.001, -.39,.175,this.TALLNESS+.001, noseR,noseG,noseB);
        drawTriangle3d(gl, shaderProgram, -.22,-.2,this.TALLNESS+.001, -.39,-.235,this.TALLNESS+.001, -.39,-.175,this.TALLNESS+.001, noseR,noseG,noseB);

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