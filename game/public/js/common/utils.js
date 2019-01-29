import { pixiApp } from '../shared.js';

var spacingUtils = {
    getCenteredChildX(parentX, parentWidth, childWidth) {
        return parentX + (parentWidth - childWidth)/2;
    },
    getCenteredChildY(parentY, parentHeight, childHeight) {
        return parentY + (parentHeight - childHeight)/2;
    },
    getOneThirdChildY(parentY, parentHeight, childHeight){
        return parentY + (parentHeight - childHeight)/3;
    },
    getTwoThirdsChildY(parentY, parentHeight, childHeight){
        return parentY + 2 * ((parentHeight - childHeight)/3);
    },
};

const uv2px = (uv, axis = null) => {
  const { width, height } = pixiApp.screen;
  if (typeof uv === 'object' && uv !== null) {
    const scaled_x = uv.x !== undefined ? uv.x*width : null;
    const scaled_y = uv.y !== undefined ? uv.y*height : null;
    return {
      x: scaled_x,
      y: scaled_y
    };
  } else if (typeof uv === 'number' && axis !== null && /^(w|h)$/.test(axis)) {
    return axis === 'w' ? uv*width : uv*height;
  } else {
    throw "You supplied an invalid value, we need an object: {x: x_val, y: y_val} or value and axis (val, 'h')";
  };
};

// (function(){
// 
//   console.log(width);
//   // console.log('self invoking!');
//   // console.log(pixiApp.screen.width);
// })();

export { spacingUtils, uv2px };