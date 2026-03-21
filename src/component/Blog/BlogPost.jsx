import { useNavigate, useParams, useLocation } from "react-router-dom";
import { POSTS, CATEGORY_COLORS } from "./Blog";
import styles from "./BlogPost.module.css";
import FixedHeader from "../FixedHeader";

// ── Full article content keyed by slug ──────────────────────────────────────
const ARTICLE_CONTENT = {
  "/blog/spring-cleaning-guide": {
    intro:
      "Spring cleaning in Nigeria is not about spring — it is about the turn of the dry season, when the harmattan dust has settled and the air is clear enough to finally see what the year has left behind. This guide takes you through every room, in order, so nothing is missed.",
    sections: [
      {
        heading: "Where to start: the declutter pass",
        body: "Before you clean a single surface, do a declutter pass through every room. Take a bag for donations and a bag for bin. Anything you have not used in 12 months and don't love — out. Cleaning around clutter wastes time and hides dirt.",
      },
      {
        heading: "Bedroom",
        body: "Strip the bed completely — mattress cover, duvet cover, all pillowcases. Wash at 60°C if possible. While they're washing, vacuum the mattress (both sides), wipe down the bed frame, clean mirrors and surfaces, and vacuum behind and under the bed. Reorganise the wardrobe while you're in there.",
      },
      {
        heading: "Kitchen",
        body: "The kitchen is the most intensive room. Start with the oven (baking soda and vinegar overnight soak). Then fridge — empty, defrost if needed, wipe all shelves. Clean inside all cabinets, descale the kettle, degrease the extractor fan, scrub the sink, and mop the floor last.",
      },
      {
        heading: "Bathrooms",
        body: "Descale taps and showerheads with white vinegar. Scrub grout with a baking soda paste and old toothbrush. Deep clean the toilet — under the rim, around the base, behind the cistern. Wash the shower curtain or clean the screen. Replace the bin liner.",
      },
      {
        heading: "Living areas",
        body: "Move furniture away from walls and vacuum behind and underneath. Wipe skirting boards. Clean windows inside and out. Vacuum the sofa and cushions, flip them if possible. Dust ceiling fans, light fittings, and the tops of picture frames.",
      },
      {
        heading: "Finish with the floors",
        body: "Sweep and mop every hard floor in the house in one go, moving from the furthest room toward the exit. This way you never walk on wet floors or carry dirt into clean rooms.",
      },
    ],
    tips: [
      "Work top-to-bottom in every room — ceiling first, floor last",
      "Do laundry on day one so it is done by the time you finish cleaning",
      "Open windows throughout to let dust and fumes out",
    ],
  },

  "/blog/move-in-move-out-cleaning": {
    intro:
      "Moving is stressful enough without a cleaning disaster at either end. A move-out clean protects your deposit. A move-in clean means you know exactly what you are moving into. This guide covers both.",
    sections: [
      {
        heading: "Move-out cleaning: what landlords check",
        body: "Landlords and agents look at the oven (inside), the fridge (inside), the bathroom grout and seals, window tracks, top of kitchen cupboards, and floors. These are the areas most people forget or rush. Spend 40% of your move-out time on the kitchen.",
      },
      {
        heading: "Move-out checklist: room by room",
        body: "Bedroom: clean wardrobe inside and out, remove scuff marks from walls, vacuum carpet or mop floor. Kitchen: oven, hob, extractor, fridge, all cabinets, sink. Bathroom: toilet, shower, tiles, grout, mirrors, floor. Hallway: light switches, door frames, floor.",
      },
      {
        heading: "Move-in cleaning: why you should always do it",
        body: "You don't know how the previous occupant cleaned. Even a freshly 'cleaned' property can have bacteria in the kitchen, mould behind the bathroom tiles, and dust inside wardrobes. A move-in clean takes 2–4 hours and gives you a clean baseline — everything after that is yours.",
      },
      {
        heading: "Move-in focus areas",
        body: "Inside kitchen cupboards and drawers, bathroom seals and grout, behind the toilet, inside the oven and fridge, and the shower drain. These are the areas most cleaning companies skip during a standard clean.",
      },
    ],
    tips: [
      "Take dated photos on move-in — they are your evidence if a deposit dispute arises",
      "Book a professional clean for move-out if the property is large — it is cheaper than losing your deposit",
      "Clean the new property before you move furniture in — infinitely easier",
    ],
  },

  "/blog/kitchen-cleaning-tips": {
    intro:
      "The kitchen is the hardest room to keep genuinely clean because it gets dirty the fastest. Grease, bacteria, food debris — it accumulates faster than any other room. This guide covers every zone.",
    sections: [
      {
        heading: "The hob: clean it warm, every time",
        body: "Grease on a warm hob wipes off in 30 seconds. Grease on a cold hob after 24 hours requires scrubbing. The single most impactful kitchen habit is wiping the hob immediately after every cook while it is still slightly warm.",
      },
      {
        heading: "The oven: the overnight method",
        body: "Mix baking soda and water into a paste. Apply thickly inside the oven, avoiding the heating elements. Leave overnight. In the morning, spray with white vinegar (it will fizz). Wipe clean. This removes even heavily burnt-on grease without harsh chemicals.",
      },
      {
        heading: "The sink: bacteria hotspot",
        body: "Kitchen sinks carry more bacteria than toilet seats. Scrub the sink with washing-up liquid and a brush daily. Once a week, pour boiling water mixed with dish soap down the drain. Monthly, use a drain unblocker or baking soda and vinegar flush.",
      },
      {
        heading: "Cabinets and handles",
        body: "Cabinet handles are touched dozens of times a day and never cleaned. Wipe with a damp cloth weekly. Inside cabinets only need cleaning every 3–6 months — remove everything, wipe shelves, replace with items grouped by use.",
      },
    ],
    tips: [
      "Clean the fridge before your weekly shop — when it is empty, it is easy",
      "Descale the kettle monthly — pour out old water and let fresh water boil",
      "Keep a roll of kitchen paper near the hob for immediate spill response",
    ],
  },

  "/blog/bathroom-cleaning-tips": {
    intro:
      "Limescale, mould, and soap scum are the three problems that make bathrooms genuinely hard to clean. Each requires a different approach. Here is what works.",
    sections: [
      {
        heading: "Limescale: prevention beats treatment",
        body: "Limescale builds up from hard water minerals left on surfaces after water evaporates. The best prevention is a squeegee on tiles and shower screen after every use. For existing limescale, white vinegar is your best tool — spray, leave 30 minutes, scrub, rinse.",
      },
      {
        heading: "Mould in grout",
        body: "Mix one part bleach to two parts water in a spray bottle. Apply to grout lines, leave 10 minutes, scrub with an old toothbrush, rinse thoroughly. For prevention, ensure the bathroom is well ventilated after every shower — open the window or run the extractor fan for 20 minutes.",
      },
      {
        heading: "Soap scum on tiles",
        body: "Soap scum is a combination of soap residue and hard water minerals. A paste of baking soda and white vinegar applied to tiles and left for 5 minutes removes it effectively. Rinse with clean water and buff dry for shine.",
      },
      {
        heading: "The toilet: clean in order",
        body: "Always clean inside first (toilet brush under the rim), then the cistern, then the body, then the seat — inside and out, top and bottom. Never clean the seat first — you will transfer bacteria from the bowl.",
      },
    ],
    tips: [
      "Spray cleaner and leave it to work — do not immediately wipe",
      "Replace shower curtain liners every 3–6 months — they harbour mould that cannot be fully removed",
      "Clean bathroom weekly minimum — it is the room that deteriorates fastest",
    ],
  },

  "/blog/bedroom-cleaning-tips": {
    intro:
      "We spend a third of our lives in the bedroom. Dust mites, skin cells, and dead hair accumulate in mattresses, pillows, and carpets faster than anywhere else. A clean bedroom directly affects the quality of your sleep.",
    sections: [
      {
        heading: "The mattress",
        body: "Vacuum your mattress monthly using the upholstery attachment. Sprinkle baking soda over the entire surface, leave 30 minutes, then vacuum it up — this absorbs odours and moisture. Rotate or flip the mattress every 3 months to distribute wear.",
      },
      {
        heading: "Bedding and pillows",
        body: "Wash duvet covers and pillowcases weekly at 60°C. Wash pillows themselves every 3–6 months — most are machine washable. Replace pillows every 1–2 years. Dust mites are invisible but their waste particles trigger allergies and disturb sleep.",
      },
      {
        heading: "Wardrobe organisation",
        body: "A disorganised wardrobe makes the bedroom feel permanently cluttered even when everything else is clean. Fold by colour, hang by type, and do a declutter pass every 6 months. Remove clothes that don't fit or haven't been worn in a year.",
      },
      {
        heading: "Dust surfaces in order",
        body: "Start from the top — wardrobe tops, shelves, ceiling fan. Work down to bedside tables and dressing table. Finish with the floor. Dusting in reverse means any falling particles land on surfaces you have not yet cleaned.",
      },
    ],
    tips: [
      "Open windows daily — airflow reduces humidity and the dust mite population",
      "Use mattress and pillow protectors — they are easier to wash than the items themselves",
      "Keep the floor clear of items — they trap dust and complicate vacuuming",
    ],
  },

  "/blog/living-room-cleaning-tips": {
    intro:
      "The living room sees the most footfall and the most varied mess — food, drinks, dust, pet hair, and general clutter. A good weekly routine keeps it under control without it ever feeling like a big job.",
    sections: [
      {
        heading: "Sofa and upholstered furniture",
        body: "Vacuum the sofa using the upholstery attachment weekly — including under and between cushions. For fabric stains, blot (never rub) with washing-up liquid diluted in cold water. For odours, sprinkle baking soda, leave 20 minutes, vacuum up.",
      },
      {
        heading: "Dusting shelves and surfaces",
        body: "The mistake most people make with dusting is using a dry cloth, which spreads dust rather than removing it. Use a slightly damp microfibre cloth and work top to bottom. Dust ceiling fan blades with a pillowcase slipped over each blade — the dust falls inside, not onto the floor.",
      },
      {
        heading: "Floors: vacuum then mop",
        body: "For hard floors, vacuum before mopping — mopping dry dust just smears it. Vacuum slowly (twice as slow as feels right) for best results. Mop with a diluted floor cleaner, and always move from the furthest point of the room to the door.",
      },
      {
        heading: "Electronics and screens",
        body: "Wipe TV screens and monitors with a dry or slightly damp microfibre cloth only — no cleaning spray. Remote controls and light switches should be wiped with an antibacterial wipe weekly — they are the most touched surfaces in the home.",
      },
    ],
    tips: [
      "Tidy before you clean — cleaning around clutter is slow and ineffective",
      "Use a lint roller on lampshades to remove dust quickly",
      "Clean windows from top to bottom in one stroke to avoid streaks",
    ],
  },

  "/blog/kids-room-cleaning-tips": {
    intro:
      "Children's rooms combine the challenges of bedrooms (dust mites, bedding) with toys, arts and crafts residue, and the need for child-safe products. Here is how to keep it clean without exposing children to harsh chemicals.",
    sections: [
      {
        heading: "Child-safe cleaning products",
        body: "White vinegar and water (50/50) is a safe, effective all-purpose spray for surfaces. Baking soda works for deodorising carpets and mattresses. Avoid bleach-based products in children's rooms — the fumes linger in soft furnishings. If commercial products are needed, look for fragrance-free and plant-based formulas.",
      },
      {
        heading: "Toy sanitisation",
        body: "Hard plastic toys can be wiped with a diluted white vinegar solution or antibacterial wipe. Soft toys should be machine washed monthly at 40–60°C if the label allows. For toys that cannot be washed, place them in a sealed bag in the freezer overnight — this kills dust mites effectively.",
      },
      {
        heading: "Mattress and bedding",
        body: "Children's mattresses need more frequent attention — vacuum weekly, deodorise with baking soda monthly, and use a waterproof mattress protector. Wash all bedding at 60°C weekly. Soft toys on the bed double the dust mite population in the sleeping zone.",
      },
      {
        heading: "Floor management",
        body: "In children's rooms, floors are both play surfaces and sleep environments. Vacuum daily if possible — or at minimum every 2 days. Avoid leaving damp items (clothes, towels) on the floor, which encourages mould growth.",
      },
    ],
    tips: [
      "Involve older children in tidying — it teaches habits they keep for life",
      "Label toy storage clearly with pictures for pre-readers",
      "Store craft supplies in sealed containers to prevent dust and drying out",
    ],
  },

  "/blog/office-cleaning-guide": {
    intro:
      "An office or home workspace carries hidden hygiene risks — keyboards harbour more bacteria than toilet seats, and shared spaces are vectors for illness. A consistent cleaning routine improves both hygiene and productivity.",
    sections: [
      {
        heading: "Daily: the 5-minute desk reset",
        body: "Clear the desk surface, wipe it down with an antibacterial wipe or damp cloth, empty the bin, and return items to their designated places. A clean desk at the end of each day means a productive start the next morning.",
      },
      {
        heading: "Weekly: keyboards, screens, and phones",
        body: "Turn the keyboard upside down and gently tap to dislodge debris. Use compressed air in the keys. Wipe keys with an antibacterial wipe. Clean the monitor with a dry microfibre cloth. Wipe phone handsets and headsets with an antibacterial wipe — they are the most bacteria-laden items on any desk.",
      },
      {
        heading: "Kitchen and shared areas",
        body: "Office kitchens deteriorate faster than any other area. Wipe the microwave interior weekly, the fridge exterior and door handles daily, and empty and clean the fridge monthly. Coffee machines and kettles should be descaled every 4–6 weeks.",
      },
      {
        heading: "Monthly: deep desk and storage clean",
        body: "Once a month, clear everything from the desk and drawers. Wipe all surfaces, clean under the monitor, sort through paper, and reorganise cable management. This prevents the gradual accumulation of clutter that silently reduces focus.",
      },
    ],
    tips: [
      "Keep antibacterial wipes in the top desk drawer for immediate use",
      "Eat away from your workstation — food crumbs in keyboards cause long-term damage",
      "Clean air in an office boosts concentration — open windows daily where possible",
    ],
  },

  "/blog/laundry-room-cleaning-tips": {
    intro:
      "Most people clean their laundry room never. The washing machine accumulates mould in the door seal, the detergent drawer fills with residue, and the drain filter gets blocked. Here is the full maintenance routine.",
    sections: [
      {
        heading: "Washing machine: monthly maintenance wash",
        body: "Run an empty hot wash (90°C) with a cup of white vinegar in the drum and baking soda in the detergent drawer. This kills bacteria, removes detergent build-up, and eliminates odours. Do this monthly without fail.",
      },
      {
        heading: "Door seal mould",
        body: "The rubber door seal is the most common mould site in a washing machine. Wipe it dry after every wash. For existing mould, apply a diluted bleach solution (1:10) with an old toothbrush, leave 10 minutes, wipe clean, rinse thoroughly.",
      },
      {
        heading: "Detergent drawer",
        body: "Remove the drawer completely (most pull straight out). Soak in warm soapy water, scrub with a brush, rinse, and replace. The interior of the drawer housing also needs cleaning — use a damp cloth or old toothbrush.",
      },
      {
        heading: "Filter cleaning",
        body: "Front-loading machines have a filter (usually behind a small panel at the bottom front). Clean it every 3 months. Place a towel beneath it before opening — it will release trapped water. Remove lint, debris, and anything else blocking it.",
      },
    ],
    tips: [
      "Leave the washing machine door slightly ajar between washes — airflow prevents mould",
      "Use the correct detergent amount — excess detergent is the main cause of drum odour",
      "Clean the top and sides of the machine with an all-purpose spray monthly",
    ],
  },

  "/blog/how-to-save-time-cleaning": {
    intro:
      "Most people spend far more time cleaning than they need to — because they use inefficient techniques, the wrong tools, and reactive rather than preventive approaches. These five strategies will cut your cleaning time significantly.",
    sections: [
      {
        heading: "Strategy 1: clean before it gets dirty",
        body: "Preventive micro-cleans take 2 minutes and eliminate 20-minute reactive cleans. Wipe the hob after every cook, squeegee the shower screen every morning, wipe kitchen surfaces before bed. These micro-habits prevent dirt from hardening and accumulating.",
      },
      {
        heading: "Strategy 2: use the right tools",
        body: "A good microfibre cloth outperforms paper towels, sponges, and cheap cloths in every way. A decent vacuum cleaner halves vacuuming time versus a weak one. A squeegee takes 20 seconds after a shower. The right tools are a one-time investment that pays back every week.",
      },
      {
        heading: "Strategy 3: clean top to bottom, room by room",
        body: "Always work from the highest surfaces down to the floor, and from the furthest room toward the exit. This means you never clean an area twice and never carry dirt into clean zones. Most people violate this instinctively — it costs significant time.",
      },
      {
        heading: "Strategy 4: outsource the deep cleans",
        body: "A monthly or quarterly professional deep clean costs less than the time most people spend doing it themselves — especially when you factor in doing it properly. Between professional cleans, your maintenance cleaning is faster and more effective because you are starting from a clean base.",
      },
      {
        heading: "Strategy 5: the one-touch rule",
        body: "Every item in your home should have a designated place. When you finish using something, put it back in one touch — rather than leaving it somewhere temporary. Tidying before cleaning is the most time-consuming part of cleaning for most people.",
      },
    ],
    tips: [
      "Set a timer — cleaning to a time limit prevents both under-cleaning and over-cleaning",
      "Clean with music or a podcast — it turns a chore into something tolerable",
      "Batch similar tasks — wipe all mirrors in the house in one go, rather than completing each room individually",
    ],
  },

  "/blog/weekly-cleaning-schedule-graphic": {
    intro:
      "A visual 7-day cleaning schedule that assigns each room a day — so no single session ever feels overwhelming. Estimated time per session: 20–40 minutes.",
    sections: [
      {
        heading: "Monday — Kitchen deep wipe",
        body: "Hob, counters, sink, microwave interior, cabinet handles. This is the most important day — the kitchen deteriorates fastest.",
      },
      {
        heading: "Tuesday — Bathrooms",
        body: "Toilet, sink, shower, mirrors, floor. Do all bathrooms in one session while your cleaning products are out.",
      },
      {
        heading: "Wednesday — Bedrooms",
        body: "Dust surfaces, vacuum floors, straighten the wardrobe, wipe bedside tables. Change bedding if it is bedding day.",
      },
      {
        heading: "Thursday — Living room",
        body: "Vacuum sofa and floors, wipe surfaces, clean glass and screens, empty bins.",
      },
      {
        heading: "Friday — Floors throughout",
        body: "Sweep and mop every hard floor in the home in one pass. Vacuum all carpets. Takes 20–30 minutes for an average home.",
      },
      {
        heading: "Saturday — Outdoor and laundry",
        body: "Balcony sweep, outdoor furniture wipe, compound. Plus laundry catch-up if needed.",
      },
      {
        heading: "Sunday — Rest or flex day",
        body: "Use this day to address anything missed during the week, or rest. A sustainable schedule must include recovery time.",
      },
    ],
    tips: [
      "Pin the schedule somewhere visible — the fridge, a whiteboard, or as a phone wallpaper",
      "Adjust days based on your actual lifestyle — the schedule serves you, not the other way around",
      "Allow 10 minutes of flex in each session for unexpected tasks",
    ],
  },

  "/blog/cleaning-frequency-chart": {
    intro:
      "Not every task needs doing every day. This frequency chart shows you exactly how often each cleaning task in your home needs to happen — and why.",
    sections: [
      {
        heading: "Daily tasks",
        body: "Wipe kitchen surfaces and hob. Wash dishes or load dishwasher. Wipe bathroom sink. Tidy living areas. Sweep kitchen floor. These take 10–15 minutes total.",
      },
      {
        heading: "Weekly tasks",
        body: "Full kitchen clean (oven exterior, fridge wipe, cabinets). Full bathroom clean. Vacuum all rooms. Mop hard floors. Change bed linen. Clean mirrors and glass surfaces.",
      },
      {
        heading: "Monthly tasks",
        body: "Inside fridge deep clean. Washing machine maintenance wash. Window cleaning inside. Dust blinds and curtains. Clean oven interior. Wipe inside kitchen cabinets.",
      },
      {
        heading: "Quarterly tasks",
        body: "Deep clean behind appliances. Clean curtains or blinds by washing. Mattress flip or rotate. Clean washing machine filter. Descale appliances.",
      },
      {
        heading: "Annual tasks",
        body: "Deep clean oven and extractor fan thoroughly. Clean gutters and outdoor drainage. Replace mattress protectors. Full wardrobe declutter and reorganise. Spring or dry-season full home reset.",
      },
    ],
    tips: [
      "Put the frequency chart on your fridge as a reference",
      "Delegate tasks by frequency — daily to everyone, weekly to the primary cleaner, monthly and quarterly on a calendar reminder",
    ],
  },

  "/blog/kitchen-cleaning-zones-graphic": {
    intro:
      "Breaking the kitchen into zones makes cleaning faster and more thorough. Here is how the kitchen breaks down and what each zone needs.",
    sections: [
      {
        heading: "Zone 1: Cooking zone (hob and oven)",
        body: "Highest grease accumulation. Clean the hob after every use (warm). Clean the oven monthly with the overnight baking soda method. Clean the extractor fan and filters monthly.",
      },
      {
        heading: "Zone 2: Prep zone (countertops and sink)",
        body: "Wipe counters after every meal prep. Scrub the sink daily with dish soap. Descale taps weekly with white vinegar spray.",
      },
      {
        heading: "Zone 3: Refrigeration zone (fridge and freezer)",
        body: "Wipe the exterior daily. Clean the interior monthly — remove everything, wipe shelves, discard expired items. Defrost the freezer when ice exceeds 1cm thickness.",
      },
      {
        heading: "Zone 4: Storage zone (cabinets and drawers)",
        body: "Wipe cabinet doors and handles weekly — they accumulate grease from cooking hands. Clean inside every 3 months.",
      },
      {
        heading: "Zone 5: Floor zone",
        body: "Sweep daily. Mop with floor cleaner 2–3 times per week. The kitchen floor carries the most bacterial load of any floor in the home.",
      },
    ],
    tips: [
      "Start with Zone 1 (cooking) and work outward",
      "The zones prioritise by dirtiness — apply this logic when you have limited time",
    ],
  },

  "/blog/bathroom-checklist-poster": {
    intro:
      "A room-by-room bathroom cleaning poster showing every task organised by frequency — ready to print and put on the back of the bathroom door.",
    sections: [
      {
        heading: "Daily (2 minutes)",
        body: "Wipe sink after use. Squeegee shower screen. Hang towels to dry. Replace toilet roll if needed. Spray toilet with cleaner and leave.",
      },
      {
        heading: "Weekly (15–20 minutes)",
        body: "Scrub toilet inside and out. Clean shower/bath including taps and showerhead. Scrub sink and wipe vanity. Mop floor. Clean mirrors. Replace bin liner.",
      },
      {
        heading: "Monthly (30–45 minutes)",
        body: "Descale taps, showerhead, and any chrome fixtures. Scrub grout with baking soda paste. Clean behind the toilet. Wash bath mat and shower curtain if applicable.",
      },
      {
        heading: "Quarterly",
        body: "Deep clean seals and caulking. Check for mould behind fixtures. Clean ventilation fan. Wash or replace shower curtain liner.",
      },
    ],
    tips: [
      "Keep the cleaner under the sink and the brush behind the toilet so there is no excuse not to clean it",
      "A 2-minute daily routine prevents 20-minute weekly sessions",
    ],
  },

  "/blog/diy-vs-professional-cleaning-graphic": {
    intro:
      "How long does it actually take to clean your own home versus having a professional do it? And what is your time worth? This comparison makes the case clearly.",
    sections: [
      {
        heading: "Time comparison: 3-bedroom home",
        body: "DIY thorough clean: 4–6 hours. Professional deep clean: 4–5 hours with 2 maids = 2–2.5 hours elapsed time. The professional clean is done twice as fast and to a higher standard.",
      },
      {
        heading: "Quality comparison",
        body: "Professional maids follow a checklist, use correct products for each surface, and have experience cleaning hundreds of homes. Most DIY cleans miss grout, extractor fans, oven interiors, behind appliances, and door frames.",
      },
      {
        heading: "Cost comparison",
        body: "A professional deep clean of a 3-bedroom home costs from ₦18,000. At a reasonable hourly value of ₦5,000/hour, a 6-hour DIY clean costs ₦30,000 in time — before accounting for cleaning products and physical effort.",
      },
      {
        heading: "When DIY makes sense",
        body: "Daily and weekly maintenance cleans are better done by you — they take 15–30 minutes and build good habits. Monthly deep cleans and seasonal resets are where professional cleaning offers the strongest value for money and time.",
      },
    ],
    tips: [
      "Use a professional for deep cleans, do maintenance yourself — this is the optimal split",
      "Book a professional clean quarterly and maintain daily habits in between",
    ],
  },

  "/blog/spring-cleaning-room-order-graphic": {
    intro:
      "The order in which you clean rooms matters more than most people realise. Moving dust and debris from one room into another you have already cleaned is the most common spring cleaning mistake.",
    sections: [
      {
        heading: "Step 1: Declutter all rooms first",
        body: "Before any cleaning begins, do a single pass through the entire home removing items that are leaving (donations, rubbish). A decluttered home is significantly faster to clean.",
      },
      {
        heading: "Step 2: Bedrooms (furthest first)",
        body: "Start with the bedroom furthest from the front door. Work inward. This way any dust dislodged in bedrooms does not travel into rooms you have already cleaned.",
      },
      {
        heading: "Step 3: Bathrooms",
        body: "Bathrooms are self-contained — clean them after bedrooms but before communal areas. The products used (bleach, descaler) need ventilation time.",
      },
      {
        heading: "Step 4: Kitchen",
        body: "The kitchen is the most intensive room. Clean it when you have maximum energy — not at the end of the day. Oven, fridge, and extractor fan are the priority tasks.",
      },
      {
        heading: "Step 5: Living areas",
        body: "Communal living and dining areas accumulate dust from foot traffic. Clean these after enclosed rooms so they benefit from the reduced dust load.",
      },
      {
        heading: "Step 6: Hallways and floors throughout",
        body: "Finish with a sweep and mop of every hallway and hard floor in order, ending at the front door. This is the final task — never mop yourself into a corner.",
      },
    ],
    tips: [
      "Allow a full day for a spring clean of a 3-bedroom home",
      "Do one room completely before moving to the next — partial cleaning across all rooms is less satisfying and less effective",
    ],
  },

  "/blog/cleaning-tips-general": {
    intro:
      "General cleaning tips that apply to every room — the fundamentals that experienced cleaners follow and most people have never been taught.",
    sections: [
      {
        heading: "Always work top to bottom",
        body: "Dust and debris fall downward. If you mop the floor first and then dust the shelves, you are cleaning the floor twice. Always start at the top of the room — ceiling, fan, shelves, then surfaces, then floor.",
      },
      {
        heading: "Spray and leave — don't spray and wipe immediately",
        body: "Cleaning products need dwell time to work. Spray your bathroom, kitchen surfaces, or toilet and let the product sit for 30–60 seconds before wiping. You will use less effort and get a better result.",
      },
      {
        heading: "Microfibre is not optional",
        body: "Microfibre cloths clean 99% of surfaces better than paper towels, sponges, or cotton cloths. They trap particles rather than pushing them around. Buy a set of 10, wash them weekly, and use them for everything.",
      },
      {
        heading: "Empty the bin before it overflows",
        body: "Overfilled bins cause spills, attract insects, and make rooms smell. Empty all bins when they reach two-thirds full — not when they overflow.",
      },
    ],
    tips: [
      "Declutter before you clean — always",
      "One cleaning product that works is better than ten that do not",
      "Consistency beats intensity — clean a little often rather than a lot rarely",
    ],
  },

  "/blog/natural-cleaning-products": {
    intro:
      "Six products handle almost every cleaning job in your home. They are cheaper than commercial cleaners, safer for children and pets, and easier to find anywhere in Nigeria.",
    sections: [
      {
        heading: "1. White vinegar",
        body: "The most versatile natural cleaner. Cuts through limescale, grease, and bacteria. Use as a diluted spray (50/50 with water) for surfaces, or neat for descaling. Do not use on natural stone (marble, granite) — the acid can etch the surface.",
      },
      {
        heading: "2. Baking soda",
        body: "Abrasive enough to scrub without scratching, and alkaline enough to neutralise acids and odours. Mixed with water into a paste it tackles grout, oven grime, and sink staining. Sprinkled on carpets and mattresses it absorbs odours. Poured down drains it prevents blockages.",
      },
      {
        heading: "3. Lemon juice",
        body: "Natural bleach and degreaser. Excellent for cutting through kitchen grease, brightening white surfaces, and deodorising. Half a lemon cleans a chopping board in 60 seconds. Lemon and salt together clean copper, brass, and chrome effectively.",
      },
      {
        heading: "4. Dish soap",
        body: "Cuts grease better than most dedicated degreasers because it was designed for exactly that. A drop in a bucket of warm water cleans hard floors, tiles, and most surfaces. Apply neat to oil stains on fabric before washing.",
      },
      {
        heading: "5. Salt",
        body: "An abrasive that does not scratch. Combined with lemon juice it cleans copper and brass. Combined with white vinegar it scrubs sink stains. Poured into a drain it prevents odour from building up.",
      },
      {
        heading: "6. Hydrogen peroxide (3%)",
        body: "Available from pharmacies. Kills bacteria and mould on contact. Spray on grout, leave 10 minutes, scrub and rinse. Excellent for bathroom mould without the harshness of bleach. Store in a dark bottle — light degrades it.",
      },
    ],
    tips: [
      "Never mix vinegar and baking soda as a cleaning solution — the reaction neutralises both",
      "White vinegar smell disappears completely when dry",
      "These six products cost a fraction of the equivalent commercial cleaners",
    ],
  },

  "/blog/cleaning-habits": {
    intro:
      "The difference between homes that are always clean and homes that are always messy is not effort — it is habits. Ten small daily actions that collectively eliminate hours of reactive cleaning.",
    sections: [
      {
        heading: "1. Wipe the hob while it is warm",
        body: "30-second wipe after cooking prevents 30-minute scrubbing sessions. Do this every single time without exception.",
      },
      {
        heading: "2. Squeegee the shower screen after every shower",
        body: "20 seconds. Prevents limescale and soap scum from ever accumulating. Eliminates monthly shower cleaning sessions.",
      },
      {
        heading: "3. The 2-minute rule",
        body: "If a cleaning task takes less than 2 minutes, do it now. Wipe the splatter you just made. Pick up the item that fell. Return the object to its place. These micro-tasks prevent large pile-ups.",
      },
      {
        heading: "4. Empty the sink before bed",
        body: "Waking to a clear sink changes the energy of the morning and prevents bacteria from multiplying overnight in food residue.",
      },
      {
        heading: "5. Make the bed every morning",
        body: "Takes 90 seconds. Makes the bedroom feel 80% cleaner. Establishes a morning discipline that carries into other areas.",
      },
      {
        heading: "6. One in, one out",
        body: "For every new item brought into the home, one existing item leaves. Prevents the gradual accumulation of clutter that makes cleaning slower and harder.",
      },
      {
        heading: "7. Clean the toilet weekly without exception",
        body: "Weekly toilet cleaning takes 3 minutes. Monthly toilet cleaning takes 20 minutes because scale and staining have set in.",
      },
      {
        heading: "8. Put cleaning products back immediately after use",
        body: "Products stored correctly and accessibly get used more often. The barrier to cleaning is lowest when nothing needs to be retrieved first.",
      },
    ],
    tips: [
      "Habits take 21–66 days to form — start with one habit and add another after two weeks",
      "Attach cleaning habits to existing routines — clean the sink while the kettle boils",
      "The goal is not a perfect home — it is a home that never becomes overwhelming",
    ],
  },

  "/blog/mould-prevention-tips": {
    intro:
      "Mould grows wherever humidity meets organic material and poor airflow. Nigeria's climate makes this a year-round challenge, particularly in bathrooms, kitchens, and behind furniture against external walls.",
    sections: [
      {
        heading: "Why mould grows in Nigerian homes",
        body: "Harmattan brings dry air, but rainy season and year-round cooking and bathing create significant indoor humidity. Poor ventilation in many Nigerian building designs traps moist air, creating ideal mould conditions.",
      },
      {
        heading: "Prevention: ventilation is everything",
        body: "Open bathroom windows or run extractor fans for 20 minutes after every shower. Open kitchen windows while cooking. Move furniture 5cm away from external walls to allow air circulation behind them. This single change prevents 80% of household mould.",
      },
      {
        heading: "Treating existing mould",
        body: "Mix 1 part bleach to 10 parts water. Apply to mould with a spray bottle. Leave 10 minutes. Scrub with a stiff brush. Rinse with clean water. For grout mould, use an old toothbrush. Always wear gloves and ensure ventilation while using bleach.",
      },
      {
        heading: "Natural mould treatment",
        body: "White vinegar kills around 82% of mould species. Spray undiluted white vinegar on the affected area, leave 1 hour, scrub, and wipe clean. Less effective than bleach on severe mould but safer to use regularly as a preventive spray.",
      },
    ],
    tips: [
      "Never paint over mould — it always returns through paint within weeks",
      "A dehumidifier in the bedroom reduces dust mites as well as mould risk",
      "Check behind wardrobes and the back of bathroom cabinets — mould there is invisible until serious",
    ],
  },

  "/blog/pet-home-cleaning-tips": {
    intro:
      "Homes with pets carry unique cleaning challenges — hair that gets everywhere, dander that triggers allergies, odours in fabric, and the occasional accident. These tips address all of them.",
    sections: [
      {
        heading: "Pet hair: the rubber glove trick",
        body: "Dampen a rubber household glove and run your hand along upholstered surfaces. Pet hair clumps and lifts immediately — far faster than a lint roller for large areas. For hard floors, a rubber broom or electrostatic mop outperforms a standard broom.",
      },
      {
        heading: "Odour management",
        body: "Pet odour in fabric responds well to baking soda. Sprinkle liberally, leave 20–30 minutes, vacuum thoroughly. For persistent odour in carpets, use an enzyme-based cleaner — these break down the organic compounds in pet waste and dander that cause odour.",
      },
      {
        heading: "Accidents on carpet",
        body: "Blot immediately with paper towels — press, do not rub. Apply cold water and blot again. Apply an enzyme cleaner (or a mix of dish soap and hydrogen peroxide), leave 10 minutes, blot again. Never use hot water — it sets the stain and odour permanently.",
      },
      {
        heading: "High-frequency cleaning zones",
        body: "Pet sleeping areas, the area around food and water bowls, and any furniture the pet uses should be cleaned twice as frequently as standard. These zones carry disproportionate bacteria, dander, and hair loads.",
      },
    ],
    tips: [
      "Groom pets outside regularly — it dramatically reduces hair indoors",
      "HEPA vacuum filters capture dander that standard filters allow back into the air",
      "Wash pet bedding weekly at 60°C",
    ],
  },

  "/blog/spring-cleaning-checklist": {
    intro:
      "The complete spring cleaning checklist — every task, every room, in the optimal order. Print it, work through it, and tick everything off.",
    sections: [
      {
        heading: "Before you start",
        body: "Declutter all rooms. One bag per room: donations, rubbish. Order cleaning products you need. Set aside a full day for a 3-bedroom home, a half day for a 1-bedroom.",
      },
      {
        heading: "Bedrooms (all)",
        body: "Strip and wash all bedding at 60°C. Vacuum mattress both sides. Wipe bed frame. Clean wardrobe inside and out. Dust all surfaces top to bottom. Clean mirrors. Vacuum under and behind furniture. Vacuum floor.",
      },
      {
        heading: "Kitchen",
        body: "Oven deep clean (overnight method). Fridge empty, wipe all shelves, discard expired items. Descale kettle, toaster clean-out, microwave steam clean. Degrease extractor fan and filter. Wipe all cabinet fronts and handles. Scrub sink and descale taps. Mop floor.",
      },
      {
        heading: "Bathrooms (all)",
        body: "Descale taps, showerhead, and chrome. Scrub grout. Deep clean toilet. Clean shower/bath entirely. Wash bath mat and shower curtain. Clean mirrors and vanity inside. Replace bin liner. Mop floor.",
      },
      {
        heading: "Living areas",
        body: "Move furniture and vacuum/clean behind. Dust ceiling fans. Clean windows inside. Vacuum sofa and cushions. Wipe all surfaces. Mop/vacuum floors.",
      },
      {
        heading: "Hallways and outdoor",
        body: "Wipe light switches throughout. Clean front door inside and out. Sweep and mop all hallways. Clean balcony or compound. Clear drains.",
      },
    ],
    tips: [
      "Tick each item as you go — the psychological momentum helps",
      "Do laundry first — it runs while you clean",
      "This checklist takes one full day — do not rush it",
    ],
  },

  "/blog/move-out-cleaning-checklist": {
    intro:
      "The exact checklist that landlords and letting agents use at move-out inspection. Work through this before they arrive and your deposit is protected.",
    sections: [
      {
        heading: "Kitchen",
        body: "Oven: interior clean including racks, door glass, and seals. Hob: degrease all burners and surfaces. Extractor: degrease fan and replace or clean filter. Fridge: empty, defrost if needed, wipe all interior surfaces. Cabinets: wipe inside and outside including hinges. Sink: descale and clean thoroughly. Floor: sweep and mop.",
      },
      {
        heading: "Bathrooms",
        body: "Toilet: inside bowl, under rim, cistern, body, seat (both sides). Shower: tiles, grout, screen, tray, showerhead (descaled). Sink and taps: descaled and clean. Floor: mopped and clean including corners. Extractor fan: clean or replace if broken.",
      },
      {
        heading: "Bedrooms",
        body: "Wardrobe: inside, shelves, and rail — wiped clean. Walls: remove all wall fittings and fill holes (check tenancy agreement). Carpets: vacuumed thoroughly or professionally cleaned if required. Windows: inside clean. Marks on walls: clean or report in writing.",
      },
      {
        heading: "Living areas and hallways",
        body: "All surfaces wiped. Floors vacuumed or mopped. Windows clean inside. Light switches and plug sockets wiped. Front door and letterbox clean.",
      },
    ],
    tips: [
      "Document everything with dated photos after cleaning — before you hand over keys",
      "Professional cleaning services provide a receipt — useful if a deposit dispute arises",
      "Return the property in the condition of the move-in inventory — use it as your checklist",
    ],
  },

  "/blog/daily-cleaning-checklist": {
    intro:
      "A realistic 15-minute daily routine that keeps the home in genuinely good order without ever feeling like a burden.",
    sections: [
      {
        heading: "Morning (5 minutes)",
        body: "Make the bed (90 seconds). Wipe the bathroom sink after use (30 seconds). Hang towels to dry. Open windows in at least two rooms.",
      },
      {
        heading: "After meals (5 minutes)",
        body: "Wipe kitchen surfaces and hob. Wash or stack dishes. Wipe the dining table. Sweep or spot-clean the kitchen floor if needed.",
      },
      {
        heading: "Evening (5 minutes)",
        body: "Tidy living areas — return all items to their places. Empty bins if needed. Wipe the bathroom sink. Check the kitchen surfaces are clear. Load the dishwasher or wash final dishes.",
      },
      {
        heading: "Weekly additions (varies by day)",
        body: "Monday: kitchen deep wipe. Tuesday: bathrooms. Wednesday: bedrooms. Thursday: living room. Friday: floor throughout. See the weekly schedule guide for the full breakdown.",
      },
    ],
    tips: [
      "The 15 minutes only works if you do not let tasks accumulate — consistency is the method",
      "Put cleaning into your phone calendar as recurring events until they become automatic",
      "The daily routine prevents Sunday cleaning marathons",
    ],
  },

  "/blog/kitchen-cleaning-checklist": {
    intro:
      "Every kitchen cleaning task, organised by how often it needs to happen. Use this as your reference and you will never have a kitchen that feels out of control.",
    sections: [
      {
        heading: "After every cook",
        body: "Wipe hob surface while warm. Wipe counters after food prep. Wash or stack dishes immediately. Wipe splashes from surfaces and tiles.",
      },
      {
        heading: "Daily",
        body: "Clean sink with dish soap and brush. Wipe down exterior surfaces. Empty food bins. Sweep floor.",
      },
      {
        heading: "Weekly",
        body: "Clean microwave interior (steam method). Wipe cabinet doors and handles. Clean fridge exterior and handle. Mop floor thoroughly. Clean outside of oven. Wipe inside dishwasher door and seals.",
      },
      {
        heading: "Monthly",
        body: "Deep clean fridge interior (empty and wipe all shelves). Clean oven interior with overnight method. Degrease extractor fan and clean or replace filter. Clean inside all cabinets. Descale kettle. Clean inside dishwasher with specialist tablet.",
      },
      {
        heading: "Quarterly / annually",
        body: "Clean behind the fridge and oven. Descale all taps. Deep degrease extractor ductwork if accessible. Reorganise and declutter all cupboards and the pantry.",
      },
    ],
    tips: [
      "The kitchen is the most important room — its cleanliness affects food safety directly",
      "A dirty oven adds a smoke smell to everything you cook",
      "If you only deep-clean one room monthly, make it the kitchen",
    ],
  },

  "/blog/how-to-clean-oven": {
    intro:
      "The overnight baking soda method cleans even heavily soiled ovens without harsh chemicals, scrubbing marathons, or expensive oven cleaners. Here is the step-by-step.",
    sections: [
      {
        heading: "What you need",
        body: "Baking soda, white vinegar in a spray bottle, washing-up liquid, rubber gloves, damp microfibre cloth, and an old sponge or scrubber. That is all.",
      },
      {
        heading: "Step 1: Remove the racks",
        body: "Take the oven racks out and soak them in hot soapy water in the sink or bathtub overnight. In the morning they scrub clean easily.",
      },
      {
        heading: "Step 2: Apply the baking soda paste",
        body: "Mix baking soda with enough water to make a thick paste. Coat the entire interior of the oven — walls, base, and door glass. Avoid the heating elements. The paste will turn brown as it absorbs grease. Leave for at least 12 hours (overnight is ideal).",
      },
      {
        heading: "Step 3: Wipe and spray",
        body: "In the morning, use a damp cloth to remove as much of the paste as possible. Then spray the interior with white vinegar. It will fizz — this is normal and loosens remaining paste and grease.",
      },
      {
        heading: "Step 4: Final wipe",
        body: "Wipe clean with a damp cloth, rinsing frequently. For stubborn spots, use a non-scratch scrubber. Wipe the door glass last — it shows the most obvious result.",
      },
    ],
    tips: [
      "Do this on a Thursday or Friday evening so the soak happens overnight and you clean Friday morning",
      "Clean the oven monthly if you cook frequently — quarterly if you use it rarely",
      "Never use foil on the oven floor — it traps heat and damages the oven interior",
    ],
  },

  "/blog/how-to-clean-grout": {
    intro:
      "Discoloured grout makes an entire bathroom look dirty even when everything else is clean. Here is the method that restores it without replacement.",
    sections: [
      {
        heading: "The baking soda method (mild discolouration)",
        body: "Mix baking soda with a small amount of water or dish soap to form a paste. Apply to grout lines with an old toothbrush. Scrub in circular motions. Rinse with warm water. For light staining this produces visible results immediately.",
      },
      {
        heading: "The bleach method (heavy mould and staining)",
        body: "Mix 1 part bleach to 2 parts water in a spray bottle. Spray directly onto grout lines. Leave 10 minutes. Scrub with a stiff grout brush or toothbrush. Rinse thoroughly. Ventilate the room fully while using bleach.",
      },
      {
        heading: "The hydrogen peroxide method (alternative to bleach)",
        body: "Apply 3% hydrogen peroxide (from the pharmacy) directly to grout. Leave 10–15 minutes. Scrub and rinse. Effective on mould and staining without bleach's harshness. Can be used more frequently.",
      },
      {
        heading: "After cleaning: sealing grout",
        body: "Once clean and dry, applying a grout sealer (available at hardware stores) prevents future staining and mould by closing the porous surface. Reseal annually for maximum protection.",
      },
    ],
    tips: [
      "Clean grout with a dedicated grout brush — a toothbrush is effective but a grout brush is faster",
      "Prevent grout discolouration by ensuring the bathroom is ventilated after every shower",
      "Once clean, a weekly wipe with diluted vinegar spray maintains colour",
    ],
  },

  "/blog/how-to-clean-mattress": {
    intro:
      "A mattress is used for 7–8 hours a night but almost never cleaned. Dust mites, dead skin, sweat, and odours accumulate inside it. This four-step process addresses all of them.",
    sections: [
      {
        heading: "Step 1: Vacuum",
        body: "Use the upholstery attachment on a vacuum cleaner. Go over the entire surface slowly, including the sides. This removes surface dust, dead skin cells, and debris that have settled into the fabric.",
      },
      {
        heading: "Step 2: Spot treat stains",
        body: "For fresh stains: blot with cold water, then apply a small amount of dish soap or hydrogen peroxide (3%), blot, and rinse. For old stains: mix baking soda and cold water into a paste, apply, leave 30 minutes, then blot clean. Never soak the mattress — deep moisture encourages mould.",
      },
      {
        heading: "Step 3: Deodorise",
        body: "Sprinkle baking soda generously over the entire mattress surface. Leave for a minimum of 30 minutes — several hours if possible. Vacuum thoroughly. The baking soda absorbs odours and surface moisture.",
      },
      {
        heading: "Step 4: Protect",
        body: "Use a mattress protector over the clean mattress. It is machine washable and significantly extends the time between mattress cleans. Wash the protector monthly.",
      },
    ],
    tips: [
      "Clean your mattress every 6 months — both sides if it is flippable",
      "Open bedroom windows after cleaning to dry the mattress surface fully before replacing bedding",
      "Dust mites are the leading cause of indoor allergies — regular mattress cleaning directly reduces symptoms",
    ],
  },

  "/blog/how-to-clean-washing-machine": {
    intro:
      "Most washing machines are dirtier than the clothes they wash. A monthly routine keeps them performing well and smelling clean.",
    sections: [
      {
        heading: "Step 1: Clean the door seal",
        body: "Pull back the rubber door seal and inspect for mould and debris. Wipe inside the fold with a cloth dipped in a diluted bleach solution (1:10). Use a toothbrush for stubborn mould. Leave the door open after cleaning to air dry.",
      },
      {
        heading: "Step 2: Clean the detergent drawer",
        body: "Remove the drawer completely (most slide or press to release). Soak in warm soapy water for 20 minutes. Scrub with a brush. Clean the housing behind the drawer slot with a damp cloth or toothbrush. Replace and ensure it clicks into position.",
      },
      {
        heading: "Step 3: Run a maintenance wash",
        body: "Add one cup of white vinegar to the drum and half a cup of baking soda to the detergent drawer. Run a hot empty cycle (90°C if available). This kills bacteria, removes detergent build-up, and clears odours from the drum.",
      },
      {
        heading: "Step 4: Clean the filter",
        body: "Locate the filter access panel (front-loading machines, usually at the bottom front). Place a towel underneath before opening — water will pour out. Unscrew and remove the filter. Clear all debris, rinse under a tap, and replace securely.",
      },
    ],
    tips: [
      "Leave the door and detergent drawer ajar between washes — this prevents mould from forming",
      "Use the correct amount of detergent — excess is the primary cause of drum odour and residue",
      "Do a maintenance wash monthly — set a calendar reminder so it does not slip",
    ],
  },

  "/blog/how-to-clean-windows": {
    intro:
      "Streak-free windows are achievable every time once you know why streaks form and how to avoid them. The technique matters more than the product.",
    sections: [
      {
        heading: "Why windows streak",
        body: "Streaks form when cleaning solution dries on the glass before it can be wiped away completely. This happens fastest in direct sunlight and hot dry air — which is why cleaning windows on a bright sunny day usually produces poor results.",
      },
      {
        heading: "Best conditions for cleaning windows",
        body: "Overcast days or early morning before the sun hits the glass are ideal. The solution stays wet longer, giving you time to wipe it fully. If you must clean in bright conditions, work faster and in smaller sections.",
      },
      {
        heading: "The technique: top to bottom, single direction",
        body: "Apply your cleaning solution (diluted dish soap or commercial glass cleaner). Use a squeegee or crumpled newspaper — not paper towels. Work from the top of the glass to the bottom in a single overlapping sweep. Wipe the squeegee blade between passes. One direction, no circular motion.",
      },
      {
        heading: "The newspaper trick",
        body: "Crumpled newspaper is genuinely the best wipe material for glass — it is lint-free, slightly abrasive enough to polish, and leaves no fibres. Commercial paper towels leave lint. Microfibre cloths work well if they are clean and dry.",
      },
      {
        heading: "Window frames and tracks",
        body: "Vacuum the window tracks first. Wipe with a damp cloth. For heavy dirt in tracks, use a cotton bud or old toothbrush. Clean the frame before the glass so any drips land on glass you have not yet cleaned.",
      },
    ],
    tips: [
      "Do inside and outside the same day for the full effect",
      "Clean windows on a morning when no direct sunlight is hitting them",
      "A professional window clean annually is worthwhile for exterior glass above ground floor",
    ],
  },
};

