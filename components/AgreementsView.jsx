import React, { useState } from 'react';

const GOLD = '#B8860B';
const DARK = '#1A1A1A';
const DARKER = '#0F0F0F';
const TEXT_DIM = '#555555';

const FORMS = [
  { key: 'form_001', label: 'Client Intake & Application' },
  { key: 'form_002', label: 'Program Application & Commitment Statement' },
  { key: 'form_003', label: 'Liability Waiver & Disclaimer' },
  { key: 'form_004', label: 'Program Agreement' },
  { key: 'form_005', label: 'Photo / Testimonial Release' },
];

const FORM_PDFS = {
  form_001: '/agreement-forms/JPG-TK-001-ClientIntake-WRK-v1.0.pdf',
  form_002: '/agreement-forms/JPG-TK-002-ProgramApplication-WRK-v1.0.pdf',
  form_003: '/agreement-forms/JPG-TK-003-LiabilityWaiver-WRK-v1.0.pdf',
  form_004: '/agreement-forms/JPG-TK-004-ProgramAgreement-WRK-v1.0.pdf',
  form_005: '/agreement-forms/JPG-TK-005-PhotoRelease-WRK-v1.0.pdf',
};

const FORM_EMAIL_SUBJECTS = {
  form_001: 'Jones Performance Group — Client Intake & Application Form',
  form_002: 'Jones Performance Group — Program Application & Commitment Statement',
  form_003: 'Jones Performance Group — Liability Waiver & Disclaimer',
  form_004: 'Jones Performance Group — Program Agreement',
  form_005: 'Jones Performance Group — Photo / Testimonial Release',
};

const EMAIL_BODY_SINGLE = (formLabel) =>
  `Please find the attached JPG form enclosed: ${formLabel}.\n\nComplete and return this document at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

const EMAIL_BODY_ALL =
  `Please find all five Jones Performance Group program forms attached to this email.\n\nComplete and return all documents at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

const FORM_FIELDS = {
  form_001: [
    { key: 'full_name',               label: 'Full Name',                        type: 'text',     required: true },
    { key: 'date_of_birth',           label: 'Date of Birth',                    type: 'date',     required: true },
    { key: 'phone',                   label: 'Phone Number',                     type: 'text',     required: true },
    { key: 'email',                   label: 'Email Address',                    type: 'text',     required: true },
    { key: 'emergency_contact_name',  label: 'Emergency Contact Name',           type: 'text',     required: true },
    { key: 'emergency_contact_phone', label: 'Emergency Contact Phone',          type: 'text',     required: true },
    { key: 'how_did_you_hear',        label: 'How Did You Hear About Us?',       type: 'text',     required: false },
    { key: 'health_concerns',         label: 'Health Concerns or Limitations',   type: 'textarea', required: false },
  ],
  form_002: [
    { key: 'primary_goal',         label: 'Primary Goal',                                                                                                    type: 'textarea', required: true },
    { key: 'motivation',           label: 'What Motivates You?',                                                                                             type: 'textarea', required: true },
    { key: 'commitment_confirm',   label: 'I commit to showing up fully for this program, doing the work, and being coachable.',                             type: 'checkbox', required: true },
    { key: 'signature',            label: 'Electronic Signature (type full name)',                                                                           type: 'text',     required: true },
  ],
  form_003: [
    { key: 'understand_risks',   label: 'I understand participation in this program involves physical and mental effort and I accept full responsibility.',   type: 'checkbox', required: true },
    { key: 'waive_claims',       label: 'I waive any and all claims against Jones Performance Group LLC arising from my participation in this program.',      type: 'checkbox', required: true },
    { key: 'medical_clearance',  label: 'I confirm I have received medical clearance to participate in a high-performance coaching program.',                 type: 'checkbox', required: true },
    { key: 'signature',          label: 'Electronic Signature (type full name)',                                                                             type: 'text',     required: true },
  ],
  form_004: [
    { key: 'agree_program_terms', label: 'I agree to the terms and conditions of the JPG Performance Program as outlined by Jones Performance Group LLC.',   type: 'checkbox', required: true },
    { key: 'agree_payment',       label: 'I acknowledge the payment terms and understand the program investment.',                                            type: 'checkbox', required: true },
    { key: 'agree_conduct',       label: 'I agree to maintain a professional and respectful standard of conduct throughout the program.',                     type: 'checkbox', required: true },
    { key: 'signature',           label: 'Electronic Signature (type full name)',                                                                            type: 'text',     required: true },
  ],
  form_005: [
    { key: 'consent_photos',       label: 'I consent to JPG using photos or videos of me for marketing and promotional purposes.',       type: 'radio', options: ['Yes', 'No'], required: true },
    { key: 'consent_testimonials', label: 'I consent to JPG using my testimonials or statements for marketing purposes.',               type: 'radio', options: ['Yes', 'No'], required: true },
    { key: 'signature',            label: 'Electronic Signature (type full name)',                                                      type: 'text',  required: true },
  ],
};

