import styles from "./ResidentialSideBar.module.css";

export default function PracticalSideBar() {
  return (
    <>
      <div className={styles.de}>
        <div className={styles.residentialDI}>
          <div className={styles.hoverMainDiv10}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Guilds and Graphics</p>
          </div>

          <div className={styles.hoverMainDiv11}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p>Seasonal</p>
          </div>

          <div className={styles.hoverMainDiv12}>
            <i class="fa fa-th-large" aria-hidden="true"></i>
            <p className={styles.para6}>Tips and Tricks</p>
          </div>
        </div>
      </div>
    </>
  );
}
