import React from "react";
import {Flux} from 'flumpt';
import _ from 'lodash';

import {UUID} from './utils';
import Todo from './models/todo';
import TodoApp from './components/index';

class App extends Flux {
  subscribe() {
    // Header
    this.on("todo:create", (newTodoTitle) => {
      if (newTodoTitle) {
        const newTodo = {
          id: UUID.gen(),
          title: newTodoTitle,
          completed: false
        };
        const newTodos = this.state.todos.concat([newTodo]);
        this.update((state) => {
          return _.set(state, 'todos', newTodos);
        });
      }
    });

    // Main
    this.on("todo:toggle", (todo) => {
      const newTodos = _.map(this.state.todos, (t) => {
        let newTodo = _.clone(t, true);
        if (t.id == todo.id) {
          newTodo.completed = !t.completed;
          return newTodo;
        }
        return t;
      })
      this.update((state) => {
        return _.set(state, 'todos', newTodos);
      });
    });

    this.on("todo:update", (todo) => {
      const newTodos = _.map(this.state.todos, (t) => {
        let newTodo = _.clone(t, true);
        if (t.id == todo.id) {
          newTodo.title = todo.title;
          return newTodo;
        }
        return t;
      });
      this.update((state) => {
        return _.set(state, 'todos', newTodos);
      });
    });

    this.on("todo:destroy", (todo) => {
      const newTodos = _.reject(this.state.todos, (t) => {
        return t.id == todo.id;
      });
      this.update((state) => {
        return _.set(state, 'todos', newTodos);
      });
    });

    // Footer
    this.on("showing:change", (newShowing) => {
      this.update((state) => {
        return _.set(state, 'nowShowing', newShowing);
      });
    });

    this.on("todo:clear-completed", () => {
      const newTodos = _.reject(this.state.todos, (todo) => {
        return todo.completed == true
      });
      this.update((state) => {
        return _.set(state, 'todos', newTodos);
      });
    });
  }

  render(state) {
    return <TodoApp {...state} />;
  }
};

export default App;
