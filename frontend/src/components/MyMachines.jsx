import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function MyMachines() {
 const [phone, setPhone] = useState("");
const [pin, setPin] = useState("");
  const [machines, setMachines] = useState([]);

  const fetchMyMachines = async () => {
  if (!phone || !pin) {
    alert("Please enter Phone Number and PIN");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:5000/my-machines",
      {
        phone: phone,
        pin: pin,
      }
    );

    setMachines(res.data);
  } catch (err) {
    console.log(err);

    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Unable to fetch your machines");
    }
  }
};

  const deleteMachine = async (id) => {
  if (!window.confirm("Delete this machine?")) return;

  const pin = prompt("Enter your 4-digit PIN:");

  if (!pin) {
    alert("PIN is required.");
    return;
  }

  try {
    const res = await axios.delete(
      `http://localhost:5000/delete-machine/${id}`,
      {
        data: {
          pin: pin,
        },
      }
    );

    alert(res.data.message);

    fetchMyMachines();
  } catch (err) {
    console.log(err);

    if (err.response) {
      alert(err.response.data.message);
    } else {
      alert("Delete failed");
    }
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>👨 My Machines</h2>

      <input
        type="text"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />
      <input
  type="password"
  placeholder="Enter Your PIN"
  value={pin}
  onChange={(e) => setPin(e.target.value)}
  style={{
    padding: "10px",
    width: "300px",
    marginBottom: "20px",
    marginLeft: "10px",
  }}
/>

      <button
        onClick={fetchMyMachines}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
        }}
      >
        Search
      </button>

      <br />
      <br />

      {machines.length === 0 ? (
        <p>No machines found.</p>
      ) : (
        machines.map((machine) => (
          <div
            key={machine.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <h3>{machine.machine_name}</h3>

            <p>Owner: {machine.owner_name}</p>

            <p>Phone: {machine.phone}</p>

            <p>District: {machine.district}</p>

            <p>Village: {machine.village}</p>

            <p>Rent: ₹{machine.rent_per_acre}</p>

            <p>Status: {machine.availability}</p>

            <button
              onClick={() => deleteMachine(machine.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🗑 Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyMachines;