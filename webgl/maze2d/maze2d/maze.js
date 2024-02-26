import { drawLine } from "./shapes2d.js";

class Cell{
    constructor(){
        this.left = true;
        this.bottom = true;
        this.right = true;
        this.top = true;
        this.visited = false;
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

class Maze {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.stack = [];
        for (let r = 0; r < height; r++) {
            this.cells.push([]);
            for (let c = 0; c < width; c++) {
                this.cells[r].push(new Cell());
            }
        }
        this.cells[0][0].bottom = false;
        this.RemoveWalls(0,0);
        this.cells[height - 1][width - 1].top = false;
    }

    RemoveWalls(r, c) {
        this.cells[r][c].visited = true;
        const left = 0;
        const bottom = 1;
        const right = 2;
        const top = 3;

        // Find all the directions we could go
        const possibilities = [];
        if (c > 0 && !this.cells[r][c - 1].visited) {
            possibilities.push(left);
        }
        if (r > 0 && !this.cells[r - 1][c].visited) {
            possibilities.push(bottom);
        }
        if (c < this.width - 1 && !this.cells[r][c + 1].visited) {
            possibilities.push(right);
        }
        if (r < this.height - 1 && !this.cells[r + 1][c].visited) {
            possibilities.push(top);
        }

        while (possibilities.length > 0) {
            const randomIndex = Math.floor(Math.random() * possibilities.length);
            const direction = possibilities.splice(randomIndex, 1)[0];
    
            let nextR = r;
            let nextC = c;
            if (direction === 0) nextC--;
            else if (direction === 1) nextR--;
            else if (direction === 2) nextC++;
            else if (direction === 3) nextR++;
    
            if (this.cells[nextR][nextC] && !this.cells[nextR][nextC].visited) {
                if (direction === 0) { 
                    this.cells[r][c].left = false; 
                    this.cells[nextR][nextC].right = false; 
                }
                else if (direction === 1) { 
                    this.cells[r][c].bottom = false; 
                    this.cells[nextR][nextC].top = false; 
                }
                else if (direction === 2) { 
                    this.cells[r][c].right = false; 
                    this.cells[nextR][nextC].left = false; 
                }
                else if (direction === 3) { 
                    this.cells[r][c].top = false; 
                    this.cells[nextR][nextC].bottom = false; 
                }
                this.stack.push({r: r, c: c});
                this.RemoveWalls(nextR, nextC);
            }
        }
    
        if (possibilities.length === 0 && this.stack.length > 0) {
            const lastCell = this.stack.pop();
            this.RemoveWalls(lastCell.r, lastCell.c);
        }
    }
    

    draw(gl, shaderProgram, width, height) {
        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                this.cells[r][c].draw(gl, shaderProgram, c, r);
            }
        }
    }
}

export {Maze}