import React, { Component, PropTypes } from 'react';
import * as QSC from './QuestionSubComponents';

import { DragSource } from 'react-dnd';

const componentSource = {
  beginDrag(props) {
    return {
    	surveyKey: props.surveyKey
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

var DraggableComponent = React.createClass({
  render() {
     const { connectDragSource, isDragging } = this.props;
     return connectDragSource(
      <div className="py-1" style={{border: 'grey dashed 1px', marginBottom: '10px'}}>
        {this.props.children}
      </div>
  	)
  }
})
    
DraggableComponent = DragSource('component', componentSource, collect)(DraggableComponent);

export const ComponentPanel = () =>(
	<div id="ComponentPanel" className="col-xs-12 mx-0 flex-items-xs-center flex-items-xs-top" style={{height: '100%', overflow: 'auto', border: 'black 1px solid'}}>
		<div className="display-5 text-xs-center">
			Components
		</div>
		<DraggableComponent surveyKey="surveyHeading">
			<QSC.SurveyHeading heading='Heading' subtitle='Subtitle' />
		</DraggableComponent>
		<DraggableComponent surveyKey="question">
			<QSC.Question style={{margin:'0'}} question='Question Title' />
		</DraggableComponent>
		<DraggableComponent surveyKey="checkboxes">
			<QSC.CheckboxesWithLabels  answers={[{label: "Checkbox(es)", value:0}]} />
		</DraggableComponent>
		<DraggableComponent surveyKey="radios">
			<QSC.RadiosWithLabels answers={[{label: "Radio(s)", value:0}]} />
		</DraggableComponent>
		<DraggableComponent surveyKey="divider">
			<QSC.Divider />
		</DraggableComponent>
		<DraggableComponent surveyKey="radioanswertable">
			<QSC.RadioAnswerTable
				questions={[{label: "Question", id: "1"},{label: "Table", id: "2"}]} 
		    	answers={ [	{label: "No", value:0},
					    	{label: "Yes", value:1}]} />
		</DraggableComponent>
	</div>
)