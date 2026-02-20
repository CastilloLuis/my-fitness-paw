// ============================================
// Activity / Toy Catalog
//
// Each entry includes intensity, joint impact, supervision level,
// hazard tags, safety rules, and recommended session structure.
//
// Sources:
// - Cornell Feline Health Center: Safe Toys
// - iCatCare: Playing With Your Cat
// - VCA Hospitals: Linear Foreign Body in Cats
// ============================================

import type { Activity, ThingToAvoid } from './types';

export const ACTIVITIES: Activity[] = [
  // --- Chase & Pounce ---
  {
    id: 'chase_pounce_ball',
    displayName: 'Ball Chase / Ping-Pong Ball',
    category: 'chase_and_pounce',
    examples: [
      'Ping-pong ball on hard floor',
      'Small rubber ball (too large to swallow)',
      'Crinkle ball',
      'DIY: aluminum foil ball (walnut-sized)',
    ],
    intensity: 'moderate',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['small_parts'],
    safetyRules: [
      'Choose balls too large to swallow (>4 cm diameter).',
      'Discard if pieces chip off.',
      'Avoid on stairs or near ledges.',
    ],
    recommendedSessionStructure:
      'Roll ball across floor to trigger chase instinct → let cat bat and pursue → retrieve and repeat 5–8 cycles → end with a "catch" and treat reward.',
  },
  {
    id: 'chase_pounce_fetch',
    displayName: 'Fetch Play',
    category: 'chase_and_pounce',
    examples: [
      'Tossed toy mouse',
      'Small soft toy',
      'Crumpled paper ball',
    ],
    intensity: 'high',
    jointImpact: 'moderate',
    supervision: 'low',
    hazardTags: ['small_parts', 'overstimulation'],
    safetyRules: [
      'Use soft toys to avoid dental injury on catch.',
      'Limit to 5–10 minutes to prevent overexertion.',
      'Stop if cat loses interest — never force.',
    ],
    recommendedSessionStructure:
      'Toss toy short distance → cat retrieves → repeat → gradually slow pace → end with catch and treat.',
  },

  // --- Prey Mimic (Wand / Feather / Mouse) ---
  {
    id: 'prey_mimic_wand',
    displayName: 'Wand / Feather Teaser',
    category: 'prey_mimic',
    examples: [
      'Da Bird feather wand',
      'DIY: stick + string + feather/fabric',
      'Ribbon wand (supervised only)',
      'Mouse-on-a-string wand',
    ],
    intensity: 'moderate',
    jointImpact: 'moderate',
    supervision: 'high',
    hazardTags: ['linear_foreign_body', 'entanglement', 'choking'],
    safetyRules: [
      'NEVER leave string/feather toys unattended — ingestion of string causes life-threatening linear foreign body obstruction.',
      'Replace frayed feathers and strings immediately.',
      'Let cat "win" (catch the prey) regularly to prevent frustration.',
      'Store out of reach after each session.',
    ],
    recommendedSessionStructure:
      'Warmup: drag slowly along ground (prey hiding) → Build: mimic erratic prey movement → Peak: 2–3 min active chase/pounce → Let cat catch → Repeat 3–4 cycles → Cooldown: slow movement → final catch → treat.',
  },
  {
    id: 'prey_mimic_mouse',
    displayName: 'Toy Mouse / Prey Figure',
    category: 'prey_mimic',
    examples: [
      'Furry mouse toy',
      'Catnip mouse',
      'Realistic prey-shaped toy',
      'DIY: sock stuffed with crinkle paper',
    ],
    intensity: 'moderate',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['small_parts', 'choking'],
    safetyRules: [
      'Check for loose eyes, whiskers, or tails that could be ingested.',
      'Replace when torn or frayed.',
      'Ensure filling material is non-toxic.',
    ],
    recommendedSessionStructure:
      'Toss or slide mouse along floor → cat stalks and pounces → let cat "kill" and carry → repeat → end with treat.',
  },

  // --- Hide & Ambush ---
  {
    id: 'hide_ambush_box',
    displayName: 'Cardboard Box / Paper Bag Hide',
    category: 'hide_and_ambush',
    examples: [
      'Cardboard box with holes cut in sides',
      'Paper grocery bag (handles removed)',
      'Cardboard tunnel',
      'DIY: multiple boxes linked together',
    ],
    intensity: 'low',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['entanglement'],
    safetyRules: [
      'REMOVE all handles from paper bags — strangulation risk.',
      'Never use plastic bags — suffocation hazard.',
      'Cut entry/exit holes large enough for the cat to pass through easily.',
      'Replace when boxes become unstable or soggy.',
    ],
    recommendedSessionStructure:
      'Set up boxes/bags in play area → drag toy past openings to lure ambush behavior → let cat explore and hide → toss treats inside for foraging → leave available for self-directed play.',
  },

  // --- Foraging / Food Play ---
  {
    id: 'foraging_puzzle_feeder',
    displayName: 'Puzzle Feeder / Food Dispensing Toy',
    category: 'foraging_food_play',
    examples: [
      'Commercial puzzle feeder (LickiMat, Trixie)',
      'DIY: egg carton with kibble',
      'Muffin tin with balls over kibble',
      'Toilet-paper-roll puzzle',
    ],
    intensity: 'low',
    jointImpact: 'low',
    supervision: 'none',
    hazardTags: [],
    safetyRules: [
      'Count dispensed food as part of daily caloric intake.',
      'Start at easiest difficulty — increase gradually to prevent frustration.',
      'Clean regularly to prevent mold and bacteria.',
    ],
    recommendedSessionStructure:
      'Fill with portion of daily kibble → set out at meal time → cat works for 10–20 min → collect and clean. Ideal for weight management — slows eating and adds mental stimulation.',
  },
  {
    id: 'foraging_treat_scatter',
    displayName: 'Treat Scatter / Snuffle Mat',
    category: 'foraging_food_play',
    examples: [
      'Scatter 5–10 treats across a room',
      'Snuffle mat',
      'Treats hidden in crumpled paper in a box',
    ],
    intensity: 'low',
    jointImpact: 'low',
    supervision: 'none',
    hazardTags: [],
    safetyRules: [
      'Count scattered treats as part of daily caloric intake.',
      'Use low-calorie treats for overweight cats.',
      'Clean snuffle mat regularly.',
    ],
    recommendedSessionStructure:
      'Scatter small number of treats (5–10) in an area → cat uses nose and paws to forage → 5–15 min engagement. Mimics natural foraging behavior.',
  },

  // --- Kick & Wrestle ---
  {
    id: 'kick_wrestle_kicker',
    displayName: 'Kicker Toy',
    category: 'kick_and_wrestle',
    examples: [
      'Large catnip kicker pillow',
      'Kicker fish toy',
      'DIY: long sock stuffed with batting and catnip',
    ],
    intensity: 'moderate',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['overstimulation'],
    safetyRules: [
      'Check seams regularly for loose filling.',
      'Replace if fabric tears — stuffing ingestion risk.',
      'Some cats become over-aroused — discontinue if aggression follows.',
    ],
    recommendedSessionStructure:
      'Present toy → cat grabs with front paws and bunny-kicks → great for core engagement → 5–10 min sessions → follow with a cooldown activity.',
  },

  // --- Noise & Novelty ---
  {
    id: 'noise_novelty_crinkle',
    displayName: 'Crinkle / Rattle Toy',
    category: 'noise_and_novelty',
    examples: [
      'Crinkle ball',
      'Mylar crinkle tunnel',
      'DIY: sealed container with dried beans inside (rattle)',
      'Crinkle paper in a paper bag',
    ],
    intensity: 'low',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['small_parts'],
    safetyRules: [
      'Ensure no small pieces can be chewed off and swallowed.',
      'DIY rattles must be securely sealed — loose beans/beads are choking hazards.',
      'Monitor mylar for tearing — small shreds can be ingested.',
    ],
    recommendedSessionStructure:
      'Toss or hide crinkle toys to encourage investigation and batting → good for sensory enrichment → leave out for solo exploration.',
  },

  // --- Climb / Vertical Space ---
  {
    id: 'climb_vertical_tree',
    displayName: 'Cat Tree / Climbing Shelves',
    category: 'climb_vertical_space',
    examples: [
      'Multi-level cat tree',
      'Wall-mounted cat shelves',
      'Tall scratching post with platform',
    ],
    intensity: 'high',
    jointImpact: 'high',
    supervision: 'low',
    hazardTags: ['falls'],
    safetyRules: [
      'Ensure tree is stable and secured to wall — tip-over risk with large/heavy cats.',
      'Not recommended for senior cats or cats with joint issues.',
      'Overweight cats: verify all shelves and platforms support their weight before use.',
      'Place on non-slip surface.',
    ],
    recommendedSessionStructure:
      'Encourage climbing by placing treats or toys at different levels → use wand toy near tree to encourage vertical movement → allow self-directed exploration.',
  },

  // --- Scratch + Play ---
  {
    id: 'scratch_play_scratcher',
    displayName: 'Scratcher (Cardboard / Sisal)',
    category: 'scratch_and_play',
    examples: [
      'Cardboard scratch pad',
      'Sisal scratching post',
      'Incline scratcher',
      'Scratcher with embedded ball track',
    ],
    intensity: 'low',
    jointImpact: 'low',
    supervision: 'none',
    hazardTags: [],
    safetyRules: [
      'Replace cardboard scratchers when worn through.',
      'Position near resting areas and by doorways.',
      'Provide both horizontal and vertical options.',
    ],
    recommendedSessionStructure:
      'Place in accessible location → sprinkle catnip or rub silver vine on surface to attract → leave available at all times. Scratching is essential for claw health, stretching, and territory marking.',
  },

  // --- Automated Toys ---
  {
    id: 'automated_electronic',
    displayName: 'Automated / Electronic Toy',
    category: 'automated_toys',
    examples: [
      'Robotic mouse',
      'Butterfly spinner',
      'Automated laser (timed)',
      'SmartyKat electronic motion toy',
    ],
    intensity: 'moderate',
    jointImpact: 'low',
    supervision: 'medium',
    hazardTags: ['battery_ingestion', 'entanglement', 'overstimulation'],
    safetyRules: [
      'Supervise electronic toys — entanglement and battery exposure risks.',
      'Rotate toys to prevent habituation (cats lose interest if always available).',
      'Not a substitute for interactive human-cat play.',
      'Use timed sessions (10–15 min) to prevent overstimulation.',
      'Automated lasers must include an auto-off timer.',
    ],
    recommendedSessionStructure:
      'Use as supplement to (not replacement for) interactive play → limit to 10–15 min → follow with a physical toy the cat can catch to satisfy prey drive.',
  },

  // --- Laser Pointer ---
  {
    id: 'laser_pointer',
    displayName: 'Laser Pointer',
    category: 'laser_pointer',
    examples: [
      'Handheld laser pointer (Class 1 or 2 only)',
      'Automated laser toy with timer',
    ],
    intensity: 'high',
    jointImpact: 'moderate',
    supervision: 'high',
    hazardTags: ['eye_risk', 'frustration', 'overstimulation'],
    safetyRules: [
      'MUST end every session by leading the dot to a physical toy or treat that the cat can catch — failure to do so causes frustration and can lead to obsessive/compulsive behavior (iCatCare).',
      'Never shine directly in eyes — retinal damage risk. Use Class 1 or 2 lasers only.',
      'Limit sessions to 3–5 minutes maximum.',
      'Not recommended for anxious cats or cats prone to compulsive behaviors.',
      'Always supervise — never leave automated laser running unattended.',
      'Move dot along floor in prey-like patterns (zigzag, hide behind objects) — avoid rapid random movement.',
    ],
    recommendedSessionStructure:
      'Short bursts only (3–5 min) → move dot in prey-like floor patterns → lead dot to physical toy or treat pile → cat makes physical catch → session ends with tangible reward.',
  },

  // --- Catnip / Silver Vine ---
  {
    id: 'catnip_silvervine',
    displayName: 'Catnip / Silver Vine Toy',
    category: 'noise_and_novelty',
    examples: [
      'Catnip-stuffed toy',
      'Loose dried catnip sprinkled on scratcher',
      'Silver vine sticks',
      'Valerian root toy',
    ],
    intensity: 'moderate',
    jointImpact: 'low',
    supervision: 'low',
    hazardTags: ['overstimulation'],
    safetyRules: [
      'About 30–50% of cats do not respond to catnip (genetic trait).',
      'Kittens under 6 months rarely respond.',
      'Some cats become aggressive — discontinue if aggression occurs.',
      'Allow 1–2 hour cooldown between exposures for sensitivity reset.',
      'Silver vine is an effective alternative for catnip non-responders.',
    ],
    recommendedSessionStructure:
      'Present fresh catnip toy or sprinkle on surface → response lasts 5–15 min → remove after response fades → wait 1–2 hours before next exposure.',
  },
];

