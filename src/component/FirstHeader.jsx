import styles from "./FirstHeader.module.css";

export default function FirstHeader() {
  return (
    <div className={styles.header}>
      <a className={styles.headerLink} href="http://deusiziinterior.com">
        Deuseizi Group
      </a>
    </div>
  );
}
