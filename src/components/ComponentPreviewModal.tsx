import { X, Play } from 'lucide-react';

interface ComponentPreviewModalProps {
  lead: any;
  onClose: () => void;
}

export function ComponentPreviewModal({ lead, onClose }: ComponentPreviewModalProps) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div className="glass-panel" style={{
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        padding: '32px',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '40px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)'
      }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Left Side: Mockup Context & Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 className="section-headline" style={{ marginBottom: '8px' }}>Personalized App Mockup</h2>
            <p className="text-small">
              Generated in real-time based on <strong>{lead.name}</strong>'s online presence. Play the animation to see it in action.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)' }}>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>AI Generated Pitch</h4>
            <div style={{ fontStyle: 'italic', color: 'var(--text-body)', lineHeight: '1.6', fontSize: '15px' }}>
              "Hi {lead.contact.split(' ')[0]}, managing service calls for {lead.name} shouldn't be a headache. 
              We've designed a custom mobile prototype that lets your clients book appointments and track technicians 
              in real-time, directly integrating with your existing dispatch system. Would you be open to a 10-minute 
              demo this Thursday?"
            </div>
            
            <button className="glass-btn-secondary" style={{ marginTop: '16px', fontSize: '12px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Play size={12} fill="currentColor" /> Preview Animation
            </button>
          </div>
          
          <div style={{ marginTop: 'auto', display: 'flex', gap: '16px' }}>
             <button className="glass-btn-secondary" style={{ flex: 1 }}>Edit Pitch</button>
             <button className="glass-btn-primary" style={{ flex: 2 }}>Send Pitch + Mockup</button>
          </div>
        </div>

        {/* Right Side: Phone Device Mockup */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '280px',
            height: '560px',
            background: 'linear-gradient(135deg, #1A1C29, #0D0F18)',
            borderRadius: '40px',
            boxShadow: 'inset 0 0 0 8px #2A2D3E, 0 24px 64px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Dynamic App Header */}
            <div style={{ padding: '40px 24px 20px', background: 'var(--accent-glow)', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <h3 style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>{lead.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '4px' }}>Welcome back, {lead.contact.split(' ')[0]}</p>
            </div>
            
            {/* App Body Content */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}></div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}></div>
                <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}></div>
              </div>
              <div style={{ width: '100%', flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}></div>
            </div>

            {/* Faux Home Indicator */}
            <div style={{ width: '100%', height: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
               <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
