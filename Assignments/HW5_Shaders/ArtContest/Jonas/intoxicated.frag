precision mediump float;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;
uniform float uTime;
uniform float uRadius; // Radius of blob


uniform sampler2D uSampler;

precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795
//run this file to see the art contest submission. I edited the code here so that it would actually run. The effects are much different from the base intoxicated filter. 
//

void main() {
    float x = v_texture.x;
    float y = v_texture.y;
    float diff = 0.08;
    vec4 color = 0.8*texture2D(uSampler, vec2(x-diff*cos(2.5*uTime), y-diff*sin(5.0*uTime))); // Left/up
    color += 0.8*texture2D(uSampler, vec2(x-diff, y-diff));  // Right/down
    color -= 1.0*texture2D(uSampler, vec2(x+diff, y+diff)); //gives a cool after image like a dust print
    //color seperation happens in a way light color, dark colors, RGB colors drawn out. 
    gl_FragColor = color;

}
