// ── LuxeStay In-Memory Database ─────────────────────────────────────────

const DB = {
  users: {
    admin: { password:"admin123", fullName:"System Administrator", email:"admin@luxestay.com", role:"admin" },
    guest: { password:"guest123", fullName:"John Guest",           email:"john@email.com",     role:"guest" },
    demo:  { password:"demo123",  fullName:"Demo User",            email:"demo@email.com",     role:"guest" },
  },
  bookings: {},
  roomBookings:  {},   // roomId -> [{checkIn, checkOut}]
  tableBookings: {},   // tableId -> [{date, mealTime}]
  currentUser: null,
};

// Init availability maps
ROOMS.forEach(r  => DB.roomBookings[r.id]   = []);
TABLES.forEach(t => DB.tableBookings[t.id]  = []);

// ── Auth ────────────────────────────────────────────────────────────────

function login(username, password) {
  const u = DB.users[username.toLowerCase().trim()];
  if (u && u.password === password) {
    DB.currentUser = { username: username.toLowerCase(), ...u };
    sessionStorage.setItem("luxestay_user", JSON.stringify(DB.currentUser));
    return DB.currentUser;
  }
  return null;
}

function logout() {
  DB.currentUser = null;
  sessionStorage.removeItem("luxestay_user");
}

function restoreSession() {
  const saved = sessionStorage.getItem("luxestay_user");
  if (saved) {
    DB.currentUser = JSON.parse(saved);
    return DB.currentUser;
  }
  return null;
}

function getCurrentUser() { return DB.currentUser; }

function registerUser(username, password, fullName, email) {
  if (!username.trim())          return { ok:false, msg:"Username cannot be empty." };
  if (DB.users[username.toLowerCase()]) return { ok:false, msg:"Username already exists." };
  if (password.length < 6)       return { ok:false, msg:"Password must be at least 6 characters." };
  if (!email.includes("@"))      return { ok:false, msg:"Please enter a valid email address." };
  DB.users[username.toLowerCase()] = { password, fullName: fullName.trim(), email: email.trim(), role:"guest" };
  return { ok:true, msg:"Account created successfully!" };
}

// ── Hotel bookings ──────────────────────────────────────────────────────

function isRoomAvailable(roomId, checkIn, checkOut) {
  return !DB.roomBookings[roomId]?.some(({ checkIn: ci, checkOut: co }) =>
    !(checkOut <= ci || checkIn >= co)
  );
}

function bookRoom(roomId, checkIn, checkOut, guests, specialRequests = "") {
  const user = DB.currentUser;
  if (!user) throw new Error("You must be logged in.");
  if (checkIn >= checkOut) throw new Error("Check-out must be after check-in.");
  if (!isRoomAvailable(roomId, checkIn, checkOut)) throw new Error(`Room ${roomId} is not available for those dates.`);

  const room    = ROOMS.find(r => r.id === roomId);
  const nights  = Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000);
  const total   = nights * room.price;
  const id      = `HTL-${Math.random().toString(36).substr(2,6).toUpperCase()}`;

  const booking = {
    id, type:"hotel", username: user.username, guestName: user.fullName,
    roomId, roomType: room.type, bedType: room.bed, floor: room.floor,
    checkIn, checkOut, nights, guests,
    pricePerNight: room.price, total, specialRequests: specialRequests.trim(),
    status:"Confirmed", createdAt: new Date().toISOString(),
  };

  DB.bookings[id] = booking;
  DB.roomBookings[roomId].push({ checkIn, checkOut });
  return booking;
}

// ── Restaurant bookings ─────────────────────────────────────────────────

function isTableAvailable(tableId, date, mealTime) {
  return !DB.tableBookings[tableId]?.some(b => b.date === date && b.mealTime === mealTime);
}

function bookTable(tableId, date, mealTime, guests, specialRequests = "") {
  const user  = DB.currentUser;
  if (!user) throw new Error("You must be logged in.");
  const table = TABLES.find(t => t.id === tableId);
  if (guests > table.seats) throw new Error(`Table ${tableId} only seats ${table.seats} guests.`);
  if (!isTableAvailable(tableId, date, mealTime)) throw new Error(`Table ${tableId} is already reserved for that time.`);

  const id = `RES-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
  const booking = {
    id, type:"restaurant", username: user.username, guestName: user.fullName,
    tableId, zone: table.zone, seats: table.seats,
    date, mealTime, guests, specialRequests: specialRequests.trim(),
    status:"Confirmed", createdAt: new Date().toISOString(),
  };

  DB.bookings[id] = booking;
  DB.tableBookings[tableId].push({ date, mealTime });
  return booking;
}

// ── Booking management ──────────────────────────────────────────────────

function getUserBookings() {
  const user = DB.currentUser;
  if (!user) return [];
  if (user.role === "admin") return Object.values(DB.bookings);
  return Object.values(DB.bookings).filter(b => b.username === user.username);
}

function getAllBookings() { return Object.values(DB.bookings); }

function getBooking(id) { return DB.bookings[id]; }

function cancelBooking(id) {
  const b = DB.bookings[id];
  if (!b) return { ok:false, msg:"Booking not found." };
  if (b.status === "Cancelled") return { ok:false, msg:"Already cancelled." };

  DB.bookings[id].status = "Cancelled";

  if (b.type === "hotel") {
    DB.roomBookings[b.roomId] = DB.roomBookings[b.roomId]
      .filter(s => !(s.checkIn === b.checkIn && s.checkOut === b.checkOut));
  } else {
    DB.tableBookings[b.tableId] = DB.tableBookings[b.tableId]
      .filter(s => !(s.date === b.date && s.mealTime === b.mealTime));
  }
  return { ok:true, msg:`Booking ${id} cancelled.` };
}

function getRoomStats() {
  return ROOMS.map(r => ({
    ...r,
    status: Object.values(DB.bookings).some(
      b => b.type === "hotel" && b.roomId === r.id && b.status === "Confirmed"
    ) ? "Occupied" : "Available",
  }));
}
