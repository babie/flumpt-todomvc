import React from "react";
import {Flux, Component, mixin} from 'flumpt';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import {UUID} from './utils';
import Todo from './models/todo';
import TodoHeader from './components/header';
import TodoMain from './components/main';
import TodoFooter from './components/footer';

class TodoApp extends Component {
  render() {
    let main = null;
    let footer = null;
    if (this.props.todos.length > 0) {
      main = (
        <TodoMain {...this.props} />
      );
      footer = (
        <TodoFooter {...this.props} />
      );
    }

    return (
      <div>
        <TodoHeader {...this.props} />
        {main}
        {footer}
      </div>
    );
  }
};

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

const app = new App({
  renderer: el => {
    ReactDOM.render(el, document.querySelector(".todoapp"));
  },
  initialState: {
    todos: [
      {id: UUID.gen(), title: "やること1", completed: true},
      {id: UUID.gen(), title: "やること2", completed: true},
      {id: UUID.gen(), title: "やること3", completed: false},
      {id: UUID.gen(), title: "やること4", completed: false},
      {id: UUID.gen(), title: "やること5", completed: false},
    ],
    nowShowing: Todo.ALL,
  },
  middlewares: [
    // Logger
    /*
    (state) => {
      console.log("state:");
      console.dir(state);
      return state;
    }
    */
  ]
});
app.update(x => x);
