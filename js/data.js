// ── LuxeStay Static Data ────────────────────────────────────────────────

const ROOMS = [
  { id:"101", type:"Standard",  bed:"King",  price:85,  floor:1, amenities:["WiFi","TV","AC"] },
  { id:"102", type:"Standard",  bed:"Twin",  price:75,  floor:1, amenities:["WiFi","TV","AC"] },
  { id:"201", type:"Deluxe",    bed:"King",  price:130, floor:2, amenities:["WiFi","TV","AC","Mini Bar","Balcony"] },
  { id:"202", type:"Deluxe",    bed:"Queen", price:120, floor:2, amenities:["WiFi","TV","AC","Mini Bar"] },
  { id:"203", type:"Deluxe",    bed:"Twin",  price:110, floor:2, amenities:["WiFi","TV","AC","Mini Bar"] },
  { id:"301", type:"Suite",     bed:"King",  price:220, floor:3, amenities:["WiFi","TV","AC","Mini Bar","Balcony","Jacuzzi"] },
  { id:"302", type:"Suite",     bed:"King",  price:200, floor:3, amenities:["WiFi","TV","AC","Mini Bar","Balcony"] },
  { id:"401", type:"Penthouse", bed:"King",  price:450, floor:4, amenities:["WiFi","TV","AC","Mini Bar","Balcony","Jacuzzi","Butler"] },
];

const TABLES = [
  { id:"T01", zone:"Window",  seats:2, desc:"Romantic window view" },
  { id:"T02", zone:"Window",  seats:2, desc:"Romantic window view" },
  { id:"T03", zone:"Main",    seats:4, desc:"Central dining area" },
  { id:"T04", zone:"Main",    seats:4, desc:"Central dining area" },
  { id:"T05", zone:"Main",    seats:6, desc:"Great for groups" },
  { id:"T06", zone:"Terrace", seats:4, desc:"Outdoor terrace" },
  { id:"T07", zone:"Terrace", seats:6, desc:"Outdoor terrace, large" },
  { id:"T08", zone:"Private", seats:8, desc:"Private dining room" },
  { id:"T09", zone:"Bar",     seats:2, desc:"Bar-side seating" },
  { id:"T10", zone:"Bar",     seats:2, desc:"Bar-side seating" },
];

const MEAL_TIMES = [
  "Breakfast — 07:00", "Breakfast — 08:00", "Breakfast — 09:00",
  "Lunch — 12:00",     "Lunch — 13:00",     "Lunch — 14:00",
  "Dinner — 18:00",    "Dinner — 19:00",    "Dinner — 20:00", "Dinner — 21:00",
];

const TYPE_COLORS = {
  Standard:  "#5b9bd5",
  Deluxe:    "#e2b96f",
  Suite:     "#f0a500",
  Penthouse: "#e05c5c",
};

const ZONE_COLORS = {
  Window:  "#5b9bd5",
  Main:    "#e2b96f",
  Terrace: "#4caf82",
  Private: "#f0a500",
  Bar:     "#e05c5c",
};

const ZONE_ICONS = {
  Window:  "🪟",
  Main:    "🍽",
  Terrace: "🌿",
  Private: "🔒",
  Bar:     "🍸",
};
