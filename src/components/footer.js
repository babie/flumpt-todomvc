import React from "react";
import {mixin} from 'flumpt';
import _ from 'lodash';
import classNames from 'classnames';

import Todo from '../models/todo';
import TodoItem from './item';

const TodoFooter = React.createClass({
  mixins: [mixin],

  handleClearCompleted(e) {
    this.dispatch("todo:clear-completed");
  },

  handleAllClick(e) {
    this.dispatch("showing:change", Todo.ALL);
  },

  handleActiveClick(e) {
    this.dispatch("showing:change", Todo.ACTIVE);
  },

  handleCompletedClick(e) {
    this.dispatch("showing:change", Todo.COMPLETED);
  },

  render() {
    const todos = this.props.todos;
    const activeCount = todos.reduce((acc, todo) => {
      return todo.completed ? acc : acc + 1;
    }, 0);
    const unitStr = activeCount > 1 ? 'items' : 'item';
    const completedCount = todos.length - activeCount;
    const nowShowing = this.props.nowShowing;

    let clearButton = null;
    if (completedCount > 0) {
      clearButton = (
        <button
          className="clear-completed"
          onClick={this.handleClearCompleted}>
          Clear completed
        </button>
      );
    }

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{activeCount}</strong> {unitStr} left
        </span>
        <ul className="filters">
          <li>
            <a href="#/"
              className={classNames({selected: nowShowing === Todo.ALL})}
              onClick={this.handleAllClick}>
              All
            </a>
          </li>
          <li>
            <a href="#/active"
              className={classNames({selected: nowShowing === Todo.ACTIVE})}
              onClick={this.handleActiveClick}>
              Active
            </a>
          </li>
          <li>
            <a href="#/completed"
              className={classNames({selected: nowShowing === Todo.COMPLETED})}
              onClick={this.handleCompletedClick}>
              Completed
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
});

export default TodoFooter;
