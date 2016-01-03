import ReactDOM from 'react-dom';

import Todo from './models/todo';
import App from './app';

const app = new App({
  renderer: el => {
    ReactDOM.render(el, document.querySelector(".todoapp"));
  },
  initialState: {
    todos: [],
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
