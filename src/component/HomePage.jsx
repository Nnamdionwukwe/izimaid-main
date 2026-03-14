import FirstHeader from "./FirstHeader";
import SubHeader from "./SubHeader";
import ThirdHeader from "./ThirdHeader";
import styles from "./MainHeader.module.css";
import FixedHeader from "./FixedHeader";
import OurCleaning from "./OurCleaning";
import PerfectGift from "./PerfectGift";
import IziBestCleaningCar from "./IziBestCleaningCar";
import WhyChooseUs from "./WhyChooseUse";
import WhyChooseUsFull from "./WhyChooseUsFull";
import Reviews from "./Reviews";
import ReviewsFull from "./ReviewsFull";
import WeProvide from "./WeProvide";
import SecondResidential from "./SecondResidential";
import SecondPractically from "./SecondPractically";
import Questions from "./Questions";
import Faq from "./Faq";
import JoinOurTeam from "./JoinOurTeam";
import JoinOurTeamFull from "./JoinOurTeamFull";
import IziMaidHelp from "./IziMaidHelp";
import IziMaidHelpFull from "./IziMaidHelpFull";
import Customers from "./Customers";
import IziBestLogo from "./IziBestLogo";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <>
    
      <div className={styles.main}>
        <FirstHeader />

        <div className={styles.fixedHeader}>
          <FixedHeader />
        </div>

        <div className={styles.fixedHeadr}>
          <SubHeader />
        </div>

        <ThirdHeader />

        <OurCleaning />

        <PerfectGift />

        <IziMaidHelp />

        <IziMaidHelpFull />

        <Customers />

        <IziBestCleaningCar />

        <div className={styles.whyChooseUs}>
          <WhyChooseUs />
        </div>

        <div className={styles.whyChooseUsFull}>
          <WhyChooseUsFull />
        </div>

        <div className={styles.whyChooseUs}>
          <Reviews />
        </div>

        <div className={styles.whyChooseUsFull}>
          <ReviewsFull />
        </div>

        <div>
          <WeProvide />
        </div>

        <div>
          <SecondResidential />
        </div>

        <div>
          <SecondPractically />
        </div>

        <div>
          <Questions />
        </div>

        <div>
          <Faq />
        </div>

        <div className={styles.whyChooseUs}>
          <JoinOurTeam />
        </div>

        <div className={styles.whyChooseUsFull}>
          <JoinOurTeamFull />
        </div>

        <div>
          <IziBestLogo />
        </div>

        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
