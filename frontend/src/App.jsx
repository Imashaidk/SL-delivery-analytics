import { useState } from 'react';
import { Package, Clock, ShieldAlert, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function App() {
  const [delayPrediction, setDelayPrediction] = useState(null);
  const [churnPrediction, setChurnPrediction] = useState(null);
  
  const [delayForm, setDelayForm] = useState({
    region: 'Colombo 1-15', distance_km: 5.0, weather: 'Clear', time_of_day: 'Morning', traffic: 'Low'
  });
  
  const [churnForm, setChurnForm] = useState({
    region: 'Colombo 1-15', total_orders: 15, avg_delay: 15.0, severe_delays: 2
  });

  const handlePredictDelay = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/predict-delay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delayForm)
      });
      const data = await res.json();
      setDelayPrediction(data.predicted_delay_mins);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePredictChurn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/predict-churn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churnForm)
      });
      const data = await res.json();
      setChurnPrediction(data.churn_probability);
    } catch (err) {
      console.error(err);
    }
  };

  // Dummy data for the chart to simulate API load
  const chartData = [
    { name: '0', churn: 0.05 },
    { name: '1', churn: 0.20 },
    { name: '2', churn: 0.35 },
    { name: '3', churn: 0.50 },
    { name: '4', churn: 0.65 },
    { name: '5+', churn: 0.85 },
  ];

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1 className="title-gradient">Next-Gen Delivery Analytics</h1>
        <p className="subtitle">Empowering Logistics and Retention with Predictive AI</p>
      </header>

      <section className="kpi-grid">
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Package size={16} style={{display:'inline', marginRight:'8px'}}/>Total Orders</div>
          <p className="kpi-value">15,000</p>
          <span className="kpi-delta positive">Live Data</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Clock size={16} style={{display:'inline', marginRight:'8px'}}/>Average Delay</div>
          <p className="kpi-value">13.2m</p>
          <span className="kpi-delta positive">-1.2m vs last month</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><ShieldAlert size={16} style={{display:'inline', marginRight:'8px'}}/>Monsoon Risk</div>
          <p className="kpi-value">+45m</p>
          <span className="kpi-delta negative">Critical Delay Impact</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Activity size={16} style={{display:'inline', marginRight:'8px'}}/>Avg Churn Risk</div>
          <p className="kpi-value">52.9%</p>
          <span className="kpi-delta negative">+2% vs last month</span>
        </div>
      </section>

      <div className="main-grid">
        <div className="glass-panel">
          <h2 style={{marginTop: 0}}>Churn Probability vs Severe Delays</h2>
          <p className="subtitle" style={{marginBottom: '20px'}}>How delays destroy customer retention</p>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(tick) => `${tick*100}%`} />
                <Tooltip contentStyle={{backgroundColor: '#1E293B', borderColor: '#334155'}} />
                <Area type="monotone" dataKey="churn" stroke="#ef4444" fillOpacity={1} fill="url(#colorChurn)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="glass-panel">
            <h3 style={{marginTop: 0, marginBottom: '16px'}}>⏱️ AI Delay Simulator</h3>
            <form onSubmit={handlePredictDelay}>
              <div className="form-group">
                <label>Region</label>
                <select className="form-control" value={delayForm.region} onChange={e => setDelayForm({...delayForm, region: e.target.value})}>
                  <option>Colombo 1-15</option><option>Colombo Suburbs</option><option>Kandy</option><option>Galle</option><option>Gampaha</option>
                </select>
              </div>
              <div className="form-group">
                <label>Distance (km): {delayForm.distance_km}</label>
                <input type="range" className="form-control" min="1" max="20" step="0.5" value={delayForm.distance_km} onChange={e => setDelayForm({...delayForm, distance_km: parseFloat(e.target.value)})} />
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Weather</label>
                  <select className="form-control" value={delayForm.weather} onChange={e => setDelayForm({...delayForm, weather: e.target.value})}>
                    <option>Clear</option><option>Light Rain</option><option>Heavy Rain (Monsoon)</option>
                  </select>
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Traffic</label>
                  <select className="form-control" value={delayForm.traffic} onChange={e => setDelayForm({...delayForm, traffic: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Gridlock</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary">Run Simulation</button>
            </form>
            
            {delayPrediction !== null && (
              <div className={`result-card ${delayPrediction > 25 ? 'danger' : delayPrediction > 15 ? 'warning' : 'success'}`}>
                <div className="result-value">{delayPrediction} Mins</div>
                <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                  {delayPrediction > 25 ? "CRITICAL RISK: Assign priority rider." : "Status: Within acceptable SLA."}
                </div>
              </div>
            )}
          </div>
          
          <div className="glass-panel">
            <h3 style={{marginTop: 0, marginBottom: '16px'}}>⚠️ Churn Predictor</h3>
            <form onSubmit={handlePredictChurn}>
              <div className="form-group">
                <label>Severe Delays Experienced</label>
                <input type="number" className="form-control" min="0" value={churnForm.severe_delays} onChange={e => setChurnForm({...churnForm, severe_delays: parseInt(e.target.value)})} />
              </div>
              <button type="submit" className="btn-primary" style={{backgroundColor: '#ef4444'}}>Analyze Risk</button>
            </form>
            
            {churnPrediction !== null && (
              <div className={`result-card ${churnPrediction > 0.7 ? 'danger' : churnPrediction > 0.4 ? 'warning' : 'success'}`}>
                <div className="result-value">{(churnPrediction * 100).toFixed(1)}% Risk</div>
                <div style={{fontSize: '0.9rem', color: 'var(--text-muted)'}}>
                  {churnPrediction > 0.7 ? "High flight risk! Send Rs. 500 promo immediately." : "Customer is loyal. No action needed."}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
