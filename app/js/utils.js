function pushDistinct(element, array) {
    if (array.indexOf(element) == -1 && element && element.length !== 0) {
        array.push(element);
    }
}
