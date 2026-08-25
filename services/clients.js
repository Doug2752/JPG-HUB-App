import { storage } from './storage';

const COACH = {
  id: 'coach_001',
  username: 'Doug',
  password: 'JPG2026',
  role: 'coach',
};

export function generateUsername(firstName, lastName) {
  return (firstName[0] + lastName).toLowerCase().replace(/\s+/g, '');
}

export function generatePassword(lastName, phone, programStartDate) {
  const lastFour = phone.replace(/\D/g, '').slice(-4);
  const d = new Date(programStartDate + 'T00:00:00Z');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const yy = String(d.getUTCFullYear()).slice(-2);
  const name = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
  return name + lastFour + mm + yy;
}

export function createClientRecord(firstName, lastName, phone, email, programStartDate) {
  const id = 'client_' + Date.now();
  return {
    id,
    role: 'client',
    first_name: firstName,
    last_name: lastName,
    username: generateUsername(firstName, lastName),
    password: generatePassword(lastName, phone, programStartDate),
    phone,
    email,
    program_start_date: programStartDate,
    tracking_start_date: null,
    current_cycle_start: null,
    onramp_end: null,
    tier: 4,
    tier_name: 'Apprentice',
    cap_override_minutes: null,
    obt_unlocked: false,
    dop_unlocked: false,
    pit_unlocked: false,
    edu_unlocked: true,
    comms_unlocked: true,
    agreements_unlocked: true,
    eventsboard_unlocked: true,
    daily_unlocked: true,
    resources_unlocked: true,
    interface_unlocked: false,
    client_approved: false,
  };
}

export async function getClients() {
  const v = await storage.get('hub_clients');
  return v && v.value ? JSON.parse(v.value) : [];
}

export async function saveClients(clients) {
  await storage.set('hub_clients', JSON.stringify(clients));
}

export async function addClient(record) {
  const clients = await getClients();
  clients.push(record);
  await saveClients(clients);
  return clients;
}

export async function updateClient(id, updates) {
  const clients = await getClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx === -1) return null;
  clients[idx] = { ...clients[idx], ...updates };
  await saveClients(clients);
  return clients[idx];
}

export async function login(username, password) {
  if (
    username.toLowerCase() === COACH.username.toLowerCase() &&
    password === COACH.password
  ) {
    const session = { id: COACH.id, role: 'coach', username: COACH.username };
    await storage.set('hub_session', JSON.stringify(session));
    return session;
  }
  if (
    username.toLowerCase() === 'prospect' &&
    password === 'JPG2026'
  ) {
    const session = { id: 'prospect_001', role: 'prospect', username: 'prospect' };
    await storage.set('hub_session', JSON.stringify(session));
    return session;
  }
  const clients = await getClients();
  const client = clients.find(
    c =>
      c.username.toLowerCase() === username.toLowerCase() &&
      c.password === password
  );
  if (client) {
    const session = {
      id: client.id,
      role: 'client',
      username: client.username,
      first_name: client.first_name,
      last_name: client.last_name,
    };
    await storage.set('hub_session', JSON.stringify(session));
    return session;
  }
  return null;
}

export async function logout() {
  await storage.delete('hub_session');
}

export async function getSession() {
  const v = await storage.get('hub_session');
  return v && v.value ? JSON.parse(v.value) : null;
}
