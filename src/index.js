import React from "react";
import {Flux, Component, mixin} from 'flumpt';
import ReactDOM from 'react-dom';

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

    this.dispatch("new-todo:create", e.target.value.trim());
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
          <TodoItem {...this.props} />
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
    this.on("new-todo:create", (newTodo) => {
      if (newTodo) {
        // TODO: create todo
        console.log("newTodo:", newTodo)
      }
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
    newTodo: "",
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
