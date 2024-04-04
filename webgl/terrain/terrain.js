import { drawColorNormalVertices, storeQuad, crossProduct, rgbToFloat } from "./shapes2d.js";

class Terrain{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.baseWaterHeight = 0;
        
    }

    F(x, y){
        const z = 0;
        return z;
    }

    draw(gl, shaderProgram){
        const vertices = [];
        let alpha = 1;
        const strips = this.HEIGHT - 1;
        for (let i = 0; i<this.WIDTH; i++){
            for (let j = 0; j<this.HEIGHT; j++){
                const x1 = i;
                const y1 = j;
                const z1 = this.F(x1, y1);
                const x2 = i+1;
                const y2 = j;
                const z2 = this.F(x2, y2);
                const x3 = i+1;
                const y3 = j+1;
                const z3 = this.F(x3, y3);
                const x4 = i;
                const y4 = j+1;
                const z4 = this.F(x4, y4);
                let [nx,ny,nz] = crossProduct(x1,y1,z1,x2,y2,z2,x3,y3,z3);
                if (j==strips-1){
                    [nx,ny,nz] = crossProduct(x1,y1,z1,x2,y2,z2,x4,y4,z4);
                }
                let r = Math.sin(i * 3712 + j * 34857 + 1) * .5 + .5;
                let g = Math.sin(i * 9321 + j * 27543 + 2) * .5 + .5;
                let b = Math.sin(i * 1268 + j * 12771 + 7) * .5 + .5;
                // let {r, g, b} = rgbToFloat(191,32,100);
                
                storeQuad(vertices, 
                    x1, y1, z1, nx, ny, nz,
                    x2, y2, z2, nx, ny, nz,
                    x3, y3, z3, nx, ny, nz,
                    x4, y4, z4, nx, ny, nz,
                    r, g, b, alpha);
            }
        }   
        // gl.enable(gl.blend)
        // alpha = 0.6;
        // let {waterR, waterG, waterB} = rgbToFloat(0, 0, 255);
        // storeQuad(vertices,
        //         0, 0, this.baseWaterHeight, nx, ny, nz,
        //         this.WIDTH, 0, this.baseWaterHeight, nx, ny, nz,
        //         this.WIDTH, this.HEIGHT, this.baseWaterHeight, nx, ny, nz,
        //         waterR, waterG, waterB, alpha);
        // gl.disable(gl.blend);
        drawColorNormalVertices(gl, shaderProgram, vertices, gl.TRIANGLES);
    }
}

export { Terrain}