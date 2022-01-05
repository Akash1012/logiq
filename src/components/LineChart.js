import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

const style = {
  table: {
    fontFamily: "arial, sans-serif",
    borderCollapse: "collapse",
    width: "100%",
  },
  tableCell: {
    border: "2px solid gray",
    margin: 0,
    padding: "5px 10px",
    width: "max-content",
    // minWidth: "150px",
  },
};

function LineChart() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [results, setResult] = useState([]);
  const [showTableData, setShowTableData] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));

    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => setPosts(json));
  }, []);

  const xAxisname = users?.map((d) => d.name);

  useEffect(() => {
    const result = users.map((u) => {
      return posts.filter((p) => p.userId === u.id);
    });
    setResult(result);
  }, [users, posts]);

  const calculateHeightOfGraph = results?.map((result) => {
    return result.length;
  });

  const barData = {
    type: "bar",
    labels: xAxisname,
    datasets: [
      {
        data: calculateHeightOfGraph,
      },
    ],
  };

  let options = {
    scales: {
      y: {
        max: 5,
        min: 0,
        ticks: {
          stepSize: 0.5,
        },
      },
    },
  };

  const showTable = (e) => {
    const id = results[e[0].index][0].userId;

    fetch("https://jsonplaceholder.typicode.com/posts?userId=" + id)
      .then((response) => response.json())
      .then((json) => setShowTableData(json));
  };

  const [editIndex, setEditIndex] = React.useState(null);
  const changeData = (index) => {
    if (index === editIndex) {
      setEditIndex(null);
    } else {
      setEditIndex(index);
    }
  };

  const changeInputField = (event, index) => {
    let items = [...showTableData];
    let item = { ...items[index] };
    item[event.target.name] = event.target.value;
    items[index] = item;
    setShowTableData(items);
  };

  return (
    <>
      <div style={{ width: "50%" }}>
        <Bar
          data={barData}
          options={{
            options,
            onClick: (e, elemet) => {
              showTable(elemet);
            },
          }}
        />
      </div>
      {showTableData.length > 1 && (
        <div style={{ padding: "32px" }}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.tableCell}>UserId</th>
                <th style={style.tableCell}>Id</th>
                <th style={style.tableCell}>Title</th>
                <th style={style.tableCell}>Descprition</th>
                <th style={style.tableCell}>Edit </th>
              </tr>
              {showTableData?.map((data, index) => {
                return (
                  <tr key={index}>
                    <td style={style.tableCell}> {data.userId}</td>
                    <td style={style.tableCell}>{data.id}</td>
                    <td style={style.tableCell}>
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="title"
                          value={data.title}
                          onChange={(e) => changeInputField(e, index)}
                        />
                      ) : (
                        data.title
                      )}
                    </td>
                    <td style={style.tableCell}>
                      {editIndex === index ? (
                        <input
                          type="text"
                          name="body"
                          value={data.body}
                          onChange={(e) => changeInputField(e, index)}
                        />
                      ) : (
                        data.body
                      )}
                    </td>
                    <td style={style.tableCell}>
                      <button onClick={() => changeData(index)}>
                        {editIndex === index ? "Submit" : "Edit"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </thead>
          </table>
        </div>
      )}
    </>
  );
}

export default LineChart;
