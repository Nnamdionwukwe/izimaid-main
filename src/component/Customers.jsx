import { useNavigate } from "react-router-dom";
import styles from "./Customers.module.css";

export default function Customers() {
  const navigate = useNavigate();

  return (
    <div className={styles.customers}>
      <div>
        <i class="fa-solid fa-people-group"></i>
        <h2>Over 100k customers served since 2025</h2>
      </div>

      <h4 onClick={() => navigate("/our-results")}>Learn More</h4>
    </div>
  );
}
