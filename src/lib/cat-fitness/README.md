# Cat Fitness Module

A self-contained TypeScript library for feline play calorie estimation, activity recommendations, and safety-constrained exercise planning.

---

## Overview

This module provides:

- **RER/MER calculations** using standard veterinary energy equations
- **Play calorie estimation** — an explicit approximation of kcal burned during interactive cat play
- **Activity/toy catalog** with safety rules, hazard tags, and session structures
- **Obesity-aware safety constraints** — shorter sessions, mandatory rest breaks, stop rules for overweight/obese cats
- **Progressive ramp plans** for cats returning to activity (especially obese/overweight)
- **Emergency stop rules** including respiratory distress guidance

---

## What This Library Can and Cannot Claim

### What it CAN do

- Compute RER and MER using widely-accepted veterinary formulas
- Estimate play calories using conservative intensity multipliers over resting metabolic rate
- Classify obesity status using Body Condition Score (BCS 1–9) or weight heuristic
- Enforce safety constraints (session length caps, intensity limits, rest breaks) based on health profile
- Provide evidence-backed activity recommendations with hazard warnings

### What it CANNOT do

- **Diagnose** any medical condition. All outputs are estimates and starting points.
- Provide exact kcal burned during play. **There is not strong direct published data for "kcal/min of cat play."** This model uses standard vet energy equations and conservative intensity multipliers for UX estimation.
- Replace veterinary advice. Weight management programs should always involve a veterinarian.
- Account for individual metabolic variation, which can be ±20% or more.

---

## Core Equations (RER/MER)

### Resting Energy Requirement (RER)

The baseline energy a cat needs at complete rest.

**Exponential formula (default, works for all weights):**

```
RER (kcal/day) = 70 × (weightKg ^ 0.75)
```

**Linear formula (alternate, less accurate at extremes):**

```
RER (kcal/day) = 30 × weightKg + 70
```

### Maintenance Energy Requirement (MER)

MER = RER × life-stage multiplier. These are **starting points** — adjust based on weight trend and BCS.

| Life stage             | Multiplier | Notes                                    |
| ---------------------- | ---------- | ---------------------------------------- |
| Kitten/juvenile (<1yr) | 2.5        | High growth demands                      |
| Typical neutered adult | 1.2        | Most common scenario                     |
| Intact adult           | 1.4        | Higher metabolic rate                    |
| Weight loss baseline   | 1.0        | Equals RER; use under veterinary guidance |

---

## Play Calorie Estimation Model

### Formula

```
restingKcalPerMin = RER / 1440

totalKcalDuringPlay   = restingKcalPerMin × intensityMultiplier × durationMinutes
extraKcalAboveRest    = restingKcalPerMin × (intensityMultiplier - 1) × durationMinutes
```

### Intensity Multipliers

| Level    | Multiplier | Description                               |
| -------- | ---------- | ----------------------------------------- |
| Low      | 2.0×       | Puzzle feeders, slow stalking, batting     |
| Moderate | 3.0×       | Wand play, chasing, fetching              |
| High     | 5.0×       | Sprinting, jumping, vigorous wand play    |

### Example

A 4.5 kg neutered adult cat playing with a wand teaser (moderate) for 10 minutes:

```
RER = 70 × 4.5^0.75 ≈ 216 kcal/day
restingKcalPerMin = 216 / 1440 ≈ 0.15 kcal/min
totalKcalDuringPlay = 0.15 × 3.0 × 10 ≈ 4.5 kcal
extraKcalAboveRest = 0.15 × 2.0 × 10 ≈ 3.0 kcal
```

**Important:** The `totalKcalDuringPlay` includes the resting baseline (the cat would burn those calories anyway). The `extraKcalAboveRest` represents the additional energy expenditure from play.

---

## Activity Catalog

The catalog includes 14 activities across these categories:

- **Chase & pounce** — ball chase, fetch
- **Prey mimic** — wand/feather teaser, toy mouse
- **Hide & ambush** — cardboard boxes, paper bags (handles removed)
- **Foraging/food play** — puzzle feeders, treat scatter
- **Kick & wrestle** — kicker toys
- **Noise & novelty** — crinkle toys, DIY rattles, catnip/silver vine
- **Climb/vertical space** — cat trees, shelves
- **Scratch + play** — scratchers (cardboard, sisal)
- **Automated toys** — electronic toys (supervised)
- **Laser pointer** — with mandatory "end with physical catch" rule

### Things to Avoid

The following items should **never** be used as cat toys:

