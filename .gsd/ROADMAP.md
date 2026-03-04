# Roadmap: KrushiKranti 2.0 Frontend

## Milestone 0: Identity & Security

### Phase 0: Google OAuth Integration
- [x] Configure Google OAuth Provider.
- [x] Implement "Continue with Google" on Login/Register.
- [x] Implement Role Selection flow for first-time users.
- [x] Secure JWT storage & Axios Intercetpors.
- [x] Implement Google Logout & Session Revocation.

## Milestone 1: Foundation & Essential Modules

### Phase 1: Storage & Initial Setup
- [ ] Implement `orderSlice` and `chatSlice` in Redux store.
- [ ] Create folder structures for missing modules (`chat`, `orders`).
- [ ] Install missing dependencies (recharts, jspdf, razorpay/stripe).

### Phase 2: User Checkout & Orders
- [ ] Implement Checkout Page UI and logic.
- [ ] Implement Order History page for users.
- [ ] Implement Order Tracking UI.
- [ ] Integrate mock payment gateway (Stripe/Razorpay).

### Phase 3: Wishlist & Product Engagement
- [ ] Implement Wishlist Redux slice with localStorage persistence.
- [ ] Create Wishlist Page UI.
- [ ] Implement Reviews & Ratings data model.
- [ ] Build Review listing and Add Review form on Product Detail page.
- [ ] Average rating display on Product Cards.

## Milestone 2: Dashboards & Real-time Integration

### Phase 4: Farmer & Wholesaler Dashboards Enhancement
- [ ] Implement Farmer Orders management.
- [ ] Implement Farmer Earnings Analytics with Recharts.
- [ ] Implement Wholesaler approve/reject bulk requests.
- [ ] Implement Wholesaler Inventory management.

### Phase 5: Real-time Chat Module
- [ ] Set up Socket.io-client connection.
- [ ] Implement Chat UI (WhatsApp Web style).
- [ ] Implement contact listing for Farmers/Users/Wholesalers.
- [ ] Add online indicators and typing indicators.

## Milestone 3: Order Management & Polish

### Phase 6: Advanced Order Management
- [ ] Implement Order Filtering and Pagination in `MyOrdersPage`.
- [ ] Implement Order Cancellation flow with modal.
- [ ] Build Refund Request UI (mock).

### Phase 7: Admin Panel Implementation
- [ ] Implement Admin Analytics dashboard.
- [ ] Implement User management (Ban/Unban).
- [ ] Implement Product moderation (Approve/Reject).
- [ ] Implement Category management.

### Phase 8: Admin Enterprise Upgrade
- [ ] Implement Fraud Detection UI & Analytics.
- [ ] Build Commission Tracking & Platform Earnings charts.
- [ ] Implement CSV Data Export (Users/Orders).
- [ ] Add Advanced Analytics (City-wise distribution, Farmer top performers).
- [ ] Build Admin Activity Logs with filtering.

### Phase 9: Professional Polish & Delivery
- [ ] Implement PDF Invoice generation.
- [ ] Add advanced Framer Motion animations (parallax, counters).
- [ ] Ensure full dark mode consistency.
- [ ] Final responsive audit and performance optimization.
- [ ] Empirical validation against SPEC.md.
