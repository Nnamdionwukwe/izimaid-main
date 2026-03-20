import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HowToSaveTime.module.css";
import FixedHeader from "../FixedHeader";

const STRATEGIES = [
  {
    icon: "🗂️",
    name: "Plan Before You Clean",
    tagline: "The session starts before you pick up a cloth",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Write a room list before you start — not during",
        text: "Every minute spent deciding what to clean next during a cleaning session is wasted time. Write your full room and task list the evening before. On cleaning day, you work through the list without stopping to think. A session driven by a pre-written plan consistently finishes 30–40% faster than one run on memory and instinct.",
      },
      {
        title: "Set a timer for every room",
        text: "Cleaning without a time constraint almost always expands to fill the available time — you find extra tasks, re-clean areas already done, or slow down once the pressure disappears. Set a timer for each room before you enter it. A 20-minute timer for a bedroom creates productive urgency that an open-ended session never produces.",
      },
      {
        title: "Clean the hardest room first",
        text: "The kitchen and the bathrooms are the most demanding rooms in the home. Do them first, when your energy and motivation are at their highest. If you leave them until last, fatigue affects the quality and speed of the clean. Completing the hardest rooms first also means the rest of the session feels progressively easier — a strong psychological advantage.",
      },
      {
        title: "Assign one room per day rather than the whole house at once",
        text: "Attempting to clean every room in the home in a single session creates a project so large it is easy to avoid starting. Assigning one room per day — bathroom Monday, kitchen Thursday, bedrooms Friday — keeps each session under 45 minutes, sustains the habit long term, and means the house never reaches the state that requires a full-day marathon.",
      },
    ],
  },
  {
    icon: "⚡",
    name: "Work Smarter",
    tagline: "The method matters as much as the effort",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Clean top to bottom in every room, always",
        text: "Always clean from the highest point in a room downward — ceiling fans, shelves, surfaces, then floors. Dust and debris fall downward as you clean. Vacuuming the floor before dusting the shelves means vacuuming twice. Top to bottom is not a preference — it is the only efficient sequence. Following it consistently saves 15–20% of total cleaning time across a session.",
      },
      {
        title: "Carry your supplies with you — never make trips",
        text: "Every trip back to the cleaning cupboard for a forgotten product or cloth is dead time. Use a caddy or bucket to carry all your cleaning products, cloths, and tools into each room before you start. Nothing leaves the room until the room is done. This single habit saves an average of 10–15 minutes in a typical whole-home clean.",
      },
      {
        title: "Let products work while you do something else",
        text: "Spray your bathroom surfaces, oven, or hob with cleaner and leave them to soak while you clean another area entirely. When you return, grease and grime wipe away in seconds rather than requiring extended scrubbing. Chemical dwell time does the work so your effort does not have to. This is the most underused time-saving principle in household cleaning.",
      },
      {
        title: "Use the two-cloth system",
        text: "Use one damp microfibre cloth to wipe surfaces and a separate dry microfibre cloth to immediately buff dry. This eliminates re-wiping and streaking that would otherwise require a second pass. Apply this to every hard surface — countertops, mirrors, stainless steel, glass. One wet pass, one dry pass, move on. No going back.",
      },
    ],
  },
  {
    icon: "🏃",
    name: "Build Speed Habits",
    tagline: "Make maintenance automatic",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "The 2-minute rule: if it takes under 2 minutes, do it now",
        text: "The single most powerful daily cleaning habit is the 2-minute rule. If returning an item to its place, wiping a surface, or clearing a mess takes under 2 minutes, do it immediately rather than adding it to a list. Tasks deferred become tasks compounded — a 2-minute wipe done daily prevents a 20-minute scrub done monthly.",
      },
      {
        title: "Clean the bathroom while you're already in it",
        text: "Keep a small spray bottle of diluted bathroom cleaner and a cloth under the sink. After your morning routine, spend 90 seconds wiping the basin, taps, and mirror before you leave. This daily habit eliminates the need for a weekly bathroom scrub — the room never reaches the level of grime that requires extended cleaning time.",
      },
      {
        title: "Wipe the hob immediately after cooking",
        text: "Grease and food residue wiped from a hob within 5 minutes of cooking takes 30 seconds. The same residue left for 24 hours takes 5 minutes. Left for a week, it requires specialist degreaser and 15 minutes of scrubbing. The time investment is the same spill — only the delay determines how hard the clean is. Wipe immediately, every time.",
      },
      {
        title: "Make your bed the moment you get up",
        text: "A made bed takes 2 minutes and transforms the visual state of a bedroom immediately. More importantly, it creates a completion signal at the start of the day — a small win that primes you for other maintenance tasks. People who consistently make their beds are significantly more likely to complete other daily cleaning habits because the first task creates momentum for the next.",
      },
    ],
  },
  {
    icon: "🧰",
    name: "Optimise Your Tools",
    tagline: "The right equipment halves the effort",
    color: "rgb(32, 32, 65)",
    tips: [
      {
        title: "Switch to microfibre cloths for everything",
        text: "A microfibre cloth cleans most surfaces — glass, countertops, appliances, mirrors — with water alone, requiring no cleaning product. It picks up bacteria and fine dust rather than moving them around. A standard cotton cloth or paper towel smears surfaces and often requires chemical assistance to produce the same result. Microfibre cloths pay back their cost in reduced cleaning time within weeks.",
      },
      {
        title: "Keep one set of cleaning supplies in each bathroom",
        text: "Storing a small spray bottle of cleaner and a cloth under each bathroom sink eliminates carrying supplies from room to room — and eliminates the barrier of having to go and get them before cleaning. Proximity is the most powerful determinant of whether a quick clean actually happens. If the product is already there, you clean. If it isn't, you intend to and then don't.",
      },
      {
        title: "Invest in an extendable microfibre duster",
        text: "An extendable microfibre duster with a 60–120cm reach allows you to dust ceiling corners, the tops of wardrobes, and ceiling fans without climbing on furniture, without getting a step ladder, and without displacing dust into the air the way a feather duster does. The time saving across a whole-home dust is 10–15 minutes. The safety benefit is immediate.",
      },
      {
        title: "Use a squeegee in the shower after every use",
        text: "Thirty seconds with a shower squeegee after every use removes 80% of the water that would otherwise dry as limescale and soap scum. The squeegee eliminates the majority of the buildup that makes shower cleaning time-consuming. A shower that is squeegeed daily takes 5 minutes to clean weekly. One that is never squeegeed takes 25 minutes.",
      },
    ],
  },
  {
    icon: "👨‍👩‍👧",
    name: "Involve Everyone",
    tagline: "Cleaning should not be one person's job",
    color: "rgb(187, 19, 47)",
    tips: [
      {
        title: "Assign ownership, not tasks",
        text: "Assigning a specific task (vacuum the living room this Saturday) creates a one-off obligation that requires constant re-assigning. Assigning ownership of a space (the living room is yours to maintain) creates sustained accountability. When someone owns a space, they notice when it needs attention without being told. Ownership distributes the mental load of cleaning, not just the physical effort.",
      },
      {
        title: "Age-appropriate responsibilities from age 3",
        text: "Children from age 3 can return toys to storage, place dirty clothes in a hamper, and wipe their own spills with a cloth. By age 6, they can make their bed, clear the table, and sweep a floor. By age 10, they can handle basic bathroom cleaning. Early responsibility is not about the quality of the clean — it is about building habits that save enormous time over years of household maintenance.",
      },
      {
        title: "The 10-minute family reset before bed",
        text: "A household-wide 10-minute tidy before bed — every person returning items to their correct place, clearing surfaces, and taking items to where they belong — resets the house daily and prevents the gradual accumulation that becomes a 2-hour clean every weekend. Ten minutes of distributed effort across four people is 40 person-minutes of maintenance that costs no single person very much.",
      },
      {
        title:
          "Book a professional for the tasks that consume disproportionate time",
        text: "Some tasks — oven deep-cleans, bathroom grout scrubbing, hob degreasing — take a professional 30 minutes and an untrained person 2 hours. The difference is not effort but technique, products, and experience. Identifying the 20% of cleaning tasks that consume 80% of your time and outsourcing those specifically produces the greatest time saving per naira spent.",
      },
    ],
  },
];

