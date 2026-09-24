# MyNextWhip.com — Honest Affordable Car Marketplace

> **"FIND YOUR NEXT WHIP."**  
> *Affordable cars, trucks, projects, and daily drivers — honestly represented.*  
> *"Your next car doesn't have to be perfect. It just has to be honest."*

MyNextWhip exists for the vehicles that traditional collector auction sites and curated platforms ignore: reliable cheap beaters, high-mileage work trucks, 4x4 trail projects, mechanic specials, utility vans, and budget daily commuters under $10,000.

---

## 🚗 Core Principles

1. **Honest Over Pretty:** Sellers are actively encouraged and rewarded for disclosing known problems (check engine lights, oil leaks, rust spots, AC issues, slipping clutch, past accidents).
2. **Show The Evidence:** Every listing features cold-start videos, walkaround videos, 17-character NHTSA VIN decoding, and service receipts.
3. **Local First:** Search with dynamic Haversine radius calculations (10, 25, 50, 100, 250, Nationwide) across regional markets.
4. **5-Minute Seller Experience:** Guided mobile-first wizard from VIN input to live listing submission.
5. **Trust Without Pretending:** Clear distinction between seller-disclosed facts and platform verification. We verify documentation and video media, but we do not fake mechanical certifications or pretend to provide warranties.

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide Icons + Motion
- **Design System:** Mobile-first automotive layout with high-contrast Charcoal (`#12151A`), Whip Orange (`#EA580C`), Emerald Verified badges, and Amber honesty disclosures.
- **VIN Decoding:** Real-time integration with the federal **NHTSA vPIC API** (`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/`) with offline fallback for famous enthusiast and budget test VINs.
- **The Whip Report Engine:** Generates customized in-person buyer inspection checklists dynamically based on the exact issues disclosed by the seller.
- **Storage & State Machine:** Persistent repository architecture simulating PostgreSQL + PostGIS with full audit logging, listing state machine, user switching, and real-time chat.
- **Monetization:** Standard $19 listing fee (configurable from the Admin portal).

---

## 🚦 Listing State Machine

```
   DRAFT
     ↓
 SUBMITTED
     ↓
 PROCESSING
     ↓
PENDING_REVIEW  ──(Admin Request Info)──> NEEDS_INFORMATION
     ↓ (Admin Approval)
   ACTIVE
     ↓ (Offer Accepted)
UNDER_OFFER
     ↓ (Transaction Complete)
    SOLD
     ↓
  ARCHIVED
```

---

## 👤 Test Personas (Switchable in Header)

1. **Mike Reynolds (Buyer):** Searching for an affordable truck or fun daily driver under $10k.
2. **Sarah Jenkins (Seller):** Owner of the featured 2008 Toyota Tacoma SR5 with transparent disclosures and cold-start video.
3. **Dave Kovacs (Mechanic/Seller):** Garage enthusiast selling a 1993 NA Miata project and a Forester XT mechanic special.
4. **Alex Vance (Platform Admin):** Platform moderator with full permissions to approve/reject listings, review community reports, and configure platform pricing.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your mobile browser or desktop.

### 4. Build for Production
```bash
npm run build
```

---

## 📋 Definition of Done Verification

- [x] User registration & test persona switcher
- [x] Search inventory with keyword, price, mileage, transmission, drivetrain, title status
- [x] Geographic radius filtering (10, 25, 50, 100, 250, Nationwide)
- [x] Vehicle detail page with swipeable photos and cold-start video player
- [x] **The Whip Report** with honesty disclosures and dynamically compiled inspection questions
- [x] 9-Step Seller Flow with instant NHTSA VIN decoding
- [x] Photo uploader with category guidance slots
- [x] Cold-start and walkaround video capture simulation
- [x] Truth confirmation checkbox & Stripe-style $19 listing payment
- [x] Moderation queue for Admin approval/rejection
- [x] In-app buyer/seller messaging and offer negotiation
- [x] In-person meetup & safe exchange zone appointment booking
- [x] Saved whips and saved search alerts
- [x] Anonymous community reporting with moderation review
- [x] Administrative audit logs
- [x] Mobile-first thumb navigation
