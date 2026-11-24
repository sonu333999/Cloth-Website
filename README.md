# MAISON LUMIÈRE — Interactive Fashion Lookbook

Luxury digital fashion magazine and interactive 3D circular lookbook showroom built with React, TypeScript, Tailwind CSS, GSAP, Motion, Lenis, Express, and Firebase (Cloud Firestore & Google Auth).

Web Link : https://ai.studio/apps/c81c9e89-988a-4cdb-a1b6-d8d671d6bf3e?fullscreenApplet=true

## Key Features
- **3D Circular Fashion Carousel**: Continuous modular looping 3D orbital stage (`perspective: 1400px`, `translate3d`, `rotateY`, dynamic scale/opacity/blur) supporting drag, touch swipe, horizontal wheel, click-to-focus, and keyboard arrows.
- **Editorial Lookbook Sections**: Featured Collections gallery, 6 asymmetrical Collection Stories, full-width Campaign spread (*THE ART OF DRESSING*), Shop the Look cards, House Philosophy, Newsletter signup, and Footer.
- **Live Cloud Persistence (Firebase Firestore & Auth)**:
  - Real-time collection & product catalog (`/collections`, `/products`)
  - Authenticated Google Sign-In shopping bag (`/users/{uid}/cart`), wishlist (`/users/{uid}/wishlist`), and order reservations (`/orders`)
  - Newsletter subscriptions (`/newsletter`)
  - Role-protected Atelier Admin Showroom (`/admin`) with collection/product CRUD, stock & order status management, Cloudinary upload integration, and editable brand identity (`/settings/brand`).
- **PostgreSQL Reference Schema**: Included in `database/schema.sql` for relational deployments.

## Environment Variables
See `.env.example` for optional `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` variables for direct image uploads in the Admin dashboard.
