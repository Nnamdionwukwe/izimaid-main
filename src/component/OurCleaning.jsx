import styles from "./OurCleaning.module.css";

export default function OurCleaning() {
  return (
    <>
      <div className={styles.main}>
        <img alt="workers" src="chefboldmart.JPG" />

        <div className={styles.hello}>
          <i class="fa-brands fa-facebook"></i>
          <i class="fa-brands fa-instagram"></i>
          <i class="fa-brands fa-x-twitter"></i>
          <i class="fa-brands fa-youtube"></i>
          <i class="fa-brands fa-linkedin"></i>
        </div>

        <div className={styles.main2Div}>
          <div className={styles.main2}>
            <h1>Our Services</h1>
            <p>
              DEUSIZI HOME SERVICES is a comprehensive digital platform that
              provides an all-in-one ecosystem for domestic care, professional
              property maintenance, and specialized interior solutions. By
              consolidating diverse home needs into a single network, the
              platform eliminates the stress of managing multiple vendors.
            </p>
          </div>
        </div>
      </div>

      <section className={styles.heroSection}>
        <div className={styles.contentCard}>
          <h1 className={styles.headline}>
            How Deusizi Home Services Can Meet All Your Personal and Home Needs
          </h1>
          <div className={styles.accentDivider} />
          <p className={styles.bodyText}>
            At Deusizi Home Services, we take great pride in delivering the
            highest-quality professional home solutions tailored entirely to
            your lifestyle. We offer a comprehensive suite of domestic care,
            skilled trades, and property maintenance services with the help of
            our well-trained, background-checked pros.
          </p>
          <p className={styles.bodyText}>
            From reliable childcare and expert elder care to professional
            plumbing, custom interior organization, and immaculate deep
            cleaning, Deusizi does everything we can to ensure your home or
            commercial space is left flawlessly functional and perfectly
            maintained after every single visit.
          </p>
        </div>
      </section>
    </>
  );
}
