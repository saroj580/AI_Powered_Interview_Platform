# InterviewAI Product Design Specification

**Version:** 1.0  
**Last Updated:** June 21, 2026  
**Design Lead:** Senior Product Designer & UX Strategist  
**Reference:** Stripe, Notion, Linear, Intercom, Slack, Mercury, Ramp, Intervue

---

## Table of Contents

1. [Authentication Flow](#authentication-flow)
2. [New User Onboarding](#new-user-onboarding)
3. [Returning User Flow](#returning-user-flow)
4. [Dashboard Experiences](#dashboard-experiences)
5. [Route Structure](#route-structure)
6. [Design Language](#design-language)
7. [Component Library](#component-library)
8. [State Management](#state-management)

---

## Authentication Flow

### Post-Login/Signup Logic

```
User authenticates (login/register)
  ↓
Check user metadata:
  - onboardingCompleted?
  - resumeUploaded?
  - careerGoalSelected?
  ↓
  IF new user OR !onboardingCompleted
    → Redirect to /onboarding
  ELSE IF user.role = "RECRUITER"
    → Redirect to /recruiter/dashboard
  ELSE IF user.role = "ADMIN"
    → Redirect to /admin/dashboard
  ELSE
    → Redirect to /dashboard
```

---

## New User Onboarding

### Purpose
- Collect essential user information
- Personalize the interview preparation experience
- Generate initial learning roadmap
- Build user confidence in platform value

### UX Principles
- **Progressive Disclosure**: Ask one question at a time
- **Clear Progress**: Show step indicator (X of 7)
- **Contextual Help**: Explain why we ask each question
- **Momentum**: Each step should feel quick and lightweight
- **No Friction**: Save progress automatically; allow skipping where appropriate

### Step 1: Welcome

**URL**: `/onboarding/step-1-welcome`

**Components**:
- Hero section with InterviewAI branding
- Headline: "Welcome to InterviewAI 👋"
- Subheading: "Let's personalize your interview preparation journey."
- Input: Full Name
- Select: Current Status

**Status Options**:
- Student
- Fresher (0-1 years experience)
- Working Professional (1-5 years)
- Senior Professional (5+ years)

**Behavior**:
- Auto-save form data
- Enable Next button only after Name + Status selected
- Show encouraging icon based on status

---

### Step 2: Career Goals

**URL**: `/onboarding/step-2-career-goals`

**Components**:
- Headline: "What's your target role?"
- Subheading: "We'll personalize interview questions based on this."
- Select: Target Role (searchable dropdown or cards)
- Input: Company names (comma-separated, optional)

**Target Roles** (with icons):
- Frontend Developer (React icon)
- Backend Developer (Server icon)
- Full Stack Developer (Stack icon)
- Mobile Developer (Phone icon)
- DevOps Engineer (Cloud icon)
- Data Scientist (Chart icon)
- Product Manager (Target icon)
- Solution Architect (Building icon)
- Security Engineer (Shield icon)
- QA Engineer (Bug icon)
- Other (Text input)

**Behavior**:
- Cards for roles (visual + text)
- Multi-select for target companies (optional)
- Show industry insights for selected role
- "Why this helps" tooltip

---

### Step 3: Skill Profile

**URL**: `/onboarding/step-3-skills`

**Components**:
- Headline: "What's your tech stack?"
- Subheading: "Select technologies you're comfortable with."
- Multi-select: Skills/Technologies

**Skills by Category**:

**Frontend**:
- React, Vue, Angular, Svelte, Next.js, Remix, Astro

**Backend**:
- Node.js, Python, Java, Go, Rust, C#, PHP, Ruby

**Databases**:
- PostgreSQL, MySQL, MongoDB, Redis, DynamoDB, Cassandra

**Cloud**:
- AWS, Google Cloud, Azure, Heroku, Vercel

**DevOps/Tools**:
- Docker, Kubernetes, Git, GitHub, GitLab, CI/CD

**Behavior**:
- Tag-based input with autocomplete
- Show skill level (Beginner/Intermediate/Advanced) sliders (optional)
- Category tabs for organization
- "Skills will be used to generate personalized questions"

---

### Step 4: Upload Resume

**URL**: `/onboarding/step-4-resume`

**Components**:
- Headline: "Upload your resume"
- Subheading: "We'll analyze it for ATS compatibility and extract key skills."
- Drag-drop zone
- File input
- File format helper text (PDF, DOCX)

**Behavior**:
- Accept PDF and DOCX only
- Max 10MB file size
- Show file upload progress
- Trigger resume parsing immediately on upload
- Show loading state with tips about ATS

---

### Step 5: ATS Analysis Results

**URL**: `/onboarding/step-5-ats-results`

**Components**:
- Headline: "Your Resume Analysis"
- ATS Score Card (0-100)
- Visual health indicator (Red/Yellow/Green)
- Breakdown cards:
  - **Detected Skills** (tags)
  - **Missing Keywords** (for target role)
  - **Resume Strengths** (bullet points)
  - **Quick Improvements** (actionable suggestions)
- CTA: "View Detailed Analysis" (links to /dashboard/resume)

**Behavior**:
- Show animation for score reveal
- Highlight improvements as expandable cards
- Allow user to download improved resume (future feature)
- Show confidence that matches target role keywords

---

### Step 6: Personalized Roadmap

**URL**: `/onboarding/step-6-roadmap`

**Components**:
- Headline: "Your Learning Roadmap"
- Subheading: "Based on your role and skills, here's what to focus on."
- Roadmap cards:
  - **Recommended Interview Tracks** (3-4 items)
  - **Weak Skill Areas** (areas to improve)
  - **Suggested Practice Topics** (ranked by importance)
- Weekly goals preview

**Roadmap Example for Frontend Developer**:
1. **React Advanced Patterns** (Prerequisite)
2. **System Design for Frontend** (Intermediate)
3. **Performance Optimization** (Advanced)
4. **Behavioral Interview Mastery** (Parallel)

**Behavior**:
- Show estimated time per topic
- Display difficulty progression (Beginner → Intermediate → Advanced)
- Allow bookmarking topics for later
- Show what peers in this role focus on

---

### Step 7: Completion Screen

**URL**: `/onboarding/step-7-complete`

**Components**:
- Success icon/animation
- Headline: "You're ready to start preparing! 🚀"
- Subheading: "Your dashboard is personalized based on your profile."
- Quick preview of dashboard features:
  - Mock Interviews
  - Coding Practice
  - Resume Optimization
  - Learning Roadmap
- CTA: "Go To Dashboard" (primary, blue)
- Secondary CTA: "View Roadmap" (secondary, outline)

**Behavior**:
- Mark onboarding as complete
- Auto-redirect after 5 seconds if user doesn't click
- Show confetti animation (light, professional)
- Update user profile with all collected data

---

## Returning User Flow

### Post-Login Redirect

```typescript
interface UserOnboardingStatus {
  onboardingCompleted: boolean;
  resumeUploaded: boolean;
  careerGoalSelected: boolean;
  lastActiveAt: Date;
}

if (!onboardingCompleted) {
  redirect('/onboarding/step-1-welcome');
} else if (role === 'RECRUITER') {
  redirect('/recruiter/dashboard');
} else if (role === 'ADMIN') {
  redirect('/admin/dashboard');
} else {
  redirect('/dashboard');
}
```

---

## Dashboard Experiences

### Candidate Dashboard

**URL**: `/dashboard`

#### Section 1: Welcome Banner
- Greeting: "Good morning, {Name} 👋"
- Time-based emoji (morning ☀️, afternoon 🌤️, evening 🌙)
- Subheading based on last activity
- Action buttons:
  - **Start Interview** (primary)
  - **Upload Resume** (secondary)
  - **Practice Coding** (secondary)

#### Section 2: Quick Stats Cards

Display in a 2x2 or 4-column grid:

1. **ATS Score**
   - Large number (0-100)
   - Trend indicator (↑ +5 vs. last week)
   - Color-coded background

2. **Interviews Completed**
   - Large number
   - "This month" label
   - Link to interview history

3. **Average Interview Score**
   - Large number (0-100)
   - Sparkline trend chart
   - Best score highlighted

4. **Current Streak**
   - Days in streak
   - Fire emoji 🔥
   - Encouraging message

#### Section 3: Interview Readiness Score

**Layout**: Radial progress indicator + breakdown

```
    ┌─────────────────┐
    │   Readiness     │
    │      72%        │
    │                 │
    └─────────────────┘

Breakdown (horizontal bars):
- Technical:       85% ████████░
- Communication:   72% ███████░░
- Problem Solving: 68% ██████░░░
- Coding:          78% ███████░░
- Confidence:      65% ██████░░░
```

#### Section 4: Recent Activity

Show last 5 items:
- Recent interviews (title, score, date)
- Recent ATS analyses
- Recent coding assessments
- Clickable to view details

#### Section 5: AI-Powered Recommendations

Smart suggestions based on weak areas:
- "System Design concepts showing low performance"
- "Practice SQL queries - 3 failed attempts last week"
- "Behavioral questions about conflict resolution needed"
- "Learn async/await patterns"

Each recommendation is actionable (click → practice session).

#### Section 6: Learning Roadmap Progress

Weekly view:
- This Week's Goals (e.g., "Learn Docker", "Practice System Design")
- Progress bar for each goal
- Completed goals with checkmarks
- Link to full roadmap (/dashboard/roadmap)

#### Section 7: Quick Action Buttons

Sticky or floating action bar:
- 📝 Start Mock Interview
- 💻 Practice Coding Round
- 🎯 Generate Company Questions
- 📄 Upload New Resume
- 📊 View Reports

---

### Recruiter Dashboard

**URL**: `/recruiter/dashboard`

#### Layout

6-section dashboard:

1. **Overview Cards**
   - Total Assessments
   - Pending Evaluations
   - Completed Assessments This Week
   - Average Time to Complete

2. **Assessment List**
   - Recent assessments with status badges
   - Candidate counts
   - Completion rates
   - Actions: View, Edit, Share, Analytics

3. **Candidates Pipeline**
   - Kanban board: Applied → Screening → Interview → Offer
   - Drag-drop candidates between stages
   - Score indicators
   - Quick actions per candidate

4. **Pending Evaluations**
   - List of candidates awaiting evaluation
   - Time since submission
   - CTA: "Evaluate Now"

5. **Performance Analytics**
   - Average assessment score by role
   - Pass rate trends
   - Time to completion

6. **Recent Activity**
   - Who submitted assessments
   - Who passed/failed
   - Who reviewed candidates

---

### Admin Dashboard

**URL**: `/admin/dashboard`

#### Layout

System health and metrics:

1. **System Overview**
   - Total Users
   - Active Users (Today/This Week)
   - Monthly Recurring Revenue
   - Platform Health (uptime %)

2. **User Growth**
   - Growth chart (line or area)
   - New signups this week
   - Active candidates / recruiters / admins

3. **Subscription Metrics**
   - Active subscriptions
   - Churn rate
   - ARPU (Average Revenue Per User)
   - Revenue breakdown by plan

4. **User Management**
   - User list with search/filter
   - Role, subscription, created date
   - Actions: Ban, Verify, Message

5. **Organization Management**
   - Organization list
   - Admin count per org
   - Active usage metrics
   - Billing status

6. **System Health**
   - Database connection status
   - API response times
   - Error rate
   - Recent logs/alerts

---

## Route Structure

### Marketing & Auth Routes
```
GET  /
GET  /pricing
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Onboarding Routes
```
GET  /onboarding
GET  /onboarding/step-1-welcome
GET  /onboarding/step-2-career-goals
GET  /onboarding/step-3-skills
GET  /onboarding/step-4-resume
GET  /onboarding/step-5-ats-results
GET  /onboarding/step-6-roadmap
GET  /onboarding/step-7-complete

POST /api/v1/onboarding/save-step
POST /api/v1/onboarding/submit
POST /api/v1/onboarding/upload-resume
```

### Candidate Dashboard Routes
```
GET  /dashboard
GET  /dashboard/resume
GET  /dashboard/interviews
GET  /dashboard/coding
GET  /dashboard/reports
GET  /dashboard/analytics
GET  /dashboard/roadmap
GET  /dashboard/settings
```

### Interview Routes
```
GET  /candidate/interviews/new
POST /api/v1/interviews/generate
GET  /candidate/interviews/[id]/session
POST /candidate/interviews/[id]/session
GET  /candidate/interviews/[id]/report
```

### Recruiter Routes
```
GET  /recruiter/dashboard
GET  /recruiter/assessments
POST /api/v1/assessments/create
GET  /recruiter/candidates
GET  /recruiter/candidates/[id]
POST /api/v1/assessments/[id]/evaluate
```

### Admin Routes
```
GET  /admin/dashboard
GET  /admin/users
GET  /admin/organizations
GET  /admin/subscriptions
GET  /admin/analytics
```

---

## Design Language

### Typography

**Font Stack**: Inter (primary), JetBrains Mono (code)

**Scale**:
- H1: 32px, weight 700, line-height 1.2
- H2: 24px, weight 600, line-height 1.3
- H3: 20px, weight 600, line-height 1.4
- Body: 16px, weight 400, line-height 1.6
- Small: 14px, weight 400, line-height 1.5
- Tiny: 12px, weight 500, line-height 1.4

### Color System

**Primary**: `#0066FF` (Interactive blue)  
**Secondary**: `#6B7280` (Neutral gray)  
**Success**: `#10B981` (Green)  
**Warning**: `#F59E0B` (Amber)  
**Error**: `#EF4444` (Red)  
**Background**: `#FFFFFF` (light mode), `#0F172A` (dark mode)  

### Spacing

Use 4px grid:
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px
- 3XL: 64px

### Components

**Buttons**:
- Primary (filled blue)
- Secondary (outline gray)
- Tertiary (ghost/link)
- Sizes: SM, MD, LG
- States: Default, Hover, Active, Disabled

**Cards**:
- Subtle border (1px #E5E7EB)
- Padding: 16px / 24px
- Border radius: 8px
- Shadow: Subtle (0 1px 2px rgba(0,0,0,0.05))

**Inputs**:
- Height: 40px
- Border radius: 6px
- Border: 1px #D1D5DB
- Focus: Blue outline
- Placeholder: #9CA3AF

**Icons**:
- Lucide React (consistent 24px size)
- Color: Inherit or gray-600

### Interactions

**Transitions**: 200ms ease-in-out (standard)  
**Animations**: Smooth, purposeful (not bouncy)  
**Micro-interactions**: Hover state changes, button presses, form feedback

---

## Component Library

### Core Components (to be created)

1. **OnboardingCard** - Step container with title/subtitle
2. **OnboardingProgress** - Step indicator (e.g., "Step 3 of 7")
3. **QuickStatCard** - Metric display with trend
4. **ReadinessRadial** - Circular progress indicator
5. **RecommendationCard** - Actionable insight card
6. **RoadmapCard** - Learning topic card
7. **DashboardSection** - Container with title
8. **InterviewCard** - Interview history item
9. **ActivityFeed** - Recent activity list
10. **StatsGrid** - 2x2 or 4-column metric grid

---

## State Management

### User State (Zustand)

```typescript
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  onboardingProgress: OnboardingProgress;
  
  setUser: (user: User) => void;
  updateOnboardingProgress: (step: number, data: any) => void;
  completeOnboarding: () => void;
}
```

### Onboarding State

```typescript
interface OnboardingProgress {
  currentStep: number; // 1-7
  fullName: string;
  currentStatus: string;
  targetRole: string;
  targetCompanies: string[];
  skills: Skill[];
  resumeFile: File | null;
  resumeAnalysis: AtsAnalysis | null;
  roadmap: RoadmapItem[];
  completed: boolean;
}
```

---

## Success Metrics

- **Onboarding Completion Rate**: Target >85% within 7 days
- **Dashboard Engagement**: >70% daily active users
- **Interview Completion Rate**: >60% start → complete
- **Resume Upload Rate**: >90% in first week
- **User Satisfaction**: NPS >40

---

## Next Steps

1. ✅ Finalize design spec (this document)
2. Create onboarding page components
3. Create dashboard page components
4. Implement authentication guards
5. Build API routes for data persistence
6. Create state management layer
7. Add animations and micro-interactions
8. User testing and iteration
