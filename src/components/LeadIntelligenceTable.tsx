import { useState } from 'react';
import { Sparkles, Phone, Mail, Link, ExternalLink, Activity, Loader2 } from 'lucide-react';
import { ComponentPreviewModal } from './ComponentPreviewModal';
import { enrichLeadWithGemini } from '../services/geminiService';


interface LeadIntelligenceTableProps {
  leads: any[];
  externalShowFull?: boolean;
  onCloseFull?: () => void;
}

export function LeadIntelligenceTable({ leads, externalShowFull, onCloseFull }: LeadIntelligenceTableProps) {
  const [activeModalLead, setActiveModalLead] = useState<any>(null);
  const [enrichingId, setEnrichingId] = useState<number | null>(null);
  const [localLeads, setLocalLeads] = useState<any[]>(leads);
  const [viewLimit, setViewLimit] = useState<number>(10);

  // Sync and sort leads when props change
  useState(() => {
    setLocalLeads([...leads].sort((a, b) => (b.score || 0) - (a.score || 0)));
  });

  const handleEnrich = async (lead: any) => {
    setEnrichingId(lead.id);
    try {
      const enrichment = await enrichLeadWithGemini(lead.name, lead.website, lead.description, lead.owner);
      setLocalLeads(prev => {
        const updated = prev.map(l => 
          l.id === lead.id 
            ? { 
                ...l, 
                score: enrichment.fitScore, 
                pitch: enrichment.pitch, 
                suggestedEmails: enrichment.suggestedEmails,
                isEnriched: true 
              } 
            : l
        );
        return updated.sort((a, b) => (b.score || 0) - (a.score || 0));
      });
    } catch (error) {
      console.error("Enrichment failed:", error);
    } finally {
      setEnrichingId(null);
    }
  };

  const displayLeads = localLeads.slice(0, viewLimit);

  const renderTable = (data: any[], isFullView = false) => (
    <div className="glass-table-container" style={{ maxHeight: isFullView ? '70vh' : 'none', overflowY: isFullView ? 'auto' : 'visible' }}>
      <table className="glass-table">
        <thead>
          <tr>
            <th className="font-headline">Company Name</th>
            <th className="font-headline">Contact Info</th>
            <th className="font-headline">AI Fit Score</th>
            <th className="font-headline" style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((lead) => (
            <tr key={lead.id}>
              <td>
                <div style={{ fontWeight: '700', marginBottom: '4px', color: '#fff', fontSize: '14px' }}>{lead.name.toUpperCase()}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                  <Link size={10} /> {lead.website}
                </div>
                {lead.owner && (
                  <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600', marginTop: '6px', letterSpacing: '0.05em' }}>
                    OWNER: {lead.owner.toUpperCase()}
                  </div>
                )}
              </td>
              <td>
                {lead.email && lead.email !== 'No Email' ? (
                  <>
                    <div style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--on-surface)' }}>{lead.contact}</div>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--on-surface-variant)', opacity: 0.7 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={10} /> {lead.phone}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={10} /> {lead.email}</span>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      className="glass-btn-secondary"
                      onClick={() => handleEnrich(lead)}
                      disabled={enrichingId === lead.id}
                      style={{ padding: '4px 12px', fontSize: '10px', width: 'fit-content', border: '1px dashed var(--primary)' }}
                    >
                      {enrichingId === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      DERIVE EMAIL
                    </button>
                    {lead.suggestedEmails && lead.suggestedEmails.length > 0 && (
                      <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: '600', padding: '4px 8px', background: 'rgba(158, 202, 255, 0.05)', borderRadius: '4px', border: '1px solid rgba(158, 202, 255, 0.1)' }}>
                        SUGGESTION: {lead.suggestedEmails[0]}
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    background: lead.score > 90 ? 'rgba(158, 202, 255, 0.1)' : 'rgba(255, 214, 10, 0.05)',
                    border: `1px solid ${lead.score > 90 ? 'var(--primary)' : 'rgba(255, 214, 10, 0.2)'}`,
                    color: lead.score > 90 ? 'var(--primary)' : '#ffd60a',
                    fontWeight: '700',
                    fontSize: '12px',
                    fontFamily: 'Space Grotesk'
                  }}>
                    <Sparkles size={12} fill="currentColor" />
                    {lead.score}%
                  </div>
                  {lead.score > 90 && (
                    <div className="animate-pulse" style={{ 
                      fontSize: '9px', 
                      fontWeight: '800', 
                      letterSpacing: '0.1em', 
                      color: '#fff', 
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-container))', 
                      padding: '2px 8px', 
                      borderRadius: '4px',
                      boxShadow: '0 0 10px var(--primary)'
                    }}>
                      UNICORN
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button 
                    className="glass-btn-secondary" 
                    onClick={() => handleEnrich(lead)}
                    disabled={enrichingId === lead.id}
                    style={{ padding: '8px 16px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    {enrichingId === lead.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Sparkles size={12} color={lead.isEnriched ? "var(--primary)" : "currentColor"} />
                    )} 
                    {lead.isEnriched ? 'ENRICHED' : 'ENRICH'}
                  </button>
                  <button 
                    className="glass-btn-primary" 
                    style={{ padding: '8px 16px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => setActiveModalLead(lead)}
                  >
                    <ExternalLink size={12} /> MOCKUP
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <section className="glass-card" style={{ padding: '32px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <div className="hud-corner-tl"></div>
        <div className="hud-corner-br"></div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 className="font-headline text-lg font-bold" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', letterSpacing: '0.05em' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(158, 202, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={18} color="var(--primary)" />
            </div>
            LEAD INTELLIGENCE
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label className="font-headline" style={{ fontSize: '10px', color: 'var(--on-surface-variant)', opacity: 0.6, letterSpacing: '0.1em' }}>VIEW LIMIT:</label>
              <select 
                className="glass-input" 
                value={viewLimit}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'all') {
                    setViewLimit(9999);
                  } else {
                    setViewLimit(parseInt(val));
                    onCloseFull?.();
                  }
                }}
                style={{ padding: '4px 8px', fontSize: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <option value={10}>10 LEADS</option>
                <option value={25}>25 LEADS</option>
                <option value="all">SHOW ALL</option>
              </select>
            </div>
            <div style={{ background: 'rgba(158, 202, 255, 0.1)', padding: '6px 16px', borderRadius: '99px', fontSize: '10px', border: '1px solid rgba(158, 202, 255, 0.2)', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.1em', fontFamily: 'Space Grotesk' }}>
              {localLeads.length} NODES DETECTED
            </div>
          </div>
        </div>

        {renderTable(displayLeads)}
      </section>

      {(externalShowFull || viewLimit === 9999) && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          zIndex: 100, 
          background: 'rgba(6, 20, 35, 0.8)', 
          backdropFilter: 'blur(20px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '1200px', maxHeight: '90vh', padding: '40px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div className="hud-corner-tl"></div>
            <div className="hud-corner-br"></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h2 className="hero-display" style={{ fontSize: '24px' }}>FULL LEAD DATABASE</h2>
              <button 
                className="glass-btn-secondary" 
                onClick={() => {
                  onCloseFull?.();
                  setViewLimit(10);
                }}
                style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
            
            {renderTable(localLeads, true)}
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <p className="font-headline" style={{ fontSize: '11px', color: 'var(--primary)', opacity: 0.6 }}>TOTAL RECORDS: {localLeads.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeModalLead && (
        <ComponentPreviewModal 
          lead={activeModalLead} 
          onClose={() => setActiveModalLead(null)} 
        />
      )}
    </>
  );
}
