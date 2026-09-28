# Resin & Paper Craft — Full-Stack E-Commerce Website

A production-ready e-commerce store built for a small handmade craft business specializing in **resin crafts, paper crafts, floral bookmarks, and artisanal decorative keepsakes**.

Designed with a warm, handcrafted aesthetic (cream/beige/terracotta/sage green palette, Playfair Display & Plus Jakarta Sans typography) and backed by **Next.js 16.3.3**, **Tailwind CSS v4**, **Neon PostgreSQL**, and **Prisma ORM**.

---

## Features

### 🛍️ Customer Storefront
- **Artisanal Homepage (`/`)**: Hero showcase, featured handmade creations, dynamic database categories, value propositions, and handmade story.
- **Shop Page (`/shop`)**: Browse active catalog with live category filtering, search, and sorting (Newest, Price Low to High, Price High to Low, Name A-Z).
- **Product Details (`/products/[slug]`)**: High-res image gallery with interactive thumbnails, stock counters, quantity selectors, dynamic SEO metadata, and related crafts.
- **Shopping Cart (`/cart`)**: Persistent browser cart (via `useSyncExternalStore` + `localStorage`), instant slide-over cart drawer, quantity updates, and stock boundary checks.
- **Checkout (`/checkout`)**: Guest checkout with strict server-side validation. **Cash on Delivery ONLY** (no prepayment gateways required).
- **Order Confirmation (`/order-success/[orderNumber]`)**: Human-readable order numbers (e.g. `RPC-10024`), breakdown of items, delivery details, and Cash on Delivery instructions.
- **Brand Story & Contact (`/about`, `/contact`)**: Warm small-batch workshop story and customizable contact placeholders.

### 🛡️ Admin Workspace (`/admin`)
- **Secure Authentication (`/admin/login`)**: Bcrypt password hashing and encrypted HttpOnly session cookies.
- **Real-Time PostgreSQL Dashboard (`/admin`)**: Real database statistics for total revenue, active crafts, out-of-stock items, total orders, pending orders, and recent orders.
- **Product Management (`/admin/products`)**:
  - Create, edit, and manage products.
  - **Direct image uploads** from your computer or external image URLs.
  - Stock quantity tracking and visibility toggles (`isActive`, `isFeatured`).
  - Safe deletion: automatically deactivates products referenced by existing orders to protect sales history.
- **Category Management (`/admin/categories`)**: Create, edit, and deactivate database-driven categories with live product counters.
- **Order Management (`/admin/orders`, `/admin/orders/[id]`)**: Filter and search orders, view complete customer address & instructions, item snapshots, and update order status (`Pending`, `Confirmed`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### 🔒 Business & Security Rules
- **Server-Side Price & Stock Recalculation**: Prices and totals sent from the browser are never trusted; all totals are re-calculated on the server.
- **Database Transactions (`prisma.$transaction`)**: Orders and product stock decrements execute atomically.
- **Stock Exhaustion Protection**: Prevents ordering more units than currently in stock with clear user feedback.
- **Immutable Order Snapshots**: `OrderItem` stores the product name and price snapshot at time of purchase.

---

## Tech Stack

- **Framework**: Next.js 16.3.3 (App Router, Server Components & Server Actions)
- **UI & Styling**: React 19, Tailwind CSS v4, Lucide React icons
- **Database**: Neon PostgreSQL
- **ORM**: Prisma 6.19.3
- **Authentication**: BcryptJS + Jose (Signed HttpOnly Cookies)
- **Fonts**: Google Fonts (`Playfair_Display` & `Plus_Jakarta_Sans`)

---

## Getting Started

### Prerequisites

- **Node.js**: v18.17+ or v20+ (tested on Node v22.14)
- **Database**: A Neon PostgreSQL connection string

### 1. Installation

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Neon PostgreSQL Connection URL
DATABASE_URL="postgresql://user:password@ep-sample.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret for Admin Session Cookies (generate a secure 32+ char string)
AUTH_SECRET="your-super-secret-jwt-key"

# Default Delivery Charge (Cash on Delivery)
DEFAULT_DELIVERY_FEE="80"

# Initial Admin Credentials (used during db seed)
ADMIN_EMAIL="admin@resincraft.com"
ADMIN_PASSWORD="admin123456"

# App Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Store Branding & Contact Configuration
NEXT_PUBLIC_STORE_NAME="Resin & Paper Craft"
NEXT_PUBLIC_CONTACT_PHONE="+880 1700-000000"
NEXT_PUBLIC_CONTACT_EMAIL="hello@resincraft.com"
NEXT_PUBLIC_CONTACT_ADDRESS="Dhanmondi, Dhaka, Bangladesh"
```

### 3. Database Migration & Seeding

Sync your schema with Neon PostgreSQL and seed initial categories, products, sample order, and the admin user:

```bash
# Push Prisma schema to Neon PostgreSQL
npx prisma db push

# Seed sample handcrafted products and the default admin account
npx prisma db seed
```

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Credentials

- **Admin Login Route**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@resincraft.com` (or the value set in `ADMIN_EMAIL`)
- **Password**: `admin123456` (or the value set in `ADMIN_PASSWORD`)

---

## Production Build

To test or run the production build:

```bash
npm run build
npm run start
```

---

## Deploying to Vercel + Neon

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In the Vercel project settings under **Environment Variables**, add:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `DEFAULT_DELIVERY_FEE`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL)
4. Set Build Command: `npx prisma generate && next build`
5. Deploy!
