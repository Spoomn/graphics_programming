import { drawColorNormalVertices, storeQuad, crossProduct, rgbToFloat } from "./shapes2d.js";

class Terrain{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.waterHeight = 0;
    }


    terrainFunction(x, y){
            let z = 0;
            z += 3*Math.sin(x/2 + 4) + 3*Math.cos(x/5 + 6);
            z += 4*Math.sin(y/4 + 5);
            z += 3*Math.sin(x/4 + 6) + 3*Math.cos(y/5 + 6);
            return z;
          }

    waterFunction(x, y){
        return 0;
    }

    draw(gl, shaderProgram){
        const vertices = [];
        const waterVertices = [];

        // draw terrain
        for (let i = 0; i<this.WIDTH; i++){
            for (let j = 0; j<this.HEIGHT; j++){
                const x1 = i;
                const y1 = j;
                const z1 = this.terrainFunction(x1, y1);
                const x2 = i+1;
                const y2 = j;
                const z2 = this.terrainFunction(x2, y2);
                const x3 = i+1;
                const y3 = j+1;
                const z3 = this.terrainFunction(x3, y3);
                const x4 = i;
                const y4 = j+1;
                const z4 = this.terrainFunction(x4, y4);
                const [nx1,ny1,nz1] = crossProduct(x1,y1,z1,x1+.001,y1,this.terrainFunction(x1+.001,y1),x1,y1+.001,this.terrainFunction(x1,y1+.001));
                const [nx2,ny2,nz2] = crossProduct(x2,y2,z2,x2+.001,y2,this.terrainFunction(x2+.001,y2),x2,y2+.001,this.terrainFunction(x2,y2+.001));
                const [nx3,ny3,nz3] = crossProduct(x3,y3,z3,x3+.001,y3,this.terrainFunction(x3+.001,y3),x3,y3+.001,this.terrainFunction(x3,y3+.001));
                const [nx4,ny4,nz4] = crossProduct(x4,y4,z4,x4+.001,y4,this.terrainFunction(x4+.001,y4),x4,y4+.001,this.terrainFunction(x4,y4+.001));
                
                let {r, g, b} = rgbToFloat(32,191,100);
                // let r = Math.sin(this.WIDTH * 3712 + j * 34857 + 1) * .5 + .5;
                // let g = Math.sin(this.WIDTH * 9321 + j * 27543 + 2) * .5 + .5;
                // let b = Math.sin(this.WIDTH * 1268 + j * 12771 + 7) * .5 + .5;
                let a = 1;

                // let r = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                // let g = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                // let b = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                // if the z value is greater than 3, color it brown
                if (z1 > 3){
                    r = 0.5;
                    g = 0.3;
                    b = 0.1;
                }
                if (z1 > 4){
                    r = 0.3;
                    g = 0.2;
                    b = 0.1;
                }
                if (z1 > 7){
                    // white
                    r = 1;
                    g = 1;
                    b = 1;
                }
                
                storeQuad(vertices, 
                    x1, y1, z1, nx1, ny1, nz1,
                    x2, y2, z2, nx2, ny2, nz2,
                    x3, y3, z3, nx3, ny3, nz3,
                    x4, y4, z4, nx4, ny4, nz4,
                    r, g, b, a);
                }
            }   
        for (let i = 0; i<this.WIDTH; i++){
            for ( let j = 0; j<this.HEIGHT; j++){
                // draw water plane
                const waterHeight = this.waterFunction(i, j);
                const waterColor = rgbToFloat(20, 20, 200);
                const waterAlpha = 0.9;
                const x1 = 0;
                const y1 = 0;
                const z1 = waterHeight;
                const x2 = this.WIDTH;
                const y2 = 0;
                const z2 = waterHeight;
                const x3 = this.WIDTH;
                const y3 = this.HEIGHT;
                const z3 = waterHeight;
                const x4 = 0;
                const y4 = this.HEIGHT;
                const z4 = waterHeight;
                const [nx1,ny1,nz1] = crossProduct(x1,y1,z1,x1+.001,y1,this.terrainFunction(x1+.001,y1),x1,y1+.001,this.terrainFunction(x1,y1+.001));
                const [nx2,ny2,nz2] = crossProduct(x2,y2,z2,x2+.001,y2,this.terrainFunction(x2+.001,y2),x2,y2+.001,this.terrainFunction(x2,y2+.001));
                const [nx3,ny3,nz3] = crossProduct(x3,y3,z3,x3+.001,y3,this.terrainFunction(x3+.001,y3),x3,y3+.001,this.terrainFunction(x3,y3+.001));
                const [nx4,ny4,nz4] = crossProduct(x4,y4,z4,x4+.001,y4,this.terrainFunction(x4+.001,y4),x4,y4+.001,this.terrainFunction(x4,y4+.001));

                storeQuad(waterVertices, 
                    x1, y1, z1, nx1, ny1, nz1,
                    x2, y2, z2, nx2, ny2, nz2,
                    x3, y3, z3, nx3, ny3, nz3,
                    x4, y4, z4, nx4, ny4, nz4,
                    waterColor.r, waterColor.g, waterColor.b, waterAlpha);
            }
        }

        drawColorNormalVertices(gl, shaderProgram, waterVertices, gl.TRIANGLES);
        drawColorNormalVertices(gl, shaderProgram, vertices, gl.TRIANGLES);
        
    }
}

export { Terrain}