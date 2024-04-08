import { drawColorNormalVertices, storeQuad, crossProduct, rgbToFloat } from "./shapes2d.js";

class Terrain{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.water = new Water(WIDTH, HEIGHT);
    }


    F(x, y){
        // TODO: implement a better function, one with variation for each hill
        const z = Math.sin(x * 0.1) * Math.cos(y * 0.3) * 4;
        return z;
    }

    draw(gl, shaderProgram){
        const vertices = [];
        // const strips = this.HEIGHT - 1;
        let accumulatedNormals = Array.from({length: this.WIDTH}, () => Array.from({length: this.HEIGHT}, () => [0,0,0]))
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
                // const [nx,ny,nz] = crossProduct(x1,y1,z1,x2,y2,z2,x3,y3,z3);
                let nx = 0;
                let ny = 0;
                let nz = 1;
                
                // let {r, g, b} = rgbToFloat(191,32,100);
                let r = Math.sin(this.WIDTH * 3712 + j * 34857 + 1) * .5 + .5;
                let g = Math.sin(this.WIDTH * 9321 + j * 27543 + 2) * .5 + .5;
                let b = Math.sin(this.WIDTH * 1268 + j * 12771 + 7) * .5 + .5;
                let a = 1;
                // let r = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                // let g = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;
                // let b = Math.sin(this.HEIGHT + this.WIDTH + i + j) * .5 + .5;

                
                storeQuad(vertices, 
                    x1, y1, z1, nx, ny, nz,
                    x2, y2, z2, nx, ny, nz,
                    x3, y3, z3, nx, ny, nz,
                    x4, y4, z4, nx, ny, nz,
                    r, g, b, a);
            }
        }   
        
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