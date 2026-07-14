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

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return content.rows;
    return content.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(normalizedQuery))
    );
  }, [content.rows, query]);

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

    setShowActionPanel(true);
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
        <div className="action-panel">
          <div>
            <strong>{content.action}</strong>
            <span>This demo action is ready. Connect it to the backend form when the API is available.</span>
          </div>
          <button type="button" onClick={() => setShowActionPanel(false)}>
            Dismiss
          </button>
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

export default ModulePage;
