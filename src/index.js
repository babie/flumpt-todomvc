import React from "react";
import {Flux, Component} from 'flumpt';
import ReactDOM from 'react-dom';

class RootComponent extends Component {
  render() {
    return (
      <h1>Hello, world!</h1>
    );
  }
};

class App extends Flux {
  subscribe() {
  }
  render(state) {
    return <RootComponent {...state} />;
  }
}

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
