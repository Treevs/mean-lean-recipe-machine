import React, { Component } from 'react';
import { Recipes } from '../api/recipes';


// Ingredient component - represents a single ingredient item
export default class Ingredient extends Component {

  //TODO Remove flag, not actually remove
  // deleteThisIngredient() {
  //   console.log(this.props);
  //   Recipes.update( {"_id": this.props.recipeId }, {"$pull": { "ingredients" : this.props.ingredient } } );

  // }

  render() {
    // Give ingredients a different className when they are checked off,
    // so that we can style them nicely in CSS

    return (
      <li>
        <span className="text">
          {this.props.directions}
        </span>
      </li>
    );
  }
}