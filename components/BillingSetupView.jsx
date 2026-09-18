import React, { useState, useEffect } from 'react';
import { GOLD, GOLD_LIGHT, TEXT_DIM, DARKER } from '../utils/constants';

// ── Helpers ────────────────────────────────────────────────────────────────

function getInvoicePrefix(tier, billingType, promoType) {
  const base = { 4: 'A', 3: 'P', 2: 'G', 1: 'U' }[tier] || 'A';
  if (billingType === 'promotional' && promoType && !['A', 'B'].includes(promoType)) {
    return base + 'P';
  }
  return base;
}

function getSeriesStart(tier) {
  return { 4: 10275, 3: 40275, 2: 70275, 1: 100275 }[tier] || 10275;
}

function getMonthlyRate(billingType, promoType, customRate) {
  if (billingType === 'standard') return 1500;
  const map = { A: 0, B: 0, C: parseFloat(customRate) || 0, D: 0, E: 0, F: 500 };
  return map[promoType] ?? 0;
}

function getBillingStatus(billingType, promoType) {
  if (billingType === 'promotional') {
    if (promoType === 'A') return 'scholarship';
    if (promoType === 'B') return 'trial';
  }
  return 'active';
}

function getPrepayAmount(billingType, promoType) {
  if (billingType !== 'promotional') return null;
  if (promoType === 'D') return 9450;
  if (promoType === 'E') return 13500;
  return null;
}

function getFirstInvoiceDate(programStartDate) {
  if (!programStartDate) return '—';
  const d = new Date(programStartDate + 'T00:00:00');
  if (d.getDate() === 1) return programStartDate;
  d.setMonth(d.getMonth() + 1, 1);
  return d.toISOString().slice(0, 10);
}

function getTrialEndDate(programStartDate, billingType, promoType) {
  if (billingType !== 'promotional' || promoType !== 'B' || !programStartDate) return null;
  const d = new Date(programStartDate + 'T00:00:00');
  d.setDate(d.getDate() + 60);
  return d.toISOString().slice(0, 10);
}

function fmtCurrency(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getFirstDueDate(firstInvoiceDate) {
  if (!firstInvoiceDate || firstInvoiceDate === '—') return '—';
  const d = new Date(firstInvoiceDate + 'T00:00:00');
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0, 10);
}

// ── Constants ──────────────────────────────────────────────────────────────

const PROMO_OPTIONS = [
  { value: 'A', label: 'A — Full Scholarship ($0)' },
  { value: 'B', label: 'B — Two Month Trial ($0 → $1,500/mo)' },
  { value: 'C', label: 'C — Reduced Rate (custom)' },
  { value: 'D', label: 'D — Greatness Prepay ($9,450 — 7 months)' },
  { value: 'E', label: 'E — Unstoppable Prepay ($13,500 — 10 months)' },
  { value: 'F', label: 'F — Friends & Family ($500/mo)' },
];

const STATUS_DISPLAY = {
  active:      { label: 'ACTIVE',      color: '#4caf50' },
  scholarship: { label: 'SCHOLARSHIP', color: GOLD_LIGHT },
  trial:       { label: 'TRIAL',       color: '#64b5f6' },
  suspended:   { label: 'SUSPENDED',   color: '#e05a5a' },
};

// ── Styles (module scope) ──────────────────────────────────────────────────

const sectionWrap = {
  marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #222',
};

const sectionHead = {
  fontSize: 10, fontWeight: 700, letterSpacing: '1.5px',
  color: TEXT_DIM, marginBottom: 10,
};

const infoRow = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  padding: '7px 0', borderBottom: '1px solid #1a1a1a',
};

const infoLabel = {
  fontSize: 10, fontWeight: 700, letterSpacing: '1px', color: TEXT_DIM,
  flexShrink: 0, width: 130,
};

const infoValue = {
  fontSize: 12, color: '#fff', textAlign: 'right', flex: 1,
};

