# Manyavar

A premium ethnic wear destination offering curated collections for weddings, festivals, and special occasions.

## Available scripts

- `npm install` - install dependencies
- `npm run dev` - start development server
- `npm run build` - build production version
- `npm start` - run production server after build

## Features

- **Redux State Management**: Cart functionality with add/remove items
- **Product Filtering**: Filter by category and sort by name, price, or rating
- **Responsive Design**: Bootstrap-based responsive layout
- **Multiple Routes**: Home, Shop, About, Contact, Cart, Checkout

## Routes

- `/` - Home page with hero, categories, and collections
- `/shop` - Shop page with filters, sorting, and add to cart
- `/about` - About page with company story and stats
- `/contact` - Contact page with form and FAQ
- `/cart` - Cart page with item management
- `/checkout` - Checkout page with order summary

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Redux Toolkit
- Bootstrap 5
- CSS Modules

## Cart Features

- Add items to cart from shop page
- View cart with item details and quantities
- Remove individual items or clear entire cart
- Cart count badge in navigation
- Proceed to checkout

## Run locally

From the project folder:
- `npm run dev`

Then open:
- `http://localhost:3000` (or 3001 if 3000 is busy)
