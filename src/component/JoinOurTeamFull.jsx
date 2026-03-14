import styles from "./WhyChooseUs.module.css";

export default function JoinOurTeamFull() {
  return (
    <div className={styles.main1}>
      <div className={styles.main2}>
        <div className={styles.subMain2}>
          <h2 className={styles.mainh1}>Join Our Team</h2>

          <p>
            The moment you put on a IziMaid® uniform, you become part of a
            family, a team of people committed to supporting one another.
            IziMaid values taking care of our employees and proudly offers the
            opportunity to grow from a job into a career and a work culture of
            respect, integrity, and fun.
          </p>

          <p>
            When you work with your local franchise owner, they’ll take care of
            you the way they take care of their own family and friends.
          </p>

          <p className={styles.border}></p>

          <p className={styles.borderp}>
            Start your career with us today. We offer exciting opportunities for
            growth and success!
          </p>

          <div className={styles.view}>
            <h4>View All Open Positions</h4>
            <h2>&rarr;</h2>
          </div>
        </div>

        <div className={styles.mainImg}>
          <img
            alt="IziBest Cleaning"
            src="https://img.freepik.com/premium-photo/adventures-joy-vibrant-cartoon-illustration-celebrating-happy-little-black-girl-with-bra_983420-19202.jpg"
          />
        </div>
      </div>
    </div>
  );
}
