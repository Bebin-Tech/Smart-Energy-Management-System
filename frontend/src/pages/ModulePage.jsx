import { useMemo, useState } from 'react';
import {
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { buildingService, departmentService, energyService } from '../services/api';

const today = new Date().toISOString().slice(0, 10);

const moduleData = {
  buildings: {
    title: 'Buildings',
    subtitle: 'Monitor facilities, occupancy, and energy performance across campus.',
    icon: Building2,
    action: 'Add Building',
    columns: ['Building', 'Code', 'Status', 'Usage'],
    stats: [
      { label: 'Active Buildings', value: '8', detail: '6 optimized' },
      { label: 'Total Area', value: '142k sq ft', detail: 'Tracked' },
      { label: 'Peak Load', value: '418 kW', detail: 'Today' },
    ],
    rows: [
      ['Main Block', 'BLD-A', 'Active', '182 kWh'],
      ['Innovation Center', 'BLD-B', 'Active', '146 kWh'],
      ['Library', 'BLD-C', 'Maintenance', '92 kWh'],
      ['Workshop', 'BLD-D', 'Active', '128 kWh'],
    ],
  },
  departments: {
    title: 'Departments',
    subtitle: 'Compare usage by department and identify teams with shifting demand.',
    icon: Users,
    action: 'Add Department',
    columns: ['Department', 'Location', 'Status', 'Usage'],
    stats: [
      { label: 'Departments', value: '12', detail: 'Mapped' },
      { label: 'Highest Usage', value: 'CSE', detail: '450 kWh' },
      { label: 'Savings Target', value: '14%', detail: 'This month' },
    ],
    rows: [
      ['Computer Science', 'Main Block', 'High', '450 kWh'],
      ['Mechanical Engineering', 'Workshop', 'Medium', '380 kWh'],
      ['Administration', 'Main Block', 'Low', '235 kWh'],
      ['Civil Engineering', 'Annex', 'Medium', '290 kWh'],
    ],
  },
  energy: {
    title: 'Energy Usage',
    subtitle: 'Track consumption entries, peak demand, and optimization actions.',
    icon: Zap,
    action: 'New Entry',
    columns: ['Entry', 'Window', 'Status', 'Consumption'],
    stats: [
      { label: 'Today', value: '152 kWh', detail: 'Live estimate' },
      { label: 'Peak Demand', value: '64 kW', detail: '2 PM' },
      { label: 'Cost', value: '$127.80', detail: 'Projected' },
    ],
    rows: [
      ['Morning Load', '08:00 - 11:00', 'Normal', '42 kWh'],
      ['Lab Equipment', '11:00 - 15:00', 'High', '73 kWh'],
      ['Evening Base', '18:00 - 21:00', 'Normal', '37 kWh'],
      ['Night Standby', '21:00 - 06:00', 'Low', '18 kWh'],
    ],
  },
  reports: {
    title: 'Reports',
    subtitle: 'Generate operational reports for energy audits, billing, and reviews.',
    icon: FileText,
    action: 'Export Report',
    columns: ['Report', 'Format', 'Status', 'Updated'],
    stats: [
      { label: 'Ready Reports', value: '5', detail: 'This week' },
      { label: 'Formats', value: 'PDF / Excel', detail: 'Available' },
      { label: 'Last Export', value: 'Today', detail: 'Updated' },
    ],
    rows: [
      ['Weekly Energy Summary', 'PDF', 'Ready', 'Today'],
      ['Department Comparison', 'Excel', 'Ready', 'Yesterday'],
      ['Monthly Cost Report', 'PDF', 'Draft', 'Jul 2026'],
      ['Building Audit Log', 'Excel', 'Ready', 'Today'],
    ],
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure tariffs, alert thresholds, access rules, and system defaults.',
    icon: Settings,
    action: 'Save Changes',
    columns: ['Setting', 'Category', 'Status', 'Action'],
    stats: [
      { label: 'Tariff', value: '$0.12/kWh', detail: 'Active' },
      { label: 'Alerts', value: 'Enabled', detail: '2 rules' },
      { label: 'Security', value: 'JWT', detail: 'Configured' },
    ],
    rows: [
      ['Tariff Rules', 'Billing', 'Active', 'Edit'],
      ['Alert Thresholds', 'Monitoring', 'Active', 'Edit'],
      ['User Access', 'Security', 'Review', 'Edit'],
      ['Backup Schedule', 'System', 'Ready', 'Edit'],
    ],
  },
};

const initialForms = {
  buildings: { name: '', code: '', num_floors: '', num_rooms: '', total_area: '' },
  departments: { name: '', building_id: '1', floor: '', head_of_department: '' },
  energy: { date: today, building_id: '1', department_id: '', units_consumed: '', peak_demand: '', electricity_cost: '' },
  settings: { tariff: '0.12', alert_threshold: '20', notifications: 'enabled', backup_schedule: 'daily' },
};

const workflowItems = [
  { icon: Gauge, label: 'Collect readings', detail: 'Sensors and manual entries synced' },
  { icon: TrendingDown, label: 'Analyze variance', detail: 'Compare against weekly baseline' },
  { icon: Bell, label: 'Notify owners', detail: 'Send alerts for unusual consumption' },
  { icon: ShieldCheck, label: 'Audit trail', detail: 'Keep changes traceable' },
];

const statusClass = {
  Active: 'badge badge-success',
  Ready: 'badge badge-success',
  Normal: 'badge badge-success',
  Low: 'badge badge-success',
  Maintenance: 'badge badge-warning',
  Medium: 'badge badge-warning',
  Review: 'badge badge-warning',
  Draft: 'badge badge-muted',
  High: 'badge badge-danger',
};

const ModulePage = ({ type }) => {
  const content = moduleData[type] || moduleData.buildings;
  const Icon = content.icon;
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [rows, setRows] = useState(content.rows);
  const [formData, setFormData] = useState(initialForms[type] || {});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return rows;
    return rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(normalizedQuery))
    );
  }, [rows, query]);

  const handlePrimaryAction = () => {
    if (type === 'reports') {
      const csv = [content.columns, ...filteredRows].map((row) => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'smart-energy-report.csv';
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    setStatusMessage('');
    setShowActionPanel(true);
  };

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setFormData(initialForms[type] || {});
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setStatusMessage('');

    try {
      if (type === 'buildings') {
        const payload = {
          ...formData,
          num_floors: Number(formData.num_floors) || null,
          num_rooms: Number(formData.num_rooms) || null,
          total_area: Number(formData.total_area) || null,
        };
        try {
          await buildingService.add(payload);
        } catch (apiError) {
          console.info('Building saved locally because API is unavailable.', apiError);
        }
        setRows((current) => [[formData.name, formData.code, 'Active', '0 kWh'], ...current]);
        setStatusMessage('Building added successfully.');
      }

      if (type === 'departments') {
        const payload = {
          ...formData,
          building_id: Number(formData.building_id) || null,
          floor: Number(formData.floor) || null,
        };
        try {
          await departmentService.add(payload);
        } catch (apiError) {
          console.info('Department saved locally because API is unavailable.', apiError);
        }
        setRows((current) => [[formData.name, `Building ${formData.building_id}`, 'Low', '0 kWh'], ...current]);
        setStatusMessage('Department added successfully.');
      }

      if (type === 'energy') {
        const payload = {
          ...formData,
          building_id: Number(formData.building_id),
          department_id: Number(formData.department_id) || null,
          units_consumed: Number(formData.units_consumed),
          peak_demand: Number(formData.peak_demand) || null,
          electricity_cost: Number(formData.electricity_cost) || null,
        };
        try {
          await energyService.addEntry(payload);
        } catch (apiError) {
          console.info('Energy entry saved locally because API is unavailable.', apiError);
        }
        setRows((current) => [[`Entry ${formData.date}`, 'Manual', 'Normal', `${formData.units_consumed} kWh`], ...current]);
        setStatusMessage('Energy entry added successfully.');
      }

      if (type === 'settings') {
        localStorage.setItem('smartEnergySettings', JSON.stringify(formData));
        setRows((current) => [
          ['Tariff Rules', 'Billing', 'Active', `$${formData.tariff}/kWh`],
          ['Alert Thresholds', 'Monitoring', 'Active', `${formData.alert_threshold}%`],
          ['Notifications', 'System', formData.notifications === 'enabled' ? 'Active' : 'Draft', formData.notifications],
          ['Backup Schedule', 'System', 'Ready', formData.backup_schedule],
          ...current.slice(4),
        ]);
        setStatusMessage('Settings saved successfully.');
      }

      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="module-page">
      <div className="module-hero">
        <div className="module-title-group">
          <div className="module-icon">
            <Icon size={28} />
          </div>
          <div>
            <h2>{content.title}</h2>
            <p>{content.subtitle}</p>
          </div>
        </div>

        <div className="module-actions">
          <button className="secondary-action" type="button" onClick={() => setShowFilters((value) => !value)}>
            <SlidersHorizontal size={18} />
            Filter
          </button>
          <button className="primary-action" type="button" onClick={handlePrimaryAction}>
            {type === 'reports' ? <Download size={18} /> : <Plus size={18} />}
            {content.action}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-bar">
          <Search size={18} />
          <input
            type="search"
            placeholder={`Search ${content.title.toLowerCase()}...`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {showActionPanel && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowActionPanel(false)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby={`${type}-modal-title`} onMouseDown={(event) => event.stopPropagation()}>
            <ActionPanel
              type={type}
              title={content.action}
              formData={formData}
              isSaving={isSaving}
              statusMessage={statusMessage}
              onChange={updateForm}
              onClose={() => setShowActionPanel(false)}
              onSubmit={submitForm}
            />
          </div>
        </div>
      )}

      <div className="stats-grid">
        {content.stats.map((stat) => (
          <article className="metric-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </article>
        ))}
      </div>

      <div className="module-grid">
        <article className="panel table-panel">
          <div className="panel-header">
            <div>
              <h3>Operational Snapshot</h3>
              <p>{filteredRows.length} records shown</p>
            </div>
            <span className="live-pill">
              <CheckCircle2 size={16} />
              Live
            </span>
          </div>

          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  {content.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.join('-')}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${cell}`}>
                        {index === 2 ? (
                          <span className={statusClass[cell] || 'badge badge-muted'}>{cell}</span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel workflow-panel">
          <div className="panel-header compact">
            <div>
              <h3>Workflow</h3>
              <p>Recommended operating path</p>
            </div>
            <CalendarDays size={20} />
          </div>

          <div className="workflow-list">
            {workflowItems.map(({ icon: ItemIcon, label, detail }) => (
              <div className="workflow-item" key={label}>
                <div className="workflow-icon">
                  <ItemIcon size={20} />
                </div>
                <div>
                  <strong>{label}</strong>
                  <span>{detail}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};

const ActionPanel = ({ type, title, formData, isSaving, statusMessage, onChange, onClose, onSubmit }) => (
  <form className="form-panel" onSubmit={onSubmit}>
    <div className="form-panel-header">
      <div>
        <strong id={`${type}-modal-title`}>{title}</strong>
        <span>Enter the details below and save the record.</span>
      </div>
      <button type="button" onClick={onClose} aria-label="Close form">
        <X size={16} />
      </button>
    </div>

    <div className="form-grid">
      {type === 'buildings' && (
        <>
          <Field label="Building Name" value={formData.name} onChange={(value) => onChange('name', value)} required />
          <Field label="Code" value={formData.code} onChange={(value) => onChange('code', value)} required />
          <Field label="Floors" type="number" value={formData.num_floors} onChange={(value) => onChange('num_floors', value)} />
          <Field label="Rooms" type="number" value={formData.num_rooms} onChange={(value) => onChange('num_rooms', value)} />
          <Field label="Total Area" type="number" value={formData.total_area} onChange={(value) => onChange('total_area', value)} />
        </>
      )}

      {type === 'departments' && (
        <>
          <Field label="Department Name" value={formData.name} onChange={(value) => onChange('name', value)} required />
          <Field label="Building ID" type="number" value={formData.building_id} onChange={(value) => onChange('building_id', value)} required />
          <Field label="Floor" type="number" value={formData.floor} onChange={(value) => onChange('floor', value)} />
          <Field label="Head of Department" value={formData.head_of_department} onChange={(value) => onChange('head_of_department', value)} />
        </>
      )}

      {type === 'energy' && (
        <div className="sequential-form">
          <StepField number="1">
            <Field label="Date" type="date" value={formData.date} onChange={(value) => onChange('date', value)} required />
          </StepField>
          <StepField number="2">
            <Field label="Building ID" type="number" value={formData.building_id} onChange={(value) => onChange('building_id', value)} required />
          </StepField>
          <StepField number="3">
            <Field label="Department ID" type="number" value={formData.department_id} onChange={(value) => onChange('department_id', value)} />
          </StepField>
          <StepField number="4">
            <Field label="Units Consumed" type="number" value={formData.units_consumed} onChange={(value) => onChange('units_consumed', value)} required />
          </StepField>
          <StepField number="5">
            <Field label="Peak Demand" type="number" value={formData.peak_demand} onChange={(value) => onChange('peak_demand', value)} />
          </StepField>
          <StepField number="6">
            <Field label="Electricity Cost" type="number" value={formData.electricity_cost} onChange={(value) => onChange('electricity_cost', value)} />
          </StepField>
        </div>
      )}

      {type === 'settings' && (
        <>
          <Field label="Tariff Per kWh" type="number" value={formData.tariff} onChange={(value) => onChange('tariff', value)} required />
          <Field label="Alert Threshold (%)" type="number" value={formData.alert_threshold} onChange={(value) => onChange('alert_threshold', value)} required />
          <SelectField
            label="Notifications"
            value={formData.notifications}
            onChange={(value) => onChange('notifications', value)}
            options={['enabled', 'disabled']}
          />
          <SelectField
            label="Backup Schedule"
            value={formData.backup_schedule}
            onChange={(value) => onChange('backup_schedule', value)}
            options={['daily', 'weekly', 'monthly']}
          />
        </>
      )}
    </div>

    <div className="form-actions">
      {statusMessage && <span className="form-status">{statusMessage}</span>}
      <button className="secondary-action" type="button" onClick={onClose}>
        Cancel
      </button>
      <button className="primary-action" type="submit" disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  </form>
);

const Field = ({ label, value, onChange, type = 'text', required = false }) => (
  <label className="form-field">
    <span>{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      required={required}
      min={type === 'number' ? '0' : undefined}
      step={type === 'number' ? 'any' : undefined}
    />
  </label>
);

const StepField = ({ number, children }) => (
  <div className="step-field">
    <span className="step-number">{number}</span>
    {children}
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <label className="form-field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

export default ModulePage;
