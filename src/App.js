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
  const [stdAvg, setStdAvg] = useState([]);
  const [myTotalAvg, setMyTotalAvg] = useState([]);

  useEffect(() => {
    store.read("sheet1", { limit: 64, offset: 1 }).then(data => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      const STD_AVG = 1292;

      let dayArray = [];
      let activeCalsArray = [];
      let restingCalsArray = [];
      let totalArray = [];
      let stdAvgArray = [];
      let myTotalAvgArray = [];
      let totalSum = 0;

      data.forEach(item => {
        dayArray.push(item.day);
        activeCalsArray.push(item.active_calories);
        restingCalsArray.push(item.resting_calories);
        let sum = Number(item.active_calories) + Number(item.resting_calories);
        totalSum += sum;
        totalArray.push(sum);
        stdAvgArray.push(STD_AVG);
        myTotalAvgArray.push(0);
      });

      let totalAvgCalc = totalSum / data.length;
      myTotalAvgArray.fill(totalAvgCalc, 0, data.length);

      setDays(dayArray);
      setActiveCals(activeCalsArray);
      setRestingCals(restingCalsArray);
      setTotal(totalArray);
      setStdAvg(stdAvgArray);
      setMyTotalAvg(myTotalAvgArray);
    }
  }, [data]);

  const stackedGraphData = {
    labels: days,
    datasets: [
      {
        label: "Milu's Average Active Metabolic Rate",
        borderColor: "pink",
        backgroundColor: "transparent",
        stack: "3",
        data: myTotalAvg
      },
      {
        label: "Standard Average Resting Metabolic Rate",
        borderColor: "yellow",
        backgroundColor: "transparent",
        stack: "3",
        data: stdAvg
      },
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

  return (
    <div className="App">
      <Line
        data={stackedGraphData}
        width={70}
        height={400}
        options={{
          maintainAspectRatio: false,
          legend: {
            position: "bottom"
          },
          scales: {
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Calories"
                }
              }
            ]
          },
          title: {
            display: true,
            text: "Milu's Caloric Expenditure",
            fontSize: 20
          }
        }}
      />
    </div>
  );
}

export default App;
