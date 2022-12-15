precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uTime;
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform float uScale; // Scale of fractal

void main() {
    float x = v_texture.x;
    float y = v_texture.y;
    float diff = 0.01;
    vec2 C = uCenter;
    C[1] *= -1.0;
    vec2 pos = uScale*v_texture - C;
    float period = 1.5;

    //using intoxicated.frag
    vec4 color = 0.5*texture2D(uSampler, vec2(x-diff*cos(2.5*uTime), y-diff*sin(5.0*uTime))); // Left/up
    color += 0.5*texture2D(uSampler, vec2(x+diff, y+diff));  // Right/down
    
    //splitting image in half
    if(pos.x > 0.5){
        color[0] = color[0] * cos(uTime/period);
        color[1] = color[1] * sin(uTime/period);
        color[2] = color[2] * tan(uTime/period);
    }else{
        color[0] = 1.0 - color[0] * tan(uTime/period);
        color[1] = 1.0 - color[1] * cos(uTime/period);
        color[2] = 1.0 - color[2] * sin(uTime/period);
    }

    
    gl_FragColor = color;
}
