import { useNavigate } from "react-router-dom";
import styles from "./WeProvide.module.css";

export default function WeProvide() {
  const navigate = useNavigate();

  return (
    <div className={styles.main}>
      <div className={styles.mainDiv}>
        <h1 className={styles.h1}>Home Cleaning Services We Provide</h1>

        <h3 className={styles.h2}>Our Approach: Custom Home Cleaning</h3>

        <p className={styles.p1}>
          Looking for the best home cleaning services near you? Look no further
          than Deusizi sparkle's custom home cleaning services. We understand
          the challenges of maintaining a clean home amid a busy schedule. Our
          team is dedicated to providing top-notch home cleaning services
          tailored to your specific needs and preferences.
        </p>

        <p className={styles.p2}>
          At Deusizi sparkle, we offer unmatched flexibility in our cleaning
          services. Our team collaborates closely with you to develop a tailored
          cleaning plan that suits your lifestyle and budget. Whether you
          require regular cleaning, assistance with move-in cleaning, or a
          one-time specific...
        </p>

        <p onClick={() => navigate("/home-cleaning")} className={styles.p3}>
          ...Read More
        </p>
      </div>
    </div>
  );
}
