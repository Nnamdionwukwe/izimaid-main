import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.footerDiv}>
        <div className={styles.footerDiv2}>
          <a href="https://deusizisparkle.com">
            <img className={styles.logo} alt="Logo" src="izimaid.jpg" />
          </a>

          <a href="tel:+2348030588774" className={styles.call}>
            <i className="fa-solid fa-phone"></i>
            <h2>0803 058 8774</h2>
          </a>

          <div className={styles.icons}>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-x-twitter"></i>
            <i className="fa-brands fa-youtube"></i>
            <i className="fa-brands fa-linkedin"></i>
          </div>
        </div>

        <div className={styles.footerDiv3}>
          {/* ── SERVICES ── */}
          <div className={styles.footerDivSub}>
            <h3>SERVICES</h3>
            <p className={styles.para}></p>
            <p
              className={styles.para2}
              onClick={() => navigate("/home-cleaning")}
            >
              Residential
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/recurring-cleaning")}
            >
              Recurring Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/one-time-cleaning")}
            >
              One Time Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/move-in-cleaning")}
            >
              Move-In Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/move-out-cleaning")}
            >
              Move-Out Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/eco-friendly-cleaning")}
            >
              Eco Friendly Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/apartment-cleaning")}
            >
              Apartment Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/occasional-cleaning")}
            >
              Occasional Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/special-event-cleaning")}
            >
              Special Event Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/home-cleaning")}
            >
              Light Commercial
            </p>
          </div>

          {/* ── COMPANY ── */}
          <div className={styles.footerDivSub}>
            <h3>COMPANY</h3>
            <p className={styles.para}></p>
            <p
              className={styles.para2}
              onClick={() => navigate("/why-hire-us")}
            >
              Why Hire Us
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/our-approach")}
            >
              Our Approach
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/our-results")}
            >
              Our Results
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/our-commitment")}
            >
              Our Commitment
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/deusizi-group")}
            >
              About Us
            </p>
            <p className={styles.para2} onClick={() => navigate("/contact")}>
              Contact Us
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/apply-locally")}
            >
              Apply Locally
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/aplicar-localmente")}
            >
              Aplicar Localmente
            </p>
            <p className={styles.para2} onClick={() => navigate("/franchise")}>
              Own a Franchise
            </p>
            <p className={styles.para2} onClick={() => navigate("/foundation")}>
              Deusizi Foundation
            </p>
            <p className={styles.para2} onClick={() => navigate("/awards")}>
              Deusizi Sparkle Awards
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/local-shelter-support")}
            >
              Local Shelter Support
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/board-of-directors")}
            >
              Board of Directors
            </p>
          </div>

          {/* ── RESOURCES ── */}
          <div className={styles.footerDivSub}>
            <h3>RESOURCES</h3>
            <p className={styles.para4}></p>
            <p className={styles.para2} onClick={() => navigate("/blog")}>
              Practically Spotless Blog
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/blog/seasonal")}
            >
              Seasonal Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/blog/tips-and-tricks")}
            >
              Tips and Tricks
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/kitchens-tips")}
            >
              Kitchen Cleaning Tips
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/living-rooms")}
            >
              Living Room Tips
            </p>
            <p className={styles.para2} onClick={() => navigate("/bathrooms")}>
              Bathroom Tips
            </p>
            <p className={styles.para2} onClick={() => navigate("/bedrooms")}>
              Bedroom Tips
            </p>
            <p className={styles.para2} onClick={() => navigate("/kids-rooms")}>
              Kids' Room Tips
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/laundry-rooms")}
            >
              Laundry Room Tips
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/office-cleaning-tips")}
            >
              Office Cleaning Tips
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/spring-cleaning")}
            >
              Spring Cleaning
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/how-to-save-time")}
            >
              How to Save Time
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/schedules-charts-checklists")}
            >
              Schedules & Checklists
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/whats-included")}
            >
              What's Included
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/before-after-cleaning")}
            >
              Before & After Cleaning
            </p>
            <p className={styles.para2} onClick={() => navigate("/locations")}>
              Our Locations
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/gift-certificates")}
            >
              Gift Certificates
            </p>
            <p className={styles.para2} onClick={() => navigate("/app")}>
              Deusizi App
            </p>
            <p
              className={styles.para2}
              onClick={() => navigate("/request-a-free-estimate")}
            >
              Get a Free Estimate
            </p>
          </div>
        </div>
      </div>

      <div className={styles.footerDiv4}>
        <p className={styles.border}></p>
        <p className={styles.border2}>
          This information is not intended as an offer to sell, or the
          solicitation of an offer to buy, a franchise. It is for information
          purposes only. Currently, the following states regulate the offer and
          sale of franchises: Lagos, Abuja. If you are a resident of or want to
          locate a franchise in one of these states, we will not offer you a
          franchise unless and until we have complied with applicable pre-sale
          registration and disclosure requirements in your state.
        </p>
        <p className={styles.border3}>A clean you can count on.®</p>
      </div>

      {/* <div className={styles.h4Div}>
        <h4
          className={styles.h4}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/terms-of-service")}
        >
          Terms of Use
        </h4>
        <h4
          className={styles.h4}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/privacy-policy")}
        >
          Privacy Policy
        </h4>
      </div> */}

      {/* <p className={styles.border4}>
        © 2025 Deusizi Sparkle Company and its affiliates. All rights reserved.
        Deusizi Sparkle is a registered trademark of Deusizi Sparkle SPV LLC.
        This site and all of its content is protected under applicable law,
        including laws of the U.S. and other countries. Each location is
        independently owned and operated. Services may vary by location. Please
        contact the franchise location for additional information.
      </p> */}
    </div>
  );
}
