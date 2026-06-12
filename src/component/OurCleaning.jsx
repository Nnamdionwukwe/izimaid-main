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
              DEUSIZI SPARKLE PLATFORM is a comprehensive digital platform that
              provides an all-in-one ecosystem for domestic care, professional
              property maintenance, and specialized interior solutions. By
              consolidating diverse home needs into a single network, the
              platform eliminates the stress of managing multiple vendors.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.izibest}>
        <div className={styles.cd}>
          <h1>
            How Deusizi Sparkle Platform Can Meet All Your Personal and Home
            Needs
          </h1>
          <p>
            At Deusizi Sparkle, we take great pride in delivering the
            highest-quality residential cleaning services near you. We offer
            cleaning services and home cleaning tips to homeowners with the help
            of our well-trained home cleaning pros. Deusizi Sparkle does
            everything we can to ensure that you are left with a spic-and-span
            home after every cleaning visit.
          </p>
        </div>
      </div>
    </>
  );
}
