import { Link } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <div>
        <Link className={styles.link} to="/">
          <i class="fa-solid fa-house"></i>
        </Link>

        <i class="fa-solid fa-greater-than"></i>

        <Link className={styles.link} to="/why-hire-us">
          <h6>Why Hire Us</h6>
        </Link>
      </div>
    </div>
  );
}
