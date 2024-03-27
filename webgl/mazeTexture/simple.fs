precision mediump float;
// uniform vec4 uColor;
varying vec2 fragUV;
uniform sampler2D uTexture0;
void main()
{
    gl_FragColor = texture2D(uTexture0, fragUV);
}
