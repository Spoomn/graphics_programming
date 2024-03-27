import {drawLines, drawLineStrip} from "./shapes2d.js";
import {drawQuad, drawVertices3d} from "./shapes3d.js";
import {Bezier, Point2} from "./bezier.js";

class Cell{
    constructor(){
        this.left = true;
        this.bottom = true;
        this.right = true;
        this.top = true;
        this.visited = false;
        const customColors = [
            [.558,.269,.91,1], //purpleish
            [.262,.856,.527,1], //greenish
            [.984,.703,.0195,1], //mustard
            [.0312,.5859,.8085,1], //cool blue gatorade
            [.214,.703,.625,1], //arctic
            [.7265,.109,.1289,1], //blood
            [.542,.757,.855,1], //cavalry blue
            [.984,.737,.016,1], //google yellow
            [.051,.396,.176,1], //google green
            [.647,.055,.055,1], //google red
            [.090,.306,.651,1], //google blue
        ]
    }
    
    draw(gl, shaderProgram, x, y){
        //draw 2d line walls
        const vertices = [];

        if(this.left){
            vertices.push(x,y, x,y+1);
        }
        if(this.bottom){
            vertices.push(x,y, x+1,y);
        }
        if(this.right){
            vertices.push(x+1,y, x+1,y+1);
        }
        if(this.top){
            vertices.push(x,y+1, x+1,y+1);
        }

        drawLines(gl, shaderProgram, vertices, [0,0,0,1]);

        // draw 3d quad walls
        const r = Math.sin(x/10)*.9+.5;
        const g = Math.sin(y/10)*.9+.5;
        const b = Math.sin(x/10+y/10)*.9+.5;
        if(this.left){
            drawQuad(gl, shaderProgram, x,y,0,x,y+1,0,x,y+1,1,x,y,1, r,g,b);
        }
        if(this.bottom){
            drawQuad(gl, shaderProgram, x,y,0,x+1,y,0,x+1,y,1,x,y,1, r,g,b);
        }
        if(this.right){
            drawQuad(gl, shaderProgram, x+1,y,0,x+1,y+1,0,x+1,y+1,1,x+1,y,1, r,g,b);
        }
        if(this.top){
            drawQuad(gl, shaderProgram, x,y+1,0,x+1,y+1,0,x+1,y+1,1,x,y+1,1, r,g,b);
        }

        // floor plane
    }
    drawOptimized(gl, shaderProgram, x, y, vertices){
        // draw 3d quad walls
        const r = Math.sin(x/10)*.9+.5;
        const g = Math.sin(y/10)*.9+.5;
        const b = Math.sin(x/10+y/10)*.9+.5;
        if(this.left){
            // drawQuad(gl, shaderProgram, x,y,0, x,y+1,0, x,y+1,1, x,y,1, r,g,b);
            vertices.push(x,y,0, r,g,b, x,y+1,0, r,g,b, x,y+1,1, r,g,b);
            vertices.push(x,y,0, r,g,b, x,y+1,1, r,g,b, x,y,1, r,g,b);
        }
        if(this.bottom){
            // drawQuad(gl, shaderProgram, x,y,0,x+1,y,0,x+1,y,1,x,y,1, r,g,b);
            vertices.push(x,y,0, r,g,b, x+1,y,0, r,g,b, x+1,y,1, r,g,b);
            vertices.push(x,y,0, r,g,b, x+1,y,1, r,g,b, x,y,1, r,g,b);
        }
        if(this.right){
            // drawQuad(gl, shaderProgram, x+1,y,0,x+1,y+1,0,x+1,y+1,1,x+1,y,1, r,g,b);
            vertices.push(x+1,y,0, r,g,b, x+1,y+1,0, r,g,b, x+1,y+1,1, r,g,b);
            vertices.push(x+1,y,0, r,g,b, x+1,y+1,1, r,g,b, x+1,y,1, r,g,b);
        }
        if(this.top){
            // drawQuad(gl, shaderProgram, x,y+1,0,x+1,y+1,0,x+1,y+1,1,x,y+1,1, r,g,b);
            vertices.push(x,y+1,0, r,g,b, x+1,y+1,0, r,g,b, x+1,y+1,1, r,g,b);
            vertices.push(x,y+1,0, r,g,b, x+1,y+1,1, r,g,b, x,y+1,1, r,g,b);
        }

        // floor plane
        drawQuad(gl, shaderProgram, x,y,-.0001, x+1,y,-.0001, x+1,y+1,-.0001, x,y+1,-.0001, .25,.45,.98);
    }
}

class Maze{
    constructor(WIDTH, HEIGHT){
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.cells = [];
        for(let r=0; r<HEIGHT; r++){
            this.cells.push([]);
            for(let c=0; c<WIDTH; c++){
                this.cells[r].push(new Cell());
            }
        }
        this.cells[0][0].bottom = false;

        this.removeWalls(0,0);
        this.cells[HEIGHT - 1][WIDTH - 1].top = false;

        this.path= [];
        for(let r=0; r<this.HEIGHT; r++){
            for(let c=0; c<this.WIDTH; c++){
                this.cells[r][c].visited = false;
            }
        }
        this.findPath(0,0);
    }

