import styles from "./Customers.module.css";

export default function Customers() {
  return (
    <div className={styles.customers}>
      <div>
        <i class="fa-solid fa-people-group"></i>
        <h2>Over 5M customers served since 2020</h2>
      </div>

      <h4>Learn More</h4>
    </div>
  );
}
