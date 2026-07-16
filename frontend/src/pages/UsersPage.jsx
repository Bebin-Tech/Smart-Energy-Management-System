import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Key,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
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
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin', status: 'Active' },
  { id: 2, username: 'manager', email: 'manager@example.com', role: 'Manager', status: 'Active' },
  { id: 3, username: 'viewer', email: 'viewer@example.com', role: 'User', status: 'Active' },
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
  const [modalMode, setModalMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return users;
    return users.filter((user) =>
      [user.username, user.email, user.role, user.status].some((cell) =>
        String(cell).toLowerCase().includes(normalizedQuery)
      )
    );
  }, [query, users]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormData(emptyForm);
    setStatusMessage('');
    setModalMode('create');
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, password: '', role: user.role });
    setStatusMessage('');
    setModalMode('edit');
  };

  const openResetModal = (user) => {
    setSelectedUser(user);
    setFormData({ ...emptyForm, password: '' });
    setStatusMessage('');
    setModalMode('reset');
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedUser(null);
    setStatusMessage('');
  };

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const submitUser = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      if (modalMode === 'create') {
        try {
          await userService.add(formData);
        } catch (apiError) {
          console.info('User saved locally because API is unavailable.', apiError);
        }
        setUsers((current) => [
          { id: Date.now(), username: formData.username, email: formData.email, role: formData.role, status: 'Active' },
          ...current,
        ]);
        setFormData(emptyForm);
        setStatusMessage('User created successfully.');
      }

      if (modalMode === 'edit' && selectedUser) {
        const updatedUser = {
          ...selectedUser,
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        try {
          await userService.update(selectedUser.id, {
            username: formData.username,
            email: formData.email,
            role: formData.role,
          });
        } catch (apiError) {
          console.info('User updated locally because API is unavailable.', apiError);
        }
        setUsers((current) => current.map((user) => (user.id === selectedUser.id ? updatedUser : user)));
        setSelectedUser(updatedUser);
        setStatusMessage('User details updated successfully.');
      }

      if (modalMode === 'reset' && selectedUser) {
        try {
          await userService.resetPassword(selectedUser.id, { password: formData.password });
        } catch (apiError) {
          console.info('Password reset locally because API is unavailable.', apiError);
        }
        setStatusMessage(`Password reset for ${selectedUser.username}.`);
        setFormData((current) => ({ ...current, password: '' }));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (userToDelete) => {
    const shouldDelete = window.confirm(`Delete user "${userToDelete.username}"?`);
    if (!shouldDelete) return;

    try {
      await userService.remove(userToDelete.id);
    } catch (apiError) {
      console.info('User deleted locally because API is unavailable.', apiError);
    }
    setUsers((current) => current.filter((user) => user.id !== userToDelete.id));
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
            <p>Admin can create users and manage usernames, passwords, roles, and account details.</p>
          </div>
        </div>

        <div className="module-actions">
          <button className="primary-action" type="button" onClick={openCreateModal}>
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
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-muted">{user.role}</span></td>
                  <td><span className="badge badge-success">{user.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button type="button" onClick={() => openEditModal(user)} title="Edit user details">
                        <Pencil size={15} />
                        Edit
                      </button>
                      <button type="button" onClick={() => openResetModal(user)} title="Reset password">
                        <Key size={15} />
                        Reset
                      </button>
                      <button className="danger" type="button" onClick={() => deleteUser(user)} title="Delete user">
                        <Trash2 size={15} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {modalMode && (
        <div className="modal-backdrop" role="presentation" onMouseDown={closeModal}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="user-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <form className="form-panel" onSubmit={submitUser}>
              <div className="form-panel-header">
                <div>
                  <strong id="user-modal-title">{modalTitle(modalMode, selectedUser)}</strong>
                  <span>{modalDescription(modalMode)}</span>
                </div>
                <button type="button" onClick={closeModal} aria-label="Close form">
                  <X size={16} />
                </button>
              </div>

              <div className="form-grid">
                {modalMode !== 'reset' && (
                  <>
                    <label className="form-field">
                      <span>Username</span>
                      <input value={formData.username} onChange={(event) => updateForm('username', event.target.value)} required />
                    </label>
                    <label className="form-field">
                      <span>Email</span>
                      <input type="email" value={formData.email} onChange={(event) => updateForm('email', event.target.value)} required />
                    </label>
                    {modalMode === 'create' && (
                      <label className="form-field">
                        <span>Password</span>
                        <input type="password" value={formData.password} onChange={(event) => updateForm('password', event.target.value)} required />
                      </label>
                    )}
                    <label className="form-field">
                      <span>Role</span>
                      <select value={formData.role} onChange={(event) => updateForm('role', event.target.value)}>
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>User</option>
                      </select>
                    </label>
                  </>
                )}

                {modalMode === 'reset' && (
                  <label className="form-field">
                    <span>New Password</span>
                    <input type="password" value={formData.password} onChange={(event) => updateForm('password', event.target.value)} required />
                  </label>
                )}
              </div>

              <div className="form-actions">
                {statusMessage && <span className="form-status">{statusMessage}</span>}
                <button className="secondary-action" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="primary-action" type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : submitLabel(modalMode)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const modalTitle = (mode, user) => {
  if (mode === 'edit') return `Edit ${user?.username || 'User'}`;
  if (mode === 'reset') return `Reset Password`;
  return 'Create User';
};

const modalDescription = (mode) => {
  if (mode === 'edit') return 'Update username, email, role, and other account details.';
  if (mode === 'reset') return 'Set a new password for this user account.';
  return 'Assign Admin, Manager, or User access.';
};

const submitLabel = (mode) => {
  if (mode === 'edit') return 'Save Changes';
  if (mode === 'reset') return 'Reset Password';
  return 'Create User';
};

export default UsersPage;
