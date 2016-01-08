import React from "react";
import {Component} from 'flumpt';
import {KeyCode} from '../utils';

class TodoHeader extends Component {
  constructor() {
    super();
    this.state = {newTodo: ""};
    this.handleCreate = this.handleCreate.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleCreate(e) {
    if (e.keyCode !== KeyCode.ENTER_KEY) {
      return;
    }
    e.preventDefault();

    this.dispatch("todo:create", e.target.value.trim());
    this.setState({newTodo: ''});
  }

  handleChange(e) {
    this.setState({newTodo: e.target.value})
  }

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
}

export default TodoHeader;
