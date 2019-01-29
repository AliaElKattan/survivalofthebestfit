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
  // input is object
  if (typeof uv === 'object' && uv !== null) {
    const scaled_x = uv.x !== undefined ? uv.x*width : null;
    const scaled_y = uv.y !== undefined ? uv.y*height : null;
    return {
      x: scaled_x,
      y: scaled_y
    };
  // input is number + axis
  } else if (typeof uv === 'number' && axis !== null && /^(w|h)$/.test(axis)) {
    return axis === 'w' ? uv*width : uv*height;
  // input is array
  } else if (Array.isArray(uv)) {
    return [uv[0]*width, uv[1]*height];
  } else {
    throw "You supplied an invalid value to the function, check utils file for valid inputs";
  };
};

// (function(){
// 
//   console.log(width);
//   // console.log('self invoking!');
//   // console.log(pixiApp.screen.width);
// })();

export { spacingUtils, uv2px };