import { useState, useEffect } from 'react';
import { Package, Clock, ShieldAlert, Activity, BarChart2, Zap, AlertTriangle, MapPin, CloudRain, Users, Search, Bell, User, Settings, CheckCircle2, Download, Calendar, Menu, X } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function App() {
  const [activeTab, setActiveTab] = useState('eda');
  const [delayPrediction, setDelayPrediction] = useState(null);
  const [churnPrediction, setChurnPrediction] = useState(null);
  const [isPredictingDelay, setIsPredictingDelay] = useState(false);
  const [isPredictingChurn, setIsPredictingChurn] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Simulate loading when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsDataLoading(true);
    setTimeout(() => setIsDataLoading(false), 500);
    setIsMobileMenuOpen(false); // Close mobile menu on select
  };

  const handleExportCSV = () => {
    showToast('Preparing CSV download...');
    
    // Create CSV header
    let csvContent = "Region,Avg Delay (mins),Demand Percentage\n";
    
    // Merge regionData and pieData for export
    const regions = ['Galle', 'Kandy', 'Colombo 1-15', 'Col. Suburbs', 'Gampaha'];
    
    regions.forEach(region => {
      const delayObj = regionData.find(d => d.region === region);
      const pieObj = pieData.find(d => d.name === region || (region === 'Col. Suburbs' && d.name === 'Suburbs'));
      
      const delay = delayObj ? delayObj.delay : 'N/A';
      const demand = pieObj ? pieObj.value + '%' : 'N/A';
      
      csvContent += `"${region}",${delay},${demand}\n`;
    });

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "SL_Delivery_Analytics_Export.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => showToast('CSV Exported Successfully!'), 1000);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };
  
  const [delayForm, setDelayForm] = useState({
    region: 'Colombo 1-15', distance_km: 5.0, weather: 'Clear', time_of_day: 'Morning', traffic: 'Low'
  });
  
  const [churnForm, setChurnForm] = useState({
    region: 'Colombo 1-15', total_orders: 15, avg_delay: 15.0, severe_delays: 2
  });

  const handlePredictDelay = async (e) => {
    e.preventDefault();
    setIsPredictingDelay(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/predict-delay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(delayForm)
      });
      const data = await res.json();
      setDelayPrediction(data.predicted_delay_mins);
      showToast('Delay prediction calculated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredictingDelay(false);
    }
  };

  const handlePredictChurn = async (e) => {
    e.preventDefault();
    setIsPredictingChurn(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/predict-churn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churnForm)
      });
      const data = await res.json();
      setChurnPrediction(data.churn_probability);
      showToast('Churn risk analyzed successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsPredictingChurn(false);
    }
  };

  // Data for visual showcase
  let churnChartData = [
    { name: '0 Delays', churn: 0.05 }, { name: '1 Delay', churn: 0.20 }, { name: '2 Delays', churn: 0.35 },
    { name: '3 Delays', churn: 0.50 }, { name: '4 Delays', churn: 0.65 }, { name: '5+ Delays', churn: 0.85 },
  ];
  let regionData = [
    { region: 'Galle', delay: 26.5 }, { region: 'Kandy', delay: 26.0 }, { region: 'Colombo 1-15', delay: 25.5 },
    { region: 'Col. Suburbs', delay: 25.0 }, { region: 'Gampaha', delay: 24.5 },
  ];
  let pieData = [
    { name: 'Colombo 1-15', value: 40 }, { name: 'Suburbs', value: 25 }, { name: 'Gampaha', value: 15 },
    { name: 'Kandy', value: 10 }, { name: 'Galle', value: 10 }
  ];

  if (appliedSearch) {
    const q = appliedSearch.toLowerCase();
    regionData = regionData.filter(d => d.region.toLowerCase().includes(q));
    pieData = pieData.filter(d => d.name.toLowerCase().includes(q));
  }

  const COLORS = ['#f97316', '#fbbf24', '#38bdf8', '#a855f7', '#ec4899'];

  return (
    <div className="app-layout">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="title-gradient" style={{fontSize: '1.5rem', margin: 0}}>SL Delivery</h2>
                <p className="subtitle" style={{fontSize: '0.8rem', margin: '5px 0 0 0'}}>Analytics Pro</p>
              </div>
            )}
            <button className="icon-btn hide-mobile" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <Menu size={24} />
            </button>
            <button className="icon-btn mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleTabChange('eda')} className={`nav-item ${activeTab === 'eda' ? 'active' : ''}`}>
            <BarChart2 size={20} style={{minWidth: '20px'}} /> <span>Global Insights</span>
          </button>
          <button onClick={() => handleTabChange('delay')} className={`nav-item ${activeTab === 'delay' ? 'active' : ''}`}>
            <Zap size={20} style={{minWidth: '20px'}} /> <span>Routing AI</span>
          </button>
          <button onClick={() => handleTabChange('churn')} className={`nav-item ${activeTab === 'churn' ? 'active' : ''}`}>
            <AlertTriangle size={20} style={{minWidth: '20px'}} /> <span>Retention AI</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-bar hide-mobile">
              <Search size={18} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search orders, regions, or alerts..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchQuery.trim() !== '') {
                      showToast(`Searching for "${searchQuery}"...`);
                      setAppliedSearch(searchQuery.trim());
                    } else {
                      setAppliedSearch('');
                      showToast('Search cleared.');
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div className="topbar-actions">
            <div style={{position: 'relative'}} className="hide-mobile">
              <div className="date-picker-dropdown" onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}>
                <Calendar size={16} />
                <span>{dateRange}</span>
              </div>
              {isDateRangeOpen && (
                <div className="profile-dropdown animate-in" style={{top: '45px', right: 'auto', left: 0}}>
                  <button className="dropdown-item" onClick={() => {setDateRange('Last 7 Days'); setIsDateRangeOpen(false); showToast('Date range updated to Last 7 Days');}}>Last 7 Days</button>
                  <button className="dropdown-item" onClick={() => {setDateRange('Last 30 Days'); setIsDateRangeOpen(false); showToast('Date range updated to Last 30 Days');}}>Last 30 Days</button>
                  <button className="dropdown-item" onClick={() => {setDateRange('Year to Date'); setIsDateRangeOpen(false); showToast('Date range updated to Year to Date');}}>Year to Date</button>
                </div>
              )}
            </div>
            <button className="icon-btn bell-btn">
              <Bell size={20} />
              <span className="badge"></span>
            </button>
          </div>
        </header>

        <div className="dashboard-container">
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

      <div className="animate-in delay-3" style={{position: 'relative'}}>
        {isDataLoading && (
          <div className="skeleton-overlay">
            <div className="skeleton-card" style={{height: '300px'}}></div>
            <div className="skeleton-card" style={{height: '300px'}}></div>
            <div className="skeleton-card" style={{height: '400px', gridColumn: '1 / -1'}}></div>
          </div>
        )}
        
        {/* TAB 1: EDA */}
        {activeTab === 'eda' && !isDataLoading && (
          <div>
            <div className="tab-header">
              <h2 style={{margin: 0}}>Global Insights</h2>
              <button className="btn-secondary" onClick={handleExportCSV}>
                <Download size={16} /> Export CSV
              </button>
            </div>
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
          </div>
        )}

        {/* TAB 2: DELAY */}
        {activeTab === 'delay' && !isDataLoading && (
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
              <button type="submit" className="btn-primary" disabled={isPredictingDelay}>
                {isPredictingDelay ? <span className="spinner"></span> : 'Initialize Simulation'}
              </button>
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
        {activeTab === 'churn' && !isDataLoading && (
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
              <button type="submit" className="btn-primary" style={{background: 'linear-gradient(135deg, #ef4444, #f97316)'}} disabled={isPredictingChurn}>
                {isPredictingChurn ? <span className="spinner"></span> : 'Analyze Flight Risk'}
              </button>
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
      </main>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast animate-in-slide">
          <CheckCircle2 size={20} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

export default App;
