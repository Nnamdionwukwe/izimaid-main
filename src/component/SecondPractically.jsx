import { useNavigate } from "react-router-dom";
import styles from "./SecondPractically.module.css";

export default function SecondPractically() {
  const navigate = useNavigate();

  return (
    <div className={styles.mainMain}>
      <div className={styles.main}>
        <div className={styles.mainSub2}>
          <h1>Practically Spotless Blog</h1>

          <div className={styles.mainh2}>
            <h4 onClick={() => navigate("/blog")}>View All Blog Posts</h4>
            <h5>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://img.freepik.com/premium-vector/man-cleaning-computer-table-with-duster-guy-wiping-workplace-desk-housework-concept-modern-living-room-interior-male-cartoon-character_48369-25689.jpg"
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>
            The Weekly Cleaning Schedule [Printable Planner]
          </h3>

          <p className={styles.there}>
            A visual 7-day cleaning schedule showing which room to focus on each
            day, time estimates per session, and a blank version you can fill in
            yourself.
          </p>

          <div className={styles.mainh1}>
            <h4
              onClick={() => navigate("/blog/weekly-cleaning-schedule-graphic")}
            >
              Learn More
            </h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://img.freepik.com/free-vector/smiling-woman-girl-cleaning-furniture-living-room-flat_1284-62344.jpg"
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>
            The Complete Spring Cleaning Guide for Nigerian Homes
          </h3>

          <p className={styles.there}>
            A room-by-room spring cleaning guide covering every phase — from
            decluttering to deep cleaning every surface, fixture, and corner of
            your home.
          </p>

          <div className={styles.mainh1}>
            <h4 onClick={() => navigate("/blog/spring-cleaning-guide")}>
              Learn More
            </h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://cdn.vectorstock.com/i/500p/57/04/elderly-woman-cleaning-her-home-cartoon-vector-55805704.jpg"
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>
            Move-In & Move-Out Cleaning: What You Need to Know
          </h3>

          <p className={styles.there}>
            Everything you need before handing over keys or unpacking boxes —
            tips, checklists, and the difference between a move-in and move-out
            clean.
          </p>

          <div className={styles.mainh1}>
            <h4 onClick={() => navigate("/blog/move-in-move-out-cleaning")}>
              Learn More
            </h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.mainSub2}>
          <h1>Cleaning Tips</h1>

          <div className={styles.mainh2}>
            <h4 onClick={() => navigate("/general-household")}>
              View All Cleaning Tips{" "}
            </h4>
            <h5>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://media.istockphoto.com/id/1330190659/vector/allergy-reaction-medicine-and-healthcare-concept.jpg?s=612x612&w=0&k=20&c=309Ayr3NzjTcXMN9zXaqHFD3rEUbJi1yxxXgS3EduC0="
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>
            Kitchen cleaning tips that actually work.
          </h3>

          <p className={styles.there}>
            Practical, professional-grade kitchen cleaning advice — from daily
            habits that prevent build-up to the deep-clean methods that restore
            any kitchen to its best.
          </p>

          <div className={styles.mainh1}>
            <h4 onClick={() => navigate("/kitchens-tips")}>Learn More</h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://i.ytimg.com/vi/spOTnZTP_V8/maxresdefault.jpg"
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>
            Spring cleaning tips that actually work.
          </h3>

          <p className={styles.there}>
            A complete room-by-room spring cleaning guide for Nigerian homes —
            from decluttering to deep cleaning every surface, fixture, and
            corner of your home.
          </p>

          <div className={styles.mainh1}>
            <h4 onClick={() => navigate("/spring-cleaning")}>Learn More</h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>

        <img
          alt="clean"
          src="https://thealohahut.com/wp-content/uploads/2024/08/How-to-Help-Kids-with-Chores-Chore-Chart-2.webp"
        />

        <div className={styles.mainSub}>
          <h3 className={styles.how}>Schedules, charts & checklists.</h3>

          <p className={styles.there}>
            Everything you need to organise your home cleaning — weekly
            schedules, room-by-room checklists, and frequency charts for every
            task in your home.
          </p>

          <div className={styles.mainh1}>
            <h4 onClick={() => navigate("/schedules-charts-checklists")}>
              Learn More
            </h4>
            <h5 className={styles.arrow}>&rarr;</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
