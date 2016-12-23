import React from 'react';

import {ComponentPanel} from './ComponentPanel'
import PreviewPanel from './PreviewPanel'
import {ParametersPanel} from './ParametersPanel'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { compose } from 'redux'

//redux
import * as actionCreators from '../action_creators';
import {connect} from 'react-redux';

import {Map, List} from 'immutable';

export const Builder = React.createClass({
	getInitialState(){
		return{currentComponent: 0};
	},
	onPropertyChange(componentIndex, id, value, fieldType, propertyIndex){
		this.props.editComponentProperty(componentIndex, id, value, fieldType, propertyIndex);
	},
	selectCurrentComponent(id){
		this.setState({currentComponent: id})
	},
	export(){
		var formattedComponents = ''
		this.props.store.get('survey').toJS().map((component)=>{
			let properties = Object.keys(component.properties).map((key)=>(
					key+'='
					+ (typeof component.properties[key] == "string" ? '' : '{') 
					+ JSON.stringify(component.properties[key])
					+ (typeof component.properties[key] == "string" ? '' : '}') 
				))
			formattedComponents+=('<' + component.code + ' ' + properties.join('\n	') + '/>\n')
		})
		console.log(formattedComponents)
		var dataUri = 'data:application/text;charset=utf-8,'+ encodeURIComponent(formattedComponents);
		var link = document.createElement("a");
		link.download = 'FormBuilderExport.txt';
		link.href = dataUri;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	},
	duplicateField(componentIndex, fieldType, propertyIndex){
		this.props.duplicateField(componentIndex, fieldType, propertyIndex)
	},
	removeField(componentIndex, fieldType, propertyIndex){
		this.props.removeField(componentIndex, fieldType, propertyIndex)
	},
	removeComponent(){
		this.props.removeComponent(this.state.currentComponent)
	},
	render() {
		return(
			<div className="row mx-0" style={{height: '100%', width: '100%'}} >
				<div style={{position:'fixed', right: '1em', top: '0.5em', zIndex: '9999'}}>
					<button className="btn btn-secondary" onClick={this.props.historyLength>1 ? this.props.undo : null}>
					    Undo ({this.props.historyLength-1})
					</button>
					<button className="btn btn-secondary" onClick={this.props.futureLength>0 ? this.props.redo : null}>
					    Redo ({this.props.futureLength})
					</button>
				</div>
				<div className="col-xs-3 px-0">
					<ComponentPanel addComponentToSurvey={this.props.addComponentToSurvey}/>
				</div>
				<div className="col-xs-6 px-0">
					<PreviewPanel 	survey={this.props.store.get('survey')}  selectCurrentComponent={this.selectCurrentComponent} 
									clearAll={this.props.clearAll} addComponentToSurvey={this.props.addComponentToSurvey}
									moveComponentInSurvey={this.props.moveComponentInSurvey} export={this.export}/>
				</div>
				<div className="col-xs-3 px-0">
					<ParametersPanel 	component={this.props.store.getIn(['survey',this.state.currentComponent])} removeField={this.removeField} 
										duplicateField={this.duplicateField} componentIndex={this.state.currentComponent} 
										onPropertyChange={this.onPropertyChange} removeComponent={this.removeComponent} />
				</div>
			</div>
		)
	}
})

function mapStateToProps(state) {
  return {
    store: state.reducer.present.get('store'),
    historyLength: state.reducer.past.length,
    futureLength: state.reducer.future.length
  };
}

export default compose(
  DragDropContext(HTML5Backend),
  connect(mapStateToProps, actionCreators)
)(Builder);
