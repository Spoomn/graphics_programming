import { drawLineLoop, drawLines, drawLineStrip, drawCircle } from "./shapes2d.js";
import { drawTriangle3d, drawQuad } from "./shapes3d.js";

//this is to draw a cheese similar to the rat, at the maze goal
class Cheese{
    constructor(x,y,degrees){
        this.x = x;
        this.y = y;
        this.degrees = degrees;
    }

    draw(gl, shaderProgram){
        // set the model view matrix
        const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
        const modelViewMatrix = mat4.create();
        // translate to the cheese's position
        mat4.translate(modelViewMatrix, modelViewMatrix, [this.x, this.y, 0]);
        // rotate the cheese
        mat4.rotate(modelViewMatrix, modelViewMatrix, (this.degrees*Math.PI/180), [0,0,1]);
        // load the model view matrix onto the shader
        gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

        // draw the cheese triangle
        const topVerticies = [.3,0, -.25,.15, -.2,-.1]; // a triangle
        const color = [.95, .75, .089, 1]; // yellow
        drawLineLoop(gl, shaderProgram, topVerticies, color);
        const bottomVerticies = [-.25,-.15, -.2,-.3 , .3,-.2];
        drawLineStrip(gl, shaderProgram, bottomVerticies, color);
        const middleVerticies1 = [-.25,.15, -.25,-.15];
        drawLineStrip(gl, shaderProgram, middleVerticies1, color);
        const middleVerticies2 = [-.2,-.1, -.2,-.3];
        drawLineStrip(gl, shaderProgram, middleVerticies2, color);
        const middleVerticies3 = [.3,0, .3,-.2];
        drawLineStrip(gl, shaderProgram, middleVerticies3, color);



        // draw the cheese's holes
        drawCircle(gl, shaderProgram, -.1, .04, .04, color);
        drawCircle(gl, shaderProgram, -.05, -.15, .05, color);
        drawCircle(gl, shaderProgram, .15, -.1, .06, color);
    }
}
export { Cheese };