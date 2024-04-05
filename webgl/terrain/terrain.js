import { drawColorNormalVertices, storeQuad, crossProduct, rgbToFloat } from "./shapes2d.js";

class Terrain{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.water = new Water(WIDTH, HEIGHT);
    }


    F(x, y){
        // TODO: implement a better function, one with variation for each hill
        const z = Math.sin(x * 3712 + y * 34857 + 1) * .5 + .5;
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
                let nx1 = x1;
                let ny1 = y1;
                let nz1 = z1;			
                let nx2 = x2;
                let ny2 = y2;
                let nz2 = z2;
                let nx3 = x3;
                let ny3 = y3;
                let nz3 = z3;
                let nx4 = x4;
                let ny4 = y4;
                let nz4 = z4;	
                // [nx1,ny1,nz1] = crossProduct(x1,y1,z1,x2,y2,z2,x3,y3,z3);
                // [nx2,ny2,nz2] = crossProduct(x2,y2,z2,x3,y3,z3,x4,y4,z4);
                // [nx3,ny3,nz3] = crossProduct(x3,y3,z3,x4,y4,z4,x1,y1,z1);
                // [nx4,ny4,nz4] = crossProduct(x4,y4,z4,x1,y1,z1,x2,y2,z2);
                // if (j==strips-1){
                //     [nx1,ny1,nz1] = crossProduct(x1,y1,z1,x2,y2,z2,x4,y4,z4);
                // }
                // let {r, g, b} = rgbToFloat(191,32,100);
                // let r = Math.sin(i * 3712 + j * 34857 + 1) * .5 + .5;
                // let g = Math.sin(i * 9321 + this.WIDTH * 27543 + 2) * .5 + .5;
                // let b = Math.sin(this.HEIGHT * 1268 + j * 12771 + 7) * .5 + .5;
                let r = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                let g = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                let b = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;

                storeQuad(vertices, x1, y1, z1, nx1, ny1, nz1,
                                    x2, y2, z2, nx2, ny2, nz2,
                                    x3, y3, z3, nx3, ny3, nz3,
                                    x4, y4, z4, nx4, ny4, nz4,
                                    r, g, b, alpha);
                
                // storeQuad(vertices, 
                //     x1, y1, z1, nx, ny, nz,
                //     x2, y2, z2, nx, ny, nz,
                //     x3, y3, z3, nx, ny, nz,
                //     x4, y4, z4, nx, ny, nz,
                //     r, g, b, 1);
            }
        }   
        // water level drawing

        // gl.enable(gl.blend)
        // alpha = 0.6;
        
        // let {waterR, waterG, waterB} = rgbToFloat(0, 50, 255);
        // let nx = 0;
        // let ny = 0;
        // let nz = 1;
        // storeQuad(vertices, 0, 0, this.baseWaterHeight, nx, ny, nz,
        //             this.WIDTH, 0, this.baseWaterHeight, nx, ny, nz,
        //             this.WIDTH, this.HEIGHT, this.baseWaterHeight, nx, ny, nz,
        //             0, this.HEIGHT, this.baseWaterHeight, nx, ny, nz,
        //             waterR, waterG, waterB, alpha);
        // gl.disable(gl.blend);
        this.water.draw(gl, shaderProgram);
        drawColorNormalVertices(gl, shaderProgram, vertices, gl.TRIANGLES);
    }
}

class Water{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.baseWaterHeight = 0;
        this.color = rgbToFloat(0, 50, 255);
        this.alpha = 0.6;
    }

    draw(gl, shaderProgram){
        const vertices = [];
        let alpha = this.alpha;
        gl.enable(gl.blend)
        
        let {r,g,b} = this.color;
        let nx = 0;
        let ny = 0;
        let nz = 1;
        storeQuad(vertices, 0, 0, this.baseWaterHeight, nx, ny, nz,
                    this.WIDTH, 0, this.baseWaterHeight, nx, ny, nz,
                    this.WIDTH, this.HEIGHT, this.baseWaterHeight, nx, ny, nz,
                    0, this.HEIGHT, this.baseWaterHeight, nx, ny, nz,
                    r,g,b, alpha);
        gl.disable(gl.blend);
    }
}

export { Terrain, Water}