- **String / Yarn** — linear foreign body risk (life-threatening)
- **Ribbon / Tinsel** — same risk; frequently fatal without surgery
- **Rubber bands** — GI obstruction risk
- **Hair ties / Elastic bands** — one of the most commonly ingested foreign bodies in cats
- **Plastic bags** — suffocation and strangulation risk
- **Small detachable parts** — choking hazard

---

## Safety and Medical Warnings (READ THIS)

### Obese and Overweight Cats

Obesity places significant strain on the heart, lungs, and joints. **Do not** jump straight to vigorous or long play sessions.

**Obese cats (BCS 8–9):**

- Maximum continuous play: **3–5 minutes** at low intensity
- Mandatory rest: **10+ minutes** between sessions
- Daily total: **10–15 minutes** split across 2–4 micro-sessions
- Progression: increase by **10–15%** per week **only if tolerated**
- Intensity cap: **low only**

**Overweight cats (BCS 7):**

- Maximum continuous play: **5–8 minutes**
- Rest: **5+ minutes** between sessions
- Daily total: **15–25 minutes** split across sessions
- Intensity cap: **moderate**

**Normal weight cats (BCS 4–6):**

- Typical sessions: **10–15 minutes**
- 2–3 sessions per day
- All intensities appropriate for healthy cats

### Emergency Stop Rules

**Stop play immediately and seek veterinary care if you observe:**

1. **Open-mouth breathing / panting** — cats should NOT pant like dogs. Persistent panting indicates overexertion or respiratory distress. If it continues beyond 2–3 minutes of rest, contact your vet.
2. **Collapse or inability to stand** — veterinary emergency.
3. **Blue, purple, or pale gums (cyanosis)** — severe oxygen deprivation; veterinary emergency.
4. **Severe lethargy or unresponsiveness** — stop immediately.
5. **Coughing, gagging, or wheezing** — may indicate respiratory distress or asthma.
6. **Vomiting** during or immediately after play.
7. **Limping or pain** — stop and assess.

**Also stop (non-emergency) if:**

- Aggression escalation (hissing, growling, stiff body)
- Hiding or fleeing the play area
- Refusing to engage — never force play
- Excessive drooling

### Special Conditions

- **Known cardiac/respiratory disease:** Only very gentle, supervised play. Veterinarian must approve any exercise program.
- **Hot ambient temperature:** Cats dissipate heat poorly. Reduce session length. Stop if any panting occurs.
- **Senior cats (11+ years):** Monitor closely for pain or fatigue. Gentler activities recommended.
- **Geriatric cats (15+ years):** Very gentle play only. Increased veterinary monitoring.

---

## API Reference

### `calcRER(weightKg, method?)`

Calculate Resting Energy Requirement.

```typescript
const rer = calcRER(4.5); // { rerKcalPerDay: 216.3, method: 'exponential', weightKg: 4.5 }
const rerLinear = calcRER(4.5, 'linear'); // { rerKcalPerDay: 205, method: 'linear', weightKg: 4.5 }
```

### `calcMER({ weightKg, ageYears?, neutered?, goal? })`

Calculate Maintenance Energy Requirement.

```typescript
const mer = calcMER({ weightKg: 4.5, ageYears: 3, neutered: true });
// { rerKcalPerDay: 216.3, merKcalPerDay: 259.6, multiplier: 1.2, ... }
```

### `estimatePlayCalories({ weightKg, durationMinutes, ... })`

Estimate calories from a play session with safety constraints.

```typescript
const result = estimatePlayCalories({
  weightKg: 5,
  ageYears: 4,
  durationMinutes: 10,
  activityId: 'prey_mimic_wand',
  neutered: true,
  bcs9: 5,
});
// Returns: rerKcalPerDay, merKcalPerDay, restingKcalPerMin,
//          totalKcalDuringPlay, extraKcalAboveRest,
//          intensityMultiplier, intensityLevel, obesityStatus, safety
```

### `recommendPlayPlan({ weightKg, bcs9?, ... })`

Get a complete play plan with safety constraints and progression schedule.

```typescript
const plan = recommendPlayPlan({ weightKg: 7, bcs9: 8 });
// Returns: obesityStatus, lifeStage, safety, progressionPlan (6 weeks for obese)
```

### `getActivityById(id)`

Look up an activity from the catalog.

```typescript
const laser = getActivityById('laser_pointer');
// Returns full Activity object with safetyRules, hazardTags, etc.
```

### `generateCatInsights(profile, todaySessions, weeklySessions)`

Generate complete insights for the app UI (backward-compatible API).

```typescript
const insights = generateCatInsights(catProfile, todaySessions, weeklySessions);
// Returns: play_plan, toy_recommendations, today_calories, weekly_calories, warnings, disclaimer
```

---

## Examples

### Obese cat — what happens

