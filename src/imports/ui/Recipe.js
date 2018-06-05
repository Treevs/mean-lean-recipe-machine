import React, { Component } from 'react';

import { Recipes } from '../api/recipes.js';


// Recipe component - represents a single recipe item
export default class Recipe extends Component {

  toggleChecked() {
    //Set the checked property to the opposite of its current value
    Recipes.update(this.props.recipe._id, {
      $set: { checked: !this.props.recipe.checked}
    });
  }

  //TODO Remove flag, not actually remove
  deleteThisRecipe() {
    Recipes.remove(this.props.recipe._id);
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
          readOnly
          checked={!!this.props.recipe.checked}
          onClick={this.toggleChecked.bind(this)}
        />


        <span className="text">
          <strong>{this.props.recipe.username}</strong>: {this.props.recipe.text}
        </span>
      </li>
    );
  }
}