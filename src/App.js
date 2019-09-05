import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "./App.css";

const SteinStore = require("stein-js-client");
const store = new SteinStore(
  "https://api.steinhq.com/v1/storages/5d70590f1ec06404b5572fe6"
);

function App() {
  const [data, setData] = useState();
  const [days, setDays] = useState([]);
  const [activeCals, setActiveCals] = useState([]);
  const [restingCals, setRestingCals] = useState([]);
  const [total, setTotal] = useState([]);

  useEffect(() => {
    store.read("sheet1", { limit: 64, offset: 1 }).then(data => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      let dayArray = [];
      let activeCalsArray = [];
      let restingCalsArray = [];
      let totalArray = [];

      data.forEach(item => {
        dayArray.push(item.day);
        activeCalsArray.push(item.active_calories);
        restingCalsArray.push(item.resting_calories);
        let sum = Number(item.active_calories) + Number(item.resting_calories);
        totalArray.push(sum);
      });

      setDays(dayArray);
      setActiveCals(activeCalsArray);
      setRestingCals(restingCalsArray);
      setTotal(totalArray);
    }
  }, [data]);

  const stackedGraphData = {
    labels: days,
    datasets: [
      {
        label: "Active Calories",
        backgroundColor: "#63aabc",
        stack: "2",
        data: activeCals
      },
      {
        label: "Resting Calories",
        backgroundColor: "#ed3833",
        stack: "2",
        data: restingCals
      },
      {
        label: "Total Burned",
        backgroundColor: "#60204b",
        stack: "2",
        data: total
      }
    ]
  };

  const barChartOptions = {
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  };

  console.log({ total });

  return (
    <div className="App">
      <Line data={stackedGraphData} />
    </div>
  );
}

export default App;
