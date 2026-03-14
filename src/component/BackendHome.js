import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [msg, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/", {
        msg,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="cont">
      <form action="POST">
        <textarea
          name="text"
          onChange={(e) => setMessage(e.target.value)}
          cols="30"
          rows="10"
          placeholder="Enter Text"
        ></textarea>

        <input type="submit" onClick={submit} value="submit"></input>
      </form>
    </div>
  );
}
