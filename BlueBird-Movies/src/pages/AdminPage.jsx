import React, { useEffect, useState, useRef } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';
import * as htmlToImage from "html-to-image";
import { downloadFile } from '../App';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function AdminPage() {
  const [data_revenue_year, setData_revenue_year] = useState([]);
  const [data_revenue_month, setData_revenue_month] = useState([]);
  const [data_revenue_day, setData_revenue_day] = useState([]);
  const [data_vote_count_genre, setData_vote_count_genre] = useState([]);
  const [data_total_vote_count, setData_total_vote_count] = useState([]);
  const [option_time, setOption_time] = useState("");

  const screenshotArea = useRef(null);


  const handleMemeDownload = async () => {
    if (!screenshotArea.current) return;
    await htmlToImage.toJpeg(screenshotArea.current).then(downloadFile);
    alert("Meme saved as meme-shot.jpg");
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        await fetch('http://127.0.0.1/revenue/year')
        .then((response) => response.json())
        .then((data_revenue_year) => setData_revenue_year(data_revenue_year));

        await fetch('http://127.0.0.1/revenue/month')
        .then((response) => response.json())
        .then((data_revenue_month) => setData_revenue_month(data_revenue_month));

        await fetch('http://127.0.0.1/revenue/day')
        .then((response) => response.json())
        .then((data_revenue_day) => setData_revenue_day(data_revenue_day));

        await fetch('http://127.0.0.1/vote_count/genre')
        .then((response) => response.json())
        .then((data_vote_count_genre) => setData_vote_count_genre(data_vote_count_genre));

        await fetch('http://127.0.0.1/total_vote_count')
        .then((response) => response.json())
        .then((data_total_vote_count) => setData_total_vote_count(data_total_vote_count));

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    
  };

  var arr_revenue = []
  if (!(Object.keys(data_vote_count_genre).length === 0)) {
      var arr_vote_count_genre = []
      for(var i = 0; i < data_vote_count_genre['name'].length; i++){
          arr_vote_count_genre.push({y : data_vote_count_genre['vote_count'][i], label : data_vote_count_genre['name'][i]})
      }
  }

  if (!(Object.keys(data_revenue_year).length === 0)) {
      var arr_revenue_year = []
      for(var i = 0; i < data_revenue_year['year'].length; i++){
          arr_revenue_year.push({x : data_revenue_year['year'][i], y : data_revenue_year['revenue'][i]})
      }
      if(option_time === "Year") {arr_revenue = arr_revenue_year}
  }

  if (!(Object.keys(data_revenue_month).length === 0)) {
      var arr_revenue_month = []
      for(var i = 0; i < data_revenue_month['month'].length; i++){
          arr_revenue_month.push({x : data_revenue_month['month'][i], y : data_revenue_month['revenue'][i]})
      }
      if(option_time === "Month") {arr_revenue = arr_revenue_month}
  }

  if (!(Object.keys(data_revenue_day).length === 0)) {
    var arr_revenue_day = []
      for(var i = 0; i < data_revenue_day['day'].length; i++){
          arr_revenue_day.push({x : data_revenue_day['day'][i], y : data_revenue_day['revenue'][i]})
      }
      if(option_time === "Day") {arr_revenue = arr_revenue_day}
}

  const ColumnOptions = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Vote count per genre"
    },
    axisY: {
      includeZero: true
    },
    axisX: {
        valueFormatString: "####",
        interval: 3
    },
    data: [
        {
            type: "bar",
            dataPoints: arr_vote_count_genre
        }
    ]
  };

  const PieOptions = {
    animationEnabled: true,
    title: {
        text: "Genres percentage"
    },
    data: [{
        type: "pie",
        startAngle: 75,
        toolTipContent: "<b>{label}</b>: {y}",
        showInLegend: "true",
        legendText: "{label}",
        indexLabelFontSize: 16,
        indexLabel: "{label} - {y}",
        dataPoints: arr_vote_count_genre
    }]
  };

  const LineOptions = {
    theme: "light2",
    title: {
        text: "Revenue / Time"
    },
    axisX: {
      title: "Time",
      valueFormatString: "####"
    },
    axisY: {
      title: "Revenue"
    },
    data: [{
        type: "line",
        // xValueFormatString: "YYYY",
        // yValueFormatString: "####",
        dataPoints: arr_revenue
    }]
  }

  return (
    <div className='w-screen h-screen bg-white flex flex-col' ref={screenshotArea}>
      <div className='flex flex-row h-1/2'>
      <CanvasJSChart options={LineOptions} 
          containerProps={{
            width: '50%',
            height: '90%'
          }}
      />
      <form onSubmit={handleSubmit} className="">
        <div className="mb-5">
            <label className="mr-10 w-100 h-30">Time</label>
            <select 
                className="text-black color-white w-48 h-8 rounded-md border border-white transition duration-100 ease-in-out focus:outline-green-400 focus:outline-offset-1px focus:scale-105"
                onChange={(e) => setOption_time(e.target.value)}
            >
                <option value="Year">Year</option>
                <option value="Month">Month</option>
                <option value="Day">Day</option>
            </select>
        </div>
      </form>
      <p style={{ fontSize: "5rem" }}>Total votes {data_total_vote_count['total_vote_count']}</p>
      <button onClick={handleMemeDownload} className='flex border-2 border-green-600 bg-green-600/40 p-3 items-center justify-center gap-2 text-xl font-semibold rounded-full text-black'>Export</button>
      </div>
      <div className='flex flex-row h-1/2'>
        <CanvasJSChart options={ColumnOptions} 
                    containerProps={{
                        width: '50%',
                        height: '90%'
                    }}
                />
        <CanvasJSChart options={PieOptions} 
                    containerProps={{
                        width: '50%',
                        height: '90%'
                    }}
        />
      </div>

    </div>

  );
}

export default AdminPage;