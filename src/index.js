import React from "react";
import {Flux, Component, mixin} from 'flumpt';
import ReactDOM from 'react-dom';
import _ from 'lodash';

const ENTER_KEY = 13;

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

  handleToggle() {
    // TODO
  },

  render() {
    let todo = this.props.todo;

    return (
      <li className="">
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
          <button className="destroy" />
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
    let todoItems = todos.map((todo) => {
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

  render() {
    let todos = this.props.todos;
    let activeCount = todos.reduce((acc, todo) => {
      return todo.completed ? acc : acc + 1;
    }, 0);
    let unitStr = activeCount > 1 ? 'items' : 'item';
    let completedCount = todos.length - activeCount;

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
            <a href="#/" className="selected">All</a>
          </li>
          <li>
            <a href="#/active" className="">Active</a>
          </li>
          <li>
            <a href="#/completed" className="">Completed</a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
});

class TodoApp extends Component {
  render(state) {
    return (
      <div>
        <TodoHeader {...this.props} />
        <TodoMain {...this.props} />
        <TodoFooter {...this.props} />
      </div>
    );
  }
};

class App extends Flux {
  subscribe() {
    this.on("todo:create", (newTodo) => {
      if (newTodo) {
        // TODO: create todo
        console.log("newTodo:", newTodo)
      }
    });
    this.on("todo:clear-completed", () => {
      let newTodos = _.reject(this.state.todos, (todo) => {
        return todo.completed == true
      });
      this.update(({todos}) => {
        return {todos: newTodos};
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
      {id: 1, title: "やること1", completed: true},
      {id: 2, title: "やること2", completed: true},
      {id: 3, title: "やること3", completed: false},
      {id: 4, title: "やること4", completed: false},
      {id: 5, title: "やること5", completed: false},
    ]
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
