import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Blog.module.css";
import FixedHeader from "../FixedHeader";

const CATEGORIES = [
  { name: "All", icon: "📚" },
  { name: "Guides", icon: "📋" },
  { name: "Graphics", icon: "🎨" },
  { name: "Tips", icon: "💡" },
  { name: "Checklists", icon: "✅" },
  { name: "How-To", icon: "🔧" },
];

const POSTS = [
  // ── Guides ──────────────────────────────────────────────────────
  {
    id: 1,
    category: "Guides",
    tag: "Spring Cleaning",
    icon: "🌸",
    title: "The Complete Spring Cleaning Guide for Nigerian Homes",
    excerpt:
      "A room-by-room spring cleaning guide covering every phase — from decluttering to deep cleaning every surface, fixture, and corner of your home.",
    readTime: "8 min read",
    featured: true,
    slug: "/blog/spring-cleaning-guide",
  },
  {
    id: 2,
    category: "Guides",
    tag: "Move Cleaning",
    icon: "📦",
    title: "Move-In & Move-Out Cleaning: What You Need to Know",
    excerpt:
      "Everything you need before handing over keys or unpacking boxes — tips, checklists, and the difference between a move-in and move-out clean.",
    readTime: "6 min read",
    featured: false,
    slug: "/blog/move-in-move-out-cleaning",
  },
  {
    id: 3,
    category: "Guides",
    tag: "Kitchens",
    icon: "🍳",
    title: "Kitchen Cleaning Tips That Actually Work",
    excerpt:
      "From hob and oven maintenance to sink bacteria and cabinet organisation — the complete guide to keeping your kitchen genuinely clean.",
    readTime: "7 min read",
    featured: false,
    slug: "/blog/kitchen-cleaning-tips",
  },
  {
    id: 4,
    category: "Guides",
    tag: "Bathrooms",
    icon: "🚿",
    title: "Bathroom Cleaning: Limescale, Mould, and Grout",
    excerpt:
      "How to tackle the three problems that make bathrooms hard to clean — limescale on taps, mould in grout, and soap scum on tiles.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/bathroom-cleaning-tips",
  },
  {
    id: 5,
    category: "Guides",
    tag: "Bedrooms",
    icon: "🛏️",
    title: "Bedroom Cleaning Tips for Better Sleep",
    excerpt:
      "Dust mites, mattress hygiene, and wardrobe maintenance — why a clean bedroom matters more than any other room for your health.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/bedroom-cleaning-tips",
  },
  {
    id: 6,
    category: "Guides",
    tag: "Living Rooms",
    icon: "🛋️",
    title: "Living Room Deep Clean: Sofas, Surfaces, and Floors",
    excerpt:
      "How to clean upholstered sofas, dust shelves properly, and maintain floors — a complete guide to your living room.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/living-room-cleaning-tips",
  },
  {
    id: 7,
    category: "Guides",
    tag: "Kid's Rooms",
    icon: "🧸",
    title: "Cleaning Children's Rooms Safely",
    excerpt:
      "Child-safe products, toy sanitisation, and dust mite prevention — how to clean a child's bedroom without exposing them to harsh chemicals.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/kids-room-cleaning-tips",
  },
  {
    id: 8,
    category: "Guides",
    tag: "Office",
    icon: "🏢",
    title: "Office Cleaning: How to Maintain a Productive Workspace",
    excerpt:
      "Daily, weekly, and deep office cleaning — how to maintain workstations, kitchens, bathrooms, and common areas to a consistent professional standard.",
    readTime: "6 min read",
    featured: false,
    slug: "/blog/office-cleaning-guide",
  },
  {
    id: 9,
    category: "Guides",
    tag: "Laundry",
    icon: "🧺",
    title: "Laundry Room Maintenance: Appliances, Mould & Drains",
    excerpt:
      "Everything your washing machine, dryer, and laundry room needs — including the tasks most people skip until it's too late.",
    readTime: "6 min read",
    featured: false,
    slug: "/blog/laundry-room-cleaning-tips",
  },
  {
    id: 10,
    category: "Guides",
    tag: "Save Time",
    icon: "⏱️",
    title: "How to Clean Faster and Do It Less",
    excerpt:
      "Five strategies for cutting your cleaning time in half — through smarter habits, better methods, and knowing what to outsource.",
    readTime: "7 min read",
    featured: false,
    slug: "/blog/how-to-save-time-cleaning",
  },
  // ── Graphics ─────────────────────────────────────────────────────
  {
    id: 11,
    category: "Graphics",
    tag: "Infographic",
    icon: "🎨",
    title: "The Weekly Cleaning Schedule [Printable Planner]",
    excerpt:
      "A visual 7-day cleaning schedule showing which room to focus on each day, time estimates per session, and a blank version you can fill in yourself.",
    readTime: "2 min read",
    featured: true,
    slug: "/blog/weekly-cleaning-schedule-graphic",
  },
  {
    id: 12,
    category: "Graphics",
    tag: "Infographic",
    icon: "🗓️",
    title: "Daily, Weekly, Monthly & Seasonal Cleaning Chart",
    excerpt:
      "A colour-coded frequency chart showing every cleaning task in your home organised by how often it needs to be done — ready to print and pin.",
    readTime: "2 min read",
    featured: false,
    slug: "/blog/cleaning-frequency-chart",
  },
  {
    id: 13,
    category: "Graphics",
    tag: "Infographic",
    icon: "🍳",
    title: "Kitchen Cleaning Zones Map [Visual Guide]",
    excerpt:
      "A visual breakdown of the kitchen by cleaning zone — hob, oven, sink, cabinets, floor — showing exactly what needs cleaning in each area.",
    readTime: "2 min read",
    featured: false,
    slug: "/blog/kitchen-cleaning-zones-graphic",
  },
  {
    id: 14,
    category: "Graphics",
    tag: "Infographic",
    icon: "🚿",
    title: "Bathroom Cleaning Checklist Poster [Printable]",
    excerpt:
      "A printable bathroom cleaning poster covering every fixture — toilet, shower, sink, grout, and floors — with daily, weekly, and monthly tasks.",
    readTime: "2 min read",
    featured: false,
    slug: "/blog/bathroom-checklist-poster",
  },
  {
    id: 15,
    category: "Graphics",
    tag: "Comparison",
    icon: "📊",
    title: "DIY vs Professional Cleaning: Time & Cost Comparison",
    excerpt:
      "A visual comparison of how long common cleaning tasks take DIY versus professionally — and what that time is worth in real terms.",
    readTime: "3 min read",
    featured: false,
    slug: "/blog/diy-vs-professional-cleaning-graphic",
  },
  {
    id: 16,
    category: "Graphics",
    tag: "Infographic",
    icon: "🌸",
    title: "Spring Cleaning Room Order [Visual Guide]",
    excerpt:
      "A step-by-step visual showing the optimal room order for a spring clean — from bedroom 1 through to outdoor areas — with reasoning for each step.",
    readTime: "2 min read",
    featured: false,
    slug: "/blog/spring-cleaning-room-order-graphic",
  },
  // ── Tips ──────────────────────────────────────────────────────────
  {
    id: 17,
    category: "Tips",
    tag: "General",
    icon: "💡",
    title: "Cleaning Tips for Every Room in Your Home",
    excerpt:
      "Practical tips for kitchens, bathrooms, bedrooms, and living areas — including quick wins, natural cleaning solutions, and time-saving habits.",
    readTime: "6 min read",
    featured: false,
    slug: "/blog/cleaning-tips-general",
  },
  {
    id: 18,
    category: "Tips",
    tag: "Natural Cleaning",
    icon: "🍋",
    title: "Clean Your Entire Home with 6 Natural Products",
    excerpt:
      "White vinegar, baking soda, lemon, and three others handle 95% of every cleaning job in your home — no specialist chemicals needed.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/natural-cleaning-products",
  },
  {
    id: 19,
    category: "Tips",
    tag: "Habits",
    icon: "🏃",
    title: "The 10 Cleaning Habits That Save Hours Every Week",
    excerpt:
      "Small daily actions — wipe the hob while warm, squeegee the shower, 2-minute rule — that collectively eliminate hours of reactive cleaning.",
    readTime: "4 min read",
    featured: false,
    slug: "/blog/cleaning-habits",
  },
  {
    id: 20,
    category: "Tips",
    tag: "Mould",
    icon: "🍃",
    title: "How to Prevent and Remove Mould in Nigerian Homes",
    excerpt:
      "Mould thrives in Nigeria's humidity. How to prevent it in bathrooms, laundry rooms, and kitchens — and how to treat it properly when it appears.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/mould-prevention-tips",
  },
  {
    id: 21,
    category: "Tips",
    tag: "Pets",
    icon: "🐾",
    title: "Cleaning Tips for Homes with Pets",
    excerpt:
      "Pet hair, dander, odours, and accidents — how to keep a home with dogs or cats genuinely clean without spending all day cleaning.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/pet-home-cleaning-tips",
  },
  // ── Checklists ────────────────────────────────────────────────────
  {
    id: 22,
    category: "Checklists",
    tag: "Spring Clean",
    icon: "✅",
    title: "The Complete Spring Cleaning Checklist",
    excerpt:
      "Every task, every room — a printable spring cleaning checklist covering decluttering, deep cleaning, and seasonal maintenance for the whole home.",
    readTime: "3 min read",
    featured: false,
    slug: "/blog/spring-cleaning-checklist",
  },
  {
    id: 23,
    category: "Checklists",
    tag: "Move Out",
    icon: "📦",
    title: "Move-Out Cleaning Checklist (Landlord Standard)",
    excerpt:
      "The exact checklist landlords and letting agents use at move-out inspections — organised by room so nothing is missed and your deposit is protected.",
    readTime: "3 min read",
    featured: false,
    slug: "/blog/move-out-cleaning-checklist",
  },
  {
    id: 24,
    category: "Checklists",
    tag: "Daily",
    icon: "☀️",
    title: "The 15-Minute Daily Cleaning Checklist",
    excerpt:
      "A realistic daily checklist that keeps the home in good order without consuming your evenings — 15 minutes, every room covered.",
    readTime: "2 min read",
    featured: false,
    slug: "/blog/daily-cleaning-checklist",
  },
  {
    id: 25,
    category: "Checklists",
    tag: "Kitchen",
    icon: "🍳",
    title: "Kitchen Cleaning Checklist: Daily, Weekly & Monthly",
    excerpt:
      "Every kitchen cleaning task organised by frequency — from wiping the hob after cooking to the annual oven deep clean.",
    readTime: "3 min read",
    featured: false,
    slug: "/blog/kitchen-cleaning-checklist",
  },
  // ── How-To ────────────────────────────────────────────────────────
  {
    id: 26,
    category: "How-To",
    tag: "Oven",
    icon: "🔧",
    title: "How to Deep Clean Your Oven (Without Harsh Chemicals)",
    excerpt:
      "A step-by-step oven cleaning guide using baking soda and white vinegar — including the overnight soak method that produces professional results.",
    readTime: "4 min read",
    featured: false,
    slug: "/blog/how-to-clean-oven",
  },
  {
    id: 27,
    category: "How-To",
    tag: "Grout",
    icon: "🧱",
    title: "How to Clean and Restore Bathroom Grout",
    excerpt:
      "Discoloured grout restored without replacement — the products, tools, and method that remove years of mould and staining from tile grout lines.",
    readTime: "4 min read",
    featured: false,
    slug: "/blog/how-to-clean-grout",
  },
  {
    id: 28,
    category: "How-To",
    tag: "Mattress",
    icon: "🛏️",
    title: "How to Clean and Deodorise a Mattress",
    excerpt:
      "Vacuum, spot-treat, deodorise, and protect — a step-by-step guide to cleaning a mattress that removes dust mites, stains, and odours.",
    readTime: "4 min read",
    featured: false,
    slug: "/blog/how-to-clean-mattress",
  },
  {
    id: 29,
    category: "How-To",
    tag: "Washing Machine",
    icon: "🌀",
    title: "How to Clean Your Washing Machine (And Keep It Clean)",
    excerpt:
      "Monthly maintenance wash, door seal mould, detergent drawer build-up, and filter cleaning — the complete washing machine cleaning routine.",
    readTime: "5 min read",
    featured: false,
    slug: "/blog/how-to-clean-washing-machine",
  },
  {
    id: 30,
    category: "How-To",
    tag: "Windows",
    icon: "🪟",
    title: "How to Clean Windows Without Streaks",
    excerpt:
      "The tools, technique, and timing that produce streak-free windows every time — including why cloudy days produce better results than sunny ones.",
    readTime: "3 min read",
    featured: false,
    slug: "/blog/how-to-clean-windows",
  },
];

