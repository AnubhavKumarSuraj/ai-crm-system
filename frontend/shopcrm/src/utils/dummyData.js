/**
 * Dummy / seed data — used while backend is not ready.
 * Remove or replace with real API calls once backend is live.
 */

// helper function
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

// ─── DUMMY CUSTOMERS ─────────────────────────────────────────────
export const DUMMY_CUSTOMERS = [
  {
    id: "c1",
    name: "Priya Sharma",
    phone: "+91 98765 00001",
    email: "priya@email.com",
    last_visit: daysAgo(5),
  },
  {
    id: "c2",
    name: "Ravi Kumar",
    phone: "+91 98765 00002",
    email: "ravi@gmail.com",
    last_visit: daysAgo(12),
  },
  {
    id: "c3",
    name: "Anjali Mehta",
    phone: "+91 98765 00003",
    email: "anjali@yahoo.com",
    last_visit: daysAgo(45),
  },
  {
    id: "c4",
    name: "Suresh Patil",
    phone: "+91 98765 00004",
    email: "suresh@email.com",
    last_visit: daysAgo(3),
  },
  {
    id: "c5",
    name: "Kavitha Nair",
    phone: "+91 98765 00005",
    email: "kavitha@email.com",
    last_visit: daysAgo(60),
  },
  {
    id: "c6",
    name: "Deepak Singh",
    phone: "+91 98765 00006",
    email: "deepak@email.com",
    last_visit: daysAgo(20),
  },
];

// ─── DUMMY CAMPAIGNS ─────────────────────────────────────────────
export const DUMMY_CAMPAIGNS = [
  {
    id: "p1",
    name: "Diwali Festival",
    message: "Hi {name}, celebrate Diwali with our special 20% discount!",
    type: "manual",
    created: daysAgo(2),
  },
  {
    id: "p2",
    name: "Win-Back Offer",
    message: "Hi {name}, we miss you! Come back & get a free gift.",
    type: "automated",
    created: daysAgo(7),
  },
];