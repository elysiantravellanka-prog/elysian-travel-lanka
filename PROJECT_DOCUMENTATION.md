# Project Documentation

## 1. Project Overview
This project is a comprehensive tourism management platform built with **Next.js 16 (App Router)**. It consists of a public-facing web application for customers to browse and book tours, and a secure admin dashboard for managing content, inquiries, and users.

**Key Technologies:**
- **Framework:** Next.js 16 (React 19)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS v4
- **Image Hosting:** Cloudinary
- **Validation:** Zod + React Hook Form

---

## 2. Architecture & Folder Structure

The project follows a modern Next.js App Router structure with distinct separation between public and admin routes, using Server Actions for backend logic.

### Directory Structure
- **`src/app/(public)`**: Public-facing web pages (Home, Packages, Contact).
- **`src/app/admin`**: Admin dashboard routes (protected).
- **`src/app/api`**: API endpoints (primary usage: NextAuth).
- **`src/models`**: Mongoose database schema definitions.
- **`src/lib`**: Utilities, database connection (`db.ts`), and Server Actions (`actions/`).
- **`src/components`**: Reusable UI components.

---

## 3. Database Architecture (MongoDB)

The database is built on MongoDB using Mongoose for object modeling. Below are the key entities.

### 3.1. AdminUser
Manages authentication for dashboard access.
- **Fields**: `username`, `email` (unique), `password` (hashed), `role` ('admin' | 'super-admin').
- **Security**: Passwords are hashed using bcrypt before saving.

### 3.2. TourPackage
Represents the core product (Tour Packages).
- **Fields**:
  - `title`, `slug` (auto-generated from title)
  - `price`, `duration`, `category` (Wildlife, Cultural, etc.)
  - `description`, `images` (Cloudinary URLs)
  - `itinerary`: Array of objects `{ day, title, description }`
  - `inclusions`, `exclusions`: Arrays of strings
  - `groupSize`, `startLocation`, `isFeatured`

### 3.3. Destination
Stores metadata about specific locations.
- **Fields**: `name` (unique), `description`, `image`, `highlights`.

### 3.4. Inquiry
Tracks customer leads and bookings.
- **Types**: General Contact, Booking Request, Tailor-made.
- **Fields**:
  - `customerName`, `email`, `phone`, `message`
  - `status`: 'New' | 'Contacted' | 'Closed'
  - `inquiryType`: 'booking' | 'contact' | 'tailor-made'
  - **Tailor-made specific**: `travelDates`, `paxCount`, `budget`, `interests`.

### 3.5. Testimonial
Customer reviews and feedback.
- **Fields**: `name`, `location`, `rating` (1-5), `message`, `image`, `isApproved`.

---

## 4. Backend Architecture

The application uses **Server Actions** (`src/lib/actions/*`) instead of traditional REST API routes for most data mutations and fetching. This ensures type safety and better integration with Next.js Client Components.

### Key Server Actions
| Module | File | Key Functions |
| :--- | :--- | :--- |
| **Tours** | `src/lib/actions/tours.ts` | `createTour`, `updateTour`, `deleteTour`, `getTours`, `getTourBySlug` |
| **Destinations** | `src/lib/actions/destinations.ts` | CRUD operations for Destinations. |
| **Inquiries** | `src/lib/actions/inquiries.ts` | `createInquiry`, `updateInquiryStatus`, `getInquiries` |
| **Testimonials** | `src/lib/actions/testimonials.ts` | `approveTestimonial`, `createTestimonial`, `deleteTestimonial` |

---

## 5. Features & Functions

### 5.1. Web Application (Public)
1.  **Home Page (`/`)**:
    - Showcases featured tours.
    - Highlights destinations and customer testimonials.
2.  **Tour Packages (`/packages`)**:
    - Browse all available tours.
    - Filter by category (Wildlife, Adventure, etc.) - *Implementation inferred*.
    - **Tour Detail Page**: View itinerary, price, inclusions, and book directly.
3.  **Tailor-Made (`/tailor-made`)**:
    - A specialized form for customers to request custom tour plans.
    - Captures budget, dates, and interests.
4.  **Contact (`/contact`)**:
    - General inquiry form.

### 5.2. Admin Dashboard (`/admin`)
1.  **Authentication**:
    - Secure login using NextAuth credentials.
2.  **Dashboard Overview**:
    - Likely displays key metrics (total inquiries, recent bookings).
3.  **Tour Management**:
    - Create/Edit/Delete tours.
    - Manage complex data like Itineraries (day-by-day) and images.
    - **Image Handling**: Deleting a tour automatically cleans up associated images from Cloudinary.
4.  **Inquiry Management**:
    - View incoming inquiries.
    - Update status (e.g., mark as "Contacted" or "Closed").
5.  **Content Management**:
    - Manage **Destinations** and approval of **Testimonials**.

---

## 6. Integrations

- **Cloudinary**:
  - Used for storing high-quality tour images and destination photos.
  - Integration handles upload and identifying public IDs for deletion.
- **NextAuth.js**:
  - Handles session management and route protection for `/admin`.
