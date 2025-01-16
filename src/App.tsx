import { useEffect, useState } from "react";
import "./App.css";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDay, format } from "@formkit/tempo";

interface IData {
  date: string;
  value: number;
}

function App() {
  const [values, setValues] = useState<number[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [data, setData] = useState<IData[]>([]);
  const [datePeriod, setDatePeriod] = useState<number>(0);

  const getData = async () => {
    if (datePeriod == 0) {
      return;
    }

    const today = new Date();
    const afterDate = addDay(today, -datePeriod);

    const todayFormatted = format({
      date: today,
      format: "DD-MM-YY",
      tz: "America/Mexico_City",
    });

    const afterDateFormatted = format({
      date: afterDate,
      format: "DD-MM-YY",
      tz: "America/Mexico_City",
    });

    console.log(afterDateFormatted, todayFormatted);

    const response = await fetch(
      `http://localhost:5000/filter?afterDate=${afterDateFormatted}&beforeDate=${todayFormatted}`
    );

    const data = await response.json();

    setValues(data.value);
    setDates(data.register_date);
  };

  const convertToGraphicalData = () => {
    const data = values.map((value, index) => {
      return {
        date: dates[index],
        value: value,
      };
    });

    setData(data);
  };

  useEffect(() => {
    convertToGraphicalData();
  }, [values, dates]);

  useEffect(() => {
    getData();
  }, [datePeriod]);

  return (
    <>
      <div>
        <button
          onClick={() => {
            setDatePeriod(7);
          }}
        >
          Ultimos 7 dias
        </button>
        <button
          onClick={() => {
            setDatePeriod(14);
          }}
        >
          Ultimas dos semanas
        </button>
        <button
          onClick={() => {
            setDatePeriod(30);
          }}
        >
          Ultimo mes
        </button>
      </div>

      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='value' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}

export default App;
