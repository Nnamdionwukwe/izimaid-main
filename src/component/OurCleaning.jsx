import styles from "./OurCleaning.module.css";

// Your social media links
const facebookLink = "https://www.facebook.com/share/1DH3rUFVdU/";
const instagramLink =
  "https://www.instagram.com/deusizisparkle?utm_source=qr&igsh=ZGR2b3BqYW45MWow";
const twitterLink = "https://x.com/Deusizigroup";
const linkedinLink =
  "https://www.linkedin.com/in/queen-lily-adiyono-11a767420?utm_source=share_via&utm_content=profile&utm_medium=member_android";
const youtubeLink = "https://youtube.com/@deusizisparkle?si=rjTmvPkm8AaAERUF";

export default function OurCleaning() {
  return (
    <>
      <div className={styles.main}>
        <img alt="workers" src="image3.JPG" />

        <div className={styles.hello}>
          <a
            href={facebookLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <i className="fa-brands fa-facebook"></i>
          </a>
          <a
            href={instagramLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href={twitterLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <i className="fa-brands fa-x-twitter"></i>
          </a>
          <a
            href={youtubeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a
            href={linkedinLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <i className="fa-brands fa-linkedin"></i>
          </a>
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
