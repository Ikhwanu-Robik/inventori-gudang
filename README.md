# Inventori Gudang — Warehouse Inventory Management System

A modern Next.js 16 (App Router) warehouse inventory management application featuring interactive SVG floorplan map location tracking, stock allocations, and outbound movement logging powered by Prisma 7 and Neon PostgreSQL.

---

## 🌟 Key Features

1. **Dashboard & Add New Item (`/` & `/items/new`)**:
   - Add new items with image upload, stock quantity, quantity units (`pcs`, `boxes`, `plt`, `kg`, `liters`, `units`, `meters`), and notes.
   - Interactive SVG Warehouse Blueprint selector to pin exact stock location coordinates `(xPct, yPct)` on floorplan maps.

2. **Inventory Catalog (`/items`)**:
   - Browse catalog of warehouse items with search filtering.
   - Aggregate total stock counts across multiple mapped warehouse locations.
   - Location badges detailing assigned warehouse facilities.

3. **Item Details & Interactive Floorplan (`/items/[id]`)**:
   - Detailed item specifications and complete stock breakdown.
   - Interactive SVG floorplan map displaying real-time target pin markers and location badges.

4. **Outbound Movement Recording (`/items/outbound`)**:
   - Item search with live autocomplete dropdown.
   - Dispatch location marker selector with stock validation.
   - Outbound movement recording with quantity, editable unit, and transaction tracking notes (`outboundNote`).

---

## 🛠 Tech Stack

- **Framework**: Next.js 16.2.10 (App Router)
- **Library**: React 19.2.4
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5 (Strict Mode)
- **Database / ORM**: Prisma 7 ORM with Neon PostgreSQL (`@prisma/adapter-neon`)

---

## 🗄 Data Model Architecture

The database schema consists of 4 main models:
- **`WarehouseBlueprint`**: Master facility data (`gudang-joglo`, `gudang-selatan`) & SVG map paths.
- **`Item`**: Master inventory catalog items.
- **`ItemLocation`**: Stock allocation mapped to exact percentage coordinates `(xPct, yPct)` on a warehouse blueprint.
- **`StockMovement`**: Transaction audit logs (`INBOUND`, `OUTBOUND`, `TRANSFER`) for stock movement history.

For a detailed Entity Relationship Diagram (ERD) and model field specifications, see [docs/DATA_MODELS.md](./docs/DATA_MODELS.md).

---

## 🚀 Getting Started

### 1. Installation

Install project dependencies:

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
DIRECT_URL="postgresql://user:password@host/neondb?sslmode=require"
```

### 3. Database Sync & Seeding

Sync Prisma schema with database and seed initial master data:

```bash
npm run db:push
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

- `npm run dev` — Start Next.js development server
- `npm run type-check` — Verify strict TypeScript compilation (`tsc --noEmit`)
- `npm run build` — Build production bundle
- `npm run lint` — Run ESLint checks
- `npm run db:generate` — Generate Prisma Client (`v7.9.1`)
- `npm run db:push` — Push Prisma schema directly to PostgreSQL database
- `npm run db:seed` — Seed initial warehouse blueprints and inventory items
- `npm run db:studio` — Launch Prisma Studio GUI database browser

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx             # Root layout & Navbar
│   ├── page.tsx               # Dashboard / Quick Input
│   └── items/
│       ├── page.tsx           # Inventory Catalog
│       ├── [id]/page.tsx      # Item Details & Floorplan Map
│       ├── new/page.tsx       # Add New Item Page
│       └── outbound/page.tsx  # Outbound Movement Form
├── components/
│   ├── ItemCard.tsx           # Catalog item card component
│   ├── ItemDetailsClient.tsx  # Interactive details client view
│   ├── ItemInputForm.tsx     # Inbound item form
│   ├── Navbar.tsx             # Navigation header
│   ├── OutboundForm.tsx       # Outbound transaction form
│   └── WarehouseBlueprint.tsx # Interactive SVG floorplan map
├── docs/
│   └── DATA_MODELS.md         # Database schema & ERD documentation
├── lib/
│   ├── inventory.ts           # Types & fallback catalog items
│   └── prisma.ts              # Prisma client singleton (Neon adapter)
└── prisma/
    ├── schema.prisma          # PostgreSQL Prisma models
    └── seed.ts                # Database seed script
```
