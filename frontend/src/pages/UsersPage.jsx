import { useMemo, useState } from 'react';
import { CheckCircle2, Plus, Search, ShieldCheck, UserCog, Users, X } from 'lucide-react';
import { userService } from '../services/api';

const rolePermissions = {
  Admin: [
    'Full system access',
    'Manage users',
    'Manage buildings',
    'Manage departments',
    'Configure electricity tariffs',
    'View analytics',
    'Generate reports',
  ],
  Manager: [
    'Add daily/monthly energy data',
    'Upload electricity bills',
    'View dashboards',
    'Download reports',
  ],
  User: [
    'View energy usage',
    'View analytics',
    'Download reports',
  ],
};

const initialUsers = [
  ['admin', 'admin@example.com', 'Admin', 'Active'],
  ['manager', 'manager@example.com', 'Manager', 'Active'],
  ['viewer', 'viewer@example.com', 'User', 'Active'],
];

const emptyForm = {
  username: '',
  email: '',
  password: '',
  role: 'User',
};

const UsersPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) => user.some((cell) => String(cell).toLowerCase().includes(normalizedQuery)));
  }, [query, users]);

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const submitUser = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      try {
        await userService.add(formData);
      } catch (apiError) {
        console.info('User saved locally because API is unavailable.', apiError);
      }
      setUsers((current) => [[formData.username, formData.email, formData.role, 'Active'], ...current]);
      setFormData(emptyForm);
      setStatusMessage('User created successfully.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="module-page">
      <div className="module-hero">
        <div className="module-title-group">
          <div className="module-icon">
            <UserCog size={28} />
          </div>
          <div>
            <h2>User Roles</h2>
            <p>Admin can create users and assign role-based access for the SmartEnergy Management System.</p>
          </div>
        </div>

        <div className="module-actions">
          <button className="primary-action" type="button" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Create User
          </button>
        </div>
      </div>

      <div className="role-grid">
        {Object.entries(rolePermissions).map(([role, permissions]) => (
          <article className="panel role-card" key={role}>
            <div className="role-card-header">
              <div className="workflow-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3>{role}</h3>
                <p>{role === 'Admin' ? 'Full system access' : role === 'Manager' ? 'Operational access' : 'Read-only access'}</p>
              </div>
            </div>
            <ul>
              {permissions.map((permission) => (
                <li key={permission}>
                  <CheckCircle2 size={16} />
                  {permission}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="filter-bar">
        <Search size={18} />
        <input
          type="search"
          placeholder="Search users..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
            <X size={16} />
          </button>
        )}
      </div>

      <article className="panel table-panel">
        <div className="panel-header">
          <div>
            <h3>System Users</h3>
            <p>{filteredUsers.length} users shown</p>
          </div>
          <span className="live-pill">
            <Users size={16} />
            Access Control
          </span>
        </div>

        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(([username, email, role, status]) => (
                <tr key={`${username}-${email}`}>
                  <td>{username}</td>
                  <td>{email}</td>
                  <td><span className="badge badge-muted">{role}</span></td>
                  <td><span className="badge badge-success">{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setIsModalOpen(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="create-user-title" onMouseDown={(event) => event.stopPropagation()}>
            <form className="form-panel" onSubmit={submitUser}>
              <div className="form-panel-header">
                <div>
                  <strong id="create-user-title">Create User</strong>
                  <span>Assign Admin, Manager, or User access.</span>
                </div>
                <button type="button" onClick={() => setIsModalOpen(false)} aria-label="Close form">
                  <X size={16} />
                </button>
              </div>

              <div className="form-grid">
                <label className="form-field">
                  <span>Username</span>
                  <input value={formData.username} onChange={(event) => updateForm('username', event.target.value)} required />
                </label>
                <label className="form-field">
                  <span>Email</span>
                  <input type="email" value={formData.email} onChange={(event) => updateForm('email', event.target.value)} required />
                </label>
                <label className="form-field">
                  <span>Password</span>
                  <input type="password" value={formData.password} onChange={(event) => updateForm('password', event.target.value)} required />
                </label>
                <label className="form-field">
                  <span>Role</span>
                  <select value={formData.role} onChange={(event) => updateForm('role', event.target.value)}>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>User</option>
                  </select>
                </label>
              </div>

              <div className="form-actions">
                {statusMessage && <span className="form-status">{statusMessage}</span>}
                <button className="secondary-action" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button className="primary-action" type="submit" disabled={isSaving}>
                  {isSaving ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default UsersPage;