    findPath(c,r){
        this.cells[r][c].visited = true;
        this.path.push(c+.5,r+.5);
        if(c==this.WIDTH-1 && r==this.HEIGHT-1){ // the top right cell is the solution
            return true; // this cell is the solution
        }

        // move left if there is no wall, and it hasn't been visited. Return true if it returns true.
        if (!this.cells[r][c].left && !this.cells[r][c-1].visited){
            if (this.findPath(c-1,r)){
                return true; // this cell leads to the solution
            }
        }

        // Same for right, top, and bottom:
        if (!this.cells[r][c].right && !this.cells[r][c+1].visited){
            if (this.findPath(c+1,r)){
                return true;
            }
        }
        if (!this.cells[r][c].top && !this.cells[r+1][c].visited){
            if (this.findPath(c,r+1)){
                return true;
            }
        }
        if (!this.cells[r][c].bottom && !this.cells[r-1][c].visited){
            if (this.findPath(c,r-1)){
                return true;
            }
        }

        // This is a loser cell, so undo the move from this.path, and return false to the previous cell.
        this.path.pop();
        this.path.pop();
        return false;
    }

    drawPath(gl, shaderProgram){
        drawLineStrip(gl, shaderProgram, this.path, [1,0,1,1]);
    }

    drawSmoothPath(gl, shaderProgram){
        for(let curve = 0; curve < this.path.length/2-3; curve++){
            const bspline = [];
            for (let i=0; i<4; i++){
                bspline.push(new Point2(this.path[curve*2+i], this.path[curve*2+i+1]));
            }
            const bezierPoints = this.bsplinetoBezier(bspline);
            const b = new Bezier(bezierPoints[0], bezierPoints[1], bezierPoints[2], bezierPoints[3]);
            b.drawCurve(gl, shaderProgram);
        }
    }

    bsplinetoBezier(bspline){
        const p0 = bspline[0];
        const p1 = bspline[1];
        const p2 = bspline[2];
        const p3 = bspline[3];
        const p4 = new Point2((p1.x+p2.x)/2, (p1.y+p2.y)/2);
        return [p0, p1, p4, p3];
    }

    removeWalls(c,r){
        this.cells[r][c].visited = true;
        const LEFT = 0;
        const BOTTOM = 1;
        const RIGHT = 2;
        const TOP = 3;
        while(true){
            // which directions are possible from the current cell?
            const available = []; 
            if(c>0 && this.cells[r][c-1].visited==false){
                available.push(LEFT);
            }
            if(c<this.WIDTH-1 && this.cells[r][c+1].visited == false){
                available.push(RIGHT);
            }
            if(r>0 && this.cells[r-1][c].visited==false){
                available.push(BOTTOM);
            }
            if(r<this.HEIGHT-1 && this.cells[r+1][c].visited == false){
                available.push(TOP);
            }

            // if we can't go forwards, go backwards.
            if (available.length == 0){
                return;
            }

            // randomly choose between the available directions, and go there.
            const random = Math.floor(Math.random()*available.length);
            const direction = available[random];

            if(direction==LEFT){
                this.cells[r][c].left = false; // remove my left wall
                this.cells[r][c-1].right = false; // remove the cell to the left's right wall
                this.removeWalls(c-1,r); // recurse left
            }            
            if(direction==RIGHT){
                this.cells[r][c].right = false;
                this.cells[r][c+1].left = false;
                this.removeWalls(c+1,r);
            }
            if(direction==BOTTOM){
                this.cells[r][c].bottom = false; 
                this.cells[r-1][c].top = false;
                this.removeWalls(c,r-1); 
            }  
            if(direction==TOP){
                this.cells[r][c].top = false; 
                this.cells[r+1][c].bottom = false;
                this.removeWalls(c,r+1); 
            }  
        }
    }

    isSafe(x,y,fatness){
        const c = Math.floor(x);
        const r = Math.floor(y);
        const offsetX = x-c;
        const offsetY = y-r;
        if(c<0 || r<0 || c>=this.WIDTH || r>=this.HEIGHT){
            return false;
        }
        // test right wall
        if (this.cells[r][c].right && offsetX + fatness > 1){
            return false;
        } 
        // test left wall
        if (this.cells[r][c].left && offsetX - fatness < 0){
            return false;
        }
        // test top wall
        if (this.cells[r][c].top && offsetY + fatness > 1){
            return false;
        }
        // test bottom wall
        if (this.cells[r][c].bottom && offsetY - fatness < 0){
            return false;
        }
        // test corners
        // top right corner
        if (offsetX + fatness > 1 && offsetY - fatness < 0){
            return false;
        }
        // top left corner
        if (offsetX - fatness < 0 && offsetY - fatness < 0){ 
            return false;
        }
        // bottom right corner
        if (offsetX + fatness > 1 && offsetY + fatness > 1){ 
            return false;
        }
        // bottom left corner
        if (offsetX - fatness < 0 && offsetY + fatness > 1){ 
            return false;
        }
        return true;
    }

    draw(gl, shaderProgram){
        for(let r=0; r<this.HEIGHT; r++){
            for(let c=0; c<this.WIDTH; c++){
                this.cells[r][c].draw(gl, shaderProgram, c, r);
            }
        }
    }
    drawOptimized(gl, shaderProgram){
        let vertices = [];
        for(let r=0; r<this.HEIGHT; r++){
            for(let c=0; c<this.WIDTH; c++){
                this.cells[r][c].drawOptimized(gl, shaderProgram, c, r, vertices);
            }
        }
        drawVertices3d(gl, shaderProgram, vertices, gl.TRIANGLES);
    }

}

export {Maze};