const QUICK_WINS = [
  {
    icon: "🪥",
    time: "30 sec",
    tip: "Squeegee the shower screen after every use — eliminates weekly limescale scrubbing.",
  },
  {
    icon: "🍳",
    time: "2 min",
    tip: "Wipe the hob within 5 minutes of cooking — grease wipes off before it bakes on.",
  },
  {
    icon: "🛏️",
    time: "2 min",
    tip: "Make the bed immediately on waking — transforms the room and triggers other habits.",
  },
  {
    icon: "🪣",
    time: "1 min",
    tip: "Rinse the sink after every use — prevents toothpaste and soap residue from building up.",
  },
  {
    icon: "👜",
    time: "1 min",
    tip: "Empty your bag on the table when you get home — prevents mess spreading through the house.",
  },
  {
    icon: "🥣",
    time: "2 min",
    tip: "Wash up or load the dishwasher immediately after meals — a stack of dishes takes 4× longer.",
  },
  {
    icon: "🧴",
    time: "90 sec",
    tip: "Wipe the basin and mirror after your morning routine — eliminates the weekly bathroom clean.",
  },
  {
    icon: "🗑️",
    time: "1 min",
    tip: "Empty small bins before they overflow — overflow always creates more work than prevention.",
  },
];

const TIME_SAVINGS = [
  {
    task: "Wipe hob after cooking",
    diy_time: "2 min",
    vs: "vs",
    saved_time: "15 min weekly scrub",
    saving: "13 min/week",
  },
  {
    task: "Squeegee shower daily",
    diy_time: "30 sec",
    vs: "vs",
    saved_time: "25 min weekly scrub",
    saving: "20+ min/week",
  },
  {
    task: "Top-to-bottom order",
    diy_time: "Same effort",
    vs: "vs",
    saved_time: "No re-vacuuming",
    saving: "15–20 min/session",
  },
  {
    task: "Carry supplies in caddy",
    diy_time: "Same effort",
    vs: "vs",
    saved_time: "No supply trips",
    saving: "10–15 min/session",
  },
  {
    task: "10-min daily family reset",
    diy_time: "10 min/day",
    vs: "vs",
    saved_time: "2-hr weekend clean",
    saving: "50+ min/week",
  },
  {
    task: "Let products soak/dwell",
    diy_time: "0 extra effort",
    vs: "vs",
    saved_time: "No extended scrubbing",
    saving: "20 min/session",
  },
];

