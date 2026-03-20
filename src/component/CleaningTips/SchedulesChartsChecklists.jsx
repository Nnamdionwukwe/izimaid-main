import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SchedulesChartsChecklists.module.css";
import FixedHeader from "../FixedHeader";

const WEEKLY_SCHEDULE = [
  {
    day: "Monday",
    short: "Mon",
    tasks: ["Vacuum all rooms", "Wipe kitchen surfaces", "Empty all bins"],
    room: "All rooms",
    time: "45 min",
  },
  {
    day: "Tuesday",
    short: "Tue",
    tasks: [
      "Deep-clean bathrooms",
      "Scrub toilet and basin",
      "Mop bathroom floor",
    ],
    room: "Bathrooms",
    time: "40 min",
  },
  {
    day: "Wednesday",
    short: "Wed",
    tasks: ["Wipe all surfaces", "Dust shelves and ledges", "Clean mirrors"],
    room: "Living areas",
    time: "30 min",
  },
  {
    day: "Thursday",
    short: "Thu",
    tasks: [
      "Kitchen deep clean",
      "Wipe hob and oven front",
      "Clean sink and taps",
    ],
    room: "Kitchen",
    time: "40 min",
  },
  {
    day: "Friday",
    short: "Fri",
    tasks: ["Wash all bedding", "Vacuum bedrooms", "Wipe skirting boards"],
    room: "Bedrooms",
    time: "50 min",
  },
  {
    day: "Saturday",
    short: "Sat",
    tasks: [
      "Mop all hard floors",
      "Clean windows inside",
      "Tidy outdoor areas",
    ],
    room: "Whole home",
    time: "60 min",
  },
  {
    day: "Sunday",
    short: "Sun",
    tasks: ["Rest day", "Quick surface tidy only", "Prep for the week ahead"],
    room: "Light only",
    time: "15 min",
  },
];

const FREQUENCY_CHECKLISTS = {
  Daily: {
    icon: "☀️",
    color: "rgb(187, 19, 47)",
    tasks: [
      {
        area: "Kitchen",
        items: [
          "Wipe countertops after cooking",
          "Wash dishes or load dishwasher",
          "Wipe hob surface",
          "Sweep kitchen floor",
        ],
      },
      {
        area: "Bathroom",
        items: [
          "Wipe basin after use",
          "Squeegee shower screen",
          "Replace wet towels",
        ],
      },
      {
        area: "All Rooms",
        items: [
          "Make beds",
          "Open windows to ventilate",
          "Return items to their place",
        ],
      },
    ],
  },
  Weekly: {
    icon: "📅",
    color: "rgb(32, 32, 65)",
    tasks: [
      {
        area: "Kitchen",
        items: [
          "Deep-clean hob and oven front",
          "Wipe inside microwave",
          "Clean fridge exterior",
          "Mop kitchen floor",
        ],
      },
      {
        area: "Bathrooms",
        items: [
          "Scrub toilet thoroughly",
          "Clean shower tiles and screen",
          "Descale taps and showerhead",
          "Mop and disinfect floor",
        ],
      },
      {
        area: "Bedrooms",
        items: [
          "Wash bedding on 60°C",
          "Vacuum carpet or mop floor",
          "Dust all surfaces",
          "Vacuum under bed",
        ],
      },
      {
        area: "Living Room",
        items: [
          "Vacuum sofas and cushions",
          "Dust all shelves",
          "Clean TV and screens",
          "Vacuum floor thoroughly",
        ],
      },
    ],
  },
  Monthly: {
    icon: "🗓️",
    color: "rgb(187, 19, 47)",
    tasks: [
      {
        area: "Kitchen",
        items: [
          "Deep-clean inside oven",
          "Clean fridge inside and defrost freezer",
          "Degrease extractor hood",
          "Wipe inside all cabinets",
        ],
      },
      {
        area: "Bathrooms",
        items: [
          "Scrub and treat grout lines",
          "Descale showerhead with vinegar soak",
          "Clean extractor fan",
          "Wipe ceiling and wall corners",
        ],
      },
      {
        area: "General",
        items: [
          "Vacuum all skirting boards",
          "Wash windows inside and out",
          "Clean curtains or dust blinds",
          "Declutter one area per room",
        ],
      },
    ],
  },
  Seasonal: {
    icon: "🍂",
    color: "rgb(32, 32, 65)",
    tasks: [
      {
        area: "Kitchen",
        items: [
          "Deep-clean all appliances",
          "Empty, clean, and reorganise all cupboards",
          "Replace worn sponges and cloths",
        ],
      },
      {
        area: "Bedrooms",
        items: [
          "Flip and rotate all mattresses",
          "Wash duvets and pillows",
          "Clean inside all wardrobes",
          "Wash all curtains",
        ],
      },
      {
        area: "Whole Home",
        items: [
          "Clean all light fittings",
          "Wash all walls and paintwork",
          "Service washing machine with cleaner",
          "Check and clear all drains",
        ],
      },
    ],
  },
};

