import React, { useEffect, useState } from 'react';

function AdminUpdate() {
  const [allLogs, setAllLogs] = useState([]);
  const [logforEdite, setlogforEdite] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/logtimes')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAllLogs(data);
      })
      .catch((error) => console.log('Error:', error));
  }, []);

  function saveChanges() {
    if (!logforEdite) return;

    fetch('http://localhost:3001/admin/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: logforEdite.username,
        type: logforEdite.type,
        newT: logforEdite.time,
        newD: logforEdite.date,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setlogforEdite(null);
        fetch('http://localhost:3001/logtimes')
          .then((res) => res.json())
          .then((data) => setAllLogs(data));
      });
  }

  return (
    <div>
      <h2>Admin - Edit & change Logs</h2>

      <ul>
        {allLogs.length === 0 && <p>No logs found</p>}
        {allLogs.length > 0 &&
          allLogs.map((log, i) => (
            <li key={i}>
              {log.username} - {log.type} - {log.time} on {log.date}
              <button onClick={() => setlogforEdite(log)}>Edit</button>
            </li>
          ))}
      </ul>

      {logforEdite && (
        <div style={{ marginTop: '20px', border: '1px solid gray', padding: '10px' }}>
          <h3>Editing Log for {logforEdite.username}</h3>

          <label>Time: </label>
          <input
            type="text"
            value={logforEdite.time}
            onChange={(e) => setlogforEdite({ ...logforEdite, time: e.target.value })}
          />
          <br />

          <label>Date: </label>
          <input
            type="text"
            value={logforEdite.date}
            onChange={(e) => setlogforEdite({ ...logforEdite, date: e.target.value })}
          />
          <br />

          <button onClick={saveChanges}>Save</button>
          <button onClick={() => setlogforEdite(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default AdminUpdate;