const TIPS = [
  "The biggest time-saver in cleaning is not a product or technique — it is consistency. A house cleaned a little every day takes a fraction of the time of a house cleaned intensively once a week.",
  "Clutter is the number one enemy of cleaning speed. A surface with nothing on it takes 10 seconds to wipe. The same surface with 8 items on it takes 2 minutes. Decluttering is the most powerful cleaning time-saver that has nothing to do with cleaning.",
  "Never clean a room you haven't tidied first. Cleaning around clutter is slower, less thorough, and more frustrating than cleaning into a clear space. Tidy first, always.",
  "A professional cleaner working in an unfamiliar home is typically 40–60% faster than the homeowner — not because they work harder but because they have a systematic method, proper tools, and commercial-grade products. Learning their approach is worth more than buying more products.",
  "Review your cleaning routine every season. Rooms change in how they are used, and your cleaning schedule should reflect the current reality — not the routine you set up two years ago.",
];

const FAQS = [
  {
    q: "How do I cut my weekly cleaning time in half?",
    a: "Three changes produce the greatest reduction: adopt the 2-minute rule for daily maintenance so problems never compound, use a pre-written task list so you never waste time deciding what to do next, and assign each room a day rather than cleaning everything at once. These three changes alone typically halve a weekly cleaning session within two weeks.",
  },
  {
    q: "What is the single most time-consuming mistake people make when cleaning?",
    a: "Cleaning in the wrong order — specifically, cleaning floors before surfaces. When you vacuum or mop first, every subsequent dusting and surface wipe deposits debris back onto the floor, requiring a second floor clean. Top to bottom, always. This one change removes a significant amount of re-work from every session.",
  },
  {
    q: "Is it faster to clean the whole house at once or room by room across the week?",
    a: "Room by room across the week is almost always faster in total time because rooms cleaned in short, focused sessions are cleaned more thoroughly and require less time per session. A whole-house clean in a single day involves constant context-switching, supply retrieval, and fatigue that progressively slows the pace. Daily maintenance also prevents the build-up that makes a single marathon session so time-consuming.",
  },
  {
    q: "How much time can I save by hiring a professional?",
    a: "A professional cleaner typically completes in 2–3 hours what takes a homeowner 5–6 hours — a saving of 3+ hours per session. The gap comes from systematic method, professional products, and experience. For tasks like oven cleaning, bathroom grout, and hob degreasing, the difference is even more pronounced. The time saving over a year, at one session per week, is substantial.",
  },
  {
    q: "What daily habits save the most time long-term?",
    a: "In order of impact: (1) wipe the hob immediately after cooking, (2) squeegee the shower screen after every use, (3) apply the 2-minute rule throughout the day, (4) 10-minute family reset before bed. These four habits, consistently applied, reduce weekly deep-cleaning time by 60–70% compared to a home with no maintenance habits.",
  },
];

