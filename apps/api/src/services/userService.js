const users = [];

export async function listUsers() {
  return users;
}

export async function createUser({ email, name, password }) {
  const user = { id: `usr_${Date.now()}`, email, name, role: "client" };
  // TODO: hash password and persist via Prisma
  users.push(user);
  return user;
}
