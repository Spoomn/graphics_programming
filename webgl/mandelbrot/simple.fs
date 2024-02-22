precision highp float;

varying vec2 fragPosition;

const int MAX_ITER = 1000;
uniform int colorMode;

vec3 getPredeterminedColor(int count) {
    if (count == MAX_ITER) {
        return vec3(0.0, 0.0, 0.0); //black inside
    } else {
        float normalized = float(count) / float(MAX_ITER);
        if (normalized < 0.1) return vec3(0.262, 0.856, 0.527); // greenish
        else if (normalized < 0.2) return vec3(0.558, 0.269, 0.91); // purpleish
        else if (normalized < 0.3) return vec3(0.984, 0.703, 0.0195); // mustard
        else if (normalized < 0.4) return vec3(0.0312, 0.5859, 0.8085); // cool blue gatorade
        else if (normalized < 0.5) return vec3(0.214, 0.703, 0.625); // arctic
        else if (normalized < 0.6) return vec3(0.7265, 0.109, 0.1289); // blood
        else if (normalized < 0.7) return vec3(0.542, 0.757, 0.855); // cavalry blue
        else if (normalized < 0.8) return vec3(0.984, 0.737, 0.016); // google yellow
        else if (normalized < 0.9) return vec3(0.051, 0.396, 0.176); // google green
        else return vec3(0.647, 0.055, 0.055); // google red
    }
}

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

vec3 getRandomColor(int count) {
    float normalized = float(count) / float(MAX_ITER);
    float r = rand(normalized * 0.1);
    float g = rand(normalized * 0.2);
    float b = rand(normalized * 0.3);
    return vec3(r, g, b);
}

int MandelbrotTest(float cr, float ci)
{
    int count = 0;

    float zr = 0.;
    float zi = 0.;
    float zrsqr = 0.;
    float zisqr = 0.;

    for (int i=0; i<MAX_ITER; i++){
      zi = zr * zi;
      zi += zi;
      zi += ci;
      zr = zrsqr - zisqr + cr;
      zrsqr = zr * zr;
      zisqr = zi * zi;
		
      if (zrsqr + zisqr > 4.0) 
        break;
      count++;
    }

    return count;
}

void main() {
    int count = MandelbrotTest(fragPosition.x, fragPosition.y);
    vec3 color;
    if (colorMode == 0) {
        color = getPredeterminedColor(count);
    } else if (colorMode == 1) {
        color = getRandomColor(count);
    }
    gl_FragColor = vec4(color, 1.0);
}