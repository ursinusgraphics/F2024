precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime;    // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;


// ----- Found this method online that gets a random number ----- // 
float rand(vec2 ran)
{
    return fract(sin(dot(ran, vec2(12.9898,78.233))) * 43758.5453);
}

// This method was supposed to make another blob but I just 
// kept messing around and it ended up making vertical lines 
// that change color very quickly
vec4 makeBlob(float x, float y){
    vec2 ran = vec2(v_position.x, uTime);
    float r3 = rand(ran);
    float g3 = rand(ran);
    float b3 = rand(ran);
    
    float cx3 = rand(ran);
    float cy3 = rand(ran);

    vec4 RGB;

    // Speed of the ball 
    float period3 = rand(ran);

    // Radius of semi-circle
    float rm3 = rand(ran);

    // Moves the ball in general
    float theta3 = -2.0*M_PI*uTime/period3;

    // Moves the ball left and right
    cx3 = -rm3*sin(theta3);

    // Moves the ball up and down
    cy3 = abs(sin(theta3));

    // Calculate the value for the green channel
    float num3 = (x-cx3)*(x-cx3) + (y-cy3)*(y-cy3);
    float denom3 = uRadius * uRadius;

    
    // Red value for the ball
    r3 = abs(sin(uTime));
    
    // Green value for the ball 
    g3 = exp(-num3/denom3) + 0.5*g3;

    // Blue value for the ball
    b3 = uTime * atan(num3);
    
    RGB.x = r3;
    RGB.y = g3;
    RGB.z = b3;
    RGB.w = 1.0;

    return RGB;
}


void main() {

    float r = 0.0;
    float g = 0.0;
 
    float x = v_position.x;
    float y = v_position.y;
    float cx = 0.0;
    float cy = 0.0;

    // Speed of the ball 
    float period = 4.0;

    // Radius of semi-circle
    float rm = cos(uTime/M_PI);

    // Moves the ball in general
    float theta = -2.0*M_PI*uTime;

    // Moves the ball left and right
    cx = -rm*cos(theta);

    // Moves the ball up and down
    cy = abs(rm*sin(theta));

    // Calculate the value for the green channel
    float num = (x-cx)*(x-cx) + (y-cy)*(y-cy);
    float denom = uRadius * uRadius;

    // Red value for the ball
    r = abs(sin(uTime));
    
    // Green value for the ball 
    g = exp(-num/denom);


    // ------------------------------------------- //

    // --- Create crazy moving vertical lines ---- //

    vec4 res;
    vec4 res2;
    vec4 res3;

    res = makeBlob(x, y);
    res2 = makeBlob(x, y);
    res3 = makeBlob(x, y);
    float new_g = g + res.y + res2.y + res3.y;
    gl_FragColor = vec4(res.x, new_g, res2.z, 1.0);
    
}
