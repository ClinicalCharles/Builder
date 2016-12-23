export function setState(state) {
  return {type: 'SET_STATE', state};
}

export function addComponentToSurvey(componentName, index) {
  return {type: 'ADD_COMPONENT_TO_SURVEY', parameters:{value:componentName,index: index}};
}
export function moveComponentInSurvey(oldIndex, newIndex) {
  return {type: 'MOVE_COMPONENT_IN_SURVEY', parameters:{oldIndex:oldIndex,newIndex: newIndex}};
}
export function editComponentProperty(componentIndex, id, value, fieldType, propertyIndex ) {
  return {type: 'EDIT_COMPONENT_PROPERTY', parameters: {componentIndex: componentIndex, fieldType: fieldType, propertyIndex: propertyIndex, id: id, value: value}};
}
export function duplicateField(componentIndex, fieldType, propertyIndex) {
  return {type: 'DUPLICATE_FIELD', parameters:{componentIndex: componentIndex, fieldType: fieldType, propertyIndex: propertyIndex}};
}
export function removeField(componentIndex, fieldType, propertyIndex) {
  return {type: 'REMOVE_FIELD', parameters:{componentIndex: componentIndex, fieldType: fieldType, propertyIndex: propertyIndex}};
}
export function removeComponent(componentIndex) {
  return {type: 'REMOVE_COMPONENT', parameters:{componentIndex: componentIndex}};
}
export function clearAll() {
  return {type: 'CLEAR_ALL'};
}

// Taken from the redux-undo library
export function undo() {
    return { type: '@@redux-undo/UNDO' };
}
export function redo() {
    return { type: '@@redux-undo/REDO' };
}
