import styles from "./FirstHeader.module.css";

export default function FirstHeader() {
  return (
    <div>
      <div className={styles.header1}>
        <a className={styles.headerP} href="http://izibest.com">
          IziBest
        </a>
      </div>
      <div className={styles.header2}>
        <a className={styles.headerP} href="http://izibest.com">
          IziBest
        </a>
      </div>
    </div>
  );
}
