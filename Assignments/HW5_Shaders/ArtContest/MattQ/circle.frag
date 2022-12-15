precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795
#define MAX_ITERS 10

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    ///////////////////////////////////////////////////////////
    // ART CONTEST - SWIRL ////////////////////////////////////
    float r = 0.0;
    float x = v_position[0] + 0.05;
    float y = v_position.y;
    float cx = 0.0;
    float cy = 0.0;
    float period = 0.5 * M_PI;
    float rm = 1.0;
    float theta = 2.0*M_PI*uTime/period;

    // loop 10 times, decreasing the radius of our path each time to create a swirling path towards the center
    for (int i = 0; i < MAX_ITERS; i++) {
        
        x -= 0.005;         // move our starting point further towards the center
        float period = 2.0 * M_PI;
        rm = 1.0/uTime;          // decrease the size our our circle, making it move 0.1 further inside each time
        cx = rm*cos(theta);
        cy = rm*sin(theta);
        float theta = 2.0*M_PI*uTime/period;
        float num = (x-cx)*(x-cx) + (y-cy)*(y-cy);
        float denom = 2.0*uRadius*uRadius;
        r = exp(-num/denom);
    }
    gl_FragColor = vec4(0.0, r, 0.0, 1.0);
}