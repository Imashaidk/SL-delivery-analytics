import { useState, useEffect } from 'react';
import { Package, Clock, ShieldAlert, Activity, BarChart2, Zap, AlertTriangle, MapPin, CloudRain, Users } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function App() {
  const [activeTab, setActiveTab] = useState('eda');
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

  // Data for visual showcase
  const churnChartData = [
    { name: '0 Delays', churn: 0.05 }, { name: '1 Delay', churn: 0.20 }, { name: '2 Delays', churn: 0.35 },
    { name: '3 Delays', churn: 0.50 }, { name: '4 Delays', churn: 0.65 }, { name: '5+ Delays', churn: 0.85 },
  ];
  const regionData = [
    { region: 'Galle', delay: 26.5 }, { region: 'Kandy', delay: 26.0 }, { region: 'Colombo 1-15', delay: 25.5 },
    { region: 'Col. Suburbs', delay: 25.0 }, { region: 'Gampaha', delay: 24.5 },
  ];
  const weatherData = [
    { weather: 'Heavy Monsoon', delay: 55.2 }, { weather: 'Light Rain', delay: 32.1 }, { weather: 'Clear Sky', delay: 18.5 },
  ];
  const pieData = [
    { name: 'Colombo 1-15', value: 40 }, { name: 'Suburbs', value: 25 }, { name: 'Gampaha', value: 15 },
    { name: 'Kandy', value: 10 }, { name: 'Galle', value: 10 }
  ];
  const COLORS = ['#f97316', '#fbbf24', '#38bdf8', '#a855f7', '#ec4899'];

  return (
    <div className="dashboard-container">
      <header className="header animate-in">
        <h1 className="title-gradient">SL Delivery Analytics Pro</h1>
        <p className="subtitle">AI-Powered Command Center for Logistics & Retention</p>
      </header>

      <section className="kpi-grid animate-in delay-1">
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Package size={16} /> Total Volume</div>
          <p className="kpi-value">15.2k</p>
          <span style={{color: '#94a3b8', fontSize: '0.85rem'}}><span className="live-dot"></span>Live Sync Active</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Clock size={16} /> Avg Fleet Delay</div>
          <p className="kpi-value">13.2<span style={{fontSize:'1.5rem'}}>m</span></p>
          <span style={{color: '#10b981', fontSize: '0.85rem'}}>↓ 1.2m vs last month</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><CloudRain size={16} /> Monsoon Impact</div>
          <p className="kpi-value" style={{color: '#ef4444'}}>+45<span style={{fontSize:'1.5rem'}}>m</span></p>
          <span style={{color: '#ef4444', fontSize: '0.85rem'}}>Critical Alert active</span>
        </div>
        <div className="glass-panel kpi-card">
          <div className="kpi-label"><Users size={16} /> Churn Risk</div>
          <p className="kpi-value">52%</p>
          <span style={{color: '#f59e0b', fontSize: '0.85rem'}}>Elevated due to weather</span>
        </div>
      </section>

      <div className="tabs-container animate-in delay-2">
        <button onClick={() => setActiveTab('eda')} className={`tab-btn ${activeTab === 'eda' ? 'active' : ''}`}>
          <BarChart2 size={18} /> Global Insights
        </button>
        <button onClick={() => setActiveTab('delay')} className={`tab-btn ${activeTab === 'delay' ? 'active' : ''}`}>
          <Zap size={18} /> Routing AI
        </button>
        <button onClick={() => setActiveTab('churn')} className={`tab-btn ${activeTab === 'churn' ? 'active' : ''}`}>
          <AlertTriangle size={18} /> Retention AI
        </button>
      </div>

      <div className="animate-in delay-3">
        {/* TAB 1: EDA */}
        {activeTab === 'eda' && (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px'}}>
            
            <div className="glass-panel">
              <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><MapPin size={20} color="#f97316"/> Demand Distribution</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#1E293B', borderRadius: '8px', border: 'none'}} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{fontSize: '0.9rem', color: '#94a3b8'}}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel">
              <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><Clock size={20} color="#38bdf8"/> Avg Delay by Region</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <BarChart data={regionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                    <XAxis dataKey="region" stroke="#94a3b8" tick={{fontSize: 12}} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{backgroundColor: '#1E293B', borderRadius: '8px', border: 'none'}} />
                    <Bar dataKey="delay" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-panel" style={{gridColumn: '1 / -1'}}>
              <h3 style={{marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px'}}><AlertTriangle size={20} color="#ef4444"/> Retention Destruction Curve</h3>
              <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px'}}>Notice how churn probability skyrockets after a user experiences 3 severe delays.</p>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={churnChartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorChurn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(tick) => `${tick*100}%`} />
                    <Tooltip contentStyle={{backgroundColor: '#1E293B', borderRadius: '8px', border: 'none'}} />
                    <Area type="monotone" dataKey="churn" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorChurn)" activeDot={{r: 6, fill: '#ef4444', stroke: '#fff'}} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DELAY */}
        {activeTab === 'delay' && (
          <div className="glass-panel" style={{maxWidth: '650px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
              <div style={{display: 'inline-block', background: 'rgba(249, 115, 22, 0.1)', padding: '15px', borderRadius: '50%', marginBottom: '15px'}}>
                <Zap size={32} color="#f97316" />
              </div>
              <h2 style={{margin: 0}}>Predictive Routing Engine</h2>
              <p style={{color: '#94a3b8', marginTop: '8px'}}>Simulate conditions to predict exact ETA using the Random Forest Model.</p>
            </div>

            <form onSubmit={handlePredictDelay}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div className="form-group">
                  <label>Delivery Zone</label>
                  <select className="form-control" value={delayForm.region} onChange={e => setDelayForm({...delayForm, region: e.target.value})}>
                    <option>Colombo 1-15</option><option>Colombo Suburbs</option><option>Kandy</option><option>Galle</option><option>Gampaha</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Distance ({delayForm.distance_km} KM)</label>
                  <input type="range" className="form-control" min="1" max="20" step="0.5" value={delayForm.distance_km} onChange={e => setDelayForm({...delayForm, distance_km: parseFloat(e.target.value)})} style={{accentColor: '#f97316'}} />
                </div>
                <div className="form-group">
                  <label>Weather Condition</label>
                  <select className="form-control" value={delayForm.weather} onChange={e => setDelayForm({...delayForm, weather: e.target.value})}>
                    <option>Clear</option><option>Light Rain</option><option>Heavy Rain (Monsoon)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Traffic Density</label>
                  <select className="form-control" value={delayForm.traffic} onChange={e => setDelayForm({...delayForm, traffic: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Gridlock</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary">Initialize Simulation</button>
            </form>
            
            {delayPrediction !== null && (
              <div style={{marginTop: '30px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', textAlign: 'center'}} className="animate-in">
                <h4 style={{margin: '0 0 10px 0', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Predicted Delay</h4>
                <div style={{fontSize: '3.5rem', fontWeight: '900', color: delayPrediction > 25 ? '#ef4444' : delayPrediction > 15 ? '#f59e0b' : '#10b981'}}>
                  {delayPrediction} <span style={{fontSize: '1.5rem', fontWeight: '500'}}>mins</span>
                </div>
                <div className="risk-meter-container">
                   <div className={`risk-meter-fill ${delayPrediction > 25 ? 'risk-danger' : delayPrediction > 15 ? 'risk-warn' : 'risk-safe'}`} 
                        style={{width: `${Math.min((delayPrediction / 60) * 100, 100)}%`}}></div>
                </div>
                <p style={{marginTop: '15px', color: '#f8fafc'}}>
                  {delayPrediction > 25 ? "🚨 ETA extremely compromised. Recommend manual dispatcher intervention." : 
                   delayPrediction > 15 ? "⚠️ Slight delay expected. Automated customer SMS triggered." : 
                   "✅ Green light. Standard ETA holds."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CHURN */}
        {activeTab === 'churn' && (
           <div className="glass-panel" style={{maxWidth: '650px', margin: '0 auto'}}>
            <div style={{textAlign: 'center', marginBottom: '30px'}}>
              <div style={{display: 'inline-block', background: 'rgba(239, 68, 68, 0.1)', padding: '15px', borderRadius: '50%', marginBottom: '15px'}}>
                <AlertTriangle size={32} color="#ef4444" />
              </div>
              <h2 style={{margin: 0}}>Retention AI Sentinel</h2>
              <p style={{color: '#94a3b8', marginTop: '8px'}}>Identify users on the verge of uninstalling the app.</p>
            </div>

            <form onSubmit={handlePredictChurn}>
               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                <div className="form-group">
                  <label>Total Lifetime Orders</label>
                  <input type="number" className="form-control" min="1" value={churnForm.total_orders} onChange={e => setChurnForm({...churnForm, total_orders: parseInt(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label>Severe Delays Experienced</label>
                  <input type="number" className="form-control" min="0" value={churnForm.severe_delays} onChange={e => setChurnForm({...churnForm, severe_delays: parseInt(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{background: 'linear-gradient(135deg, #ef4444, #f97316)'}}>Analyze Flight Risk</button>
            </form>
            
            {churnPrediction !== null && (
              <div style={{marginTop: '30px', padding: '24px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', textAlign: 'center'}} className="animate-in">
                <h4 style={{margin: '0 0 10px 0', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px'}}>Probability of Churn</h4>
                <div style={{fontSize: '3.5rem', fontWeight: '900', color: churnPrediction > 0.7 ? '#ef4444' : churnPrediction > 0.4 ? '#f59e0b' : '#10b981'}}>
                  {(churnPrediction * 100).toFixed(1)}<span style={{fontSize: '2rem'}}>%</span>
                </div>
                <div className="risk-meter-container">
                   <div className={`risk-meter-fill ${churnPrediction > 0.7 ? 'risk-danger' : churnPrediction > 0.4 ? 'risk-warn' : 'risk-safe'}`} 
                        style={{width: `${churnPrediction * 100}%`}}></div>
                </div>
                <p style={{marginTop: '15px', color: '#f8fafc'}}>
                  {churnPrediction > 0.7 ? "🚨 CRITICAL: Recommend immediate Rs.500 wallet credit injection." : 
                   churnPrediction > 0.4 ? "⚠️ VULNERABLE: Send push notification with free delivery promo." : 
                   "✅ SECURE: High retention probability. No action needed."}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
