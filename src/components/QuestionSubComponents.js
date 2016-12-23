import React from 'react';
import { browserHistory } from 'react-router'

export const Divider = (props) => {
	let style={borderTop: '3px dotted #15cbb9', marginTop: '2rem',marginBottom: '2rem'}
	return(
		<hr style={style} className={props.className}/>
	)
}

export const SurveyHeading = (props) => (
	<div className="surveyHeading">
		<h2 className="heading">{props.heading}</h2>
		<h3 className="heading assessmentSubtitle">{props.subtitle}</h3>
	</div>
)

export const Question = (props) => (
	<h3 className="question" style={props.style}>{props.question}</h3>
)

export const CompleteSurveyButton = (props) => (
	<div className="row flex-items-xs-center flex-items-xs-middle my-1">
		<div className="col-md-3 flex-xs-middle text-xs-center">
			<button type="button" className="btn btn-success" onClick={()=>{browserHistory.push("/Dashboard");}}>Complete survey</button>
		</div>
	</div>
)
export const RadioAnswerTable = (props) => (
	<table className="table table-sm table-striped green">
		<thead>
			<tr>
				{props.questions ? <th> </th> : null}
				{ props.answers.map((answer, index)=>(
					<th key={index}>{answer.label}</th>
				))}
			</tr>
		</thead>
		<tbody>
			{ props.questions ?
				(props.questions.map((question, index)=>(
						<TabledRadiosWithLabels key={index}
					    		id={question.id}
					    		question={question.label}
					    		answers={props.answers}/>
				)))
			:
				(<TabledRadiosWithLabels 
					    		id={props.id}
					    		answers={props.answers}/>
				)
			}
		</tbody>
	</table>
)

export const RadiosWithLabels = React.createClass({
	getInitialState(){
		return{activeIndex: -1};
	},
	setActiveIndex(index){
		this.setState({activeIndex: index});
	},
	render() {
		return(
				<div className="btn-group-vertical " data-toggle="buttons" style={{boxSizing: 'content-box'}}>
					{ this.props.answers.map((answer, index)=>(
						<RadioWithLabel key={index} label={answer.label} id={this.props.id} index={index} value={answer.value} activeIndex={this.state.activeIndex} setActiveIndex={this.setActiveIndex}/>
					))}
				</div>
		)
	}
})

export const TabledRadiosWithLabels = React.createClass({
	getInitialState(){
		return{activeIndex: -1};
	},
	setActiveIndex(index){
		this.setState({activeIndex: index});
	},
	render() {
		return(
				<tr >
					{this.props.question ? <th scope="row" >{this.props.question}</th> : null}
					{ this.props.answers.map((answer, index)=>(
						<td key={index}>
							<RadioWithLabel  id={this.props.id} index={index} value={answer.value} activeIndex={this.state.activeIndex} setActiveIndex={this.setActiveIndex}/>
						</td>
					))}
				</tr>
		)
	}
})

export const RadioWithLabel = (props) => (
		<label className={props.activeIndex == props.index ? 'btn active text-xs-right' : 'btn text-xs-right'} style={{whiteSpace: 'normal'}}>
            <input
              type="radio"
              onChange={() => (props.setActiveIndex(props.index))}
              value={props.value}
              name={props.id}
               style={{display:'none'}}
            />
            <div className="pull-right m-l-1 customRadio">
              <div className="dot" />
            </div>
            <p>
            	{props.label}
            </p>
          </label>
  	)

export const CheckboxesWithLabels = (props) => (
	<div className="btn-group-vertical " data-toggle="buttons" style={{boxSizing: 'content-box'}}>
		{ props.answers.map((answer, index)=>(
			<CheckboxWithLabel key={index} label={answer.label} id={props.id} value={answer.value} />
		))}
	</div>
)

export const CheckboxWithLabel = React.createClass({
	getInitialState(){
		return{active: false};
	},
  	render(){
  		return(<label className={this.state.active ? 'btn active text-xs-right' : 'btn text-xs-right'} style={{whiteSpace: 'normal'}}>
            <input
              type="checkbox"
              value={this.props.value}
              onChange={()=> this.setState({active: !this.state.active})}
              style={{display:'none'}}
            />
            <div className="pull-right m-l-1">
              <span className="fa fa-check check" style={{paddingLeft: '1px', fontSize: '1em'}}></span>
            </div>
            <p>
            	{this.props.label}
            </p>
          </label>
  	)}
})