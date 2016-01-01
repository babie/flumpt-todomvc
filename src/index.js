import React from "react";
import {Flux, Component} from 'flumpt';
import ReactDOM from 'react-dom';

class TodoHeader extends Component {
  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          autofocus={true}
        />
      </header>
    );
  }
};

class TodoItem extends Component {
  render() {
    return (
      <li className="">
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
          />
          <label>
            HOGE
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
};

class TodoMain extends Component {
  render() {
    return (
      <section className="main">
        <input
          className="toggle-all"
          type="checkbox"
        />
        <ul className="todo-list">
          <TodoItem />
        </ul>
      </section>
    );
  }
};

class TodoFooter extends Component {
  render() {
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>42</strong> items left
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
        <button className="clear-completed">
          Clear completed
        </button>
      </footer>
    );
  }
};

class TodoApp extends Component {
  render() {
    return (
      <div>
        <TodoHeader />
        <TodoMain />
        <TodoFooter />
      </div>
    );
  }
};

class App extends Flux {
  subscribe() {
  }
  render(state) {
    return <TodoApp {...state} />;
  }
};

const app = new App({
  renderer: el => {
    ReactDOM.render(el, document.querySelector(".todoapp"));
  },
  initialState: {},
  middlewares: [
    (state) => {
      console.dir(state);
      return state;
    }
  ]
});
app.update(_initialState => ({}));
