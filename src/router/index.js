import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from './routes';

export default class CreateRouter extends Component {
  render() {
    return (
      <Router basename={'/'}>{renderRoutes(routes)}</Router>
    );
  }
}
