import styles from "./Residential.module.css";

export default function AboutUs() {
  return (
    <>
      <div className={styles.residentialMain4}>
        <div className={styles.residentialDIv4}>
          <div className={styles.residentialSub}>
            <div className={styles.hoverMainDiv1}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>A Neighborly Company</p>
            </div>

            <div className={styles.hoverMainDiv2}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Locations</p>
            </div>

            <div className={styles.homeDiv}>
              <div className={styles.hoverMainDiv3}>
                <i class="fa fa-th-large" aria-hidden="true"></i>
                <p>FAQ</p>
              </div>

              <div className={styles.home}>
                <p>What's Included</p>
                <p className={styles.homeP}>Before and After Your Cleaning</p>
              </div>
            </div>

            <div className={styles.homeDiv}>
              <div className={styles.hoverMainDiv4}>
                <i class="fa fa-th-large" aria-hidden="true"></i>
                <p>IziBest Foundation</p>
              </div>

              <div className={styles.home}>
                <p>Donate</p>
                <p>IziBest Awards</p>
                <p>Local Shelter/Agency Support</p>
                <p>Board of Directors</p>
              </div>
            </div>
          </div>

          <div className={styles.residentialSub3}>
            <div className={styles.hoverMainDiv1}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>The Neighboly App</p>
            </div>

            <div className={styles.hoverMainDiv3}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Gift Certificates</p>
            </div>
          </div>

          <div className={styles.residentialSub2}>
            <div className={styles.hoverMainDiv1}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Own a Franchise</p>
            </div>

            <div className={styles.hoverMainDiv2}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Contact Us</p>
            </div>
          </div>

          <div className={styles.residentialSub2}>
            <div className={styles.hoverMainDiv1}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Aplicar Localmente</p>
            </div>
          </div>

          <div className={styles.residentialSub2}>
            <div className={styles.hoverMainDiv1}>
              <i class="fa fa-th-large" aria-hidden="true"></i>
              <p>Apply Locally</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