const ROOM_CHECKLISTS = {
  Kitchen: {
    icon: "🍳",
    items: [
      { task: "Wipe all countertops", freq: "Daily" },
      { task: "Clean hob and burner caps", freq: "Weekly" },
      { task: "Degrease extractor hood", freq: "Monthly" },
      { task: "Deep-clean oven inside", freq: "Monthly" },
      { task: "Clean fridge inside", freq: "Monthly" },
      { task: "Wipe inside cabinets", freq: "Monthly" },
      { task: "Descale sink and taps", freq: "Weekly" },
      { task: "Sweep and mop floor", freq: "Daily" },
      { task: "Wipe splashback tiles", freq: "Weekly" },
      { task: "Clean microwave inside", freq: "Weekly" },
    ],
  },
  Bathrooms: {
    icon: "🚿",
    items: [
      { task: "Wipe basin and taps", freq: "Daily" },
      { task: "Squeegee shower screen", freq: "Daily" },
      { task: "Scrub toilet inside", freq: "Weekly" },
      { task: "Clean shower tiles", freq: "Weekly" },
      { task: "Descale showerhead", freq: "Monthly" },
      { task: "Scrub grout lines", freq: "Monthly" },
      { task: "Clean mirror streak-free", freq: "Weekly" },
      { task: "Mop floor", freq: "Weekly" },
      { task: "Wipe light switches", freq: "Weekly" },
      { task: "Clean extractor fan", freq: "Monthly" },
    ],
  },
  Bedrooms: {
    icon: "🛏️",
    items: [
      { task: "Make bed", freq: "Daily" },
      { task: "Open window to ventilate", freq: "Daily" },
      { task: "Wash bedding on 60°C", freq: "Weekly" },
      { task: "Dust all surfaces", freq: "Weekly" },
      { task: "Vacuum floor", freq: "Weekly" },
      { task: "Vacuum under bed", freq: "Monthly" },
      { task: "Wipe wardrobe doors", freq: "Weekly" },
      { task: "Clean inside wardrobes", freq: "Seasonal" },
      { task: "Flip mattress", freq: "Seasonal" },
      { task: "Wash curtains", freq: "Seasonal" },
    ],
  },
  "Living Room": {
    icon: "🛋️",
    items: [
      { task: "Return items to place", freq: "Daily" },
      { task: "Vacuum sofas", freq: "Weekly" },
      { task: "Dust all shelves", freq: "Weekly" },
      { task: "Vacuum floor", freq: "Weekly" },
      { task: "Clean TV and screens", freq: "Weekly" },
      { task: "Wipe skirting boards", freq: "Monthly" },
      { task: "Clean windows inside", freq: "Monthly" },
      { task: "Deep vacuum under sofas", freq: "Monthly" },
      { task: "Clean light fittings", freq: "Seasonal" },
      { task: "Wash or dry-clean cushion covers", freq: "Seasonal" },
    ],
  },
};

const FREQ_COLORS = {
  Daily: "rgb(187, 19, 47)",
  Weekly: "rgb(32, 32, 65)",
  Monthly: "rgb(100, 80, 0)",
  Seasonal: "rgb(20, 100, 60)",
};

const FREQ_BG = {
  Daily: "rgb(255, 235, 238)",
  Weekly: "rgb(235, 235, 255)",
  Monthly: "rgb(255, 243, 205)",
  Seasonal: "rgb(220, 245, 230)",
};

