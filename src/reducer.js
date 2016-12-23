import { List, Map } from 'immutable';

function setState(state, newState) {
	return state.merge(newState);
}

function addComponentToSurvey(state, parameters){
	let surveyList = state.getIn(['store','survey'])
	let newComponent = state.getIn(['store', 'components', parameters.value])

	if(parameters.index) 
		return state.setIn(['store', 'survey'], surveyList.insert(parameters.index, newComponent))
	else
		return state.setIn(['store', 'survey'], surveyList.push(newComponent))
}

function moveComponentInSurvey(state, parameters){
	let surveyList = state.getIn(['store','survey'])
	let oldItem = surveyList.get(parameters.oldIndex);
	let shiftedsurveyList = surveyList.delete(parameters.oldIndex).insert(parameters.newIndex, oldItem);

	return state.setIn(['store', 'survey'], shiftedsurveyList);
}

function editComponentProperty(state, parameters){
	if(parameters.fieldType)
		return state.setIn(['store', 'survey', parameters.componentIndex, 'properties', parameters.fieldType, parameters.propertyIndex, parameters.id], parameters.value)
	else
		return state.setIn(['store', 'survey', parameters.componentIndex, 'properties', parameters.id], parameters.value)
}

function duplicateField(state, parameters){
	let fieldList = state.getIn(['store','survey', parameters.componentIndex, 'properties', parameters.fieldType])
	let newField = fieldList.get(parameters.propertyIndex)
	return state.setIn(['store','survey', parameters.componentIndex, 'properties', parameters.fieldType], fieldList.push(newField));
}

function removeField(state, parameters){
	let fieldList = state.getIn(['store','survey', parameters.componentIndex, 'properties', parameters.fieldType])
	return state.setIn(['store','survey', parameters.componentIndex, 'properties', parameters.fieldType], fieldList.delete(parameters.propertyIndex));
}

function removeComponent(state, parameters){
	return state.deleteIn(['store','survey', parameters.componentIndex]);
}

function clearAll(state){
	return state.setIn(['store','survey'], List([]));
}

export default function(state = Map(), action) {
  switch (action.type) {
	  case 'SET_STATE':
	    return setState(state, action.state);
	  case 'ADD_COMPONENT_TO_SURVEY':
	    return addComponentToSurvey(state, action.parameters);
	  case 'EDIT_COMPONENT_PROPERTY':
	    return editComponentProperty(state, action.parameters);
	  case 'DUPLICATE_FIELD':
	    return duplicateField(state, action.parameters);
	  case 'REMOVE_FIELD':
	    return removeField(state, action.parameters);
	  case 'REMOVE_COMPONENT':
	    return removeComponent(state, action.parameters);
	  case 'MOVE_COMPONENT_IN_SURVEY':
	    return moveComponentInSurvey(state, action.parameters);
	  case 'CLEAR_ALL':
	    return clearAll(state);
  }
  return state;
}