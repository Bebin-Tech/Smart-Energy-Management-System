import { AlertTriangle, Building2, DollarSign, TrendingUp, Zap } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Energy Consumption (kWh)',
        data: [120, 150, 140, 180, 170, 110, 95],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { border: { display: false }, grid: { color: '#e2e8f0' } },
    },
  };

  return (
    <section className="module-page">
      <div className="module-hero dashboard-hero">
        <div>
          <span className="eyebrow">Campus energy command center</span>
          <h2>Dashboard Overview</h2>
          <p>Track consumption, peak load, costs, and alerts from one responsive workspace.</p>
        </div>
      </div>

      <div className="stats-grid dashboard-stats">
        <StatCard title="Total Consumption" value="1,065 kWh" icon={Zap} tone="blue" detail="+5% from last week" />
        <StatCard title="Daily Average" value="152 kWh" icon={TrendingUp} tone="green" detail="-2% from last week" />
        <StatCard title="Estimated Cost" value="$127.80" icon={DollarSign} tone="amber" detail="+3% from last week" />
        <StatCard title="Active Alerts" value="2" icon={AlertTriangle} tone="red" detail="Needs review" />
      </div>

      <div className="module-grid">
        <article className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Weekly Consumption Trend</h3>
              <p>Seven-day demand pattern</p>
            </div>
            <span className="live-pill">Live</span>
          </div>
          <div className="chart-wrap">
            <Line data={data} options={options} />
          </div>
        </article>

        <article className="panel workflow-panel">
          <div className="panel-header compact">
            <div>
              <h3>AI Recommendations</h3>
              <p>Priority actions</p>
            </div>
            <Building2 size={20} />
          </div>
          <div className="recommendation-list">
            <div>
              <strong>Shift AC loads</strong>
              <span>Peak consumption expected at 2 PM.</span>
            </div>
            <div>
              <strong>Check Room 302</strong>
              <span>Usage detected after hours.</span>
            </div>
            <div>
              <strong>Review lab schedule</strong>
              <span>Equipment load is above baseline.</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

const StatCard = ({ title, value, icon: Icon, tone, detail }) => (
  <article className="metric-card stat-card">
    <div className={`stat-icon ${tone}`}>
      <Icon size={22} />
    </div>
    <span>{title}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

export default Dashboard;
