import React from "react";
import {Component} from 'flumpt';

import TodoHeader from './header';
import TodoMain from './main';
import TodoFooter from './footer';

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

export default TodoApp;
