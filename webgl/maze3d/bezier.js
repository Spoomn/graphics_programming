import { drawLineStrip, drawCircle} from "./shapes2d.js";
import { drawLineStrip3d } from "./shapes3d.js";
class Point2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Point3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Bezier {
    constructor(p0, p1, p2, p3) {
        this.points = [p0, p1, p2, p3];
        this.selectedPointIndex = -1;
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
        this.color = [.24,.24,.24,1];
    }


    evaluate(t) {
        let p0 = this.points[0];
        let p1 = this.points[1];
        let p2 = this.points[2];
        let p3 = this.points[3];

        let x = p0.x * Math.pow((1 - t), 3) + 3 * p1.x * t * Math.pow((1 - t), 2) + 3 * p2.x * Math.pow(t, 2) * (1 - t) + p3.x * Math.pow(t, 3);
        let y = p0.y * Math.pow((1 - t), 3) + 3 * p1.y * t * Math.pow((1 - t), 2) + 3 * p2.y * Math.pow(t, 2) * (1 - t) + p3.y * Math.pow(t, 3);

        return new Point2(x, y);
    }

    drawCurve(gl, shaderProgram) {
        const segments = 20;
        let points = [];
        for (let i = 0; i <= segments; i++) {
            let t = i / segments;
            let pt = this.evaluate(t);
            points.push(pt.x, pt.y);
        }
        drawLineStrip(gl, shaderProgram, points, this.color);
    }

    drawCurve3d(gl, shaderProgram) {
        const segments = 20;
        let points = [];
        for (let i = 0; i <= segments; i++) {
            let t = i / segments;
            let pt = this.evaluate(t);
            points.push(pt.x, pt.y, pt.z, this.color[0], this.color[1], this.color[2]);
        }
        drawLineStrip3d(gl, shaderProgram, points);
    }

    drawControlPoints(gl, shaderProgram) {
        const pointSize = this.isSelected ? 0.2 : 0.1;
        this.points.forEach(point => {
            drawCircle(gl, shaderProgram, point.x, point.y, pointSize, this.color);
        });
    }

    isPicked(x, y) {
        const radius = 0.5;
        for (let i = 0; i < this.points.length; i++) {
            const dx = x - this.points[i].x;
            const dy = y - this.points[i].y;
            if (dx * dx + dy * dy < radius * radius) {
                return i;
            }
        }
        return -1; // Return -1 if no control point is close enough
    }

    setPoint(index, x, y) {
        if (index >= 0 && index < this.points.length) {
            this.points[index].x = x;
            this.points[index].y = y;
        }
    }
}
export {Point2, Bezier, Point3};