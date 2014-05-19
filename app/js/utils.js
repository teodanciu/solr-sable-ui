function pushDistinct(element, array) {
    if (array.indexOf(element) == -1 && element && element.length !== 0) {
        array.push(element);
    }
}

function pushToHistory(state, history) {
    history.unshift({
       host: state.host,
       core: state.core,
       query: state.query,
       data: state.data,
       title: state.title
    });
}
