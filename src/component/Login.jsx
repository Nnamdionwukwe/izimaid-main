import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [msg, setMsg] = useState("");

  async function Submit(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8000/", {
        msg,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="cont">
      {msg}

      <form action="post">
        <textarea
          name="text"
          onChange={(e) => setMsg(e.target.value)}
          id=""
          cols="30"
          rows="10"
          placeholder="Enter Text"
        ></textarea>

        <input type="submit" onClick={Submit} value="Submit" />
      </form>
    </div>
  );
}