/**
 * Things cats should NEVER play with.
 *
 * Source: Cornell Feline Health Center — Safe Toys;
 * VCA Hospitals — Linear Foreign Body in Cats.
 */
export const THINGS_TO_AVOID: ThingToAvoid[] = [
  {
    item: 'String / Yarn',
    reason:
      'If swallowed, string anchors under the tongue or around intestinal tissue and causes the intestines to "accordion" and perforate — a life-threatening linear foreign body obstruction requiring emergency surgery.',
    hazardTags: ['linear_foreign_body', 'entanglement'],
  },
  {
    item: 'Ribbon / Tinsel',
    reason:
      'Same linear foreign body risk as string. Tinsel is especially dangerous during holidays — cats are attracted to its shimmer but ingestion is frequently fatal without surgery.',
    hazardTags: ['linear_foreign_body', 'entanglement'],
  },
  {
    item: 'Rubber Bands',
    reason:
      'Small, easily swallowed, and can cause gastrointestinal obstruction or constriction of tissue.',
    hazardTags: ['choking', 'linear_foreign_body'],
  },
  {
    item: 'Hair Ties / Elastic Bands',
    reason:
      'One of the most commonly ingested foreign bodies in cats. Can cause intestinal obstruction and are frequently found in multiples during surgery.',
    hazardTags: ['choking', 'linear_foreign_body'],
  },
  {
    item: 'Plastic Bags',
    reason:
      'Suffocation risk. Handles create strangulation hazard. Some cats chew and ingest plastic pieces.',
    hazardTags: ['choking', 'entanglement'],
  },
  {
    item: 'Small Objects (buttons, coins, paper clips)',
    reason:
      'Choking and gastrointestinal obstruction risk. Cats often bat small objects under furniture where they accumulate and are found later.',
    hazardTags: ['choking', 'small_parts'],
  },
  {
    item: 'Toys with Small Detachable Parts (googly eyes, bells, button noses)',
    reason:
      'Parts can be chewed off and swallowed. Always choose toys with securely attached or no small components.',
    hazardTags: ['choking', 'small_parts'],
  },
];

/**
 * Get an activity by its stable ID.
 * Returns undefined if not found.
 */
export function getActivityById(id: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.id === id);
}

/**
 * Get all activities in a category.
 */
export function getActivitiesByCategory(category: string): Activity[] {
  return ACTIVITIES.filter((a) => a.category === category);
}