const CATEGORY_COLORS = {
  Guides: { bg: "rgb(240, 240, 255)", color: "rgb(32, 32, 65)" },
  Graphics: { bg: "rgb(255, 235, 238)", color: "rgb(187, 19, 47)" },
  Tips: { bg: "rgb(220, 248, 230)", color: "rgb(20, 100, 40)" },
  Checklists: { bg: "rgb(255, 243, 205)", color: "rgb(120, 80, 0)" },
  "How-To": { bg: "rgb(220, 240, 255)", color: "rgb(20, 80, 140)" },
};

export { POSTS, CATEGORY_COLORS };

export default function Blog() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.filter((p) => p.featured);
  const regular = filtered.filter((p) => !p.featured);

  function handleSearch(e) {
    setSearchInput(e.target.value);
    setSearch(e.target.value);
  }

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.heroEyebrow}>The Practical Spotless Blog</p>
        <h1 className={styles.heroTitle}>
          Guides, graphics
          <br />
          <em>&amp; cleaning tips.</em>
        </h1>
        <p className={styles.heroDesc}>
          Practical cleaning guides, printable checklists, visual infographics,
          and expert how-to advice for every room in your home.
        </p>
        <div className={styles.heroDivider} />

        {/* Search bar inside hero */}
        <div className={styles.heroSearch}>
          <span className={styles.heroSearchIcon}>🔍</span>
          <input
            className={styles.heroSearchInput}
            value={searchInput}
            onChange={handleSearch}
            placeholder="Search guides, tips, checklists…"
          />
          {searchInput && (
            <button
              className={styles.heroSearchClear}
              onClick={() => {
                setSearchInput("");
                setSearch("");
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Trust bar */}
      <div className={styles.trustBar}>
        {[
          [
            "📋",
            `${POSTS.filter((p) => p.category === "Guides").length} guides`,
          ],
          [
            "🎨",
            `${POSTS.filter((p) => p.category === "Graphics").length} graphics`,
          ],
          [
            "💡",
            `${POSTS.filter((p) => p.category === "Tips").length} tip articles`,
          ],
          [
            "✅",
            `${POSTS.filter((p) => p.category === "Checklists").length} checklists`,
          ],
          [
            "🔧",
            `${POSTS.filter((p) => p.category === "How-To").length} how-tos`,
          ],
        ].map(([emoji, text]) => (
          <div key={text} className={styles.trustItem}>
            <span className={styles.trustEmoji}>{emoji}</span>
            <span className={styles.trustText}>{text}</span>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div className={styles.filterBar}>
        <div className={styles.catTabs}>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              className={`${styles.catTab} ${activeCategory === c.name ? styles.catTabActive : ""}`}
              onClick={() => setActiveCategory(c.name)}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
        {(search || activeCategory !== "All") && (
          <p className={styles.resultCount}>
            {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            {search ? ` matching "${search}"` : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>
        )}
      </div>

      {/* Featured posts */}
      {featured.length > 0 && !search && (
        <div className={styles.section}>
          <p className={styles.sectionEyebrow}>Featured</p>
          <div className={styles.featuredGrid}>
            {featured.map((post) => {
              const colors = CATEGORY_COLORS[post.category] || {};
              return (
                <div
                  key={post.id}
                  className={styles.featuredCard}
                  onClick={() => navigate(post.slug)}
                >
                  <div className={styles.featuredCardTop}>
                    <div className={styles.featuredIcon}>{post.icon}</div>
                    <div className={styles.featuredMeta}>
                      <span
                        className={styles.catBadge}
                        style={{ background: colors.bg, color: colors.color }}
                      >
                        {post.category}
                      </span>
                      <span className={styles.tagBadge}>{post.tag}</span>
                    </div>
                  </div>
                  <h2 className={styles.featuredTitle}>{post.title}</h2>
                  <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                  <div className={styles.featuredFooter}>
                    <span className={styles.readTime}>⏱ {post.readTime}</span>
                    <span className={styles.readMore}>Read article →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All articles */}
      <div className={styles.section}>
        {!search && (
          <p className={styles.sectionEyebrow}>
            {activeCategory === "All" ? "All articles" : activeCategory}
          </p>
        )}
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <p className={styles.emptyTitle}>No articles found</p>
            <p className={styles.emptySub}>
              Try a different search term or browse all categories.
            </p>
            <button
              className={styles.emptyReset}
              onClick={() => {
                setSearch("");
                setSearchInput("");
                setActiveCategory("All");
              }}
            >
              Show all articles
            </button>
          </div>
        ) : (
          <div className={styles.postGrid}>
            {(search ? filtered : regular).map((post, i) => {
              const colors = CATEGORY_COLORS[post.category] || {};
              return (
                <div
                  key={post.id}
                  className={styles.postCard}
                  style={{ animationDelay: `${i * 0.04}s` }}
                  onClick={() => navigate(post.slug)}
                >
                  <div className={styles.postCardTop}>
                    <div className={styles.postIcon}>{post.icon}</div>
                    <div className={styles.postMeta}>
                      <span
                        className={styles.catBadge}
                        style={{ background: colors.bg, color: colors.color }}
                      >
                        {post.category}
                      </span>
                      <span className={styles.tagBadge}>{post.tag}</span>
                    </div>
                  </div>
                  <h3 className={styles.postTitle}>{post.title}</h3>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postFooter}>
                    <span className={styles.readTime}>⏱ {post.readTime}</span>
                    <span className={styles.readMore}>Read →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Rather let the professionals handle it?
        </h2>
        <p className={styles.ctaText}>
          Every tip in this blog is what our vetted maids do every day. Book a
          professional clean in under 2 minutes — no contracts.
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