const TIPS = [
  "Stick your weekly cleaning schedule on the fridge — visible reminders increase follow-through by over 60% compared to digital-only lists.",
  "Set a recurring phone alarm for your weekly deep-clean tasks rather than relying on memory. Treat it like a meeting you cannot cancel.",
  "Assign rooms to specific days rather than trying to clean the whole house in one session — it reduces the time spent and the mental resistance to starting.",
  "Review and update your seasonal checklist every three months — needs change with the weather, occupancy, and how each room is used.",
  "Use the room-by-room checklist to brief a professional cleaner — it eliminates ambiguity and ensures nothing is missed.",
];

const FAQS = [
  {
    q: "How do I build a realistic cleaning schedule?",
    a: "Start by listing every cleaning task in your home, then assign each one a frequency — daily, weekly, monthly, or seasonal. Distribute weekly tasks across different days so no single day is overwhelming. A 30–60 minute session per day is sustainable for most households long-term.",
  },
  {
    q: "What is the most important room to keep on a regular schedule?",
    a: "The kitchen and bathrooms. These two rooms harbour the most bacteria and deteriorate the fastest without consistent maintenance. If you can only maintain two rooms on a strict schedule, prioritise these. Everything else can follow a more flexible routine.",
  },
  {
    q: "Should I clean top-to-bottom or room-by-room?",
    a: "Both approaches work — the key is consistency. Top-to-bottom within each room (ceiling corners, then shelves, then surfaces, then floors) is the most efficient method because fallen dust is captured in the final floor clean rather than dirtying surfaces you've already cleaned.",
  },
  {
    q: "How do I get the rest of the household to follow the schedule?",
    a: "Post it somewhere visible — on the fridge or a shared board. Assign specific tasks to specific people rather than general responsibilities. Break tasks into small, timed units (10 minutes to vacuum the living room rather than 'vacuum the house'). Short, clear tasks have far higher completion rates.",
  },
  {
    q: "How often should I deep-clean versus maintain?",
    a: "A good rule of thumb is daily maintenance (5–15 minutes), weekly cleaning (30–60 minutes per room), monthly deep-cleans of high-use areas like kitchens and bathrooms, and seasonal full-home resets four times a year. This layered approach prevents build-up and eliminates the need for emergency marathon cleans.",
  },
];

