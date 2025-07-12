# BidWizer – AI-Powered Tender Management Platform

BidWizer is a modern web application that helps companies find, analyze, and respond to tenders with the power of AI. It streamlines the bidding process for both bidders and publishers, enabling collaboration, document management, and intelligent automation.

---

## Features

- **AI-Powered Tender Analysis:** Summarize and query tender documents using OpenAI.
- **Multi-Step Registration:** Company-centric onboarding for bidders, with team invites and document uploads.
- **Role-Based Dashboards:** Separate workspaces for bidders, publishers, and admins.
- **Tender Publishing:** Publishers can create, manage, and track tenders.
- **Document Library:** Centralized resource center for company documents and templates.
- **Team Collaboration:** Invite and manage team members (plan-based limits).
- **Secure Authentication:** JWT-based, with email confirmation and role enforcement.
- **Admin Controls:** User management, audit logs, and platform analytics.

---

## User Flows

### 1. **Bidders**
- Register company via multi-step onboarding.
- Confirm email to activate account.
- Invite team members and upload company documents.
- Search, analyze, and respond to tenders using AI tools.

### 2. **Publishers**
- Register organization and confirm email.
- Access publisher dashboard to create and manage tenders.
- View statistics on published tenders.

### 3. **Admins**
- Log in via admin portal.
- Manage users, approve/reject publishers, and view platform stats.

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, shadcn/ui, React Router
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL
- **AI:** OpenAI API (for document analysis and Q&A)
- **Email:** Nodemailer (SMTP)
- **Authentication:** JWT (JSON Web Tokens)

---

## Local Development

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- OpenAI API Key

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/bidwizer-tender-flow.git
   cd bidwizer-tender-flow
   ```

2. **Install dependencies:**
   ```bash
   cd bidwizer-backend
   npm install
   cd ../
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in both root and `bidwizer-backend/`.
   - Set your database URL, OpenAI API key, and SMTP credentials.

4. **Run database migrations and seed:**
   ```bash
   cd bidwizer-backend
   npx prisma migrate deploy
   npm run seed
   ```

5. **Start the backend:**
   ```bash
   npm start
   ```

6. **Start the frontend:**
   ```bash
   cd ../
   npm run dev
   ```

---

## Folder Structure
