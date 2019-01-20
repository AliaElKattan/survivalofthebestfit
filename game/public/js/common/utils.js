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
}

export { spacingUtils };