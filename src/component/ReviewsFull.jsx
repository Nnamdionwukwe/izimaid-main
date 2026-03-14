import { useState } from "react";
import styles from "./Reviews.module.css";
import { Link } from "react-router-dom";

const steps = [
  "I was extremely pleased with the service that the staff did for me. The office was attentive to my request and was great with communication. They were thorough and were able to tackle a messy situation. I would highly recommend their service.",
  "The team came to do a deep cleaning at my house this week and they did an amazing job. We were beyond grateful since my husband and I work and study at the same time we have little to no time for cleaning the house and IziMaid's team made our house look incredible. We are beyond happy and grateful with the team and their service.",
  "Wow I am so impressed with Team #8 Matilda and Cristina! This is the first time I have had my home professionally cleaned and I can definitely say I will not hesitate to book with IziMaid again. My home has never been cleaner and fresher. I would recommend IziMaid to my friends and family in a heartbeat.",
  "The cleaning team arrived promptly and started cleaning immediately. They were very friendly and took great care to ensure they did a good job. Im very impressed with the company so far! From the initial in-home estimate to the first cleaning! Even having a supervisor stop by to ensure the cleaning was done properly. I look forward to continue to work with the company.",
  "I have been using  IziMaid for a few months now and I am very happy with the service. The team is always on time, professional, and does a great job cleaning my home. I appreciate the attention to detail and the personalized service they provide. I highly recommend  IziMaid to anyone looking for a reliable and thorough cleaning service.",
];

export default function ReviewsFull() {
  const [step, setStep] = useState(1);

  //   function handleNextpx() {
  //     if (step < 5) setStep(step + 1);
  //     if (step >= 5) setStep(5);
  //   }

  //   //   setInterval(() => {
  //   //     handleNext();
  //   //   }, 6000);

  //   function handlePrevious() {
  //     if (step > 1) setStep(step - 1);
  //     if (step <= 1) setStep(1);
  //   }

  return (
    <div className={styles.main}>
      <div className={styles.hearMain}>
        <div className={styles.hearMainSub}>
          <h1>Hear From Our Clients</h1>
          <h4>Read More Reviews</h4>
        </div>
      </div>

      <nav className={styles.mainSub}>
        <ul className={styles.mainFull}>
          <li className={styles.reviewContainer}>
            <div className={styles.imageContainer}>
              <i class="fa fa-comment" aria-hidden="true"></i>
            </div>

            <p className={styles.reviews}>{steps[step - 1]}</p>

            <div className={styles.reviewFooter}>
              <p className={styles.reviewName}>Michael Solace.</p>

              <div className={styles.reviewFooterSub}>
                <h6>5/5</h6>

                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
          </li>

          <li className={styles.reviewContainer}>
            <div className={styles.imageContainer}>
              <i class="fa fa-comment" aria-hidden="true"></i>
            </div>

            <p className={styles.reviews}>{steps[step]}</p>

            <div className={styles.reviewFooter}>
              <p className={styles.reviewName}>Johnson King.</p>

              <div className={styles.reviewFooterSub}>
                <h6>5/5</h6>

                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
          </li>

          <li className={styles.reviewContainer}>
            <div className={styles.imageContainer}>
              <i class="fa fa-comment" aria-hidden="true"></i>
            </div>

            <p className={styles.reviews}>{steps[step + 1]}</p>

            <div className={styles.reviewFooter}>
              <p className={styles.reviewName}>Philip Evans.</p>

              <div className={styles.reviewFooterSub}>
                <h6>5/5</h6>

                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
          </li>

          <li className={styles.reviewContainer}>
            <div className={styles.imageContainer}>
              <i class="fa fa-comment" aria-hidden="true"></i>
            </div>

            <p className={styles.reviews}>{steps[step + 2]}</p>

            <div className={styles.reviewFooter}>
              <p className={styles.reviewName}>Nnamdi Gideon.</p>

              <div className={styles.reviewFooterSub}>
                <h6>5/5</h6>

                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
          </li>

          <li className={styles.reviewContainer}>
            <div className={styles.imageContainer}>
              <i class="fa fa-comment" aria-hidden="true"></i>
            </div>

            <p className={styles.reviews}>{steps[step + 3]}</p>

            <div className={styles.reviewFooter}>
              <p className={styles.reviewName}>Muhamed Ismail.</p>

              <div className={styles.reviewFooterSub}>
                <h6>5/5</h6>

                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
                <i class="fa fa-star" aria-hidden="true"></i>
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <div className={styles.logoDiv}>
        <div className={styles.logoDivDiv}>
          <a href="https://izimaid-sage.vercel.app" className={styles.logoDiv1}>
            <img className={styles.logo1} alt="Logo" src="izimaid.jpg" />
          </a>

          <div className={styles.logoDiv2}>
            <h2>
              The IziMaid Done Right Promise? delivered by IziBest Interior, a
              proud IziBest company.
            </h2>
          </div>

          <Link to="request-a-free-estimate" className={styles.logoDiv3}>
            <i class="fa fa-calendar" aria-hidden="true"></i>
            <h3>Request a Free Estimate</h3>
          </Link>
        </div>
      </div>
    </div>
  );
}
