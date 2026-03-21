import { useState } from "react";
import styles from "./SecondResidentisl.module.css";
import { useNavigate } from "react-router-dom";

export default function SecondResidential() {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  function handleClick1() {
    setIsOpen1((prev) => !prev);
    setIsOpen2(false);
  }

  function handleClick2() {
    setIsOpen2((prev) => !prev);
    setIsOpen1(false);
  }

  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <div className={styles.mainSub}>
        <div onClick={handleClick1} className={styles.backed}>
          <p>&#9734;</p>

          <h3>Residential</h3>

          {isOpen1 ? <h1>&minus;</h1> : <h1>&#43;</h1>}
        </div>

        {isOpen1 && (
          <ul className={styles.residentialDIv}>
            <li
              onClick={() => navigate("/recurring-cleaning")}
              className={styles.hoverMainliv1}
            >
              <p>Recurring Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/one-time-cleaning")}
              className={styles.hoverMainliv2}
            >
              <p>One Time Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/move-in-cleaning")}
              className={styles.hoverMainli3}
            >
              <p>Movin_in Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/eco-friendly-cleaning")}
              className={styles.hoverMainli4}
            >
              <p>Eco Friendly Cleaning </p>
            </li>

            <li
              onClick={() => navigate("/apartment-cleaning")}
              className={styles.hoverMainli5}
            >
              <p className={styles.para5}> Apartment and Condo Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/occasional-cleaning")}
              className={styles.hoverMainli6}
            >
              <p>Occasional Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/move-out-cleaning")}
              className={styles.hoverMainli7}
            >
              <p>Move-out Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/home-cleaning")}
              className={styles.hoverMainli8}
            >
              <p>Home Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/special-event-cleaning")}
              className={styles.hoverMainli9}
            >
              <p>Special Event Cleaning</p>
            </li>
          </ul>
        )}
      </div>

      <div className={styles.mainSub}>
        <div onClick={handleClick2} className={styles.backed}>
          <p>&#9734;</p>

          <h3>Light Commercial</h3>

          {isOpen2 ? <h1>&minus;</h1> : <h1>&#43;</h1>}
        </div>

        {isOpen2 && (
          <ul className={styles.residentialDIv2}>
            <li
              onClick={() => navigate("/recurring-cleaning")}
              className={styles.hoverMainli1}
            >
              <p>Recurring Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/one-time-cleaning")}
              className={styles.hoverMainli2}
            >
              <p>One Time Cleaning</p>
            </li>

            <li
              onClick={() => navigate("/occasional-cleaning")}
              className={styles.hoverMainli6}
            >
              <p>Occasional Cleaning</p>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
