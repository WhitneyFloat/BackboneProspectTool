import { useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { SearchCommandCenter } from './components/SearchCommandCenter';
import { LeadIntelligenceTable } from './components/LeadIntelligenceTable';

function App() {
  const [leads, setLeads] = useState<any[]>([]);
  const [showFullLeads, setShowFullLeads] = useState(false);

  const handleResultsFetched = (results: any[]) => {
    // Map Apify results to our table format
    const formattedLeads = results.map((item, index) => ({
      id: Date.now() + index,
      name: item.title || item.name || 'Unknown Company',
      contact: item.contactName || 'Primary Owner',
      owner: item.ownerName || item.owner || '',
      phone: item.phone || item.phoneNumber || 'No Phone',
      email: item.email || 'No Email',
      score: Math.floor(Math.random() * (98 - 70 + 1)) + 70, // Baseline score until enriched
      website: item.website || item.url || 'No Website',
      description: item.description || ''
    })).sort((a, b) => b.score - a.score);

    setLeads(formattedLeads);
  };

  return (
    <DashboardLayout onShowLeads={() => setShowFullLeads(true)}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', padding: '0 8px' }}>
        <div>
          <h1 className="hero-display" style={{ marginBottom: '4px' }}>PROSPECT INTELLIGENCE</h1>
          <p className="font-headline" style={{ fontSize: '12px', color: 'var(--primary)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.8 }}>
            AI-powered lead generation // SYSTEM_UPLINK_READY
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-btn-secondary" style={{ padding: '10px 20px', fontSize: '11px' }}>EXPORT DATA</button>
          <button className="glass-btn-primary" style={{ padding: '10px 24px', fontSize: '11px' }}>SYNC PIPELINE</button>
        </div>
      </header>
      
      <SearchCommandCenter onResultsFetched={handleResultsFetched} />
      <LeadIntelligenceTable 
        leads={leads} 
        externalShowFull={showFullLeads} 
        onCloseFull={() => setShowFullLeads(false)} 
      />
    </DashboardLayout>
  );
}

export default App;
