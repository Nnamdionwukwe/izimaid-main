import { useState } from "react";
import styles from "./WhyChooseUs.module.css";

export default function WhyChooseUs() {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const [isOpen3, setIsOpen3] = useState(true);
  const [isOpen4, setIsOpen4] = useState(true);

  return (
    <div>
      <div className={styles.main}>
        <h1 className={styles.mainh1}>Why Choose Us?</h1>

        <img
          alt="IziBest Cleaning"
          src="https://media.istockphoto.com/id/480751546/vector/cleaner.jpg?s=612x612&w=0&k=20&c=U2w2T9sMsvNL3gHmv6ujRP8axazaseIKhq1sFVuk9Hc="
        />

        <div className={styles.mainSub}>
          <div
            onClick={() => setIsOpen1((is) => !is)}
            className={styles.backed}
          >
            <i class="fa fa-check-square" aria-hidden="true"></i>

            <h3>Backed by the IziBest Done Right Promise</h3>

            {isOpen1 ? <h1>&uarr;</h1> : <h1>&darr;</h1>}
          </div>

          {isOpen1 && (
            <p>
              We’ve been around over 5 years and know how to provide the best
              clean within your budget and schedule, and with no term contracts.
              With our 44-point checklist, it’s a clean you can count on. If
              it’s not done right, we’ll make it right.
            </p>
          )}
        </div>

        <div className={styles.mainSub}>
          <div
            onClick={() => setIsOpen2((is) => !is)}
            className={styles.backed}
          >
            <i class="fa fa-check-square" aria-hidden="true"></i>

            <h3>Trusted and Screened Cleaning Proffesionals</h3>

            {isOpen2 ? <h1>&uarr;</h1> : <h1>&darr;</h1>}
          </div>

          {isOpen2 && (
            <p>
              Our employees are trained, insured and background checked for
              peace of mind. We are locally owned and operated.
            </p>
          )}
        </div>

        <div className={styles.mainSub}>
          <div
            onClick={() => setIsOpen3((is) => !is)}
            className={styles.backed}
          >
            <i class="fa fa-check-square" aria-hidden="true"></i>

            <h3>Customized Cleaning</h3>

            {isOpen3 ? <h1>&uarr;</h1> : <h1>&darr;</h1>}
          </div>

          {isOpen3 && (
            <p>
              Don’t settle for a one-size-fits-all approach to cleaning. Let us
              create a customized cleaning plan tailored to you and your needs.
            </p>
          )}
        </div>

        <div className={styles.mainSub}>
          <div
            onClick={() => setIsOpen4((is) => !is)}
            className={styles.backed}
          >
            <i class="fa fa-check-square" aria-hidden="true"></i>

            <h3>Easy Online Scheduling</h3>

            {isOpen4 ? <h1>&uarr;</h1> : <h1>&darr;</h1>}
          </div>

          {isOpen4 && (
            <p>
              We know you’re busy, so we make it easy to get an estimate and
              schedule an appointment. Book online or give us a call directly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
