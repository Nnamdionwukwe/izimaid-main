import styles from "./OurCleaning.module.css";

export default function PerfectGift() {
  return (
    <div>
      <div className={styles.services}>
        <div className={styles.mainDiv2}>
          <div className={styles.home}>
            <i class="fa-solid fa-house"></i>
          </div>

          <h5>Residential Services</h5>
          <h4>&rarr;</h4>
        </div>

        <div className={styles.mainDiv2}>
          <div className={styles.home}>
            <i class="fa fa-gift" aria-hidden="true"></i>
          </div>

          <h5>Perfect Gift</h5>
          <h4>&rarr;</h4>
        </div>

        <div className={styles.mainDiv2}>
          <div className={styles.home}>
            <i class="fa-solid fa-spray-can"></i>
          </div>

          <h5>Practically Spotless Blog</h5>
          <h4>&rarr;</h4>
        </div>

        <div className={styles.mainDiv3}>
          <div className={styles.home}>
            <i class="fa fa-heartbeat" aria-hidden="true"></i>
          </div>

          <h5>IziBest Foundation</h5>
          <h4>&rarr;</h4>
        </div>
      </div>

      <div className={styles.gridMain}>
        <div className={styles.grid}>
          <div className={styles.gridDiv}>
            <img
              alt="welcome"
              src="https://img.freepik.com/premium-photo/house-cleaning-equipment-supplies-bucket_488220-3224.jpg?semt=ais_hybrid&w=740"
            />
            <div className={styles.subDiv}>
              <h3>Residential Services</h3>

              <p className={styles.para}>
                Choose a plan to fit your needs—no contracts, no hassle.
              </p>
              <div className={styles.learnMore}>
                <p className={styles.p}>Learn More</p>
                <p>&rarr;</p>
              </div>
            </div>

            <div className={styles.home2}>
              <i class="fa-solid fa-house"></i>
            </div>
          </div>

          <div className={styles.gridDiv}>
            <img
              alt="welcome"
              src="https://production-next-images-cdn.thumbtack.com/i/427431748070432796/width/1024.jpeg"
            />
            <div className={styles.subDiv}>
              <h3>Perfecct Gift</h3>
              <p className={styles.para}>
                Give the gift of time with a IziMaid gift certificate.
              </p>
              <div className={styles.learnMore}>
                <p className={styles.p}>Learn More</p>
                <p>&rarr;</p>
              </div>
            </div>

            <div className={styles.home2}>
              <i class="fa fa-gift" aria-hidden="true"></i>
            </div>
          </div>

          <div className={styles.gridDiv}>
            <img
              alt="welcome"
              src="https://media.istockphoto.com/id/1340208950/vector/cleaning-workers-isolated-flat-cartoon-characters-man-and-woman-in-uniform-vector.jpg?s=612x612&w=0&k=20&c=tj9dk0o4ecIrJbJ80P_LjNbI7wnlG4bAj0ISa5ZSbbM="
            />
            <div className={styles.subDiv}>
              <h3>Practically Spotless Blog</h3>
              <p className={styles.para}>
                Get expert advice from our team of cleaning specialists.
              </p>
              <div className={styles.learnMore}>
                <p className={styles.p}>Learn More</p>
                <p>&rarr;</p>
              </div>
            </div>

            <div className={styles.home2}>
              <i class="fa-solid fa-spray-can"></i>
            </div>
          </div>

          <div className={styles.gridDiv}>
            <img
              alt="welcome"
              src="https://www.shutterstock.com/image-vector/loving-mother-hugging-her-daughter-600nw-2500342501.jpg"
            />

            <div className={styles.subDiv}>
              <h3>IziBest Foundation</h3>
              <p className={styles.para}>
                Supporting victims of domestic violence.
              </p>
              <div className={styles.learnMore}>
                <p className={styles.p}>Learn More</p>
                <p>&rarr;</p>
              </div>
            </div>

            <div className={styles.home2}>
              <i class="fa fa-heartbeat" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
