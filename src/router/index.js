import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { connect } from "react-redux";
import routes from './routes';

class CreateRouter extends Component {
  render() {
    return (
      <Router basename={'/'}>{renderRoutes(routes)}</Router>
    );
  }
}

export default connect((state) => ({ accessToken: state.app.accessToken }))(CreateRouter);
