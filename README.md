# ScriptClear — Prescription Safety & Daily Routine Sentinel
> **Theme:** Tech for a Better Tomorrow | **Challenge:** Open Innovation | **Event:** HACKDAY 1.0

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-Accessibility-4F46E5?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 📌 Problem
Over **50% of elderly patients and adults with low health literacy** misunderstand clinical prescription labels, meal timing rules, and contraindications. In the United States alone, adverse drug events (ADEs) trigger **1.3 million emergency room visits** annually, costing over $5 billion. Common scenarios—like taking over-the-counter Advil for joint pain while on a blood thinner, or drinking grapefruit juice with cholesterol statins—lead to preventable hemorrhages, liver toxicity, or treatment failure.

## 💡 Solution: ScriptClear
**ScriptClear** is an accessible, plain-language polypharmacy sentinel and visual daily routine companion. It deconstructs dense medical leaflets into 4th-grade reading-level cards, tracks a 24-hour visual routine tied to meal times, provides instant voice readouts, cross-checks active medications against an intelligent interaction matrix, and generates print-ready emergency wallet cards for first responders.

---

## ✨ Key Features

1. **24-Hour Visual Daily Routine:**
   - Organizes daily pills into Morning (Breakfast), Afternoon (Lunch), Evening (Dinner), and Bedtime intervals.
   - Distinct dietary icons (With Food, Plenty Water, Empty Stomach, No Grapefruit).
   - One-touch dose check-off with persistent adherence streak tracking.

2. **Optical Pill Identification:**
   - Renders realistic pill shapes (oval, round, capsule, diamond) and colors so seniors recognize medications visually rather than trying to decipher tiny chemical names.

3. **Polypharmacy Safety Sentinel:**
   - Real-time pairwise conflict matrix (e.g., Warfarin + Ibuprofen = Critical internal hemorrhage alert).
   - Automatic cross-reactive allergy interception (e.g., Penicillin allergy vs. Amoxicillin prescription).
   - Cumulative dietary rules for grapefruit, potassium salt substitutes, and alcohol.

4. **Doctor & Pharmacist Discussion Script:**
   - Generates exact, plain-language questions for the patient or family caregiver to bring to their next clinic appointment.

5. **AI Prescription Ingestion Lab:**
   - Scans camera or photo uploads, performs semantic decomposition, extracts plain-language directions, and verifies safety before the first dose is taken.
   - Includes 3 one-click live hackathon demonstration presets.

6. **"I Forgot My Pill" Missed Dose Advisor:**
   - Immediate clinical guidance for forgotten doses based on elapsed hours, strictly preventing accidental double-dosing.

7. **Senior High-Contrast Mode & Web Speech API Voice:**
   - Large typography, high-contrast borders, 48px+ touch targets, and native browser speech synthesis at a gentle 0.88x cadence for low-vision and low-literacy users.

8. **Standardized Emergency Medical Wallet Card:**
   - 1-click printable EMS triage card with blood type, allergies, active prescriptions, doctor contacts, and emergency next-of-kin information.

---

## 🛠️ Technology Stack

| Layer | Technology | Justification |
|---|---|---|
| **Framework** | React 19 + TypeScript | Strict type safety across clinical drug schemas and state transitions. |
| **Styling** | Tailwind CSS v4 | High-contrast WCAG-compliant design system with zero CSS runtime overhead. |
| **Icons** | Lucide React | Clean, intuitive healthcare and accessibility glyphs. |
| **Accessibility** | Web Speech API | Zero-latency, browser-native voice synthesis without external API dependencies. |
| **Persistence** | Browser LocalStorage | Resilient offline compliance tracking that survives tab reloads. |
| **Build Tool** | Vite 8 | Near-instant development startup and optimized production bundle. |

---

## 🚀 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/scriptclear.git
cd scriptclear

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

---

## 🏆 Hackathon Demo Walkthrough (90 Seconds)

1. **The Human Story (0:00–0:20):** Introduce 74-year-old Eleanor taking Warfarin, Metformin, Lisinopril, and Lipitor. Show the 24-hour visual schedule and tap "Read Summary Aloud".
2. **The Common Mistake (0:20–0:50):** Navigate to the **AI Label Scanner** and select the "Advil 400mg" preset (bought OTC for knee pain). Click "Deconstruct & Safety-Check".
3. **The Life-Saving Interception (0:50–1:15):** ScriptClear immediately intercepts the dose: 🚨 *Critical Conflict: Ibuprofen + Warfarin increases internal bleeding risk by 400%*.
4. **The Resolution & Impact (1:15–1:30):** Open the **Doctor Discussion Script** to show the generated question: *"What is the safest alternative to Ibuprofen for my joint stiffness?"* Then open the **Emergency Wallet Card** ready for printing.
