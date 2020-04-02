import React, {useState, useEffect} from 'react';

import CanvasJSReact from '../assets/canvasjs.react.js';

function Chart(props) {

  const CanvasJSChart = CanvasJSReact.CanvasJSChart;

  let [data, setData] = useState([]);

  useEffect(() => {

    if(props.data.length === 0) {
      setData(props.data);
      return
    }

    let newData = props.data.reduce(
      (total, current) => {
        if(total[current.name]) {
          total[current.name].dataPoints.push({
            y: current.price,
            label: current.date,
          })
        }
        else {
          total[current.name] = {
            type: "spline",
            name: current.name,
            showInLegend: true,
            connectNullData: true,
            dataPoints: [
              {y: current.price, label: `${current.date}T${current.time === 1 ? '12:00' : '08:00'}`}
            ]
          }
        }
        return total;
      }, {}
    );
    
    function padZero(s) {
      let newS = "0" + s;
      return newS.substr(newS.length - 2);
    }

    for(let [,value] of Object.entries(newData)) {
      let day = new Date(value.dataPoints[0].label);
      console.log(value.dataPoints[0].label);
      day = new Date(day.setDate(day.getDate() - day.getDay()));
      for(let i = 0; i < 7; i++) {
        let checkDay = new Date(day);
        checkDay.setDate(day.getDate() + i);
        let checkString = `${checkDay.getFullYear()}-${padZero(checkDay.getMonth() + 1)}-${padZero(checkDay.getDate())}`;
        if(value.dataPoints.find(val => val.label === checkString + 'T08:00') === undefined) {
          value.dataPoints.push({y: null, label: checkString + 'T08:00'});
        }
        if(value.dataPoints.find(val => val.label === checkString + 'T12:00') === undefined) {
          value.dataPoints.push({y: null, label: checkString + 'T12:00'});
        }
      }
      
      value.dataPoints.sort((f,s) => {
        let dateF = new Date(f.label);
        let dateS = new Date(s.label);
        console.log(dateF, dateS);
        return (new Date(f.label)) - (new Date(s.label))
      });
      
    }

    setData(Object.values(newData));

  }, [props.data]);
  
  return (
    <div>
      {data.length === 0 ? <p>
        No Data
      </p> :
      <CanvasJSChart options = {{
        animationEnabled: true,
        title:{
          text: "Price of Turnips"
        },
        axisY : {
          title: "Price",
          includeZero: true
        },
        toolTip: {
          shared: true
        },
        data: data
      }} />
    }
    </div>
  );
}

export default Chart;