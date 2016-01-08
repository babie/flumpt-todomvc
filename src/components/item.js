import React from "react";
import {Component} from 'flumpt';
import {KeyCode} from '../utils';
import _ from 'lodash';
import classNames from 'classnames';

class TodoItem extends Component {
  constructor(props){
    super(props);
    this.state = {
      editing: false,
      editText: props.todo.title
    };
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextState.editing !== this.state.editing ||
      nextState.editText !== this.state.editText
    );
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.editing && this.state.editing) {
      var node = this.refs.editField;
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  handleToggle(e) {
    this.dispatch("todo:toggle", this.props.todo);
  }

  handleEdit() {
    this.setState({editing: true});
  }

  handleUpdate(e) {
    const value = e.target.value.trim();
    if (value) {
      const todo = _.set(this.props.todo, 'title', e.target.value.trim());
      this.dispatch("todo:update", todo);
      this.setState({editing: false, editText: todo.title});
    } else {
      this.dispatch("todo:destroy", this.props.todo);
    }
  }

  handleChange(e) {
    if (this.state.editing) {
      this.setState({editText: e.target.value});
    }
  }

  handleKeyDown(e) {
    if (e.which === KeyCode.ESCAPE_KEY) {
      this.setState({editing: false, editText: this.props.todo.title});
    } else if (e.which === KeyCode.ENTER_KEY) {
      this.handleUpdate(e);
    }
  }

  handleDestroy(e) {
    this.dispatch("todo:destroy", this.props.todo);
  }

  render() {
    const todo = this.props.todo;

    return (
      <li className={classNames({completed: todo.completed, editing: this.state.editing})}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={this.handleToggle}
          />
          <label onDoubleClick={this.handleEdit}>
            {todo.title}
          </label>
          <button className="destroy" onClick={this.handleDestroy} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onBlur={this.handleUpdate}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}

export default TodoItem;
