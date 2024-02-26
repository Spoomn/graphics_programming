import { drawLine } from "./shapes2d.js";

class Cell{
    constructor(){
        this.left = true;
        this.bottom = true;
        this.right = true;
        this.top = true;
        this.visited = true;
    }
    draw(gl, shaderProgram, x, y){
        const verticies = []
        if (this.left){
            verticies.push(x, y, x, y+1);
        }
        if (this.right){
            verticies.push(x+1, y, x+1, y+1);
        }
        if (this.bottom){
            verticies.push(x, y, x+1, y);
        }
        if (this.top){
            verticies.push(x, y+1, x+1, y+1);
        }

        drawLine(gl, shaderProgram, verticies)
    }
}

class Maze{
    constructor(width,height){
        this.width = width;
        this.height = height;
        this.cells = [];
        for(let r = 0; r < height; r++){
            this.cells.push([])
            for(let c = 0; c < width; c++){
                this.cells[r].push(new Cell());
            }
        }
        this.RemoveWalls()
    }
    RemoveWalls(r,c){
        this.cells[r][c].visited = true;
        const left = 0;
        const bottom = 1;
        const right = 2;
        const top = 3;
        while(true){
            const possibilities = [];
            
            // Find all the directions we could go
            if(c > 0 && this.cells[r][c-1].visited == false){
                possibilities.push(left)
            }
            if(c > 0 && this.cells[r][c-1].visited == false){
                possibilities.push(left)
            }
            if(c > 0 && this.cells[r][c+1].visited == false){
                possibilities.push(right)
            }
            if(c > 0 && this.cells[r][c-1].visited == false){
                possibilities.push(left)
            }
            //repeat 3 times
            
            // if possibilities is none then return

            // randomly choose which direction
        }
    
        // go that direction by knocking out walls, and recursing
    }
    draw(gl, shaderProgram, width, height){
        for(let r = 0; r < height; r++){
            for(let c = 0; c < width; c++){
                this.cells[r][c].draw(gl, shaderProgram, c, r);
            }
        }
    }
}
export {Maze}