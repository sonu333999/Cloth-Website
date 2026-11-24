-- Reference PostgreSQL Schema for MAISON LUMIÈRE Fashion Lookbook
-- Note: Live runtime persistence in this deployment uses Cloud Firestore & Firebase Auth
-- (see firebase-blueprint.json & firestore.rules).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uid VARCHAR(128) UNIQUE NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collections (
  id VARCHAR(128) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(64) NOT NULL,
  description VARCHAR(500) NOT NULL,
  editorial_story TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  model_image TEXT NOT NULL,
  alt_text VARCHAR(300) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 1,
  featured BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(128) PRIMARY KEY,
  collection_id VARCHAR(128) NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  description VARCHAR(600) NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  image TEXT NOT NULL,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS cart (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(16) NOT NULL,
  color VARCHAR(48) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(128) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  shipping_address VARCHAR(400) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(254) UNIQUE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'subscribed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
