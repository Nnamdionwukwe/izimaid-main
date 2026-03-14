import styles from "./Residential.module.css";

export default function Practically() {
  return (
    <>
      <div className={styles.residentialDIv6}>
        <div className={styles.hoverMainDiv1}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Guides and Graphics</p>
        </div>

        <div className={styles.hoverMainDiv2}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Seasonal</p>
        </div>

        <div className={styles.hoverMainDiv6}>
          <i class="fa fa-th-large" aria-hidden="true"></i>
          <p>Tips and Tricks</p>
        </div>
      </div>
    </>
  );
}
