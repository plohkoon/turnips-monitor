import React, {useMemo} from 'react';
import { Chart } from 'react-charts';

function TurnipsGraph(props) {
  
  let data = useMemo(() => {

    let newData = props.data.reduce(
      (total, current) => {
        if(total[current.name]) {
          total[current.name].data.push([
            new Date(`${current.date}T${current.time === 1 ? '12:00' : '08:00'}`),
            current.price,
          ])
        }
        else {
          total[current.name] = {
            label: current.name.replace(/^'/, "").replace(/'$/, ""),
            data: [
              [
                new Date(`${current.date}T${current.time === 1 ? '12:00' : '08:00'}`),
                current.price,
              ]
            ]
          }
        }
        return total;
      }, {}
    );

    let checkDay = new Date(props.date);
    let startDay = new Date(checkDay.setDate(checkDay.getDate() - checkDay.getDay()));
    let endDay = new Date(checkDay.setDate(checkDay.getDate() - checkDay.getDay() + 6));

    startDay.setHours(0,0,0,0);
    endDay.setHours(23,59,59,0);
    //TODO: Figure out proper way of dealing with Axes
    newData = Object.values(newData)
    newData.push(
      {
        label: "start",
        data: [
          [startDay, 0]
        ]
      },
      {
        label: "end",
        data: [
          [endDay, 1000]
        ]
      }
    );

    return newData;

  }, [props.data])
  
  const axes = useMemo(() => [
    {
      primary: true,
      type: 'time',
      position: 'bottom',
    },
    {
      type: 'linear',
      position: 'left',
    }
  ], [])

  return (
    <div style={{height: '400px'}}>
      <Chart data={data} axes={axes} tooltip/>
    </div>
  );
}

export default TurnipsGraph;