const { estNonVide, estEmailValide } = require('../utils/validators');
let users = [
  { id: 1, name: 'Aya', email: 'aya@example.com', role: 'admin' },
  { id: 2, name: 'Ferdaws', email: 'ferdaws@example.com', role: 'author' },
];

const getAllUsers = (req, res) => {
  const { role } = req.query;
  let result = users;
  if (role) {
    result = users.filter(u => u.role === role);
  }
  res.json(result);
};

const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: `User ${id} not found` });
  }
  res.json(user);
};


const createUser = (req, res) => {
  const { name, email, role } = req.body;

  if (!estNonVide(name)) {
    return res.status(400).json({ error: 'Name is required and cannot be empty' });
  }
  if (!estEmailValide(email)) {
    return res.status(400).json({ error: 'Email is invalid (it must contain @ and .)' });
  }

  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: newId, name: name.trim(), email, role: role || 'reader' };
  users.push(newUser);
  res.status(201).json(newUser);
};

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `User ${id} not found` });
  }
  const deleted = users.splice(index, 1)[0];
  res.json({ message: `User ${id} deleted`, user: deleted });
};

module.exports = { 
  getAllUsers,
  getUserById, 
  createUser, 
  deleteUser };