```typescript
const result = estimatePlayCalories({
  weightKg: 7,
  durationMinutes: 15,
  bcs9: 9,
  intensity: 'high',
});

// result.obesityStatus === 'obese'
// result.intensityLevel === 'low'  (capped from 'high')
// result.safety.maxContinuousMinutes === { min: 3, max: 5 }
// result.safety.warnings includes:
//   - "This cat is classified as obese..."
//   - "Intensity was capped to 'low'..."
//   - "Requested duration (15 min) exceeds recommended maximum..."
// result.safety.restSuggestion explains rest protocol
```

### Healthy kitten

```typescript
const result = estimatePlayCalories({
  weightKg: 3,
  ageYears: 0.5,
  durationMinutes: 10,
  activityId: 'prey_mimic_wand',
});

// result.obesityStatus === 'normal'
// result.intensityLevel === 'moderate'
// result.merKcalPerDay uses 2.5x kitten multiplier
// No safety warnings for a healthy kitten at moderate intensity
```

---

## How the Play Session Timer Enforces Safety Limits

The app's live play session timer integrates directly with this library's safety constraints to protect overweight and obese cats from overexertion. Here is how it works end-to-end:

### 1. Safety Assessment (`usePlaySafety` hook)

When a cat is selected for a play session, the `usePlaySafety` hook builds a `CatProfile` from the cat's database record (weight, age, energy level) and calls:

1. `classifyObesityStatus(profile)` — determines if the cat is **obese**, **overweight**, **normal**, or **unknown** using BCS (when available) or a weight-based heuristic (>6.5 kg → overweight, >7.5 kg → obese).
2. `buildSafetyConstraints(obesityStatus, profile)` — returns the maximum continuous play time, intensity cap, rest requirements, and warning messages.

The hook returns a `PlaySafety` object containing:

| Field | Description |
|-------|-------------|
| `maxContinuousMs` | Hard time limit in milliseconds (e.g. 5 min = 300,000 ms for obese) |
| `hasLimits` | `true` if the cat is overweight or obese |
| `timerWarning` | Human-readable warning string shown in the UI |
| `safety` | Full `SafetyConstraints` object with rest suggestions, stop rules, etc. |

### 2. Timer Behavior

The live session screen uses these constraints at every stage:

**Before recording starts:**
- A **safety banner** is displayed with the `timerWarning` message (e.g. "Obese cat — max 3–5 min per session. Timer will auto-pause at 5 min.").
- The banner is color-coded: red for obese, amber for overweight.

**During recording:**
- A **progress bar** shows how much of the time limit has been used.
- A **countdown label** shows remaining time (e.g. "3 min 24 s remaining").
- The timer text **changes color** as the limit approaches:
  - Normal (green) → **Warning** (amber, at 75% of limit) → **Danger** (red, at 100%).
- When elapsed time reaches `maxContinuousMs`, the timer **auto-pauses** immediately with haptic feedback (iOS).

**After auto-pause (Time Limit Reached overlay):**
- The timer stops and a full-screen overlay explains why.
- A **rest suggestion** is shown (e.g. "Rest at least 10 minutes between play sessions for obese cats").
- The user can **end the session** (proceeds to classification) or **continue anyway** (the limit resets — this is intentional so the user retains control, but the default path is to stop).

**During classification (after timer stops):**
- If the cat has safety limits, a reminder banner persists showing rest suggestions.

### 3. Time Limits by Obesity Status

These limits come from `buildSafetyConstraints` and match veterinary guidelines:

| Obesity Status | Max Continuous Play | Intensity Cap | Mandatory Rest Between Sessions |
|---------------|--------------------|--------------|---------------------------------|
| **Obese** (BCS 8–9) | 3–5 minutes | Low only | 10+ minutes |
| **Overweight** (BCS 7) | 5–8 minutes | Moderate | 5+ minutes |
| **Normal** (BCS 4–6) | 10–15 minutes | All allowed | No mandatory rest |

The timer uses the **max** value of each range (5 min for obese, 8 min for overweight, 15 min for normal) as the auto-pause threshold.

### 4. Why This Matters

Obese cats face serious health risks during exercise:

- **Cardiovascular strain** — excess weight forces the heart to work harder, increasing risk of cardiac events during vigorous activity.
- **Respiratory distress** — fat deposits around the thorax reduce lung capacity. Obese cats can develop open-mouth breathing (a medical emergency in cats) much faster than normal-weight cats.
- **Joint damage** — excess load on joints during jumping or running can cause pain and injury.
- **Heat intolerance** — obese cats dissipate heat poorly, making overexertion in warm environments dangerous.

