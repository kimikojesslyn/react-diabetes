import { useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://web-production-5da9.up.railway.app/predict";

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      Pregnancies: Number(data.Pregnancies),
      Glucose: Number(data.Glucose),
      BloodPressure: Number(data.BloodPressure),
      SkinThickness: Number(data.SkinThickness),
      Insulin: Number(data.Insulin),
      BMI: Number(data.BMI),
      DiabetesPedigreeFunction: Number(data.DiabetesPedigreeFunction),
      Age: Number(data.Age),
    };

    const invalid = Object.entries(payload).find(([, val]) => Number.isNaN(val));
    if (invalid) {
      setError(`Field "${invalid[0]}" tidak valid.`);
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      setPrediction(res.data);
    } catch (err) {
      if (err.response) {
        setError(`Server ${err.response.status}: ${typeof err.response.data === "string" ? err.response.data : JSON.stringify(err.response.data)}`);
      } else {
        setError("Network error, pastikan API berjalan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Prediksi Diabetes</h1>

      {/* Input Data */}
      <form onSubmit={handleSubmit}>
        {Object.keys(data).map((key) => (
          <div className="form-group mt-2" key={key}>
            <label>{key}</label>
            <input type="number" step="any" className="form-control" name={key} value={data[key]} onChange={handleChange} required />
          </div>
        ))}

        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      {/* Hasil Prediksi */}
      {prediction && (
        <div className="card p-4 mt-4 shadow-sm">
          <h4>Result</h4>

          <p className="mt-2">
            Hasil prediksi menunjukkan Anda {prediction.prediction === 1 ? "kemungkinan tinggi terkena diabetes." : "kemungkinan rendah terkena diabetes."}
            <pre>{JSON.stringify(prediction, null, 2)}</pre>
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
