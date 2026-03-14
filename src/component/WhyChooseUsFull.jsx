import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUsFull() {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.subMain}>
          <h1 className={styles.mainh1}>Why Choose Us?</h1>

          <div className={styles.mainSub}>
            <div className={styles.backed}>
              <i class="fa fa-check-square" aria-hidden="true"></i>

              <h3>Backed by the IziBest Done Right Promise</h3>
            </div>

            <p>
              We’ve been around over 5 years and know how to provide the best
              clean within your budget and schedule, and with no term contracts.
              With our 44-point checklist, it’s a clean you can count on. If
              it’s not done right, we’ll make it right.
            </p>
          </div>

          <div className={styles.mainSub}>
            <div className={styles.backed}>
              <i class="fa fa-check-square" aria-hidden="true"></i>

              <h3>Trusted and Screened Cleaning Proffesionals</h3>
            </div>

            <p>
              Our employees are trained, insured and background checked for
              peace of mind. We are locally owned and operated.
            </p>
          </div>

          <div className={styles.mainSub}>
            <div className={styles.backed}>
              <i class="fa fa-check-square" aria-hidden="true"></i>

              <h3>Customized Cleaning</h3>
            </div>

            <p>
              Don’t settle for a one-size-fits-all approach to cleaning. Let us
              create a customized cleaning plan tailored to you and your needs.
            </p>
          </div>

          <div className={styles.mainSub}>
            <div className={styles.backed}>
              <i class="fa fa-check-square" aria-hidden="true"></i>

              <h3>Easy Online Scheduling</h3>
            </div>

            <p>
              We know you’re busy, so we make it easy to get an estimate and
              schedule an appointment. Book online or give us a call directly.
            </p>
          </div>
        </div>

        <div className={styles.mainImg}>
          <img
            alt="IziBest Cleaning"
            src="https://media.istockphoto.com/id/480751546/vector/cleaner.jpg?s=612x612&w=0&k=20&c=U2w2T9sMsvNL3gHmv6ujRP8axazaseIKhq1sFVuk9Hc="
          />
        </div>
      </div>
    </div>
  );
}