const CATEGORY_COLORS_LOCAL = {
  Guides: { bg: "rgb(240, 240, 255)", color: "rgb(32, 32, 65)" },
  Graphics: { bg: "rgb(255, 235, 238)", color: "rgb(187, 19, 47)" },
  Tips: { bg: "rgb(220, 248, 230)", color: "rgb(20, 100, 40)" },
  Checklists: { bg: "rgb(255, 243, 205)", color: "rgb(120, 80, 0)" },
  "How-To": { bg: "rgb(220, 240, 255)", color: "rgb(20, 80, 140)" },
};

export default function BlogPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const slug = "/" + location.pathname.split("/").slice(1).join("/");

  const post = POSTS.find((p) => p.slug === slug);
  const content = ARTICLE_CONTENT[slug];

  // Related posts: same category, not this post
  const related = post
    ? POSTS.filter(
        (p) => p.category === post.category && p.id !== post.id,
      ).slice(0, 3)
    : [];

  if (!post || !content) {
    return (
      <div className={styles.page}>
        <FixedHeader />
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>🔍</div>
          <h1 className={styles.notFoundTitle}>Article not found</h1>
          <p className={styles.notFoundSub}>
            The article you are looking for does not exist or has been moved.
          </p>
          <button className={styles.backBtn} onClick={() => navigate("/blog")}>
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  const colors = CATEGORY_COLORS_LOCAL[post.category] || {};

  return (
    <div className={styles.page}>
      <FixedHeader />

      {/* Article hero */}
      <div className={styles.hero}>
        <button className={styles.backLink} onClick={() => navigate("/blog")}>
          ← Back to Blog
        </button>
        <div className={styles.heroBadges}>
          <span
            className={styles.catBadge}
            style={{ background: colors.bg, color: colors.color }}
          >
            {post.category}
          </span>
          <span className={styles.tagBadge}>{post.tag}</span>
          <span className={styles.readTime}>⏱ {post.readTime}</span>
        </div>
        <div className={styles.heroIcon}>{post.icon}</div>
        <h1 className={styles.heroTitle}>{post.title}</h1>
        <div className={styles.heroDivider} />
      </div>

      {/* Article body */}
      <article className={styles.article}>
        {/* Intro */}
        <p className={styles.intro}>{content.intro}</p>

        {/* Sections */}
        {content.sections.map((s, i) => (
          <section key={i} className={styles.section}>
            <h2 className={styles.sectionHeading}>{s.heading}</h2>
            <p className={styles.sectionBody}>{s.body}</p>
          </section>
        ))}

        {/* Tips callout */}
        {content.tips && content.tips.length > 0 && (
          <div className={styles.tipsBox}>
            <p className={styles.tipsLabel}>💡 Key takeaways</p>
            <ul className={styles.tipsList}>
              {content.tips.map((tip, i) => (
                <li key={i} className={styles.tipItem}>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Book CTA inline */}
        <div className={styles.inlineCta}>
          <div>
            <p className={styles.inlineCtaTitle}>
              Rather let the professionals handle it?
            </p>
            <p className={styles.inlineCtaText}>
              Our vetted maids follow every technique in this guide — and bring
              their own supplies.
            </p>
          </div>
          <button
            className={styles.inlineCtaBtn}
            onClick={() => navigate("/maids")}
          >
            Book a Clean →
          </button>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <div className={styles.related}>
          <p className={styles.relatedEyebrow}>More in {post.category}</p>
          <div className={styles.relatedGrid}>
            {related.map((r) => {
              const rc = CATEGORY_COLORS_LOCAL[r.category] || {};
              return (
                <div
                  key={r.id}
                  className={styles.relatedCard}
                  onClick={() => navigate(r.slug)}
                >
                  <div className={styles.relatedCardTop}>
                    <span className={styles.relatedIcon}>{r.icon}</span>
                    <span
                      className={styles.catBadge}
                      style={{ background: rc.bg, color: rc.color }}
                    >
                      {r.category}
                    </span>
                  </div>
                  <p className={styles.relatedTitle}>{r.title}</p>
                  <p className={styles.relatedExcerpt}>{r.excerpt}</p>
                  <p className={styles.relatedRead}>Read article →</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>
          Professional cleaning, booked in 2 minutes.
        </h2>
        <p className={styles.ctaText}>
          Browse vetted maids near you across Abuja and Lagos. No contracts, no
          fuss.
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
            onClick={() => navigate("/blog")}
          >
            More Articles
          </button>
        </div>
      </div>
    </div>
  );
}
