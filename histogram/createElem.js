/**
 * Creates a new HTML element, sets classes and appends
 * @param {string} tagName Tag name of element
 * @param {string|undefined} [className] A class or classes to assign to the element
 * @param {HTMLElement} [parent] A parent element to append the element to
 * @returns {HTMLElement}
 */
export function createElem(tagName, className, parent) {
    // create, set class and append in one
    const elem = document.createElement(tagName);
    if (className)
        elem.className = className;
    if (parent)
        parent.appendChild(elem);
    return elem;
}
export function createInput(type, value, parent, className, checked) {
    const elem = document.createElement('input');
    elem.type = type;
    elem.value = value;
    if (className)
        elem.className = className;
    if (parent)
        parent.appendChild(elem);
    if (checked !== undefined)
        elem.checked = checked;
    return elem;
}
