import { useState } from "react";
import styles from "./Faq.module.css";

export default function Faq() {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpen7, setIsOpen7] = useState(false);
  const [isOpen8, setIsOpen8] = useState(false);
  const [isOpen9, setIsOpen9] = useState(false);

  function handleClick1() {
    setIsOpen1((prev) => !prev);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }

  function handleClick2() {
    setIsOpen2((prev) => !prev);
    setIsOpen1(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }

  function handleClick3() {
    setIsOpen3((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }

  function handleClick4() {
    setIsOpen4((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }

  function handleClick5() {
    setIsOpen5((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }
  function handleClick6() {
    setIsOpen6((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen7(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }
  function handleClick7() {
    setIsOpen7((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen8(false);
    setIsOpen9(false);
  }
  function handleClick8() {
    setIsOpen8((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen9(false);
  }
  function handleClick9() {
    setIsOpen9((prev) => !prev);
    setIsOpen1(false);
    setIsOpen2(false);
    setIsOpen3(false);
    setIsOpen4(false);
    setIsOpen5(false);
    setIsOpen6(false);
    setIsOpen7(false);
    setIsOpen8(false);
  }

  return (
    <div className={styles.main}>
      <h2>FAQ</h2>
      <div className={styles.main1}>
        <div className={styles.mainSub}>
          <div onClick={handleClick1} className={styles.backed}>
            <h3>What is The IziBest Done Right Promise®?</h3>

            {isOpen1 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen1 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                IziBest Done Right Promise® delivered by IziMaid® ensures
                outstanding service. If something isn't right, contact us by the
                next business day and we'll make it right, at no extra cost.
                Trusted for 5+ years to get the job done right.
                <span className={styles.span}>Learn More.</span>
              </p>

              <p className={styles.hoverMainliv1}>
                Molly Maid is proud to be an IziBest Interior company.We're part
                of a network of home service professionals who offer trusted,
                friendly and fast home services for your entire home. From
                plumbing to electrical, appliance repair to handyman service,
                IziBest Group of Companies has you covered.
                <a href="http://izibest.com">
                  <span className={styles.span}>Learn More About IziBest.</span>
                </a>
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick2} className={styles.backed}>
            <h3>Why Choose IziMaid?</h3>

            {isOpen2 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen2 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                Life is busy, which means you can’t always complete everything
                on your to-do list. IziMaid allows you to have a sparkling home,
                saves you valuable time, and provides the peace of mind that
                comes with knowing the job was done right. Our residential home
                cleaning service is dedicated to making your life easier. We've
                built a reputation for top-notch cleaning that you can trust.
                Our detailed approach covers every room and corner, leaving no
                mess behind.
              </p>

              <p className={styles.hoverMainliv1}>
                You deserve a clean, comfortable space; we're here to deliver it
              </p>

              <p className={styles.hoverMainliv1}>
                As part of the IziBest family of home service brands, we uphold
                high standards and prioritize your satisfaction. Choose IziMaid
                for a cleaner, healthier home that allows you to focus on what
                matters most to you.
                <span className={styles.span}>Request a free estimate</span>
                now!
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick3} className={styles.backed}>
            <h3>How long has IziMaid been in business?</h3>

            {isOpen3 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen3 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                Since 2020, customers have welcomed the trusted cleaning
                professionals from locally owned and operated IziMaid businesses
                into their homes. We’ve provided cleaning services to over a
                million customers, and want you to know that you can continue to
                rely on us to go above and beyond to provide you with a
                worry-free, top-notch cleaning service every time.
              </p>

              <p className={styles.hoverMainliv1}>
                Taking care of homes and those in them is what we do best. We
                firmly believe a healthy home is a clean home!
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick4} className={styles.backed}>
            <h3>What Do We Clean?</h3>

            {isOpen4 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen4 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                IziMaid takes care of your whole home!{" "}
                <span className={styles.span}>Our Services</span> are the
                definition of comprehensive. We give your kitchen a thorough
                cleaning, and bathrooms sparkle after we're done. Your living
                room is cozy and inviting after we clean.
              </p>

              <p className={styles.hoverMainliv1}>
                All bedrooms get our attention, with beds made and dust gone.
                Our professional home cleaners ensure every room you want
                cleaned is a delight for you to come back to. If you’ve been
                looking for the best
                <span className={styles.span}>
                  local home cleaning services
                </span>
                near you, IziMaid is the right choice.
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick5} className={styles.backed}>
            <h3>What Is Our Home Cleaning Process?</h3>

            {isOpen5 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen5 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                Our cleaning process is easy and thorough. First, our friendly
                team arrives on time, ready to make your home shine. We start by
                cleaning up each room and dusting all surfaces while removing
                dirt and allergens. We clean countertops, appliances, and the
                sink in the kitchen so it shines. Bathrooms can get messy
                quickly, so we give them special attention, from scrubbing
                toilets to cleaning counters and wiping mirrors.
              </p>

              <p className={styles.hoverMainliv1}>
                If you’re looking for
                <span className={styles.span}> cleaning services near me</span>
                that cover it all, IziMaid is the answer. We ensure that floors
                are vacuumed and mopped throughout the house, making them clean
                and fresh. Want your bedrooms to be cozy retreats? Come home to
                neatly made beds and refreshed rooms. We also tackle additional
                spaces, like hallways and entryways, to ensure no areas are
                overlooked. page to determine the services that best suit your
                needs.
              </p>

              <p className={styles.hoverMainliv1}>
                Whether you’re looking for recurring cleaning services,
                occasional cleaning, or helping with cleaning during a move, our
                goal is to leave your home spotless and inviting. We take care
                of the details so you can relax and enjoy your clean,
                comfortable space.
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick6} className={styles.backed}>
            <h3>What Other Services Does IziMaid Provide?</h3>

            {isOpen6 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen6 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                We offer cleaning services for any occasion. For a list of all
                the cleaning services our teams provide, visit
                <span className={styles.span}> our services</span>
                page to determine the services that best suit your needs.
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick7} className={styles.backed}>
            <h3>Why Do We Stand Behind Our Work?</h3>

            {isOpen7 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen7 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                IziMaid doesn’t just promise a thorough clean, we back it up.
                <span className={styles.span}>
                  The IziBest Done Right Promise®
                </span>
                is our commitment to excellence, ensuring that our cleaning
                services for residential homes are held to the highest
                standards. We prioritize your satisfaction and the quality of
                our services. From the moment we step into your home, we bring
                professionalism and cleaning expertise.
              </p>

              <p className={styles.hoverMainliv1}>
                Our skilled team treats your space with care, ensuring thorough
                cleaning throughout your home. If something doesn't meet your
                expectations, we'll make it right.
              </p>

              <p className={styles.hoverMainliv1}>
                We value your trust and aim to provide exceptional service that
                leaves your home gleaming and you smiling.
              </p>

              <p className={styles.hoverMainliv1}>
                Your cleanliness satisfaction is always our top priority.
              </p>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick8} className={styles.backed}>
            <h3>
              How Do We Provide a Thorough Clean When and Where You Need It?
            </h3>

            {isOpen8 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen8 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                Customize your cleaning services as a part of your one-time or
                recurring cleaning when things get grimy! In addition to our
                standard room-by-room cleaning services, our team can also
                invest extra time cleaning your home's most essential
                appliances. Check out our refrigerator cleaning and oven
                cleaning options to really make your kitchen shine. Rooms
                included with our home cleaning service:
              </p>

              <ul className={styles.hoverMainliv1}>
                <li>Bathroom cleaning</li>
                <li>Bedroom cleaning</li>
                <li>Kitchen cleaning</li>
                <li>Laundry room cleaning</li>
                <li>Dining room cleaning</li>
              </ul>
            </div>
          )}
        </div>

        <div className={styles.mainSub}>
          <div onClick={handleClick9} className={styles.backed}>
            <h3>Do I Need To Be Home During My Appointment?</h3>

            {isOpen9 ? <h2>&minus;</h2> : <h1>&#43;</h1>}
          </div>

          {isOpen9 && (
            <div className={styles.residentialDIv}>
              <p className={styles.hoverMainliv1}>
                Most of our residential cleaning services occur during the day
                when our clients are away or at work. Our house cleaning
                professionals are usually entrusted with a key or garage code to
                make things easy for our clients. Whichever option you prefer,
                we’ll work with you to meet your specific cleaning needs.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.see}>
        <h3>See All FAQs</h3>
      </div>
    </div>
  );
}
