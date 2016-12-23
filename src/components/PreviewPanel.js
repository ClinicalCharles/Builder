import React from 'react';
import * as QSC from './QuestionSubComponents';
import {Map, List} from 'immutable';
import ReactDOMServer from 'react-dom/server'
import { DropTarget, DragSource } from 'react-dnd';
import { findDOMNode } from 'react-dom';

const components = {
    "QSC.CheckboxesWithLabels": QSC.CheckboxesWithLabels,
    "QSC.RadiosWithLabels": QSC.RadiosWithLabels,
    "QSC.Divider": QSC.Divider,
    "QSC.SurveyHeading": QSC.SurveyHeading,
  	"QSC.Question": QSC.Question,
  	"QSC.RadioAnswerTable": QSC.RadioAnswerTable
};

const containerTarget = {
  drop(props, monitor, component) {
  	monitor.isOver() && monitor.getItem().surveyKey ?
  	props.addComponentToSurvey(monitor.getItem().surveyKey, false) : null
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

//full description here https://github.com/gaearon/react-dnd/tree/master/examples/04%20Sortable/Simple
const componentTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    if(dragIndex == null) return

    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    dragIndex >= 0 ? props.moveComponentInSurvey(dragIndex, hoverIndex) 
    : null

    monitor.getItem().index = hoverIndex;
  },
  drop(props, monitor, component){
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    let index = props.index
    // Insert above or below?
    if(hoverClientY > hoverMiddleY) index = index+1 

  	monitor.getItem().surveyKey ?
  	props.addComponentToSurvey(monitor.getItem().surveyKey, index) : null
  }
};

const componentSource = {
  beginDrag(props) {
    return {
      index: props.index
    };
  }
};

@DropTarget('component', componentTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

@DragSource('component', componentSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

class DropContainer extends React.Component {
  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0.5 : 1;

    return connectDragSource(connectDropTarget(
      <div style={{ opacity }}>
        {this.props.children}
      </div>
    ));
  }
}

export const PreviewPanel = React.createClass({
	render() {
		const { connectDropTarget, drop } = this.props;
		return connectDropTarget(
      <div style={{height: '100%', overflow: 'auto', border: 'black 1px solid'}}>
  			<div className="row flex-items-xs-center mx-0" style={{height: '10%'}}>
  				<div className="col-md-12 ">
  					<div className="display-5 text-xs-center">
  						Preview
  						<button className="btn btn-secondary mt-1" style={{position:'absolute', right: '1em'}}
  								onClick={this.props.clearAll}>
  						    Clear all
  						</button>
              <button className="btn btn-secondary mt-1" style={{position:'absolute', right: '8em'}}
                  onClick={this.props.export}>
                  Export
              </button>
  					</div>
          </div>
        </div>
        <div className="row flex-items-xs-center mx-0" style={{height: '90%', overflow: 'auto'}}>
          <div className="col-md-12 col-xl-8">
  					{this.props.survey.size > 0 ? this.props.survey.map((component, id)=>{
  								const Component = components[component.get('code')]
  								return (
  									<DropContainer moveComponentInSurvey={this.props.moveComponentInSurvey} addComponentToSurvey={this.props.addComponentToSurvey} index={id}>
  										<div className="py-1" key={id} onClick={()=>{this.props.selectCurrentComponent(id)}}>
  											<Component  {...component.get('properties').toJS()} />
  										</div>
  									</DropContainer>
  								)
  							}
  						) : <div>Drag components from the left into this panel</div>
  					}
  				</div>
        </div>
			</div>)
	}
})

export default DropTarget('component', containerTarget, collect)(PreviewPanel);
