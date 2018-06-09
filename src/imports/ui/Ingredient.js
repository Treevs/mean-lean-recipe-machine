import React, { Component } from 'react';


// Ingredient component - represents a single ingredient item
export default class Ingredient extends Component {

  //TODO Remove flag, not actually remove
  deleteThisIngredient() {
    Ingredients.remove(this.props.ingredient._id);
  }

  render() {
    // Give ingredients a different className when they are checked off,
    // so that we can style them nicely in CSS

    return (
      <li>
        <span className="text">
          {this.props.ingredient}
        </span>
      </li>
    );
  }
}