export default function SchedulesChartsChecklists() {
  const navigate = useNavigate();
  const [activeFreq, setActiveFreq] = useState("Daily");
  const [activeRoom, setActiveRoom] = useState("Kitchen");
  const [activeDay, setActiveDay] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Home cleaning organisation</p>
        <h1 className={styles.heroTitle}>
          Schedules, charts
          <br />
          <em>& checklists.</em>
        </h1>
        <p className={styles.heroDesc}>
          Everything you need to organise your home cleaning — weekly schedules,
          room-by-room checklists, and frequency charts for every task in your
          home.
        </p>
        <div className={styles.heroDivider} />
        <div className={styles.heroButtons}>
          <button
            className={styles.heroPrimary}
            onClick={() => navigate("/maids")}
          >
            Book a Professional
          </button>
          <button
            className={styles.heroSecondary}
            onClick={() =>
              document
                .getElementById("schedule-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            View the Schedules
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["📋", "Printable checklists"],
          ["📅", "Weekly planner"],
          ["🏠", "Every room covered"],
          ["⏱️", "Time estimates included"],
          ["✅", "Expert-approved"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Weekly schedule */}
      <div className={styles.section} id="schedule-section">
        <p className={styles.sectionEyebrow}>Weekly planner</p>
        <h2 className={styles.sectionTitle}>
          A 7-day cleaning schedule that works
        </h2>
        <p className={styles.sectionDesc}>
          Tap any day to see the full task list. One focused area per day keeps
          sessions under an hour and prevents the house from ever getting truly
          dirty.
        </p>
        <div className={styles.weekGrid}>
          {WEEKLY_SCHEDULE.map((d, i) => (
            <div
              key={d.day}
              className={`${styles.dayCard} ${activeDay === i ? styles.dayCardActive : ""}`}
              style={{ animationDelay: `${i * 0.05}s` }}
              onClick={() => setActiveDay(activeDay === i ? null : i)}
            >
              <div className={styles.dayTop}>
                <span className={styles.dayShort}>{d.short}</span>
                <span className={styles.dayTime}>{d.time}</span>
              </div>
              <p className={styles.dayRoom}>{d.room}</p>
              {activeDay === i && (
                <div className={styles.dayTasks}>
                  {d.tasks.map((t) => (
                    <div key={t} className={styles.dayTask}>
                      <div className={styles.dayTaskDot} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Frequency checklists */}
      <div className={styles.checklist}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          By frequency
        </p>
        <h2 className={styles.checklistTitle}>What to clean and how often</h2>
        <p className={styles.checklistSub}>
          Every task in your home organised by cleaning frequency — daily,
          weekly, monthly, and seasonal.
        </p>
        <div className={styles.freqTabs}>
          {Object.keys(FREQUENCY_CHECKLISTS).map((freq) => (
            <button
              key={freq}
              className={`${styles.freqTab} ${activeFreq === freq ? styles.freqTabActive : ""}`}
              onClick={() => setActiveFreq(freq)}
            >
              {FREQUENCY_CHECKLISTS[freq].icon} {freq}
            </button>
          ))}
        </div>
        <div className={styles.freqContent}>
          {FREQUENCY_CHECKLISTS[activeFreq].tasks.map((group) => (
            <div key={group.area} className={styles.freqGroup}>
              <p className={styles.freqGroupTitle}>{group.area}</p>
              <div className={styles.freqItems}>
                {group.items.map((item) => (
                  <div key={item} className={styles.freqItem}>
                    <div className={styles.freqCheck}>✓</div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Room-by-room checklist with frequency badges */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>Room-by-room checklist</p>
        <h2 className={styles.sectionTitle}>
          Every task, every room — with frequencies
        </h2>
        <p className={styles.sectionDesc}>
          A complete task list for each room colour-coded by how often each task
          should be done. Use this to brief a cleaner or track your own routine.
        </p>

        {/* Frequency legend */}
        <div className={styles.legend}>
          {Object.entries(FREQ_COLORS).map(([freq, color]) => (
            <div key={freq} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ background: color }} />
              <span className={styles.legendLabel}>{freq}</span>
            </div>
          ))}
        </div>

        {/* Room tabs */}
        <div className={styles.roomTabs}>
          {Object.keys(ROOM_CHECKLISTS).map((room) => (
            <button
              key={room}
              className={`${styles.roomTab} ${activeRoom === room ? styles.roomTabActive : ""}`}
              onClick={() => setActiveRoom(room)}
            >
              {ROOM_CHECKLISTS[room].icon} {room}
            </button>
          ))}
        </div>

        <div className={styles.roomTaskList}>
          {ROOM_CHECKLISTS[activeRoom].items.map((item, i) => (
            <div
              key={item.task}
              className={styles.roomTaskRow}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div
                className={styles.roomTaskCheck}
                style={{ background: FREQ_COLORS[item.freq] }}
              >
                ✓
              </div>
              <span className={styles.roomTaskText}>{item.task}</span>
              <span
                className={styles.roomTaskFreq}
                style={{
                  background: FREQ_BG[item.freq],
                  color: FREQ_COLORS[item.freq],
                }}
              >
                {item.freq}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            Tips for sticking to your schedule
          </p>
        </div>
        <div className={styles.tipsList}>
          {TIPS.map((tip, i) => (
            <div key={i} className={styles.tipItem}>
              <div className={styles.tipDot}>{i + 1}</div>
              <p className={styles.tipText}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className={styles.faq}>
        <p className={styles.sectionEyebrow}>Got questions?</p>
        <h2 className={styles.sectionTitle}>Frequently asked questions</h2>
        <div className={styles.faqList}>
          {FAQS.map((f, i) => (
            <div key={i} className={styles.faqItem}>
              <button
                className={styles.faqQuestion}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {f.q}
                <span
                  className={`${styles.faqChevron} ${openFaq === i ? styles.faqChevronOpen : ""}`}
                >
                  ▾
                </span>
              </button>
              {openFaq === i && <p className={styles.faqAnswer}>{f.a}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Would rather hand it to a professional?
        </h2>
        <p className={styles.ctaText}>
          Share any of these checklists with your Deusizi Sparkle maid and every
          task will be completed to a professional standard — every visit.
        </p>
        <div className={styles.ctaButtons}>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate("/maids")}
          >
            Browse Maids
          </button>
          <button
            className={styles.ctaSecondary}
            onClick={() => navigate("/request-a-free-estimate")}
          >
            Get a Free Estimate
          </button>
        </div>
      </div>
    </div>
  );
}