const inputStyle = {
  width: '100%', background: '#111', color: '#fff',
  border: '1px solid #444', borderRadius: 3,
  padding: '6px 10px', fontSize: 12, fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const fieldLabel = {
  fontSize: 10, fontWeight: 700, letterSpacing: '1px',
  color: TEXT_DIM, marginBottom: 5, display: 'block',
};

const fieldWrap = { marginBottom: 14 };

// ── Component ──────────────────────────────────────────────────────────────

export default function BillingSetupView({ client, onSave, onBack }) {
  const storageKey = `hub_billing_${client?.username}`;

  const loadExisting = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (_) { return null; }
  };

  const existing = loadExisting();

  const [billingType, setBillingType] = useState(existing?.billing_type || 'standard');
  const [promoType,   setPromoType]   = useState(existing?.promo_type   || '');
  const [customRate,  setCustomRate]  = useState(
    existing?.promo_type === 'C' ? String(existing.monthly_rate) : ''
  );
  const [stripeId,    setStripeId]    = useState(existing?.stripe_client_id || '');
  const [clientCode,  setClientCode]  = useState(existing?.client_code || '');
  const [saved,       setSaved]       = useState(false);

  // Derived values
  const tier             = client?.tier || 4;
  const tierName         = client?.tier_name || 'Apprentice';
  const programStartDate = client?.program_start_date || '';
  const username         = client?.username || '';

  const invoicePrefix    = getInvoicePrefix(tier, billingType, promoType);
  const seriesStart      = getSeriesStart(tier);
  const monthlyRate      = getMonthlyRate(billingType, promoType, customRate);
  const billingStatus    = getBillingStatus(billingType, promoType);
  const prepayAmount     = getPrepayAmount(billingType, promoType);
  const firstInvoiceDate = getFirstInvoiceDate(programStartDate);
  const trialEndDate     = getTrialEndDate(programStartDate, billingType, promoType);
  const linkedAgreement  = billingType === 'promotional' ? 'form_007' : 'form_002';
  const firstDueDate     = getFirstDueDate(firstInvoiceDate);
  const invoicePreview   = clientCode.trim()
    ? `${invoicePrefix}-${clientCode.trim()}-${seriesStart + 1}`
    : `${invoicePrefix}-[CODE]-${seriesStart + 1}`;

  useEffect(() => {
    if (billingType === 'standard') { setPromoType(''); setCustomRate(''); }
    setSaved(false);
  }, [billingType]);

  useEffect(() => {
    if (promoType !== 'C') setCustomRate('');
    setSaved(false);
  }, [promoType]);

  useEffect(() => { setSaved(false); }, [stripeId, clientCode, customRate]);

  function handleSave() {
    const record = {
      username,
      client_code:         clientCode.trim(),
      tier,
      tier_name:           tierName,
      program_start_date:  programStartDate,
      billing_type:        billingType,
      promo_type:          billingType === 'promotional' ? promoType : null,
      linked_agreement:    linkedAgreement,
      monthly_rate:        monthlyRate,
      first_invoice_date:  firstInvoiceDate === '—' ? null : firstInvoiceDate,
      trial_end_date:      trialEndDate,
      prepay_amount:       prepayAmount,
      stripe_client_id:    stripeId.trim(),
      billing_status:      billingStatus,
      invoice_prefix:      invoicePrefix,
      invoice_series_start: seriesStart,
      created_at:          existing?.created_at || new Date().toISOString(),
    };
    try { localStorage.setItem(storageKey, JSON.stringify(record)); } catch (_) {}
    setSaved(true);
    if (onSave) onSave(record);
  }

  const canSave =
    clientCode.trim() !== '' &&
    stripeId.trim()   !== '' &&
    (billingType === 'standard' || promoType !== '') &&
    (promoType !== 'C' || customRate.trim() !== '');

  const statusInfo = STATUS_DISPLAY[billingStatus] || STATUS_DISPLAY.active;

  const toggleBtn = (active) => ({
    flex: 1, padding: '6px 0', fontSize: 10, fontWeight: 700,
    letterSpacing: '1px', border: 'none', borderRadius: 3, cursor: 'pointer',
    fontFamily: 'inherit',
    background: active ? GOLD_LIGHT : '#222',
    color: active ? '#000' : TEXT_DIM,
  });

  return (
    <div style={{ padding: '0 16px 16px', overflowY: 'auto', flex: 1 }}>

      {/* ── Section 1: Client Identity ──────────────────────────── */}
      <div style={sectionWrap}>
        <div style={sectionHead}>CLIENT IDENTITY</div>
        <div style={infoRow}>
          <span style={infoLabel}>NAME</span>
          <span style={infoValue}>
            {client ? `${client.first_name} ${client.last_name}` : '—'}
          </span>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>USERNAME</span>
          <span style={infoValue}>{username || '—'}</span>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>TIER</span>
          <span style={{ ...infoValue, color: GOLD }}>{tierName}</span>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>PROGRAM START</span>
          <span style={infoValue}>{programStartDate || '—'}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <label style={fieldLabel}>BILLING CODE</label>
          <input
            type="text"
            value={clientCode}
            onChange={e => setClientCode(e.target.value)}
            placeholder="e.g. SMITH-001"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Section 2: Billing Classification ──────────────────── */}
      <div style={sectionWrap}>
        <div style={sectionHead}>BILLING CLASSIFICATION</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          <button style={toggleBtn(billingType === 'standard')}   onClick={() => setBillingType('standard')}>STANDARD</button>
          <button style={toggleBtn(billingType === 'promotional')} onClick={() => setBillingType('promotional')}>PROMOTIONAL</button>
        </div>

        {billingType === 'promotional' && (
          <div style={fieldWrap}>
            <label style={fieldLabel}>PROMOTIONAL TYPE</label>
            <select
              value={promoType}
              onChange={e => setPromoType(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">— Select type —</option>
              {PROMO_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}

        <div style={infoRow}>
          <span style={infoLabel}>LINKED AGREEMENT</span>
          <span style={{ ...infoValue, color: TEXT_DIM, fontSize: 11 }}>{linkedAgreement}</span>
        </div>
      </div>

      {/* ── Section 3: Rate & Schedule ──────────────────────────── */}
      <div style={sectionWrap}>
        <div style={sectionHead}>RATE & SCHEDULE</div>

        {promoType === 'C' && (
          <div style={{ ...fieldWrap, marginBottom: 14 }}>
            <label style={fieldLabel}>MONTHLY RATE ($)</label>
            <input
              type="number"
              value={customRate}
              onChange={e => setCustomRate(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              style={inputStyle}
            />
          </div>
        )}

        <div style={infoRow}>
          <span style={infoLabel}>MONTHLY RATE</span>
          <span style={infoValue}>{fmtCurrency(monthlyRate)}</span>
        </div>

        {prepayAmount !== null && (
          <div style={infoRow}>
            <span style={infoLabel}>PREPAY AMOUNT</span>
            <span style={{ ...infoValue, color: GOLD_LIGHT }}>{fmtCurrency(prepayAmount)}</span>
          </div>
        )}

        <div style={infoRow}>
          <span style={infoLabel}>FIRST INVOICE DATE</span>
          <span style={infoValue}>{firstInvoiceDate}</span>
        </div>

        {trialEndDate && (
          <div style={infoRow}>
            <span style={infoLabel}>TRIAL END DATE</span>
            <span style={{ ...infoValue, color: '#64b5f6' }}>{trialEndDate}</span>
          </div>
        )}
      </div>

      {/* ── Section 4: Stripe ───────────────────────────────────── */}
      <div style={sectionWrap}>
        <div style={sectionHead}>STRIPE</div>
        <div style={fieldWrap}>
          <label style={fieldLabel}>STRIPE CLIENT ID</label>
          <input
            type="text"
            value={stripeId}
            onChange={e => setStripeId(e.target.value)}
            placeholder="cus_XXXXXXXXXXXXXXXXXX"
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Section 5: Billing Status ───────────────────────────── */}
      <div style={sectionWrap}>
        <div style={sectionHead}>BILLING STATUS</div>
        <div style={infoRow}>
          <span style={infoLabel}>STATUS</span>
          <span style={{ ...infoValue, color: statusInfo.color, fontWeight: 700 }}>
            {statusInfo.label}
          </span>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>INVOICE PREFIX</span>
          <span style={{ ...infoValue, color: TEXT_DIM, fontFamily: 'monospace', fontSize: 11 }}>
            {invoicePrefix}
          </span>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>SERIES START</span>
          <span style={{ ...infoValue, color: TEXT_DIM, fontSize: 11 }}>{seriesStart}</span>
        </div>
      </div>

      {/* ── Section 6: Invoice Preview ──────────────────────────── */}
      <div style={{ ...sectionWrap, borderBottom: 'none', marginBottom: 24, paddingBottom: 0 }}>
        <div style={sectionHead}>INVOICE PREVIEW</div>
        <div style={{
          background: DARKER, border: '1px solid #333', borderRadius: 4,
          padding: '12px 14px',
        }}>
          <div style={{ fontSize: 9, color: TEXT_DIM, letterSpacing: '1px', marginBottom: 6 }}>
            FIRST INVOICE NUMBER
          </div>
          <div style={{
            fontSize: 14, fontWeight: 700, color: GOLD_LIGHT,
            fontFamily: 'monospace', letterSpacing: '1px',
          }}>
            {invoicePreview}
          </div>
        </div>
        <div style={infoRow}>
          <span style={infoLabel}>FIRST INVOICE AMOUNT</span>
          <span style={infoValue}>{fmtCurrency(monthlyRate)}</span>
        </div>
        <div style={{ ...infoRow, borderBottom: 'none' }}>
          <span style={infoLabel}>FIRST DUE DATE</span>
          <span style={infoValue}>{firstDueDate}</span>
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            flex: 1, padding: '9px 0', fontSize: 11, fontWeight: 700,
            letterSpacing: '1px', border: 'none', borderRadius: 4,
            cursor: canSave ? 'pointer' : 'default', fontFamily: 'inherit',
            background: canSave ? GOLD_LIGHT : '#2a2a2a',
            color: canSave ? '#000' : TEXT_DIM,
          }}
        >
          {saved ? 'SAVED ✓' : 'SAVE BILLING RECORD'}
        </button>

        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: '9px 16px', fontSize: 11, fontWeight: 700,
              letterSpacing: '1px', border: '1px solid #444', borderRadius: 4,
              cursor: 'pointer', fontFamily: 'inherit',
              background: 'transparent', color: TEXT_DIM,
            }}
          >
            BACK
          </button>
        )}
      </div>
    </div>
  );
}
