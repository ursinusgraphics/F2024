var rotXEq = document.getElementById('rotXEq');
rotXEq.innerHTML = "\\[ R_X(\\gamma) = \\left[ \\begin{array}{ccc} 1 & 0 & 0 \\\\ 0 & \\cos(\\gamma) & -\\sin(\\gamma)  \\\\ 0 & \\sin(\\gamma) & \\cos(\\gamma) \\end{array}\\right] \\]";

var rotYEq = document.getElementById('rotYEq');
rotYEq.innerHTML = "\\[ R_Y(\\beta) = \\left[ \\begin{array}{ccc} \\cos(\\beta) & 0 & \\sin(\\beta) \\\\ 0 & 1 & 0 \\\\ -\\sin(\\beta) & 0 & cos(\\beta) \\end{array}\\right] \\]";

var rotZEq = document.getElementById('rotZEq');
rotZEq.innerHTML = "\\[ R_Z(\\alpha) = \\left[ \\begin{array}{ccc} \\cos(\\alpha) & -\\sin(\\alpha) & 0 \\\\ \\sin(\\alpha) & \\cos(\\alpha) & 0 \\\\ 0 & 0 & 1 \\end{array}\\right] \\]";
