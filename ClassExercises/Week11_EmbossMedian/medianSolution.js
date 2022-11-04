float diff = (b[channel]-a[channel])/GR;
float c = b[channel] - diff;
float d = a[channel] + diff;
float fc = 0.0;
float fd = 0.0;
for (float dx = -BLUR_WIDTH; dx <= BLUR_WIDTH; dx++) {
    for (float dy = -BLUR_WIDTH; dy <= BLUR_WIDTH; dy++) {
        vec4 I = texture2D(uSampler, vec2(x+dx*RES, y+dy*RES));
        fc += abs(I[channel] - c);
        fd += abs(I[channel] - d);
    }
}
if (fc < fd) {
    b[channel] = d;
}
else {
    a[channel] = c;
}
