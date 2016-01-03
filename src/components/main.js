import React from "react";
import {mixin} from 'flumpt';
import _ from 'lodash';

import {UUID, KeyCode} from '../utils';
import Todo from '../models/todo';
import TodoItem from './item';

const TodoMain = React.createClass({
  mixins: [mixin],

  render() {
    const todos = this.props.todos;

    const shownTodos = _.filter(todos, (todo) => {
      switch (this.props.nowShowing) {
        case Todo.ACTIVE:
          return !todo.completed;
        case Todo.COMPLETED:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    const todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem key={todo.id} todo={todo} />
      );
    });

    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
        />
        <ul className="todo-list">
          {todoItems}
        </ul>
      </section>
    );
  }
});

export default TodoMain;
