import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";


function RentMachine() {
  const { t, i18n } = useTranslation();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetchMachines();
  }, []);

 const fetchMachines = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/machines",
      {
        params: {
          language: i18n.language,
        },
      }
    );
console.log(res.data);
    setMachines(res.data);
  } catch (err) {
    console.log(err);
  }
};
 
  const deleteMachine = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this machine?"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `http://localhost:5000/delete-machine/${id}`
    );

    alert("Machine deleted successfully");

    fetchMachines(); // Reload the list
  } catch (err) {
  console.log(err);

  if (err.response) {
    alert(err.response.data.error || err.response.data.message);
  } else {
    alert(err.message);
  }
}
};
  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          color: "#2e7d32",
          marginBottom: "20px",
        }}
      >
        🚜 {t("rentMachine")}
      </h2>

      {machines.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          {t("noMachines")}
        </p>
      ) : (
        machines.map((machine) => (
          <div
            key={machine.id}
            style={{
              background: "#fff",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3>🚜 {machine.machine_name}</h3>

            <p>
              👤 <b>{t("owner")}:</b>{" "}
              {machine.owner_name}
            </p>

            <p>
              📞 <b>{t("phone")}:</b>{" "}
              {machine.phone}
            </p>
             
            <p>
              📍 <b>{t("district")}:</b>{" "}
              {machine.district}
            </p>

            <p>
              🏡 <b>{t("village")}:</b>{" "}
              {machine.village}
            </p>

            <p>
              🌾 <b>{t("crops")}:</b>{" "}
              {machine.crops}
            </p>

            <p>
              💰 <b>{t("rent")}:</b> ₹
              {machine.rent_per_acre}/acre
            </p>

            <p>
              🟢 <b>{t("availability")}:</b>{" "}
              {machine.availability}
            </p>

            <a href={`tel:${machine.phone}`}>
              <button
                style={{
                  marginTop: "10px",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#2e7d32",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                📞 {t("callOwner")}
              </button>
            </a>
         

  

          </div>
        ))
      )}
    </div>
  );
}

export default RentMachine;