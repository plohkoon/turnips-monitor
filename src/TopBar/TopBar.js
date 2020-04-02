import React from 'react';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/date-fns';

import './TopBar.css';

function TopBar(props) {
  console.log(props.date);
  const handleChange = date => {
    props.setDate(date);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <AppBar
        position="sticky"
      >
        <ToolBar>
          <div className="spacer">
            <Typography
              variant="h4"
            >
              <span className="turnip">Turnip</span>
              <span className="s">s</span>
              <span className="prices"> Prices</span>
            </Typography>
            <DatePicker
              variant="inline"
              value={props.date}
              onChange={handleChange}
              color="primary"
            />
          </div>
        </ToolBar>
      </AppBar>
    </MuiPickersUtilsProvider>
  );

}

export default TopBar;