import React, {useState, useEffect} from 'react';

import Chart from './Chart/Chart';
import TopBar from './TopBar/TopBar';
import AddObservation from './AddObservation/AddObservation';
import DataTable from './DataTable/DataTable';

import './App.css';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  fontFamily: "FinkHeavy"
});

function App() {

  let [date, setDate] = useState(Date());
  let [data, setData] = useState([]);

  async function updateData() {
    let response = await fetch(`http://turnips.tallrandy.dev/turnips?date=${date}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json'},
    }).then(res => res.json());

    return response;
  }

  useEffect(() => {
    updateData().then(newData => setData(newData))
  }, [date]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <TopBar date={date} setDate={setDate} />
        <div className="main-body">
          <div className="chart-container">
            <Chart style={{margin: "10px"}} date={date} data={data}/>
          </div>
          <div className="table-container">
            <DataTable data={data} />
          </div>
        </div>
        <div class="fab-container">
          <AddObservation date={date} setData={setData}/>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

//<img src="/stonks.png" width={500}/>