import React from 'react';
import {Map, List} from 'immutable';

var fieldType = null;
export const ParametersPanel = React.createClass({
	shouldComponentUpdate(newProps) {
		let oldLength = this.props.component ? JSON.stringify(this.props.component).match(/[^\\]":/g).length : 0
		let newLength = newProps.component ? JSON.stringify(newProps.component).match(/[^\\]":/g).length : 0
		return oldLength != newLength
	},
	mapProperties(obj, propertyName, depth){
		if (typeof depth == 'number')
	        depth++;
	    else{
	        depth = 1;
	        fieldType= null;
	    }

		if(!Number.isInteger(parseInt(propertyName)))  fieldType=propertyName;

		return(
			<div className="my-1" id={propertyName}  key={Math.random()}>
				{Object.keys(obj).map((property, id) => {
					let type = fieldType
					return (<div> 
								{depth==1 ? <hr/> : null }
								{depth==2 ? <div>
												<span style={{fontWeight: 'bold', fontSize: '1.2em'}}>{type} {id+1}</span> 
												<button className="float-xs-right btn btn-secondary" 
													onClick={()=>{this.props.duplicateField(this.props.componentIndex, type, id)}}>
													+
												</button>
												<button className="float-xs-right btn btn-secondary" 
													onClick={()=>{this.props.removeField(this.props.componentIndex, type, id)}}>
													-
												</button> 
											</div> : null}
								

								{typeof obj[property] === 'object' ?
									this.mapProperties(obj[property], property, depth) :
									<div key={Math.random()} id={id} className="row">
									    <label className="col-xs-4">{property}</label>
									    <input 	className="col-xs-5" type='text' id='iteration' defaultValue={obj[property]} 
									    		onChange={fieldType ? (e)=>{this.props.onPropertyChange(this.props.componentIndex, property, e.target.value, type, propertyName)} 
									    							: (e)=>{this.props.onPropertyChange(this.props.componentIndex, property, e.target.value)}
									    	}>
										</input>

									</div>}
							</div>
					)
				}
				)}
			</div>
		)
	},
	render() {
		return(
			<div className="col-xs-12 mx-0 flex-items-xs-center flex-items-xs-top" style={{height: '100%', overflow: 'auto', border: 'black 1px solid'}}>
				<div className="display-5 text-xs-center">
					Properties
					{this.props.component ? <button className="btn btn-secondary mt-1" style={{position:'absolute', right: '1em'}}
						onClick={this.props.removeComponent}>
						-
					</button> : null}
				</div>
				<div>
					{this.props.component ?
						 (this.props.component.get('properties').size > 0 ? this.mapProperties(this.props.component.get('properties').toJS(), 0) : <p>This component has no properties</p> ): <p>Select a component in the preview pane to edit it's properties </p>
					}
				</div>
			</div>
		)
	}
})
