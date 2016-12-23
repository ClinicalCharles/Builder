import React from 'react';
import ReactDOM from 'react-dom';
import {Nav} from './components/Nav';
import BuilderContainer from './components/Builder'
import * as QSC from './components/QuestionSubComponents';
//Redux imports
import { createStore, combineReducers } from 'redux';
import reducer from './reducer';
import {Provider} from 'react-redux';
import {EDIT_COMPONENT_PROPERTY, setState} from './action_creators';
// redux-undo higher-order reducer
import undoable, { excludeAction } from 'redux-undo'

//Routing
import { Router, Route, Link, IndexRoute, browserHistory, hashHistory } from 'react-router';

const undoReducer = combineReducers({
  reducer: undoable(reducer, {
    filter: excludeAction("EDIT_COMPONENT_PROPERTY"),
    limit: 11
  })
})

const store = createStore(undoReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

if (localStorage.getItem('state')) {
	const serializedState = localStorage.getItem('state');
    store.dispatch(	setState( JSON.parse(serializedState) ) );
} else {
	store.dispatch(	setState(
				    {
				    	store:{
			    			components: {
			    				checkboxes: {code: 'QSC.CheckboxesWithLabels', properties: { id: '1',answers: [ {label: "No", value:0},{label: "Yes", value:1} ]} },
			    				radios: {code: 'QSC.RadiosWithLabels', properties: { id: '1', answers: [ {label: "No", value:0},{label: "Yes", value:1}]}},
								divider: {code: 'QSC.Divider', properties:{}},
								surveyHeading: {code: 'QSC.SurveyHeading', properties:{heading:'Heading',subtitle:'Subtitle'}},
								question: {code: 'QSC.Question', properties:{question: 'Question Title' }},
								radioanswertable: {code: 'QSC.RadioAnswerTable', properties:{questions:[{label: "Question", id: "1"},{label: "Table", id: "2"}], answers:[{label: "No", value:0},	{label: "Yes", value:1}] }}
			    			},
		    				survey: [  ],
			    		}
	    			}
	    		));
}

store.subscribe(() => {
  	const serializedState = JSON.stringify(store.getState().reducer.present);
    localStorage.setItem('state', serializedState);
});

const Container = (props) => (
	<div>
	  <Nav />
	  	{props.children}
	</div>
);

ReactDOM.render(
	<Provider store={store}>	
		<Router history={browserHistory}>
			<Route path='/' component={Container}>
				<IndexRoute component={BuilderContainer} />			
	        </Route>
	  	</Router>
	</Provider>,
  document.getElementById('app')
);