The timer enforcement ensures the app **never gamifies exercise** at the expense of cat safety. The auto-pause is a guardrail, not a suggestion — the default action after reaching the limit is to end the session and rest.

---

## Sources and What Each Supports

### RER/MER Formulas

| Source | What it supports |
| ------ | --------------- |
| [MSD Vet Manual — Nutritional Requirements of Small Animals](https://www.msdvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals) | RER formula; caveat that any formula is a starting point; individuals vary |
| [WSAVA Feeding Instructions and Monitoring Chart](https://wsava.org/wp-content/uploads/2020/01/Feeding-Instructions-and-Monitoring-Chart-for-Hospitalized-Patients.pdf) | Exponential formula `70 × BW^0.75` |
| [Pet Nutrition Alliance — MER/RER Overview (PDF)](https://petnutritionalliance.org/wp-content/uploads/2023/03/MER.RER_.PNA_.pdf) | RER then multiplying by life-stage factors |
| [MSD/Merck — Daily Maintenance Energy Requirements Table](https://www.msdvetmanual.com/multimedia/table/daily-maintenance-energy-requirements-for-dogs-and-cats) | Life-stage multipliers for MER |

### Weight Management

| Source | What it supports |
| ------ | --------------- |
| [AAHA Weight Management Guidelines (2014)](https://www.aaha.org/wp-content/uploads/globalassets/02-guidelines/weight-management/2014-AAHA-Weight-Management-Guidelines-for-Dogs-and-Cats) | Diet is primary for weight loss; exercise supports; safe pacing |
| [AAHA — Feline Fitness: How to Help Your Cat Lose Weight](https://www.aaha.org/resources/feline-fitness-how-to-help-your-cat-lose-weight/) | Practical guidance for feline weight loss programs |

### Play Calorie Estimation Limitations

| Source | What it supports |
| ------ | --------------- |
| [ScienceDirect — Challenges in Measuring Energy Expenditure](https://www.sciencedirect.com/science/article/pii/S0022316622083572) | Challenges measuring energy expenditure in cats/dogs; supports "approximation" framing |
| [PetMD — How Many Calories Do Pets Burn During Exercise?](https://www.petmd.com/blogs/thedailyvet/ktudor/2013/oct/how-many-calories-do-pets-burn-during-exercise-30951) | Limitations in exercise calorie estimates for pets |

### Obesity and Safety

| Source | What it supports |
| ------ | --------------- |
| [Cornell Feline Health Center — Obesity](https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/obesity) | BCS thresholds; cardiovascular burden of obesity; health risks |
| [VCA — Exercise and Your Obese Cat](https://vcahospitals.com/know-your-pet/exercise-and-your-obese-cat) | Obese cats struggle with exercise; increase gradually; include feeding-based activity |

### Play Session Structure

| Source | What it supports |
| ------ | --------------- |
| [AAHA — How Often Should You Play With Your Cat?](https://www.aaha.org/resources/how-often-should-you-play-with-your-cat/) | 2–3 sessions of 10–15 min; short bursts recommended |

### Respiratory Distress / Stop Rules

| Source | What it supports |
| ------ | --------------- |
| [AAHA — CC: Respiratory Distress](https://www.aaha.org/trends-magazine/january-2023/cc-respiratory-distress/) | Cats should not pant/open-mouth breathe; emergency framing |
| [PDSA — Breathing Problems in Cats](https://www.pdsa.org.uk/pet-help-and-advice/pet-health-hub/symptoms/breathing-problems-in-cats) | Panting/open-mouth breathing → contact vet |

### Toy Safety

| Source | What it supports |
| ------ | --------------- |
| [Cornell Feline Health Center — Safe Toys and Gifts](https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/safe-toys-and-gifts) | Warns against small pieces and linear strand-like parts; mentions cheap/free items |
| [iCatCare — Playing With Your Cat](https://icatcare.org/articles/playing-with-your-cat) | Missing catch sequence causes frustration; laser pointer caution ("end with catch") |
| [VCA — Linear Foreign Body in Cats](https://vcahospitals.com/know-your-pet/linear-foreign-body-in-cats) | String/ribbon ingestion → life-threatening intestinal obstruction |

---

## Disclaimer

All calorie estimates are approximate and based on standard veterinary energy equations (RER/MER) with conservative intensity multipliers. There is not strong direct published data for "kcal/min of cat play." Actual energy expenditure varies significantly based on individual metabolism, ambient temperature, play intensity, health status, and other factors. These figures are for general guidance only and should not replace veterinary advice. Consult a veterinarian for any weight-management program or if your cat shows signs of illness, injury, or distress during play. This library does not provide veterinary diagnosis.
