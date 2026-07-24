import { useState } from "react";
import axios from "axios";

function RegisterMachine() {
  const [form, setForm] = useState({
  owner_name: "",
  phone: "",
  district: "",
  village: "",
  machine_name: "",
  crops: "",
  rent_per_acre: "",
  availability: "Available",
  pin: "",
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const registerMachine = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/register-machine",
        form
      );

      alert(response.data.message);

      setForm({
        owner_name: "",
        phone: "",
        district: "",
        village: "",
        machine_name: "",
        crops: "",
        rent_per_acre: "",
        availability: "Available",
        pin:"",
      });
    } catch (error) {
  console.log(error);

  if (error.response) {
    alert(error.response.data.error);
  } else {
    alert(error.message);
  }
}
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto" }}>
      <h2>🚜 Register Your Machine</h2>

      <input
        name="owner_name"
        placeholder="Owner Name"
        value={form.owner_name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="district"
        placeholder="District"
        value={form.district}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="village"
        placeholder="Village"
        value={form.village}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="machine_name"
        placeholder="Machine Name"
        value={form.machine_name}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="crops"
        placeholder="Suitable Crops (Rice,Wheat)"
        value={form.crops}
        onChange={handleChange}
      />
      <br /><br />

      <input
        name="rent_per_acre"
        placeholder="Rent Per Acre"
        value={form.rent_per_acre}
        onChange={handleChange}
      />
      <br /><br />
      <input
  type="password"
  name="pin"
  placeholder="Create 4-digit PIN"
  value={form.pin}
  onChange={handleChange}
  maxLength={4}
/>

<br /><br />
      <select
        name="availability"
        value={form.availability}
        onChange={handleChange}
      >
        <option>Available</option>
        <option>Not Available</option>
      </select>

      <br /><br />

      <button onClick={registerMachine}>
        Register Machine
      </button>

      
    </div>
  );
}

export default RegisterMachine;