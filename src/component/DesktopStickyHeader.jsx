import { useEffect, useRef } from "react";
import styles from "./DesktopStickyHeader.module.css";

export default function DesktopStickyHeader({ children }) {
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      // Ensure the header stays sticky with hardware acceleration
      header.style.transform = "translateZ(0)";
      header.style.webkitTransform = "translateZ(0)";
      header.style.position = "sticky";
      header.style.top = "0";
      header.style.zIndex = "9999";
      header.style.background = "#ffffff";
    }
  }, []);

  return (
    <div ref={headerRef} className={styles.stickyWrapper}>
      {children}
    </div>
  );
}
