# MoWave Voucher Management System

A modern React application for managing internet vouchers, payments, and system architecture for hotspot solutions.

---

🚀 **Live Demo:** [https://voucher-frontend-omega.vercel.app/](https://voucher-frontend-omega.vercel.app/)

---

## Features

- **User Authentication**: Login and registration with email, phone, and password
- **Voucher Management**: Generate, list, search, and filter internet vouchers
- **Payment Integration**: Initiate payments for vouchers, view payment history
- **Dashboard**: System architecture overview and project tracker
- **Responsive UI**: Built with Tailwind CSS and Lucide icons
- **Toast Notifications**: User-friendly feedback for all actions
- **API Integration**: Connects to a Node.js/Express backend (see below)

## Tech Stack

- React 19+
- Tailwind CSS
- Lucide React Icons
- Fetch API for backend communication

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nicowalter256/voucher-frontend.git
   cd voucher-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

## API Integration

This app is designed to work with the [MoWave Voucher Backend](https://voucher-backend-1.onrender.com).

### Key Endpoints Used

- `POST /auth/login` — User login
- `POST /auth/register` — User registration
- `GET /vouchers` — List vouchers
- `POST /vouchers/generate` — Generate a new voucher
- `POST /payments/init` — Initiate a payment
- `GET /payments/my` — List user payments

> **Note:** All authenticated endpoints require a Bearer token in the `Authorization` header.

## Usage

- **Login/Register**: Create an account or sign in with your credentials.
- **Voucher Management**: Generate new vouchers, search/filter, and copy codes.
- **Payments**: Initiate payments for unused vouchers and view your payment history.
- **Dashboard**: Click the dashboard card to view the system architecture and project progress.
- **Navigation**: Seamlessly switch between voucher management and dashboard views.

## Development Notes

- **Config**: API endpoints and storage keys are managed in `src/config.js`.
- **API Utilities**: All API calls use `src/utils/api.js` for authentication and error handling.
- **Toast System**: Global toast notifications are available via `window.showToast()`.
- **Routing**: Simple view state management is used instead of React Router for this version.
- **Error Handling**: Handles 201 Created responses and non-JSON responses gracefully.

## Customization

- **Styling**: Tailwind CSS classes can be customized in `tailwind.config.js`.
- **Icons**: Uses [Lucide React](https://lucide.dev/) for all icons.
- **Backend**: You can point the API base URL to your own backend in `src/config.js`.

## License

MIT