const DEFAULT_FORM_STATE = {
  form_001: { submitted: false, submitted_at: null, data: {} },
  form_002: { submitted: false, submitted_at: null, data: {} },
  form_003: { submitted: false, submitted_at: null, data: {} },
  form_004: { submitted: false, submitted_at: null, data: {} },
  form_005: { submitted: false, submitted_at: null, data: {} },
};

function getAgreements(username) {
  try {
    const raw = localStorage.getItem(`jpg_agreements_${username}`);
    return raw ? JSON.parse(raw) : { ...DEFAULT_FORM_STATE };
  } catch (_) {
    return { ...DEFAULT_FORM_STATE };
  }
}

function saveAgreements(username, data) {
  localStorage.setItem(`jpg_agreements_${username}`, JSON.stringify(data));
}

function countComplete(agreements) {
  return Object.values(agreements).filter(f => f.submitted === true).length;
}

function fieldLabel(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function fieldValue(val) {
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (val === null || val === undefined || val === '') return '—';
  return String(val);
}

// ── Input styles ────────────────────────────────────────────────

const inputBase = {
  background: '#111', color: '#fff', border: '1px solid #444',
  borderRadius: 3, padding: '8px 10px', fontSize: 13,
  fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
};

// ── Client form view (fill out or view submitted) ───────────────

function ClientFormView({ formDef, entry, username, onBack, onSubmitted }) {
  const fields = FORM_FIELDS[formDef.key] || [];
  const isSubmitted = entry && entry.submitted;

  const initValues = () => {
    const vals = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') vals[f.key] = false;
      else vals[f.key] = '';
    });
    return vals;
  };

  const [values, setValues] = useState(initValues);
  const [error, setError] = useState('');

  function handleChange(key, val) {
    setValues(prev => ({ ...prev, [key]: val }));
    setError('');
  }

  function handleSubmit() {
    for (const f of fields) {
      if (!f.required) continue;
      const v = values[f.key];
      if (f.type === 'checkbox' && !v) {
        setError(`Please check: "${f.label.slice(0, 60)}…"`);
        return;
      }
      if (f.type === 'radio' && !v) {
        setError(`Please select an option for: "${f.label.slice(0, 60)}…"`);
        return;
      }
      if ((f.type === 'text' || f.type === 'date' || f.type === 'textarea') && !String(v).trim()) {
        setError(`"${f.label}" is required.`);
        return;
      }
    }

    const all = getAgreements(username);
    const now = new Date().toISOString().slice(0, 10);
    all[formDef.key] = { submitted: true, submitted_at: now, data: { ...values } };
    saveAgreements(username, all);
    onSubmitted();
  }

  // ── Read-only submitted view ─────────────────────────────────
  if (isSubmitted) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>
        <button onClick={onBack} style={backBtnStyle}>← Back</button>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{formDef.label}</div>
        <div style={{ color: '#4caf50', fontSize: 13, marginBottom: 24 }}>✓ Submitted {entry.submitted_at}</div>
        {Object.entries(entry.data).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>
              {fieldLabel(key)}
            </div>
            <div style={{ color: '#ccc', fontSize: 13 }}>{fieldValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }

  // ── Fillable form ────────────────────────────────────────────
  return (
    <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 24 }}>{formDef.label}</div>

      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 20 }}>
          {f.type === 'checkbox' ? (
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!values[f.key]}
                onChange={e => handleChange(f.key, e.target.checked)}
                style={{ marginTop: 2, accentColor: GOLD, flexShrink: 0, width: 16, height: 16 }}
              />
              <span style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>
                {f.label}
                {f.required && <span style={{ color: GOLD }}> *</span>}
              </span>
            </label>
          ) : f.type === 'radio' ? (
            <div>
              <div style={{ color: '#aaa', fontSize: 12, fontWeight: 700, letterSpacing: '1px', marginBottom: 8 }}>
                {f.label}{f.required && <span style={{ color: GOLD }}> *</span>}
              </div>
              <div style={{ display: 'flex', gap: 20 }}>
                {(f.options || []).map(opt => (
                  <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: '#ccc', fontSize: 13 }}>
                    <input
                      type="radio"
                      name={f.key}
                      value={opt}
                      checked={values[f.key] === opt}
                      onChange={() => handleChange(f.key, opt)}
                      style={{ accentColor: GOLD }}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ) : f.type === 'textarea' ? (
            <div>
              <div style={{ color: '#aaa', fontSize: 12, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>
                {f.label}{f.required && <span style={{ color: GOLD }}> *</span>}
              </div>
              <textarea
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                rows={4}
                style={{ ...inputBase, resize: 'vertical' }}
              />
            </div>
          ) : (
            <div>
              <div style={{ color: '#aaa', fontSize: 12, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>
                {f.label}{f.required && <span style={{ color: GOLD }}> *</span>}
              </div>
              <input
                type={f.type === 'date' ? 'date' : 'text'}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                style={inputBase}
              />
            </div>
          )}
        </div>
      ))}

      {error && (
        <div style={{ color: '#e57373', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#1a0a0a', borderRadius: 4 }}>
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{
          background: GOLD, color: '#000', fontWeight: 700, fontSize: 13,
          padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer',
          letterSpacing: '1px', marginTop: 8,
        }}
      >
        SUBMIT
      </button>
    </div>
  );
}

// ── Client agreements list ───────────────────────────────────────

function ClientAgreementsView({ user }) {
  const [activeForm, setActiveForm] = useState(null);
  const [tick, setTick] = useState(0);

  const agreements = getAgreements(user.username);
  const complete = countComplete(agreements);

  if (activeForm) {
    const formDef = FORMS.find(f => f.key === activeForm);
    const entry = agreements[activeForm];
    return (
      <ClientFormView
        formDef={formDef}
        entry={entry}
        username={user.username}
        onBack={() => setActiveForm(null)}
        onSubmitted={() => { setTick(t => t + 1); setActiveForm(null); }}
      />
    );
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>
      <div style={{
        color: '#fff', fontWeight: 700, fontSize: 20,
        marginBottom: 6, paddingBottom: 12, borderBottom: `2px solid ${GOLD}`,
      }}>
        AGREEMENTS
      </div>
      <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 24 }}>
        {complete} of 5 complete
      </div>

      {FORMS.map(form => {
        const entry = agreements[form.key] || { submitted: false };
        return (
          <ClientFormRow
            key={form.key}
            form={form}
            submitted={!!entry.submitted}
            submittedAt={entry.submitted_at}
            onClick={() => setActiveForm(form.key)}
          />
        );
      })}
    </div>
  );
}

