import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Gauge,
  Lightbulb,
  LineChart,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react';
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

const buildingProfiles = {
  'Main Block': { base: 182, growth: 7, risk: 'High', saving: '14%' },
  'Innovation Center': { base: 146, growth: 5, risk: 'Medium', saving: '11%' },
  Library: { base: 92, growth: 3, risk: 'Low', saving: '8%' },
};

const recommendations = [
  {
    title: 'Shift heavy HVAC loads',
    impact: 'High',
    saving: '18 kWh/day',
    detail: 'Pre-cool priority rooms before the 2 PM peak and reduce compressor load during peak tariff hours.',
  },
  {
    title: 'Detect after-hours usage',
    impact: 'Medium',
    saving: '9 kWh/day',
    detail: 'Room 302 and the east lab show usage after scheduled closure. Add an automated shutdown checklist.',
  },
  {
    title: 'Optimize lighting zones',
    impact: 'Medium',
    saving: '7 kWh/day',
    detail: 'Use occupancy-based lighting for corridors and low-traffic admin areas between 6 PM and 8 AM.',
  },
  {
    title: 'Schedule lab equipment batches',
    impact: 'High',
    saving: '21 kWh/day',
    detail: 'Group high-load equipment runs outside the predicted peak window to flatten demand.',
  },
];

const AIInsights = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('Main Block');
  const [horizon, setHorizon] = useState(7);
  const profile = buildingProfiles[selectedBuilding];

  const prediction = useMemo(() => {
    return Array.from({ length: horizon }, (_, index) => {
      const dayFactor = Math.sin(index / 1.7) * 5;
      return Math.round(profile.base + profile.growth * index + dayFactor);
    });
  }, [horizon, profile]);

  const chartData = {
    labels: prediction.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: 'Predicted demand',
        data: prediction,
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} kWh`,
        },
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        ticks: {
          callback: (value) => `${value} kWh`,
        },
        border: { display: false },
        grid: { color: '#e2e8f0' },
      },
    },
  };

  const peakDemand = Math.max(...prediction);
  const averageDemand = Math.round(prediction.reduce((sum, value) => sum + value, 0) / prediction.length);

  return (
    <section className="module-page ai-page">
      <div className="module-hero ai-hero">
        <div className="module-title-group">
          <div className="module-icon">
            <Bot size={28} />
          </div>
          <div>
            <span className="eyebrow">Single AI module</span>
            <h2>AI Insights</h2>
            <p>Predict future energy demand and receive AI-based energy-saving recommendations in one workspace.</p>
          </div>
        </div>

        <div className="ai-controls">
          <label>
            Building
            <select value={selectedBuilding} onChange={(event) => setSelectedBuilding(event.target.value)}>
              {Object.keys(buildingProfiles).map((building) => (
                <option key={building}>{building}</option>
              ))}
            </select>
          </label>
          <label>
            Forecast
            <select value={horizon} onChange={(event) => setHorizon(Number(event.target.value))}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>
          </label>
        </div>
      </div>

      <div className="stats-grid dashboard-stats">
        <InsightCard icon={LineChart} label="Predicted Peak" value={`${peakDemand} kWh`} detail={`${horizon}-day horizon`} tone="blue" />
        <InsightCard icon={Gauge} label="Daily Average" value={`${averageDemand} kWh`} detail={selectedBuilding} tone="green" />
        <InsightCard icon={AlertTriangle} label="Demand Risk" value={profile.risk} detail="AI classification" tone="red" />
        <InsightCard icon={TrendingDown} label="Saving Potential" value={profile.saving} detail="Recommended actions" tone="amber" />
      </div>

      <div className="ai-grid">
        <article className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>AI Demand Prediction</h3>
              <p>Forecasted consumption for {selectedBuilding}</p>
            </div>
            <span className="live-pill">
              <CheckCircle2 size={16} />
              Model Ready
            </span>
          </div>
          <div className="chart-wrap ai-chart-wrap">
            <Line data={chartData} options={chartOptions} />
          </div>
        </article>

        <article className="panel ai-summary-panel">
          <div className="panel-header compact">
            <div>
              <h3>Prediction Summary</h3>
              <p>What the model expects next</p>
            </div>
            <TrendingUp size={20} />
          </div>
          <div className="ai-summary-list">
            <div>
              <strong>Peak window</strong>
              <span>Day {prediction.indexOf(peakDemand) + 1}, between 1 PM and 4 PM</span>
            </div>
            <div>
              <strong>Demand direction</strong>
              <span>{prediction[prediction.length - 1] > prediction[0] ? 'Increasing' : 'Stable'} over selected horizon</span>
            </div>
            <div>
              <strong>Recommended response</strong>
              <span>Apply load shifting and after-hours shutdown rules before the predicted peak.</span>
            </div>
          </div>
        </article>
      </div>

      <article className="panel">
        <div className="panel-header">
          <div>
            <h3>AI Energy-Saving Recommendations</h3>
            <p>Prioritized actions generated from predicted demand patterns</p>
          </div>
          <span className="live-pill">
            <Lightbulb size={16} />
            {recommendations.length} Actions
          </span>
        </div>

        <div className="recommendation-grid">
          {recommendations.map((item) => (
            <div className="ai-recommendation-card" key={item.title}>
              <div className="recommendation-card-top">
                <div className="workflow-icon">
                  <Zap size={20} />
                </div>
                <span className={item.impact === 'High' ? 'badge badge-danger' : 'badge badge-warning'}>
                  {item.impact} impact
                </span>
              </div>
              <h4>{item.title}</h4>
              <p>{item.detail}</p>
              <strong>{item.saving}</strong>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

const InsightCard = ({ icon: Icon, label, value, detail, tone }) => (
  <article className="metric-card stat-card">
    <div className={`stat-icon ${tone}`}>
      <Icon size={22} />
    </div>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>
);

export default AIInsights;
