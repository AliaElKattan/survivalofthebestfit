import {pixiApp} from '../game/gameSetup.js';

const {width, height} = pixiApp.screen;

const spacingUtils = {
    getCenteredChildX(parentX, parentWidth, childWidth) {
        return parentX + (parentWidth - childWidth) / 2;
    },
    getCenteredChildY(parentY, parentHeight, childHeight) {
        return parentY + (parentHeight - childHeight) / 2;
    },
    getOneThirdChildY(parentY, parentHeight, childHeight) {
        return parentY + (parentHeight - childHeight) / 3;
    },
    getTwoThirdsChildY(parentY, parentHeight, childHeight) {
        return parentY + 2 * ((parentHeight - childHeight) / 3);
    },
    // absolute height/width minus a value
    absMinusSize(px, axis) {
        return axis === 'w' ? width - px : height - px;
    },
    screenCenterX(childWidth) {
        return this.getCenteredChildX(0, uv2px(1, 'w'), childWidth);
    },
    screenCenterY(childHeight) {
        return this.getCenteredChildY(0, uv2px(1, 'h'), childHeight);
    },
};
// convert uv coordinates to screen pixels
/*
start drawing at the center of the screen

var coorObj = uv2px({x: 0.5, y: 0.5}); // if you prefer objects
var coorArray = uv2px([0.5,0.5]); // if you prefer arrays
*/
const uv2px = (uv, axis = null) => {
    // input is object
    if (typeof uv === 'object' && uv !== null) {
        const scaled_x = uv.x !== undefined ? uv.x * width : null;
        const scaled_y = uv.y !== undefined ? uv.y * height : null;
        return {
            x: scaled_x,
            y: scaled_y,
        };
    // input is number + axis
    } else if (typeof uv === 'number' && axis !== null && /^(w|h)$/.test(axis)) {
        return axis === 'w' ? uv * width : uv * height;
    // input is array
    } else if (Array.isArray(uv)) {
        return [uv[0] * width, uv[1] * height];
    } else {
        throw 'You supplied an invalid value to the function, check utils file for valid inputs';
    };
};

// clamp a value
const clamp = (val, minVal, maxVal) => {
    return Math.max(minVal, Math.min(maxVal, val));
};

// convenience function to animate object, parameter default to not moving anywhere
function animateTo({target, x, y, scale=1, easing=PIXI.tween.Easing.inQuart(), time=1000} = {}) {
    if (x === undefined) {
        x = target.x;
    } else {
        x = uv2px(x, 'w');
    };
    if (y === undefined) {
        y = target.y;
    } else {
        y = uv2px(y, 'h');
    };
    const tween = PIXI.tweenManager.createTween(target);
    tween.easing = easing;
    tween.time = time;
    tween.expire = true;
    tween.from({
        'x': target.x,
        'y': target.y,
        'scale': {'x': target.scale.x, 'y': target.scale.y},
    });
    tween.to({
        'x': x,
        'y': y,
        'scale': {'x': target.scale.x*scale, 'y': target.scale.y*scale},
    });
    return tween;
}

export {spacingUtils, uv2px, clamp, animateTo};
