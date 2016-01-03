import ReactDOM from 'react-dom';

import {UUID} from './utils';
import App from './app';
import Todo from './models/todo';

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
