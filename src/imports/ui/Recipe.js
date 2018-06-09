import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Recipes } from '../api/recipes.js';

import Ingredient from './Ingredient.js';

// Recipe component - represents a single recipe item
export default class Recipe extends Component {

  constructor(props){
    super(props);
    this.state = {
      hideIngredients: true,
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
      hideIngredients: !this.state.hideIngredients,
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    //Find the text field via the React ref

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Recipes.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  //TODO Remove flag, not actually remove
  deleteThisRecipe() {
    Recipes.remove(this.props.recipe._id);
  }
  // renderRecipes() {
  //   let filteredRecipes = this.props.recipes;
  //   if(this.state.hideCompleted) {
  //     filteredRecipes = filteredRecipes.filter(recipe => !recipe.checked);
  //   }
  //   return filteredRecipes.map((recipe) => (
  //     <Recipe key={recipe._id} recipe={recipe} />
  //   ));
  // }

  renderIngredients() {
    let ingredients = this.props.recipe.ingredients;
    console.log(!this.state.hideIngredients);
    if(!this.state.hideIngredients) {
      //Is it bad to hard code a React key like this?
      var ingredientJSX = [<li className="ingredients-label" key ="0">Ingredients:</li>];

      console.log(this.props.currentUser);
      if(this.props.currentUser){
        ingredientJSX.push(<form className="new-recipe" onSubmit={this.handleSubmit.bind(this)} >
          <input
            type="text"
            ref="textInput"
            placeholder="Type to add new recipes"
          />
        </form>);
      }
      if(ingredients) {
        ingredientJSX.push(ingredients.map((ingredient) => (
          <Ingredient key={ingredient} ingredient={ingredient} />
        )));
      }
      return ingredientJSX;
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
      </li>
    );
  }
}