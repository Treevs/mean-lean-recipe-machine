import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';

import { Recipes } from '../api/recipes.js';
import Recipe from './Recipe.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

// App component - represents the whole app
class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      hideCompleted: false,
    };
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

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderRecipes() {
    let filteredRecipes = this.props.recipes;
    if(this.state.hideCompleted) {
      filteredRecipes = filteredRecipes.filter(recipe => !recipe.checked);
    }
    return filteredRecipes.map((recipe) => (
      <Recipe key={recipe._id} recipe={recipe} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Recipes ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Recipes
          </label>

          <AccountsUIWrapper />

          {this.props.currentUser ?
            <form className="new-recipe" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new recipes"
              />
            </form> : ''
          }
        </header>
        <ul>
          {this.renderRecipes()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    recipes: Recipes.find({}, {sort: { createdAt: -1} }).fetch(),
    incompleteCount: Recipes.find({ checked: {$ne: true} }).count(),
    currentUser: Meteor.user(),
  };
})(App);