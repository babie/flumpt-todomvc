import React from "react";
import {Flux, Component, mixin} from 'flumpt';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

const ENTER_KEY = 13;
const ALL_TODOS = 'all';
const ACTIVE_TODOS = 'active';
const COMPLETED_TODOS = 'completed';

const Utils = {
  uuid() {
    let i, random;
    let uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i == 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
  }
}

const TodoHeader = React.createClass({
  mixins: [mixin],
  getInitialState() {
    return {
      newTodo: ""
    };
  },

  handleCreate(e) {
    if (e.keyCode !== ENTER_KEY) {
      return;
    }
    e.preventDefault();

    this.dispatch("todo:create", e.target.value.trim());
    this.setState({newTodo: ''});
  },

  handleChange(e) {
    this.setState({newTodo: e.target.value})
  },

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autofocus={true}
          value={this.state.newTodo}
          onKeyDown={this.handleCreate}
          onChange={this.handleChange}
        />
      </header>
    );
  }
});

const TodoItem = React.createClass({
  mixins: [mixin],

  handleToggle(e) {
    this.dispatch("todo:toggle", this.props.todo);
  },

  handleDestroy(e) {
    this.dispatch("todo:destroy", this.props.todo);
  },

  render() {
    let todo = this.props.todo;

    return (
      <li className={classNames({completed: todo.completed})}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggle}
          />
          <label>
            {todo.title}
          </label>
          <button className="destroy" onClick={this.handleDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
        />
      </li>
    );
  }
});

const TodoMain = React.createClass({
  mixins: [mixin],

  render() {
    let todos = this.props.todos;

    let shownTodos = _.filter(todos, (todo) => {
      switch (this.props.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    }, this);

    let todoItems = shownTodos.map((todo) => {
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

const TodoFooter = React.createClass({
  mixins: [mixin],

  handleClearCompleted(e) {
    this.dispatch("todo:clear-completed");
  },

  handleAllClick(e) {
    this.dispatch("showing:change", ALL_TODOS);
  },

  handleActiveClick(e) {
    this.dispatch("showing:change", ACTIVE_TODOS);
  },

  handleCompletedClick(e) {
    this.dispatch("showing:change", COMPLETED_TODOS);
  },

  render() {
    let todos = this.props.todos;
    let activeCount = todos.reduce((acc, todo) => {
      return todo.completed ? acc : acc + 1;
    }, 0);
    let unitStr = activeCount > 1 ? 'items' : 'item';
    let completedCount = todos.length - activeCount;
    let nowShowing = this.props.nowShowing;

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
              className={classNames({selected: nowShowing === ALL_TODOS})}
              onClick={this.handleAllClick}>
              All
            </a>
          </li>
          <li>
            <a href="#/active"
              className={classNames({selected: nowShowing === ACTIVE_TODOS})}
              onClick={this.handleActiveClick}>
              Active
            </a>
          </li>
          <li>
            <a href="#/completed"
              className={classNames({selected: nowShowing === COMPLETED_TODOS})}
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
        let newTodo = {
          id: Utils.uuid(),
          title: newTodoTitle,
          completed: false
        };
        let newTodos = this.state.todos.concat([newTodo]);
        this.update((state) => {
          return _.set(state, 'todos', newTodos);
        });
      }
    });

    // Main
    this.on("todo:toggle", (todo) => {
      let newTodos = _.map(this.state.todos, (t) => {
        let newTodo = t;
        if (t.id === todo.id) {
          newTodo.completed = !t.completed
          return newTodo;
        }
        return t;
      })
      this.update((state) => {
        return _.set(state, 'todos', newTodos);
      });
    });

    this.on("todo:destroy", (todo) => {
      let newTodos = _.reject(this.state.todos, (t) => {
        return t.id === todo.id;
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
      let newTodos = _.reject(this.state.todos, (todo) => {
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
      {id: Utils.uuid(), title: "やること1", completed: true},
      {id: Utils.uuid(), title: "やること2", completed: true},
      {id: Utils.uuid(), title: "やること3", completed: false},
      {id: Utils.uuid(), title: "やること4", completed: false},
      {id: Utils.uuid(), title: "やること5", completed: false},
    ],
    nowShowing: ALL_TODOS,
  },
  middlewares: [
    (state) => {
      console.log("state:");
      console.dir(state);
      return state;
    }
  ]
});
app.update(x => x);
