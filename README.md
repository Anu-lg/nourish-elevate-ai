# Your Health Blueprint

Create a stunning, modern, professional landing page for a project called “NutriFlex AI”.

Project Context

NutriFlex AI is an AI-powered personalized diet and workout planner.

The user provides:

Age

Height

Weight

Food preference: Vegetarian / Non-Vegetarian

Fitness goal: Weight Gain / Weight Loss / Fat Loss / Strength / Muscle Building

Activity level

Workout preference

Number of workout days per week

Based on these preferences, the application generates a personalized 7-day diet and workout plan using Generative AI.

IMPORTANT ASSIGNMENT REQUIREMENT

The generated diet MUST respect the user's selected food preference.

For example:

If the user selects Vegetarian, the generated diet must contain ONLY vegetarian foods.

Do NOT display:

Chicken

Fish

Meat

Egg

Any other non-vegetarian food

If the user selects Non-Vegetarian, the AI may include suitable non-vegetarian foods.

The final application should generate a personalized weekly plan based on the user's profile and fitness goal.

Landing Page Design

Create a visually stunning, premium-looking health-tech landing page.

Design Style

Use a modern AI + fitness + nutrition aesthetic.

The design should feel:

Clean

Premium

Modern

Trustworthy

Energetic

Professional enough for a job interview/demo

Not overly complicated

Use a soft light background with attractive green/teal gradients and subtle AI-inspired visual elements.

Use:

Rounded cards

Soft shadows

Gradient accents

Smooth hover effects

Subtle animations

Modern typography

Good spacing

Responsive layout

Avoid making it look like a generic template.

HERO SECTION

Create a strong hero section.

Main heading:

“Your AI-Powered Path to a Healthier You.”

Supporting text:

“Get a personalized 7-day nutrition and workout plan designed around your body, goals, food preferences, and lifestyle.”

Add two CTA buttons:

“Create My Plan”

and

“Explore How It Works”

On the right side, create an attractive visual dashboard/card showing a sample personalized fitness plan.

Example visual:

Your Weekly Plan

🎯 Goal: Weight Gain

🥗 Personalized Nutrition
🏋️ Personalized Workout
📅 7-Day Plan
✨ AI Powered

Include subtle animated elements such as floating nutrition/fitness cards.

TRUST / HIGHLIGHT SECTION

Add a small section below the hero with 3–4 highlights:

AI Personalized

Plans adapt to the user's individual information.

Food Preference Aware

Vegetarian and non-vegetarian preferences are respected.

7-Day Planning

Get a complete weekly diet and workout plan.

Goal Focused

Plans are generated according to the user's fitness objective.

HOW IT WORKS SECTION

Create a beautiful 4-step process.

Step 1 — Tell Us About You

Enter age, height, weight, activity level and other basic information.

Step 2 — Choose Your Goal

Select goals such as weight gain, weight loss, fat loss, strength or muscle building.

Step 3 — Set Your Food Preference

Choose Vegetarian or Non-Vegetarian.

Step 4 — Get Your AI Plan

NutriFlex AI generates your personalized 7-day diet and workout plan.

Represent these steps using modern cards with icons and connecting visual elements.

PERSONALIZATION SECTION

Create a section titled:

“A Plan That Understands Your Preferences”

Explain that NutriFlex AI does not provide the same generic plan to everyone.

Show example comparison cards:

User A

Goal: Weight Gain
Food: Vegetarian

→ Vegetarian calorie-focused diet
→ Personalized workout

User B

Goal: Fat Loss
Food: Non-Vegetarian

→ Goal-focused nutrition
→ Personalized workout

Make it visually clear that different user inputs produce different plans.

AI SECTION

Create an attractive section titled:

“Powered by Generative AI”

Explain briefly:

“NutriFlex AI uses Generative AI to transform your personal information, fitness goals, activity level and dietary preferences into a structured weekly plan.”

Add a visual representation:

User Profile → AI Analysis → Personalized Diet + Workout

Use an AI-inspired glowing/gradient visual without making the design too futuristic.

FINAL CTA SECTION

Create a strong final call-to-action section.

Heading:

“Ready to Build Your Personalized Plan?”

Text:

“Tell NutriFlex AI about yourself and get a 7-day plan built around your goals.”

Button:

“Create My Personalized Plan →”

The button should navigate to the user input/profile form page.

NAVIGATION BAR

Create a responsive navbar with:

NutriFlex AI logo/name on the left.

Navigation links:

Home

How It Works

Features

About

Right side:

Get Started →

The navbar should remain clean and responsive on mobile.

FOOTER

Create a professional footer containing:

NutriFlex AI

“Personalized fitness and nutrition powered by AI.”

Links:

Home

Features

How It Works

Get Started

Add:

© 2026 NutriFlex AI.

USER EXPERIENCE

Make the landing page responsive for:

Desktop

Tablet

Mobile

Add smooth scrolling between sections.

Add subtle entrance animations when sections appear.

Buttons should have hover and active states.

Cards should have subtle hover effects.

Do not use excessive animations.

The page must load quickly and feel professional.

TECHNICAL REQUIREMENTS

Use:

React

TypeScript

Tailwind CSS

Modern component-based architecture

Keep components reusable.

Suggested structure:

src/
├── components/
│   ├── Navbar
│   ├── Hero
│   ├── Highlights
│   ├── HowItWorks
│   ├── Personalization
│   ├── AISection
│   ├── CTA
│   └── Footer
│
├── pages/
│   └── LandingPage
│
└── App.tsx


Use Lucide React or another suitable icon library.

Do not use unnecessary backend/API functionality for the landing page yet.

The “Create My Plan” and “Get Started” buttons should be prepared to navigate to a future profile-input page where the user will enter their age, height, weight, food type, fitness goal and workout preferences.

IMPORTANT

This is an interview assignment, so prioritize:

Excellent UI/UX

Clean React code

Responsive design

Clear project purpose

Professional visual presentation

A realistic AI-product feel

Easy integration with the future diet/workout generation functionality

Do not build the complete AI backend yet.

First create the landing page and make it visually impressive and fully responsive.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0c42bf3e-274f-48aa-b92b-f3e6af340038).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
