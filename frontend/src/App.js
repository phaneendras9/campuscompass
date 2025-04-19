import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>{message}</h1>
    </div>
  );
}

export default App;
