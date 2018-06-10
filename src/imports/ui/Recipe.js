import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Recipes } from '../api/recipes.js';

import Ingredient from './Ingredient.js';
import Directions from './Directions.js';

// Recipe component - represents a single recipe item
export default class Recipe extends Component {

  constructor(props){
    super(props);
    this.state = {
      hideIngredientsAndDirections: true,
    };
  }

  toggleChecked() {
    //Set the checked property to the opposite of its current value
    Recipes.update(this.props.recipe._id, {
      $set: { checked: !this.props.recipe.checked}
    });
  }
  
  toggleHideIngredients() {
    this.setState({
      hideIngredientsAndDirections: !this.state.hideIngredientsAndDirections,
    });
  }

  handleIngredientSubmit(event) {
    event.preventDefault();

    //Find the text field via the React ref

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    let currentRecipeId = this.props.recipe._id;


    Recipes.update({"_id": currentRecipeId},{$push: {"ingredients": text}});

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
  
  handleDirectionsSubmit(event) {
    event.preventDefault();

    //Find the text field via the React ref

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    let currentRecipeId = this.props.recipe._id;


    Recipes.update({"_id": currentRecipeId},{$set: {"directions": text}});

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  //TODO Remove flag, not actually remove
  deleteThisRecipe() {
    Recipes.remove(this.props.recipe._id);
  }

  renderIngredients() {
    let ingredients = this.props.recipe.ingredients;
    if(!this.state.hideIngredientsAndDirections) {
      //Is it bad to hard code a React key with a string like this?
      var ingredientJSX = [<li className="ingredients-label" key ="ingredients"><strong>Ingredients:</strong></li>];

      if(this.props.currentUser){
        //It looks funky if the "ingredients" text is before the form
        ingredientJSX.unshift(<form className="new-recipe" onSubmit={this.handleIngredientSubmit.bind(this)} key="ingredient-form" >
          <input
            type="text"
            ref="textInput"
            placeholder="Type to add new ingredients"
          />
        </form>);
      }
      if(ingredients && ingredients.length > 0) {
        ingredientJSX.push(ingredients.map((ingredient) => (
          <Ingredient key={ingredient} ingredient={ingredient} recipeId={this.props.recipe._id}/>
        )));
      } else {
        ingredientJSX.push(<li key="no-ingredients">There are no ingredients listed yet!</li>);
      }
      return ingredientJSX;
    }
    
  }

  renderDirections() {
    let directions = this.props.recipe.directions;
    if(!this.state.hideIngredientsAndDirections) {
      var directionsJSX = [<li className="directions-label" key ="directions2"><strong>Directions:</strong></li>];
      if(this.props.currentUser){
        //It looks funky if the "directions" text is before the form
        directionsJSX.unshift(<form className="new-recipe" onSubmit={this.handleDirectionsSubmit.bind(this)} key="directions-form" >
          <input
            type="text"
            ref="textInput"
            placeholder="Type to add new directions"
          />
        </form>);
      }
      if(directions && directions.length > 0) {
        directionsJSX.push(<Directions key={this.props.recipe._id} directions={directions} recipeId={this.props.recipe._id}/>);
      } else {
        directionsJSX.push(<li key="no-directions">There are no directions listed yet!</li>);
      }
      return directionsJSX; 
    }

  }

  render() {
    // Give recipes a different className when they are checked off,
    // so that we can style them nicely in CSS
    const recipeClassName = this.props.recipe.checked ? 'checked' : '';

    return (
      <li className={recipeClassName}>
        <button className="delete" onClick={this.deleteThisRecipe.bind(this)}>
          &times;
        </button>

        <input
          type="checkbox"
          checked={!!this.props.recipe.checked}
          onClick={this.toggleHideIngredients.bind(this)}
        />


        <span className="text">
          <strong>{this.props.recipe.username}</strong>: {this.props.recipe.text}
        </span>
        <div className="ingredients">
          <ul>
            {this.renderIngredients()}
          </ul>
        </div>
        <div className="directions">
          <ul>
            {this.renderDirections()}
          </ul>
        </div>
      </li>
    );
  }
}