import React from 'react';
import ReactDOM from "react-dom";
import { Segment, Header, Grid, Divider, Icon } from "semantic-ui-react";

import ResultsList from "./ResultsList";
import CSVReader from "./uploadbutton";
import Tbl from "./Tbl";
import './css/detailbutton.css';


const App = ({ children }) => (
  <Grid container style={{ margin: 20 }}>
    <Grid.Row>
      <Grid.Column>
        <Header as="h3"><span role="img" aria-label="logo">⛵️</span> Breeze Church Management </Header>
        <Divider />
        <br />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <div className="ui segments">
          <div className="ui secondary segment">
          <h3 className="ui header"><i className="upload icon"></i> Please upload a CSV file </h3>
          </div>
          <div className="ui very padded segment">
            <div id="errmsg"></div><br />
            <CSVReader></CSVReader>
          </div>
        </div>
        <br />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        <h3 className="ui block header">
          <i className="user outline icon"></i>People
        </h3>
        <ResultsList />
        <br />
        <Divider />
        <br />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
      <h3 className="ui block header">
      <i className="users icon"></i> Groups
        </h3>
        <Tbl />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

ReactDOM.render(
  <App></App>,
  document.getElementById("root")
);