function ClientFormRow({ form, submitted, submittedAt, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DARK, border: `1px solid ${submitted ? '#2e5a2e' : GOLD}`,
        borderRadius: 6, padding: '14px 20px', marginBottom: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', filter: hovered ? 'brightness(1.15)' : 'none',
        transition: 'filter 0.1s',
      }}
    >
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{form.label}</div>
      {submitted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#4caf50', fontSize: 13 }}>✓ {submittedAt}</span>
          <span style={{ color: GOLD, fontSize: 11, textDecoration: 'underline' }}>VIEW</span>
        </div>
      ) : (
        <span style={{ color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '1px' }}>COMPLETE →</span>
      )}
    </div>
  );
}

// ── Coach detail view ────────────────────────────────────────────

function CoachDetailView({ client, onBack }) {
  const [expandedForm, setExpandedForm] = useState(null);
  const agreements = getAgreements(client.username);
  const complete = countComplete(agreements);
  const fullName = (client.first_name + ' ' + client.last_name).toUpperCase();

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>
      <button onClick={onBack} style={backBtnStyle}>← Back to Agreements</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>{fullName}</div>
        <div style={{
          background: GOLD, color: '#000', fontWeight: 700, fontSize: 12,
          padding: '3px 10px', borderRadius: 12,
        }}>
          {complete} of 5 complete
        </div>
      </div>

      {FORMS.map(form => {
        const entry = agreements[form.key] || { submitted: false, submitted_at: null, data: {} };
        const isExpanded = expandedForm === form.key;
        return (
          <div key={form.key} style={{
            background: DARK, border: '1px solid #5a4a1a', borderRadius: 6,
            padding: '14px 20px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{form.label}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {entry.submitted ? (
                  <>
                    <span style={{ color: '#4caf50', fontSize: 13 }}>✓ Submitted {entry.submitted_at}</span>
                    <button
                      onClick={() => setExpandedForm(isExpanded ? null : form.key)}
                      style={{
                        background: 'none', border: 'none', color: GOLD,
                        fontSize: 12, cursor: 'pointer', textDecoration: 'underline', marginLeft: 12,
                      }}
                    >
                      {isExpanded ? 'HIDE' : 'VIEW SUBMISSION'}
                    </button>
                  </>
                ) : (
                  <span style={{ color: GOLD, fontSize: 13, fontStyle: 'italic' }}>Not yet submitted</span>
                )}
              </div>
            </div>

            {isExpanded && entry.data && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #333', paddingLeft: 16 }}>
                {Object.entries(entry.data).map(([key, val]) => (
                  <div key={key} style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic', marginBottom: 6, lineHeight: 1.5 }}>
                    <strong style={{ fontStyle: 'normal', color: '#ccc' }}>{fieldLabel(key)}:</strong> {fieldValue(val)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Coach roster view ────────────────────────────────────────────

function CoachAgreementsView() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [expandedFormSend, setExpandedFormSend] = useState(null);
  const [emailInputs, setEmailInputs] = useState({});

  const clientsRaw = localStorage.getItem('hub_clients');
  const clients = clientsRaw
    ? JSON.parse(clientsRaw).filter(c => c.role === 'client')
    : [];

  if (selectedClient) {
    return <CoachDetailView client={selectedClient} onBack={() => setSelectedClient(null)} />;
  }

  // --- helpers ---
  const handleEmailChange = (formKey, val) => {
    setEmailInputs(prev => ({ ...prev, [formKey]: val }));
  };

  const handleSendSingle = (form) => {
    const email = emailInputs[form.key] || '';
    const subject = encodeURIComponent(FORM_EMAIL_SUBJECTS[form.key]);
    const body = encodeURIComponent(EMAIL_BODY_SINGLE(form.label));
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  const handleSendAll = (email) => {
    const subject = encodeURIComponent('Jones Performance Group — Program Agreement Forms');
    const body = encodeURIComponent(EMAIL_BODY_ALL);
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  };

  const handleDownload = (formKey) => {
    const link = document.createElement('a');
    link.href = FORM_PDFS[formKey];
    link.download = FORM_PDFS[formKey].split('/').pop();
    link.click();
  };

  // --- render ---
  return (
    <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>

      {/* ── FORMS SECTION ── */}
      <div style={{
        color: '#fff', fontWeight: 700, fontSize: 20,
        marginBottom: 24, paddingBottom: 12, borderBottom: `2px solid ${GOLD}`,
      }}>
        AGREEMENTS
      </div>

      {/* Forms subheader */}
      <div style={{
        color: GOLD, fontWeight: 700, fontSize: 15,
        marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid #5a4a1a`,
      }}>
        FORMS
      </div>

      {/* Note about mailto */}
      <div style={{
        color: '#aaa', fontSize: 12, fontStyle: 'italic', marginBottom: 16,
      }}>
        Your default mail client will open when sending. Attach the downloaded PDF manually.
      </div>

      {FORMS.map(form => {
        const isOpen = expandedFormSend === form.key;
        const emailVal = emailInputs[form.key] || '';
        return (
          <div key={form.key} style={{
            background: DARK, border: `1px solid #5a4a1a`,
            borderRadius: 6, padding: '14px 20px', marginBottom: 10,
          }}>
            {/* Form row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, flex: 1, marginRight: 16 }}>
                {form.label}
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                {/* Download */}
                <button
                  onClick={() => handleDownload(form.key)}
                  style={{
                    background: 'none', border: `1px solid ${GOLD}`, color: GOLD,
                    fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer',
                    whiteSpace: 'nowrap', minWidth: 110,
                  }}
                >
                  DOWNLOAD PDF
                </button>
                {/* Send options toggle */}
                <button
                  onClick={() => setExpandedFormSend(isOpen ? null : form.key)}
                  style={{
                    background: GOLD, border: 'none', color: '#000',
                    fontWeight: 700, fontSize: 11, padding: '4px 8px',
                    borderRadius: 4, cursor: 'pointer',
                    whiteSpace: 'nowrap', minWidth: 128,
                  }}
                >
                  {isOpen ? '▲ SEND OPTIONS' : '▼ SEND OPTIONS'}
                </button>
              </div>
            </div>

            {/* Send options panel */}
            {isOpen && (
              <div style={{
                marginTop: 14, paddingTop: 14,
                borderTop: '1px solid #333',
              }}>
                <input
                  type="email"
                  placeholder="Client email address"
                  value={emailVal}
                  onChange={e => handleEmailChange(form.key, e.target.value)}
                  style={{
                    width: '100%', background: '#111', border: `1px solid ${GOLD}`,
                    color: '#fff', borderRadius: 4, padding: '8px 10px',
                    fontSize: 13, boxSizing: 'border-box', marginBottom: 10,
                  }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => handleSendSingle(form)}
                    style={{
                      background: GOLD, border: 'none', color: '#000',
                      fontWeight: 700, fontSize: 12, padding: '7px 16px',
                      borderRadius: 4, cursor: 'pointer',
                    }}
                  >
                    SEND THIS FORM
                  </button>
                  <button
                    onClick={() => handleSendAll(emailVal)}
                    style={{
                      background: 'none', border: `1px solid ${GOLD}`, color: GOLD,
                      fontWeight: 700, fontSize: 12, padding: '7px 16px',
                      borderRadius: 4, cursor: 'pointer',
                    }}
                  >
                    SEND ALL FORMS
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ── CLIENTS SECTION ── */}
      <div style={{
        color: GOLD, fontWeight: 700, fontSize: 15,
        marginTop: 32, marginBottom: 14,
        paddingBottom: 8, borderBottom: `1px solid #5a4a1a`,
      }}>
        CLIENTS
      </div>

      {clients.length === 0 ? (
        <div style={{ color: '#fff', fontStyle: 'italic', fontSize: 14 }}>
          No clients enrolled.
        </div>
      ) : (
        clients.map(c => {
          const agreements = getAgreements(c.username);
          const complete = countComplete(agreements);
          return (
            <ClientRow
              key={c.id}
              client={c}
              complete={complete}
              onClick={() => setSelectedClient(c)}
            />
          );
        })
      )}

    </div>
  );
}

function ClientRow({ client, complete, onClick }) {
  const [hovered, setHovered] = useState(false);
  const fullName = (client.first_name + ' ' + client.last_name).toUpperCase();
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: DARK, border: `1px solid ${GOLD}`, borderRadius: 6,
        padding: '14px 20px', marginBottom: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', filter: hovered ? 'brightness(1.15)' : 'none',
        transition: 'filter 0.1s',
      }}
    >
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{fullName}</div>
      <div style={{ color: GOLD, fontSize: 13 }}>{complete} of 5 complete</div>
    </div>
  );
}

// ── Shared styles ────────────────────────────────────────────────

const backBtnStyle = {
  background: 'none', border: `1px solid ${GOLD}`, color: GOLD,
  padding: '6px 14px', borderRadius: 4, cursor: 'pointer',
  marginBottom: 20, fontSize: 13, fontFamily: 'inherit',
};

// ── Root export ──────────────────────────────────────────────────

export default function AgreementsView({ user }) {
  if (user.role === 'coach') return <CoachAgreementsView />;
  return <ClientAgreementsView user={user} />;
}