export default function HowToSaveTime() {
  const navigate = useNavigate();
  const [activeStrategy, setActiveStrategy] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>Cleaning efficiency guide</p>
        <h1 className={styles.heroTitle}>
          How to clean faster
          <br />
          <em>and do it less.</em>
        </h1>
        <p className={styles.heroDesc}>
          Practical strategies for cutting your cleaning time in half — through
          smarter habits, better methods, and knowing which tasks are worth
          outsourcing.
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
                .getElementById("strategies-section")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Read the Strategies
          </button>
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          ["⏱️", "Time estimates included"],
          ["🧠", "Habit-based strategies"],
          ["📋", "5 strategy categories"],
          ["💡", "8 quick wins"],
          ["✅", "Expert-approved"],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Strategies */}
      <div className={styles.section} id="strategies-section">
        <p className={styles.sectionEyebrow}>Five strategies</p>
        <h2 className={styles.sectionTitle}>
          How to get more done in less time
        </h2>
        <p className={styles.sectionDesc}>
          Select a strategy to read the full tips. Each category builds on the
          previous — work through all five for the complete picture.
        </p>

        {/* Strategy selector */}
        <div className={styles.strategySelector}>
          {STRATEGIES.map((s, i) => (
            <button
              key={s.name}
              className={`${styles.strategyBtn} ${activeStrategy === i ? styles.strategyBtnActive : ""}`}
              style={activeStrategy === i ? { borderColor: s.color } : {}}
              onClick={() => setActiveStrategy(i)}
            >
              <span className={styles.strategyIcon}>{s.icon}</span>
              <div className={styles.strategyBtnText}>
                <span className={styles.strategyNum}>Strategy {i + 1}</span>
                <span className={styles.strategyName}>{s.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Active strategy tips */}
        <div className={styles.strategyContent}>
          <div
            className={styles.strategyHeader}
            style={{ borderLeftColor: STRATEGIES[activeStrategy].color }}
          >
            <span className={styles.strategyHeaderIcon}>
              {STRATEGIES[activeStrategy].icon}
            </span>
            <div>
              <p className={styles.strategyHeaderTitle}>
                Strategy {activeStrategy + 1}: {STRATEGIES[activeStrategy].name}
              </p>
              <p className={styles.strategyHeaderTagline}>
                {STRATEGIES[activeStrategy].tagline}
              </p>
            </div>
          </div>

          <div className={styles.tipCards}>
            {STRATEGIES[activeStrategy].tips.map((tip, i) => (
              <div
                key={tip.title}
                className={styles.tipCard}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={styles.tipCardTop}>
                  <div
                    className={styles.tipNum}
                    style={{
                      background: STRATEGIES[activeStrategy].color,
                    }}
                  >
                    {i + 1}
                  </div>
                  <p className={styles.tipTitle}>{tip.title}</p>
                </div>
                <p className={styles.tipText}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick wins */}
      <div className={styles.quickWins}>
        <p
          className={styles.sectionEyebrow}
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Start today
        </p>
        <h2 className={styles.quickWinsTitle}>
          8 habits that take under 2 minutes
        </h2>
        <p className={styles.quickWinsSub}>
          These micro-habits collectively eliminate hours of cleaning every
          week. The time investment is seconds. The saving is substantial.
        </p>
        <div className={styles.quickWinsGrid}>
          {QUICK_WINS.map((w, i) => (
            <div
              key={i}
              className={styles.quickWinCard}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={styles.quickWinTop}>
                <span className={styles.quickWinIcon}>{w.icon}</span>
                <span className={styles.quickWinTime}>{w.time}</span>
              </div>
              <p className={styles.quickWinText}>{w.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Time savings table */}
      <div className={styles.section}>
        <p className={styles.sectionEyebrow}>By the numbers</p>
        <h2 className={styles.sectionTitle}>
          How much time each habit actually saves
        </h2>
        <p className={styles.sectionDesc}>
          These are real-world time comparisons between maintenance habits and
          the reactive cleaning sessions they replace.
        </p>
        <div className={styles.savingsTable}>
          <div className={styles.savingsHeader}>
            <div className={styles.savingsColHead}>Habit</div>
            <div className={styles.savingsColHead}>Cost</div>
            <div className={styles.savingsColHead}>Saving</div>
          </div>
          {TIME_SAVINGS.map((row, i) => (
            <div
              key={row.task}
              className={`${styles.savingsRow} ${i % 2 === 0 ? styles.savingsRowAlt : ""}`}
            >
              <div className={styles.savingsTask}>{row.task}</div>
              <div className={styles.savingsCell}>{row.diy_time}</div>
              <div className={styles.savingsSaving}>
                <span className={styles.savingsBadge}>{row.saving}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips banner */}
      <div className={styles.tipsBanner}>
        <div className={styles.tipsBannerHeader}>
          <span className={styles.tipsHeaderIcon}>💡</span>
          <p className={styles.tipsHeaderTitle}>
            The principles behind saving time
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
          The fastest clean is one you don't have to do yourself.
        </h2>
        <p className={styles.ctaText}>
          Book a vetted professional and reclaim 3–5 hours every week. All
          products supplied. Flexible scheduling. No contracts.
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
