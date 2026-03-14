import styles from "./OurCleaning.module.css";

export default function OurCleaning() {
  return (
    <>
      <div className={styles.main}>
        <img
          alt="workers"
          src="https://simpletaxes.co.uk/wp-content/uploads/2023/03/Cleaner-Self-Asessment-Tax-Returns-1024x805.jpg"
        />

        <div className={styles.hello}>
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-instagram"></i>
          <i class="fa-brands fa-x-twitter"></i>
          <i class="fa-brands fa-youtube"></i>
          <i class="fa-brands fa-linkedin"></i>
        </div>

        <div className={styles.main2Div}>
          <div className={styles.main2}>
            <h1>Our Cleaning Services</h1>
            <p>
              Want a freshly cleaned home and your free time back? Call IziMaid
              today and take advantage of our expert home cleaning services!
            </p>
          </div>
        </div>
      </div>

      <div className={styles.izibest}>
        <div className={styles.cd}>
          <h1>How IziMaid Can Meet Your Cleaning Needs</h1>
          <p>
            At IziMaid®, we take great pride in delivering the highest-quality
            residential cleaning services near you. We offer cleaning services
            and home cleaning tips to homeowners with the help of our
            well-trained home cleaning pros. IziMaid does everything we can to
            ensure that you are left with a spic-and-span home after every
            cleaning visit.
          </p>
        </div>
      </div>
    </>
  );
}
