import React, { useState, useEffect } from 'react';
import { GOLD, DARK, DARKER, TEXT_DIM } from '../utils/constants';
import { generateUsername, generatePassword, createClientRecord, addClient } from '../services/clients';
import TK007GeneratorView from './TK007GeneratorView';

const FORMS = [
  { key: 'form_001', label: 'Client Application' },
  { key: 'form_002', label: 'Program Overview & Agreement' },
  { key: 'form_003', label: 'Liability Waiver & Disclaimer' },
  { key: 'form_005', label: 'Photo / Testimonial Release' },
];

const FORM_PDFS = {
  form_001: '/agreement-forms/JPG-TK-001-ClientApplication-WRK-v2.0.pdf',
  form_002: '/agreement-forms/JPG-TK-002-ProgramOverview-WRK-v2.0.pdf',
  form_003: '/agreement-forms/JPG-TK-003-LiabilityWaiver-WRK-v1.0.pdf',
  form_005: '/agreement-forms/JPG-TK-005-PhotoRelease-WRK-v1.0.pdf',
  form_007: '/agreement-forms/JPG-TK-007-PromotionalAgreement-WRK-v1.0.pdf',
};

const FORM_EMAIL_SUBJECTS = {
  form_001: 'Jones Performance Group — Client Application',
  form_002: 'Jones Performance Group — Program Overview & Agreement',
  form_003: 'Jones Performance Group — Liability Waiver & Disclaimer',
  form_005: 'Jones Performance Group — Photo / Testimonial Release',
  form_007: 'Jones Performance Group — Promotional Discount Program Agreement',
};

const PROMOTION_TYPES = [
  { key: 'A', label: 'Type A — Full Scholarship', description: 'Entire program through Tier 2 at no cost to the client.' },
  { key: 'B', label: 'Type B — Two Month Trial', description: 'First two months of the program at no cost to the client.' },
  { key: 'C', label: 'Type C — Reduced Rate', description: 'Reduced monthly rate as entered by coach.' },
  { key: 'D', label: 'Type D — Greatness Prepay', description: '7 months prepaid. Standard value: $10,500. Promotional prepay price: $9,450 (10% off).' },
  { key: 'E', label: 'Type E — Unstoppable Prepay', description: '10 months prepaid. Standard value: $15,000. Promotional prepay price: $13,500 (10% off).' },
  { key: 'F', label: 'Type F — Friends & Family', description: 'Flat monthly rate of $500/month for the duration of the program.' },
];

const EMAIL_BODY_SINGLE = (formLabel) =>
  `Please find the attached JPG form enclosed: ${formLabel}.\n\nComplete and return this document at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

const EMAIL_BODY_ALL =
  `Please find all four Jones Performance Group program forms attached to this email.\n\nComplete and return all documents at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

const FORM_FIELDS = {
  form_001: [
    // SECTION 1 — PERSONAL INFORMATION
    { key: 'full_name',              label: 'Full Name (first and last)',                    type: 'text',     required: true },
    { key: 'preferred_name',         label: 'Preferred Name',                                type: 'text',     required: false },
    { key: 'age',                    label: 'Age',                                           type: 'text',     required: false },
    { key: 'birth_month',            label: 'Birth Month (Jan – Dec)',                       type: 'text',     required: false },
    { key: 'phone',                  label: 'Phone Number',                                  type: 'text',     required: true },
    { key: 'email',                  label: 'Email Address',                                 type: 'text',     required: true },
    { key: 'occupation',             label: 'Occupation',                                    type: 'text',     required: true },
    { key: 'residential_street',     label: 'Residential Street',                            type: 'text',     required: true },
    { key: 'residential_city',       label: 'Residential City',                              type: 'text',     required: false },
    { key: 'residential_state',      label: 'Residential State',                             type: 'text',     required: false },
    { key: 'residential_zip',        label: 'Residential Zip',                               type: 'text',     required: false },
    { key: 'mailing_same',           label: 'Mailing address same as residential',           type: 'checkbox', required: false },
    { key: 'mailing_street',         label: 'Mailing Street',                                type: 'text',     required: false },
    { key: 'mailing_city',           label: 'Mailing City',                                  type: 'text',     required: false },
    { key: 'mailing_state',          label: 'Mailing State',                                 type: 'text',     required: false },
    { key: 'mailing_zip',            label: 'Mailing Zip',                                   type: 'text',     required: false },
    // SECTION 2 — IDENTITY & SELF-AWARENESS
    { key: 'who_are_you',            label: 'Who are you right now?',                        type: 'textarea', required: true },
    { key: 'who_do_you_want_to_become', label: 'Who do you want to become?',                type: 'textarea', required: true },
    { key: 'holding_you_back',       label: 'What patterns or habits are currently holding you back?', type: 'textarea', required: true },
    // SECTION 3 — DESIRED OUTCOMES
    { key: 'desired_outcomes',       label: 'What are your desired outcomes from this program?', type: 'textarea', required: true },
    // SECTION 4 — TOTAL COMMITMENT (static framing block renders above this field)
    { key: 'total_commitment_response', label: 'Having read the above — what is your response? What does total commitment mean to you in the context of this program?', type: 'textarea', required: true },
    // SECTION 5 — READINESS & DISCIPLINE
    { key: 'daily_routine',          label: 'Describe your current daily routine — what does a typical day look like from morning to night?', type: 'textarea', required: true },
    { key: 'prevented_progress',     label: 'What has prevented progress in the past?',      type: 'textarea', required: true },
    { key: 'why_ready_now',          label: 'Why are you ready now?',                        type: 'textarea', required: true },
    { key: 'ready_for_structure',    label: 'Are you ready for daily structure and accountability? Describe what that means to you.', type: 'textarea', required: true },
    // SECTION 6 — TIME & COMMITMENT
    { key: 'time_commitment_response', label: 'This program requires a consistent weekly time investment. The system is designed to build sustainable habits without overwhelming your schedule. Are you willing to commit the time each week that the program requires?', type: 'textarea', required: true },
    { key: 'six_month_commitment',   label: 'I understand that this program requires a minimum six-month commitment. I am prepared to honor that commitment.', type: 'checkbox', required: true },
    // SECTION 7 — HEALTH & LIFESTYLE BASELINE
    { key: 'non_negotiables',        label: 'Non-Negotiables — What will you not compromise on during this program?', type: 'textarea', required: true },
    { key: 'hobbies',                label: 'Hobbies & Interests',                           type: 'textarea', required: false },
    { key: 'current_fitness',        label: 'Current Fitness Activity — write None if no current fitness activity', type: 'textarea', required: true },
    { key: 'eating_habits',          label: 'Current Eating Habits — describe a typical day', type: 'textarea', required: true },
    { key: 'sleep',                  label: 'Sleep — typical bedtime, wake time, and quality on a 1–10 scale (10 = Great)', type: 'textarea', required: true },
    { key: 'injuries',               label: 'Injuries, Medical Conditions, or Physical Limitations', type: 'textarea', required: true },
    // SECTION 8 — EMERGENCY CONTACT
    { key: 'emergency_contact_name',  label: 'Emergency Contact Name',                      type: 'text',     required: true },
    { key: 'emergency_contact_phone', label: 'Emergency Contact Phone',                     type: 'text',     required: true },
    // SECTION 9 — PROGRAM INVESTMENT
    { key: 'program_agreement_acknowledged', label: 'I have reviewed the JPG Program Agreement and understand the program investment and commitment required.', type: 'checkbox', required: true },
    // SECTION 10 — READINESS DECLARATIONS
    { key: 'decl_honest',            label: 'I am ready to be honest about who I am.',      type: 'checkbox', required: false },
    { key: 'decl_patterns',          label: 'I am willing to confront my patterns.',         type: 'checkbox', required: false },
    { key: 'decl_structure',         label: 'I am ready to follow daily structure.',         type: 'checkbox', required: false },
    { key: 'decl_accountability',    label: 'I am ready for accountability.',                type: 'checkbox', required: false },
    { key: 'decl_selective',         label: 'I understand that acceptance is selective and not guaranteed.', type: 'checkbox', required: false },
    { key: 'decl_coachable',         label: 'I am willing to accept coaching, criticism, encouragement, and hard conversations when needed.', type: 'checkbox', required: false },
    // SECTION 10 — ACKNOWLEDGMENT
    { key: 'full_name_signature',    label: 'Full Name (typed — serves as signature for Phase 1)', type: 'text', required: true },
    { key: 'date_submitted',         label: 'Date',                                          type: 'text',     required: false },
  ],
  form_002: [
    { key: 'full_legal_name',        label: 'Full Legal Name',                                                                                                    type: 'text',     required: true },
    { key: 'email',                  label: 'Email Address',                                                                                                      type: 'text',     required: true },
    { key: 'phone',                  label: 'Phone Number',                                                                                                       type: 'text',     required: true },
    { key: 'effective_date',         label: 'Effective Date (MM/DD/YYYY)',                                                                                        type: 'date',     required: false },
    { key: 'anticipated_start_date', label: 'Anticipated Start Date (MM/DD/YYYY)',                                                                               type: 'date',     required: false },
    { key: 'ack_scope',              label: 'I understand the scope of JPG coaching services and acknowledge that JPG does not provide medical, therapeutic, dietary, legal, or financial services of any kind.', type: 'checkbox', required: true },
    { key: 'ack_tier_structure',     label: 'I understand the tier progression structure and accept that entry at Tier 4 is mandatory, progression through Tier 2 is required, and Tier 1 is optional.',         type: 'checkbox', required: true },
    { key: 'ack_financial_terms',    label: 'I have read and understood all financial terms above including the program rate, billing schedule, suspension policy, reinstatement fee, and non-refundable policy.', type: 'checkbox', required: true },
    { key: 'ack_monthly_auth',       label: 'I authorize Jones Performance Group LLC to invoice me monthly at the agreed rate and I will maintain a current payment method on file at all times.',                type: 'checkbox', required: true },
    { key: 'ack_time_commitment',    label: 'I understand this program requires a minimum six-month commitment and a consistent weekly time investment. I am prepared to honor both.',                            type: 'checkbox', required: true },
    { key: 'ack_ip',                 label: 'I acknowledge JPG\'s intellectual property rights and my confidentiality obligations. I will not share, reproduce, or distribute any JPG materials without prior written authorization. I understand that JPG will protect my personal data.', type: 'checkbox', required: true },
    { key: 'ack_dispute',            label: 'I acknowledge the dispute resolution terms, including the governing law provision and the good-faith resolution requirement before formal legal action.',             type: 'checkbox', required: true },
    { key: 'ack_full_agreement',     label: 'I have read this Agreement in full. I understand and agree to all terms. I am signing voluntarily and with full knowledge of my obligations under this Agreement.',  type: 'checkbox', required: true },
    { key: 'signature',              label: 'Full Name (typed — serves as signature for Phase 1)',                                                                                                               type: 'text',     required: true },
  ],
  form_003: [
    { key: 'understand_risks',   label: 'I understand participation in this program involves physical and mental effort and I accept full responsibility.',   type: 'checkbox', required: true },
    { key: 'waive_claims',       label: 'I waive any and all claims against Jones Performance Group LLC arising from my participation in this program.',      type: 'checkbox', required: true },
    { key: 'medical_clearance',  label: 'I confirm I have received medical clearance to participate in a high-performance coaching program.',                 type: 'checkbox', required: true },
    { key: 'signature',          label: 'Electronic Signature (type full name)',                                                                             type: 'text',     required: true },
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
  const activeKeys = ['form_001','form_002','form_003','form_005'];
  return activeKeys.filter(k => agreements[k]?.submitted === true).length;
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
  const fields = formDef ? (FORM_FIELDS[formDef.key] || []) : [];
  const isSubmitted = entry && entry.submitted;

  const initValues = () => {
    const vals = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') vals[f.key] = false;
      else vals[f.key] = '';
    });
    return vals;
  };

  const [values, setValues] = useState(() => initValues());
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setValues(initValues());
  }, [formDef?.key]);

  if (!formDef || formDef.key === 'form_007') {
    return <Form007View entry={entry} username={username} onBack={onBack} onSubmitted={onSubmitted} />;
  }

  if (formDef.key === 'form_003') {
    return <Form003View entry={entry} username={username} onBack={onBack} onSubmitted={onSubmitted} />;
  }

  if (formDef.key === 'form_005') {
    return <Form005View entry={entry} username={username} onBack={onBack} onSubmitted={onSubmitted} />;
  }

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

  function handleEdit() {
    const vals = {};
    fields.forEach(f => {
      if (f.type === 'checkbox') vals[f.key] = entry.data?.[f.key] ?? false;
      else vals[f.key] = entry.data?.[f.key] ?? '';
    });
    setValues(vals);
    setEditMode(true);
  }

  // ── Read-only submitted view ─────────────────────────────────
  if (isSubmitted && !editMode) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
        <button onClick={onBack} style={backBtnStyle}>← Back</button>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{formDef.label}</div>
        <div style={{ color: '#4caf50', fontSize: 13, marginBottom: 12 }}>✓ Submitted {entry.submitted_at}</div>
        <button onClick={handleEdit} style={{ ...backBtnStyle, marginBottom: 24 }}>EDIT</button>
        {Object.entries(entry.data).map(([key, val]) => (
          <React.Fragment key={key}>
            {key === 'total_commitment_response' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                Real, lasting results are completely attainable. JPG uses a multifaceted approach that focuses on building multiple foundations. I am not just a fitness coach — I am a total life coach whose tools and methods reach into many aspects of daily life. To get there you have to be honest with me — about what's working, what isn't, and what you're struggling with. We work on everything together: how you move, how you eat, how you sleep, and how you think. None of it is optional.
              </div>
            )}
            {key === 'ack_scope' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                <div>Jones Performance Group provides performance coaching built around the individual client and based upon an established system of success delivered through an interactive application and personalized coaching experience. JPG integrates AI models to elevate the probability of success and reduction of friction, however does not solely rely upon these AI models for program delivery. The JPG program includes fitness and nutrition plan development, mindset development, life architecture, business and career momentum guidance, and most importantly the implementation of these principles and actions while balancing demanding schedules and overall life.</div>
                <div style={{ marginTop: 10 }}>Clients also receive access to the JPG application suite — JPG Hub, Personal Investment Time (PIT), and Daily Operational Process (DOP) — which supports daily execution across all four program foundations.</div>
                <div style={{ marginTop: 10 }}>JPG does not provide medical diagnoses, treatment plans, psychotherapy, licensed counseling, registered dietary or nutritional therapy, legal advice, financial planning, or crisis intervention services. All coaching is delivered strictly within the scope of performance coaching.</div>
              </div>
            )}
            {key === 'ack_tier_structure' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                <div>All clients enter JPG at Tier 4 — Apprentice. This is the mandatory entry point regardless of prior experience, fitness level, or background. The program follows a defined progression built around your desired outcomes: Tier 4 (Apprentice, 1 month) establishes your baseline and onboarding. Tier 3 (Performance, 3 months) moves into active development and desired outcome progression. Tier 2 (Greatness, 3 months) is the program completion milestone that every client works toward.</div>
                <div style={{ marginTop: 10 }}>The program is designed as a full journey. Clients are asked to honor the complete progression through Tier 2, as early departure limits the depth of results achievable within the system.</div>
                <div style={{ marginTop: 10 }}>Tier 1 — Unstoppable is optional and available only after successful completion of Tier 2. This tier represents the peak of the JPG system and is activated through a separate written agreement between coach and client.</div>
              </div>
            )}
            {key === 'ack_financial_terms' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                <div>The standard program rate is $1,500 per month, consistent across all tiers and phases of the program. Payment is due on the 1st of each month. A 7-day grace period applies — payment not received by the 8th results in immediate program suspension and cancellation of all sessions and access.</div>
                <div style={{ marginTop: 10 }}>Persistent non-payment constitutes a material breach of this Agreement and grounds for immediate termination. Reinstatement following non-payment requires a $500 reinstatement fee plus the current month's payment in full before re-entry is permitted.</div>
                <div style={{ marginTop: 10 }}>The Tier 4 entry period and first full month payment are non-refundable under all circumstances. Refund eligibility for Tier 3 and Tier 2 is reviewed at the coach's sole discretion. The program term is defined by enrolled tier — Tier 4 through Tier 2 represents a minimum commitment of 7 months. Either party may terminate with 14 days written notice after Tier 2 completion.</div>
              </div>
            )}
            {key === 'ack_ip' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                <div>All JPG frameworks, systems, methodologies, program content, training materials, and operational documents are the exclusive property of Jones Performance Group LLC. This includes the Four Foundations framework, LIMITLESS doctrine, tier progression system, JPG Hub, Personal Investment Time (PIT), Daily Operational Process (DOP), and all associated tools and proprietary content. The client may not disclose, share, reproduce, or distribute any JPG material to any third party without prior written authorization. This obligation remains in effect after termination of this Agreement.</div>
                <div style={{ marginTop: 10 }}>Jones Performance Group LLC will not disclose your personal information, progress data, biometrics, or session content to any third party without your written consent, except where required by applicable law or court order.</div>
              </div>
            )}
            {key === 'ack_dispute' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                This Agreement is governed by the laws of the state in which Jones Performance Group LLC is legally organized at the time of the dispute. In the event of a dispute, both parties agree to first attempt resolution through direct communication before pursuing formal legal action. If direct resolution is not reached, the dispute will be submitted to binding arbitration under rules mutually agreed upon by both parties. This does not limit JPG's right to seek injunctive or equitable relief for breach of intellectual property or confidentiality obligations.
              </div>
            )}
            {key === 'ack_full_agreement' && (
              <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
                By submitting this form you confirm that you have read this JPG Program Overview and Agreement in its entirety and understand each section and its implications. You are entering this Agreement voluntarily, without duress, and with the full understanding that it is a legally binding document. You acknowledge that you had the opportunity to seek independent legal counsel before signing and have chosen to proceed. You agree to all terms stated herein. No services will begin until this Agreement is fully submitted and initial payment is received.
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>
                {fieldLabel(key)}
              </div>
              <div style={{ color: '#ccc', fontSize: 13 }}>{fieldValue(val)}</div>
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }

  // ── Fillable form ────────────────────────────────────────────
  return (
    <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 24 }}>{formDef.label}</div>

      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 20 }}>
          {f.key === 'total_commitment_response' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              Real, lasting results are completely attainable. JPG uses a multifaceted approach that focuses on building multiple foundations. I am not just a fitness coach — I am a total life coach whose tools and methods reach into many aspects of daily life. To get there you have to be honest with me — about what's working, what isn't, and what you're struggling with. We work on everything together: how you move, how you eat, how you sleep, and how you think. None of it is optional.
            </div>
          )}
          {f.key === 'ack_scope' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              <div>Jones Performance Group provides performance coaching built around the individual client and based upon an established system of success delivered through an interactive application and personalized coaching experience. JPG integrates AI models to elevate the probability of success and reduction of friction, however does not solely rely upon these AI models for program delivery. The JPG program includes fitness and nutrition plan development, mindset development, life architecture, business and career momentum guidance, and most importantly the implementation of these principles and actions while balancing demanding schedules and overall life.</div>
              <div style={{ marginTop: 10 }}>Clients also receive access to the JPG application suite — JPG Hub, Personal Investment Time (PIT), and Daily Operational Process (DOP) — which supports daily execution across all four program foundations.</div>
              <div style={{ marginTop: 10 }}>JPG does not provide medical diagnoses, treatment plans, psychotherapy, licensed counseling, registered dietary or nutritional therapy, legal advice, financial planning, or crisis intervention services. All coaching is delivered strictly within the scope of performance coaching.</div>
            </div>
          )}
          {f.key === 'ack_tier_structure' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              <div>All clients enter JPG at Tier 4 — Apprentice. This is the mandatory entry point regardless of prior experience, fitness level, or background. The program follows a defined progression built around your desired outcomes: Tier 4 (Apprentice, 1 month) establishes your baseline and onboarding. Tier 3 (Performance, 3 months) moves into active development and desired outcome progression. Tier 2 (Greatness, 3 months) is the program completion milestone that every client works toward.</div>
              <div style={{ marginTop: 10 }}>The program is designed as a full journey. Clients are asked to honor the complete progression through Tier 2, as early departure limits the depth of results achievable within the system.</div>
              <div style={{ marginTop: 10 }}>Tier 1 — Unstoppable is optional and available only after successful completion of Tier 2. This tier represents the peak of the JPG system and is activated through a separate written agreement between coach and client.</div>
            </div>
          )}
          {f.key === 'ack_financial_terms' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              <div>The standard program rate is $1,500 per month, consistent across all tiers and phases of the program. Payment is due on the 1st of each month. A 7-day grace period applies — payment not received by the 8th results in immediate program suspension and cancellation of all sessions and access.</div>
              <div style={{ marginTop: 10 }}>Persistent non-payment constitutes a material breach of this Agreement and grounds for immediate termination. Reinstatement following non-payment requires a $500 reinstatement fee plus the current month's payment in full before re-entry is permitted.</div>
              <div style={{ marginTop: 10 }}>The Tier 4 entry period and first full month payment are non-refundable under all circumstances. Refund eligibility for Tier 3 and Tier 2 is reviewed at the coach's sole discretion. The program term is defined by enrolled tier — Tier 4 through Tier 2 represents a minimum commitment of 7 months. Either party may terminate with 14 days written notice after Tier 2 completion.</div>
            </div>
          )}
          {f.key === 'ack_ip' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              <div>All JPG frameworks, systems, methodologies, program content, training materials, and operational documents are the exclusive property of Jones Performance Group LLC. This includes the Four Foundations framework, LIMITLESS doctrine, tier progression system, JPG Hub, Personal Investment Time (PIT), Daily Operational Process (DOP), and all associated tools and proprietary content. The client may not disclose, share, reproduce, or distribute any JPG material to any third party without prior written authorization. This obligation remains in effect after termination of this Agreement.</div>
              <div style={{ marginTop: 10 }}>Jones Performance Group LLC will not disclose your personal information, progress data, biometrics, or session content to any third party without your written consent, except where required by applicable law or court order.</div>
            </div>
          )}
          {f.key === 'ack_dispute' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              This Agreement is governed by the laws of the state in which Jones Performance Group LLC is legally organized at the time of the dispute. In the event of a dispute, both parties agree to first attempt resolution through direct communication before pursuing formal legal action. If direct resolution is not reached, the dispute will be submitted to binding arbitration under rules mutually agreed upon by both parties. This does not limit JPG's right to seek injunctive or equitable relief for breach of intellectual property or confidentiality obligations.
            </div>
          )}
          {f.key === 'ack_full_agreement' && (
            <div style={{ background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 14, color: '#ccc', fontSize: 13, lineHeight: 1.7 }}>
              By submitting this form you confirm that you have read this JPG Program Overview and Agreement in its entirety and understand each section and its implications. You are entering this Agreement voluntarily, without duress, and with the full understanding that it is a legally binding document. You acknowledge that you had the opportunity to seek independent legal counsel before signing and have chosen to proceed. You agree to all terms stated herein. No services will begin until this Agreement is fully submitted and initial payment is received.
            </div>
          )}
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

// ── Form 007 input helpers ───────────────────────────────────────

function TI({ label, placeholder = '', req = false, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: '#aaa', fontSize: 12, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>
        {label}{req && <span style={{ color: GOLD }}> *</span>}
      </div>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} style={inputBase} />
    </div>
  );
}

function CB({ label, checked, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <input type="checkbox" checked={checked} onChange={onChange} style={{ marginTop: 2, accentColor: GOLD, flexShrink: 0, width: 16, height: 16 }} />
        <span style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{label}<span style={{ color: GOLD }}> *</span></span>
      </label>
    </div>
  );
}

function TA({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ color: '#aaa', fontSize: 12, fontWeight: 700, letterSpacing: '1px', marginBottom: 6 }}>
        {label}<span style={{ color: GOLD }}> *</span>
      </div>
      <textarea value={value} onChange={onChange} rows={4} style={{ ...inputBase, resize: 'vertical' }} />
    </div>
  );
}

// ── Form 007 — Promotional Discount Program Agreement ───────────

function Form007View({ entry, username, onBack, onSubmitted }) {
  const init = () => ({
    email: '', phone: '', anticipated_start_date: '',
    ack_agreement_basis: false,
    ack_scope: false,
    ack_tier_structure: false,
    ack_financial_terms: false,
    ack_time_commitment: false,
    why_applying: '', top_three_behaviors: '', overcoming_difficulty: '',
    prog_ack_1: false, prog_ack_2: false, prog_ack_3: false,
    prog_ack_4: false, prog_ack_5: false, prog_ack_6: false,
    prog_ack_7: false, prog_ack_8: false, prog_ack_9: false,
    ack_ip: false,
    ack_dispute: false,
    ack_full_agreement: false,
    signature: '',
  });

  const [values, setValues] = useState(init);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const isSubmitted = entry && entry.submitted;
  const promoTypeObj = PROMOTION_TYPES.find(p => p.key === entry?.promoType);
  const promoLabel = promoTypeObj ? promoTypeObj.label : (entry?.promoType || '—');
  const promoDescription = promoTypeObj ? promoTypeObj.description : '';
  const clientName = entry?.clientName || '—';
  const effectiveDate = entry?.effectiveDate || '—';

  function handleChange(key, val) { setValues(prev => ({ ...prev, [key]: val })); setError(''); }

  function handleSubmit() {
    const required = [
      { key: 'email', type: 'text', label: 'Email Address' },
      { key: 'phone', type: 'text', label: 'Phone Number' },
      { key: 'ack_agreement_basis', type: 'cb', label: 'Section 2 acknowledgment' },
      { key: 'ack_scope', type: 'cb', label: 'Section 3 acknowledgment' },
      { key: 'ack_tier_structure', type: 'cb', label: 'Section 4 acknowledgment' },
      { key: 'ack_financial_terms', type: 'cb', label: 'Section 6 acknowledgment' },
      { key: 'ack_time_commitment', type: 'cb', label: 'Section 7 acknowledgment' },
      { key: 'why_applying', type: 'text', label: 'Why are you applying' },
      { key: 'top_three_behaviors', type: 'text', label: 'Top three behaviors' },
      { key: 'overcoming_difficulty', type: 'text', label: 'Overcoming difficulty' },
      { key: 'prog_ack_1', type: 'cb', label: 'Program acknowledgment 1' },
      { key: 'prog_ack_2', type: 'cb', label: 'Program acknowledgment 2' },
      { key: 'prog_ack_3', type: 'cb', label: 'Program acknowledgment 3' },
      { key: 'prog_ack_4', type: 'cb', label: 'Program acknowledgment 4' },
      { key: 'prog_ack_5', type: 'cb', label: 'Program acknowledgment 5' },
      { key: 'prog_ack_6', type: 'cb', label: 'Program acknowledgment 6' },
      { key: 'prog_ack_7', type: 'cb', label: 'Program acknowledgment 7' },
      { key: 'prog_ack_8', type: 'cb', label: 'Program acknowledgment 8' },
      { key: 'prog_ack_9', type: 'cb', label: 'Program acknowledgment 9' },
      { key: 'ack_ip', type: 'cb', label: 'Section 10 acknowledgment' },
      { key: 'ack_dispute', type: 'cb', label: 'Section 11 acknowledgment' },
      { key: 'ack_full_agreement', type: 'cb', label: 'Section 12 acknowledgment' },
      { key: 'signature', type: 'text', label: 'Full Name (typed signature)' },
    ];
    for (const r of required) {
      const v = values[r.key];
      if (r.type === 'cb' && !v) { setError(`Please check: "${r.label}"`); return; }
      if (r.type === 'text' && !String(v).trim()) { setError(`"${r.label}" is required.`); return; }
    }
    const all = getAgreements(username);
    const existing = all['form_007'] || {};
    const now = new Date().toISOString().slice(0, 10);
    all['form_007'] = { ...existing, submitted: true, submitted_at: now, data: { ...values } };
    saveAgreements(username, all);
    onSubmitted();
  }

  function handleEdit() {
    const d = entry.data || {};
    setValues({
      email: d.email || '', phone: d.phone || '',
      anticipated_start_date: d.anticipated_start_date || '',
      ack_agreement_basis: d.ack_agreement_basis ?? false,
      ack_scope: d.ack_scope ?? false,
      ack_tier_structure: d.ack_tier_structure ?? false,
      ack_financial_terms: d.ack_financial_terms ?? false,
      ack_time_commitment: d.ack_time_commitment ?? false,
      why_applying: d.why_applying || '',
      top_three_behaviors: d.top_three_behaviors || '',
      overcoming_difficulty: d.overcoming_difficulty || '',
      prog_ack_1: d.prog_ack_1 ?? false, prog_ack_2: d.prog_ack_2 ?? false,
      prog_ack_3: d.prog_ack_3 ?? false, prog_ack_4: d.prog_ack_4 ?? false,
      prog_ack_5: d.prog_ack_5 ?? false, prog_ack_6: d.prog_ack_6 ?? false,
      prog_ack_7: d.prog_ack_7 ?? false, prog_ack_8: d.prog_ack_8 ?? false,
      prog_ack_9: d.prog_ack_9 ?? false,
      ack_ip: d.ack_ip ?? false,
      ack_dispute: d.ack_dispute ?? false,
      ack_full_agreement: d.ack_full_agreement ?? false,
      signature: d.signature || '',
    });
    setEditMode(true);
  }

  const sBox = { background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 };
  const pBox = { background: '#0f1e0f', border: '1px solid #2a4a2a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 };
  const errBox = { color: '#e57373', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#1a0a0a', borderRadius: 4 };
  const secHead = { color: GOLD, fontWeight: 700, fontSize: 13, letterSpacing: '1px', marginBottom: 10, marginTop: 24, borderBottom: `1px solid #3a2e00`, paddingBottom: 6 };
  const subHead = { color: GOLD, fontWeight: 700, fontSize: 12, letterSpacing: '1px', marginBottom: 8, marginTop: 16 };
  const bodyText = { color: '#ccc', fontSize: 13, lineHeight: 1.7, marginBottom: 10 };
  const italicText = { color: '#aaa', fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14 };

  const header = (
    <>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Promotional Discount Program Agreement</div>
      <div style={{ color: GOLD, fontSize: 11, marginBottom: 16, opacity: 0.7 }}>JPG-TK-007-PromotionalAgreement-WRK-v1.1</div>
    </>
  );

  if (isSubmitted && !editMode) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
        {header}
        <div style={{ color: '#4caf50', fontSize: 13, marginBottom: 12 }}>✓ Submitted {entry.submitted_at}</div>
        <button onClick={handleEdit} style={{ ...backBtnStyle, marginBottom: 24 }}>EDIT</button>
        <div style={pBox}>
          <div><strong style={{ color: GOLD }}>Client Name:</strong> {clientName}</div>
          <div style={{ marginTop: 6 }}><strong style={{ color: GOLD }}>Effective Date:</strong> {effectiveDate}</div>
          <div style={{ marginTop: 6 }}><strong style={{ color: GOLD }}>Promotion Type:</strong> {promoLabel}</div>
        </div>
        {Object.entries(entry.data || {}).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>{fieldLabel(key)}</div>
            <div style={{ color: '#ccc', fontSize: 13 }}>{fieldValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
      {header}

      <div style={secHead}>SECTION 1 — PARTIES &amp; EFFECTIVE DATE</div>
      <div style={bodyText}>This Agreement is entered into between Jones Performance Group LLC ("JPG") and the client identified below. Services begin only on or after the effective date and only upon full execution of this Agreement.</div>
      <div style={pBox}>
        <div><strong style={{ color: GOLD }}>Full Legal Name:</strong> {clientName}</div>
        <div style={{ marginTop: 6 }}><strong style={{ color: GOLD }}>Effective Date:</strong> {effectiveDate}</div>
      </div>
      <TI label="Email Address" req value={values.email} onChange={e => handleChange('email', e.target.value)} />
      <TI label="Phone Number" req value={values.phone} onChange={e => handleChange('phone', e.target.value)} />
      <TI label="Anticipated Start Date (MM/DD/YYYY)" placeholder="MM/DD/YYYY" value={values.anticipated_start_date} onChange={e => handleChange('anticipated_start_date', e.target.value)} />

      <div style={secHead}>SECTION 2 — AGREEMENT BASIS</div>
      <div style={bodyText}>This Agreement serves as the complete program agreement for clients enrolled under a promotional arrangement.</div>
      <div style={italicText}>I understand that this is my complete program agreement and governs all terms of my enrollment.</div>
      <CB label="I understand that this is my complete program agreement and governs all terms of my enrollment." checked={values.ack_agreement_basis} onChange={e => handleChange('ack_agreement_basis', e.target.checked)} />

      <div style={secHead}>SECTION 3 — SCOPE OF SERVICE</div>
      <div style={bodyText}>Jones Performance Group LLC provides performance coaching services to enrolled clients. Services include access to the JPG coaching framework, Four Foundations programming, DOP (Daily Operational Process), PIT (Personal Investment Time), OBT (14-Day Baseline Tracker), and all associated tools and materials made available through the JPG platform.</div>
      <div style={bodyText}>JPG coaching is not medical advice, physical therapy, clinical treatment, or nutritional counseling. No JPG service constitutes a licensed medical, psychological, or dietary service of any kind.</div>
      <div style={bodyText}>Service delivery is contingent on full execution of this Agreement and satisfaction of applicable payment terms.</div>
      <div style={italicText}>I understand the scope of services provided by JPG and acknowledge that coaching services are not a substitute for licensed medical, psychological, or nutritional care.</div>
      <CB label="I understand the scope of JPG coaching services and acknowledge that coaching services are not a substitute for licensed medical, psychological, or nutritional care." checked={values.ack_scope} onChange={e => handleChange('ack_scope', e.target.checked)} />

      <div style={secHead}>SECTION 4 — TIER STRUCTURE &amp; PROGRESSION</div>
      <div style={{ ...sBox, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '6px 12px', marginBottom: 10 }}>
          <div style={{ color: GOLD, fontWeight: 700, fontSize: 12 }}>Tier</div>
          <div style={{ color: GOLD, fontWeight: 700, fontSize: 12 }}>Duration</div>
          <div style={{ color: GOLD, fontWeight: 700, fontSize: 12 }}>Description</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Tier 4 — Apprentice</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>1 month</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Mandatory entry tier. Baseline tracking and onboarding.</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Tier 3 — Performance</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>3 months</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Active development and goal progression.</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Tier 2 — Greatness</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>3 months</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Mandatory program completion point.</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Tier 1 — Unstoppable</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>3+ months (optional)</div>
          <div style={{ color: '#ccc', fontSize: 12 }}>Peak tier. Available only after Tier 2 completion.</div>
        </div>
        <div style={{ color: '#bbb', fontSize: 12, lineHeight: 1.6 }}>— All clients enter JPG at Tier 4 — Apprentice. No enrollment above Tier 4 is permitted under any circumstance.</div>
        <div style={{ color: '#bbb', fontSize: 12, lineHeight: 1.6, marginTop: 6 }}>— Progression through Tier 4 → Tier 3 → Tier 2 is mandatory. No client may exit before completing Tier 2 without formal written agreement.</div>
        <div style={{ color: '#bbb', fontSize: 12, lineHeight: 1.6, marginTop: 6 }}>— Tier 1 — Unstoppable is optional and available only after successful completion of Tier 2. Separate written disclosure is required before Tier 1 activates.</div>
        <div style={{ color: '#bbb', fontSize: 12, lineHeight: 1.6, marginTop: 6 }}>— Upon completing Tier 2, the client may advance to Tier 1, join the JPG Finishers Group, enter Maintenance Stage, or complete exit.</div>
      </div>
      <div style={italicText}>I understand the tier progression structure and accept that entry at Tier 4 is mandatory, progression through Tier 2 is required, and Tier 1 is optional.</div>
      <CB label="I understand the tier progression structure and accept that entry at Tier 4 is mandatory, progression through Tier 2 is required, and Tier 1 is optional." checked={values.ack_tier_structure} onChange={e => handleChange('ack_tier_structure', e.target.checked)} />

      <div style={secHead}>SECTION 5 — PROMOTIONAL TERMS</div>
      <div style={bodyText}>This section identifies the specific promotional arrangement applicable to this client.</div>
      <div style={pBox}>
        <div><strong style={{ color: GOLD }}>Client Name:</strong> {clientName}</div>
        <div style={{ marginTop: 6 }}><strong style={{ color: GOLD }}>Effective Date of Promotion:</strong> {effectiveDate}</div>
        <div style={{ marginTop: 6 }}><strong style={{ color: GOLD }}>Promotion Type Selected:</strong> {promoLabel}</div>
      </div>
      <div style={{ ...sBox, marginBottom: 14 }}>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{promoLabel}</div>
        <div style={bodyText}>{promoDescription}</div>
      </div>

      <div style={secHead}>SECTION 6 — FINANCIAL TERMS (PROMOTIONAL)</div>
      <div style={bodyText}>The financial terms below correspond to the promotion type selected in Section 5. Only one type governs this agreement.</div>
      <div style={{ ...sBox, marginBottom: 14 }}>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{promoLabel}</div>
        {entry?.promoType === 'A' && <><div style={bodyText}>Rate: $0.00 for the full duration of the program through Tier 2 completion.</div><div style={bodyText}>Billing: No invoice will be generated for any program month covered under this scholarship.</div><div style={bodyText}>Non-refundable: This scholarship carries no monetary value and is non-transferable.</div><div style={bodyText}>Termination: Standard 14-day written notice applies.</div></>}
        {entry?.promoType === 'B' && <><div style={bodyText}>Rate: $0.00 for months 1 and 2. Standard rate of $1,500/month applies from month 3 forward.</div><div style={bodyText}>Billing: No invoice for trial months. Standard billing resumes automatically on month 3.</div><div style={bodyText}>Non-refundable: Trial months carry no monetary value and are non-transferable.</div><div style={bodyText}>Termination: Standard 14-day written notice applies after trial period.</div></>}
        {entry?.promoType === 'C' && <><div style={bodyText}>Rate: ${entry?.promoRate || '—'}/month for the duration of the program.</div><div style={bodyText}>Billing: Monthly invoice at the reduced rate stated above.</div><div style={bodyText}>Non-refundable: All payments are non-refundable.</div><div style={bodyText}>Termination: Standard 14-day written notice applies.</div></>}
        {entry?.promoType === 'D' && <><div style={bodyText}>Rate: $9,450 prepaid — covers 7 months of the program (10% discount off standard rate of $10,500).</div><div style={bodyText}>Billing: Single prepayment due prior to program start.</div><div style={bodyText}>Non-refundable: Prepayment is non-refundable.</div><div style={bodyText}>Termination: No refund on prepaid balance. Program access continues through prepaid period.</div></>}
        {entry?.promoType === 'E' && <><div style={bodyText}>Rate: $13,500 prepaid — covers 10 months of the program (10% discount off standard rate of $15,000).</div><div style={bodyText}>Billing: Single prepayment due prior to program start.</div><div style={bodyText}>Non-refundable: Prepayment is non-refundable.</div><div style={bodyText}>Termination: No refund on prepaid balance. Program access continues through prepaid period.</div></>}
        {entry?.promoType === 'F' && <><div style={bodyText}>Rate: $500/month flat rate for the full duration of the program.</div><div style={bodyText}>Billing: Monthly invoice at the Friends &amp; Family rate.</div><div style={bodyText}>Non-refundable: All payments are non-refundable.</div><div style={bodyText}>Termination: Standard 14-day written notice applies.</div></>}
      </div>
      <div style={italicText}>I understand and agree to the financial terms associated with my selected promotion type as described above. I authorize Jones Performance Group LLC to invoice me accordingly and will maintain a current payment method on file at all times.</div>
      <CB label="I understand and agree to the financial terms associated with my selected promotion type. I authorize Jones Performance Group LLC to invoice me accordingly." checked={values.ack_financial_terms} onChange={e => handleChange('ack_financial_terms', e.target.checked)} />

      <div style={secHead}>SECTION 7 — TIME COMMITMENT</div>
      <div style={bodyText}>The JPG program requires a minimum six-month commitment covering Tier 4 through Tier 2 completion. Promotional arrangements do not alter the minimum time commitment unless explicitly stated in the applicable promotion type terms in Section 6.</div>
      <div style={italicText}>I understand the six-month minimum commitment required to complete the JPG program through Tier 2, and I am prepared to fulfill that commitment.</div>
      <CB label="I understand the six-month minimum commitment required to complete the JPG program through Tier 2, and I am prepared to fulfill that commitment." checked={values.ack_time_commitment} onChange={e => handleChange('ack_time_commitment', e.target.checked)} />

      <div style={secHead}>SECTION 8 — CLIENT COMMITMENT STATEMENT</div>
      <div style={bodyText}>I am entering the Jones Performance Group program with full understanding of what is required of me. I am not here to explore the possibility of change — I am here to make it. I understand that this program demands consistent effort, honest self-assessment, and a willingness to be challenged. I accept that results are earned through execution, not intention. I enter this program as a committed participant, not a passive observer, and I hold myself accountable to the standard JPG requires.</div>
      <TA label="Why are you applying to the Jones Performance Group program?" value={values.why_applying} onChange={e => handleChange('why_applying', e.target.value)} />
      <TA label="What are the top three behaviors you can see yourself implementing through this program?" value={values.top_three_behaviors} onChange={e => handleChange('top_three_behaviors', e.target.value)} />
      <TA label="What is your current system for overcoming difficulty when faced with challenging tasks?" value={values.overcoming_difficulty} onChange={e => handleChange('overcoming_difficulty', e.target.value)} />

      <div style={secHead}>SECTION 9 — PROGRAM ACKNOWLEDGMENTS</div>
      <div style={bodyText}>I have read and understand the following. Each item reflects a non-negotiable condition of my enrollment.</div>
      <CB label="All clients enter JPG at Tier 4 — Apprentice. There is no alternative entry point regardless of prior experience, fitness level, or background." checked={values.prog_ack_1} onChange={e => handleChange('prog_ack_1', e.target.checked)} />
      <CB label="Progression through Tier 4 → Tier 3 → Tier 2 is mandatory. I may not exit the program before completing Tier 2 without formal written agreement." checked={values.prog_ack_2} onChange={e => handleChange('prog_ack_2', e.target.checked)} />
      <CB label="Tier 1 — Unstoppable is optional and available only after successful completion of Tier 2. Separate written disclosure is required before Tier 1 activates." checked={values.prog_ack_3} onChange={e => handleChange('prog_ack_3', e.target.checked)} />
      <CB label="Payment is governed by the promotional terms in Section 6. The 7-day grace period is a professional courtesy — not a negotiable extension. Non-payment by the 8th results in immediate program removal." checked={values.prog_ack_4} onChange={e => handleChange('prog_ack_4', e.target.checked)} />
      <CB label="Program removal for non-payment is immediate and without exception. All sessions are cancelled and access is suspended until the account is current and reinstatement fee is paid." checked={values.prog_ack_5} onChange={e => handleChange('prog_ack_5', e.target.checked)} />
      <CB label="The Tier 4 entry period and first full month payment terms are governed by my selected promotion type. Refund eligibility for Tier 3 and Tier 2 is reviewed at the coach's sole discretion." checked={values.prog_ack_6} onChange={e => handleChange('prog_ack_6', e.target.checked)} />
      <CB label="No specific outcome or result is guaranteed. Results are determined by my consistency, effort, and execution. JPG provides the framework — I am responsible for applying it." checked={values.prog_ack_7} onChange={e => handleChange('prog_ack_7', e.target.checked)} />
      <CB label="JPG coaching is not medical advice, therapy, or clinical treatment of any kind. I will consult a licensed medical professional before beginning any fitness or nutrition programming." checked={values.prog_ack_8} onChange={e => handleChange('prog_ack_8', e.target.checked)} />
      <CB label="I am entering this program voluntarily and with full commitment. I understand that my results are a direct reflection of my effort and I hold myself to the standard this program requires." checked={values.prog_ack_9} onChange={e => handleChange('prog_ack_9', e.target.checked)} />

      <div style={secHead}>SECTION 10 — INTELLECTUAL PROPERTY &amp; CONFIDENTIALITY</div>
      <div style={subHead}>JPG IP OWNERSHIP</div>
      <div style={bodyText}>All JPG frameworks, systems, methodologies, program content, training materials, tracking tools, and operational documents are exclusively owned by Jones Performance Group LLC. This includes but is not limited to: the Four Foundations framework, LIMITLESS doctrine, tier progression system, JPG Hub, Personal Investment Time (PIT), Daily Operational Process (DOP), and all associated tools, templates, and proprietary content.</div>
      <div style={subHead}>CLIENT IP OBLIGATIONS</div>
      <div style={bodyText}>The client may not disclose, share, reproduce, publish, distribute, or transmit any JPG system, methodology, framework, or content to any third party without prior written authorization from Jones Performance Group LLC. This obligation survives termination of this Agreement.</div>
      <div style={subHead}>JPG CONFIDENTIALITY OBLIGATION</div>
      <div style={bodyText}>Jones Performance Group LLC will not disclose client personal information, progress data, biometrics, or session content to any third party without written client consent, except where disclosure is required by applicable law or court order.</div>
      <div style={subHead}>CLIENT CONFIDENTIALITY OBLIGATION</div>
      <div style={bodyText}>The client acknowledges that all JPG program materials, frameworks, and operational systems are proprietary and confidential. The client will not disclose, share, reproduce, or publish any JPG system, methodology, or content without prior written authorization from Jones Performance Group LLC. This obligation survives termination of this Agreement.</div>
      <div style={italicText}>I acknowledge that all JPG frameworks, systems, and content are the exclusive intellectual property of Jones Performance Group LLC. I will not share, reproduce, or distribute any JPG materials without prior written authorization. I acknowledge the mutual confidentiality obligations stated above.</div>
      <CB label="I acknowledge JPG's intellectual property rights and my confidentiality obligations. I will not share, reproduce, or distribute any JPG materials without prior written authorization." checked={values.ack_ip} onChange={e => handleChange('ack_ip', e.target.checked)} />

      <div style={secHead}>SECTION 11 — DISPUTE RESOLUTION</div>
      <div style={subHead}>GOVERNING LAW</div>
      <div style={bodyText}>This Agreement shall be governed by and construed in accordance with the laws of the state in which Jones Performance Group LLC is legally organized at the time of the dispute. In the event of entity relocation, active clients will be notified in writing before any change in governing jurisdiction takes effect. Client agreements executed prior to relocation remain governed by the law in effect at time of signing unless a written amendment is fully executed by both parties.</div>
      <div style={subHead}>DISPUTE PROCESS</div>
      <div style={bodyText}>The parties agree to attempt good-faith resolution of any dispute through direct communication before pursuing formal legal action. In the event good-faith resolution is not achieved, disputes shall be submitted to binding arbitration in accordance with the rules of a mutually agreed arbitration body. The prevailing party shall be entitled to recover reasonable attorney's fees and costs.</div>
      <div style={italicText}>I agree to attempt good-faith resolution before pursuing formal legal action and accept binding arbitration as the dispute resolution mechanism for this Agreement.</div>
      <CB label="I acknowledge the dispute resolution terms, including the governing law provision and the good-faith resolution requirement before formal legal action." checked={values.ack_dispute} onChange={e => handleChange('ack_dispute', e.target.checked)} />

      <div style={secHead}>SECTION 12 — ACKNOWLEDGMENT &amp; EXECUTION</div>
      <div style={bodyText}>I, the undersigned, confirm that I have read this Promotional Discount Program Agreement in its entirety and understand each section and its implications. I am entering this Agreement voluntarily, without duress, and with full understanding that it is a legally binding document. I acknowledge that I had the opportunity to seek independent legal counsel before signing and have chosen to proceed.</div>
      <div style={bodyText}>I agree to all terms stated herein. I understand that no services will begin until this Agreement is fully executed and all applicable payment requirements have been satisfied.</div>
      <div style={italicText}>I have read this Promotional Discount Program Agreement in full. I understand and agree to all terms. I am signing voluntarily and with full knowledge of my obligations under this Agreement.</div>
      <CB label="I agree to all terms stated herein, including all sections of this Promotional Discount Program Agreement." checked={values.ack_full_agreement} onChange={e => handleChange('ack_full_agreement', e.target.checked)} />
      <TI label="Full Name (typed — serves as electronic signature)" req value={values.signature} onChange={e => handleChange('signature', e.target.value)} />

      {error && <div style={errBox}>{error}</div>}
      <button onClick={handleSubmit} style={{ background: GOLD, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer', letterSpacing: '1px', marginTop: 8 }}>
        SUBMIT
      </button>
    </div>
  );
}

// ── Form 005 — Photo / Testimonial Release ──────────────────────

function Form005View({ entry, username, onBack, onSubmitted }) {
  const init = () => ({
    full_name: '', email: '', phone: '',
    auth_photographs: false,
    auth_video: false,
    auth_before_after: false,
    auth_written_testimonial: false,
    auth_verbal_testimonial: false,
    auth_progress_updates: false,
    auth_case_reference: false,
    use_website: false,
    use_social_media: false,
    use_email_marketing: false,
    use_marketing_materials: false,
    use_educational_content: false,
    use_presentations: false,
    ack_full_release: false,
    signature: '',
  });

  const [values, setValues] = useState(init);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const isSubmitted = entry && entry.submitted;

  function handleChange(key, val) { setValues(prev => ({ ...prev, [key]: val })); setError(''); }

  function handleSubmit() {
    const required = [
      { key: 'full_name', type: 'text', label: 'Full Name' },
      { key: 'email', type: 'text', label: 'Email Address' },
      { key: 'phone', type: 'text', label: 'Phone Number' },
      { key: 'ack_full_release', type: 'cb', label: 'Section 5 acknowledgment' },
      { key: 'signature', type: 'text', label: 'Full Name (typed signature)' },
    ];
    for (const r of required) {
      const v = values[r.key];
      if (r.type === 'cb' && !v) { setError(`Please check: "${r.label}"`); return; }
      if (r.type === 'text' && !String(v).trim()) { setError(`"${r.label}" is required.`); return; }
    }
    const all = getAgreements(username);
    const now = new Date().toISOString().slice(0, 10);
    all['form_005'] = { submitted: true, submitted_at: now, data: { ...values } };
    saveAgreements(username, all);
    onSubmitted();
  }

  function handleEdit() {
    const d = entry.data || {};
    setValues({
      full_name: d.full_name || '', email: d.email || '', phone: d.phone || '',
      auth_photographs: d.auth_photographs ?? false,
      auth_video: d.auth_video ?? false,
      auth_before_after: d.auth_before_after ?? false,
      auth_written_testimonial: d.auth_written_testimonial ?? false,
      auth_verbal_testimonial: d.auth_verbal_testimonial ?? false,
      auth_progress_updates: d.auth_progress_updates ?? false,
      auth_case_reference: d.auth_case_reference ?? false,
      use_website: d.use_website ?? false,
      use_social_media: d.use_social_media ?? false,
      use_email_marketing: d.use_email_marketing ?? false,
      use_marketing_materials: d.use_marketing_materials ?? false,
      use_educational_content: d.use_educational_content ?? false,
      use_presentations: d.use_presentations ?? false,
      ack_full_release: d.ack_full_release ?? false,
      signature: d.signature || '',
    });
    setEditMode(true);
  }

  const sBox = { background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 };
  const errBox = { color: '#e57373', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#1a0a0a', borderRadius: 4 };
  const secHead = { color: GOLD, fontWeight: 700, fontSize: 13, letterSpacing: '1px', marginBottom: 10, marginTop: 24, borderBottom: `1px solid #3a2e00`, paddingBottom: 6 };
  const subHead = { color: GOLD, fontWeight: 700, fontSize: 12, letterSpacing: '1px', marginBottom: 8, marginTop: 16 };
  const bodyText = { color: '#ccc', fontSize: 13, lineHeight: 1.7, marginBottom: 10 };
  const italicText = { color: '#aaa', fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14 };
  const noteText = { color: '#888', fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 10, marginTop: -4 };

  const CBOpt = ({ label, stateKey }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
        <input type="checkbox" checked={values[stateKey]} onChange={e => handleChange(stateKey, e.target.checked)} style={{ marginTop: 2, accentColor: GOLD, flexShrink: 0, width: 16, height: 16 }} />
        <span style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{label}</span>
      </label>
    </div>
  );

  const header = (
    <>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Photo / Testimonial Release</div>
      <div style={{ color: GOLD, fontSize: 11, marginBottom: 16, opacity: 0.7 }}>JPG-TK-005-PhotoRelease-WRK-v1.0</div>
    </>
  );

  if (isSubmitted && !editMode) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
        {header}
        <div style={{ color: '#4caf50', fontSize: 13, marginBottom: 12 }}>✓ Submitted {entry.submitted_at}</div>
        <button onClick={handleEdit} style={{ ...backBtnStyle, marginBottom: 24 }}>EDIT</button>
        {Object.entries(entry.data || {}).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>{fieldLabel(key)}</div>
            <div style={{ color: '#ccc', fontSize: 13 }}>{fieldValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
      {header}

      <div style={secHead}>SECTION 1 — CLIENT INFORMATION</div>
      <TI label="Full Name" req value={values.full_name} onChange={e => handleChange('full_name', e.target.value)} />
      <TI label="Email Address" req value={values.email} onChange={e => handleChange('email', e.target.value)} />
      <TI label="Phone Number" req value={values.phone} onChange={e => handleChange('phone', e.target.value)} />

      <div style={secHead}>SECTION 2 — SCOPE OF AUTHORIZATION</div>
      <div style={bodyText}>Select all content types you authorize Jones Performance Group LLC to use. You may select one, several, or all.</div>

      <div style={subHead}>PHOTOGRAPHY &amp; VIDEO</div>
      <CBOpt stateKey="auth_photographs" label="Photographs — still images of me taken during coaching sessions, events, or program activities." />
      <CBOpt stateKey="auth_video" label="Video footage — video recordings of me taken during coaching sessions, events, or program activities." />
      <CBOpt stateKey="auth_before_after" label="Before & after imagery — comparative progress photographs taken at program milestones." />
      <div style={noteText}>Note: Before & after imagery will never be published without your explicit written approval of the specific images.</div>

      <div style={subHead}>WRITTEN &amp; VERBAL CONTENT</div>
      <CBOpt stateKey="auth_written_testimonial" label="Written testimonial — a statement written by me describing my experience with JPG." />
      <CBOpt stateKey="auth_verbal_testimonial" label="Verbal testimonial — a recorded statement by me describing my experience with JPG." />
      <CBOpt stateKey="auth_progress_updates" label="Progress updates — written summaries of my progress, results, or milestones shared by JPG." />
      <CBOpt stateKey="auth_case_reference" label="Case reference — anonymized or named reference to my program participation and outcomes." />
      <div style={noteText}>Note: Named case references require separate written confirmation before publication.</div>

      <div style={secHead}>SECTION 3 — PERMITTED USES</div>
      <div style={bodyText}>Select all channels and uses you authorize. JPG will only publish authorized content through channels you select below.</div>

      <div style={subHead}>DIGITAL &amp; ONLINE</div>
      <CBOpt stateKey="use_website" label="JPG website — jonesperformancegroup.com and any associated subdomains." />
      <CBOpt stateKey="use_social_media" label="Social media — JPG-owned accounts on Instagram, Facebook, LinkedIn, X, or similar platforms." />
      <CBOpt stateKey="use_email_marketing" label="Email marketing — JPG client newsletters, promotional emails, or broadcast communications." />

      <div style={subHead}>MARKETING &amp; EDUCATIONAL CONTENT</div>
      <CBOpt stateKey="use_marketing_materials" label="Marketing materials — digital or printed promotional materials including ads, flyers, and campaign assets." />
      <CBOpt stateKey="use_educational_content" label="Educational content — JPG educational documents, reference materials, or program guides." />
      <CBOpt stateKey="use_presentations" label="Presentations & speaking — use in presentations, speaking engagements, or media appearances by Doug Jones." />

      <div style={secHead}>SECTION 4 — TERMS &amp; CONDITIONS</div>
      <div style={subHead}>NO COMPENSATION</div>
      <div style={bodyText}>This authorization is granted voluntarily and without financial compensation of any kind. No payment, credit, or other consideration is owed or implied by JPG for use of authorized content.</div>
      <div style={subHead}>RIGHT TO WITHDRAW</div>
      <div style={bodyText}>This authorization may be withdrawn at any time by submitting written notice to Jones Performance Group LLC. Withdrawal takes effect within 30 calendar days of written notice receipt. Content already published at the time of withdrawal is not subject to retroactive removal unless JPG determines removal is feasible.</div>
      <div style={subHead}>IDENTIFIABLE CONTENT</div>
      <div style={bodyText}>Jones Performance Group LLC will not publish identifiable photographs, video, or named testimonials without a fully executed copy of this release on file. Anonymized references to client results do not require a signed release and are governed separately.</div>
      <div style={subHead}>ACCURACY</div>
      <div style={bodyText}>JPG will not alter or misrepresent the substance of any written or verbal testimonial. Minor editing for length, clarity, or formatting may occur without altering the original meaning.</div>
      <div style={subHead}>NO ENDORSEMENT IMPLIED</div>
      <div style={bodyText}>Use of client content does not imply endorsement of any specific product, third-party service, or external organization. All content will be used solely in connection with JPG coaching services.</div>

      <div style={secHead}>SECTION 5 — ACKNOWLEDGMENT &amp; SIGNATURE</div>
      <div style={sBox}>I, the undersigned, voluntarily authorize Jones Performance Group LLC to use the content types and channels I have selected above. I confirm that I have read and understood all terms in this release. I understand that this authorization is revocable with 30 days written notice and that existing published content is not subject to retroactive removal. I am signing this release freely and without duress.</div>
      <div style={italicText}>I confirm my selections above are accurate and I agree to all terms stated in this release.</div>
      <CB label="I confirm my selections above are accurate and I agree to all terms stated in this release." checked={values.ack_full_release} onChange={e => handleChange('ack_full_release', e.target.checked)} />
      <TI label="Full Name (typed — serves as electronic signature)" req value={values.signature} onChange={e => handleChange('signature', e.target.value)} />

      {error && <div style={errBox}>{error}</div>}
      <button onClick={handleSubmit} style={{ background: GOLD, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer', letterSpacing: '1px', marginTop: 8 }}>
        SUBMIT
      </button>
    </div>
  );
}

// ── Form 003 — Liability Waiver & Disclaimer ────────────────────

function Form003View({ entry, username, onBack, onSubmitted }) {
  const init = () => ({
    full_name: '', email: '', phone: '',
    ack_medical: false,
    ack_mental_health: false,
    ack_results: false,
    ack_assumption_of_risk: false,
    ack_liability: false,
    ack_full_waiver: false,
    signature: '',
  });

  const [values, setValues] = useState(init);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const isSubmitted = entry && entry.submitted;

  function handleChange(key, val) { setValues(prev => ({ ...prev, [key]: val })); setError(''); }

  function handleSubmit() {
    const required = [
      { key: 'full_name', type: 'text', label: 'Full Name' },
      { key: 'email', type: 'text', label: 'Email Address' },
      { key: 'phone', type: 'text', label: 'Phone Number' },
      { key: 'ack_medical', type: 'cb', label: 'Section 2 acknowledgment' },
      { key: 'ack_mental_health', type: 'cb', label: 'Section 3 acknowledgment' },
      { key: 'ack_results', type: 'cb', label: 'Section 4 acknowledgment' },
      { key: 'ack_assumption_of_risk', type: 'cb', label: 'Section 5 acknowledgment' },
      { key: 'ack_liability', type: 'cb', label: 'Section 6 acknowledgment' },
      { key: 'ack_full_waiver', type: 'cb', label: 'Section 7 acknowledgment' },
      { key: 'signature', type: 'text', label: 'Full Name (typed signature)' },
    ];
    for (const r of required) {
      const v = values[r.key];
      if (r.type === 'cb' && !v) { setError(`Please check: "${r.label}"`); return; }
      if (r.type === 'text' && !String(v).trim()) { setError(`"${r.label}" is required.`); return; }
    }
    const all = getAgreements(username);
    const now = new Date().toISOString().slice(0, 10);
    all['form_003'] = { submitted: true, submitted_at: now, data: { ...values } };
    saveAgreements(username, all);
    onSubmitted();
  }

  function handleEdit() {
    const d = entry.data || {};
    setValues({
      full_name: d.full_name || '', email: d.email || '', phone: d.phone || '',
      ack_medical: d.ack_medical ?? false,
      ack_mental_health: d.ack_mental_health ?? false,
      ack_results: d.ack_results ?? false,
      ack_assumption_of_risk: d.ack_assumption_of_risk ?? false,
      ack_liability: d.ack_liability ?? false,
      ack_full_waiver: d.ack_full_waiver ?? false,
      signature: d.signature || '',
    });
    setEditMode(true);
  }

  const sBox = { background: '#1a1a2e', border: '1px solid #5a4a1a', borderRadius: 4, padding: '14px 16px', marginBottom: 10, color: '#ccc', fontSize: 13, lineHeight: 1.7 };
  const errBox = { color: '#e57373', fontSize: 13, marginBottom: 16, padding: '8px 12px', background: '#1a0a0a', borderRadius: 4 };
  const secHead = { color: GOLD, fontWeight: 700, fontSize: 13, letterSpacing: '1px', marginBottom: 10, marginTop: 24, borderBottom: `1px solid #3a2e00`, paddingBottom: 6 };
  const subHead = { color: GOLD, fontWeight: 700, fontSize: 12, letterSpacing: '1px', marginBottom: 8, marginTop: 16 };
  const bodyText = { color: '#ccc', fontSize: 13, lineHeight: 1.7, marginBottom: 10 };
  const italicText = { color: '#aaa', fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 14 };

  const header = (
    <>
      <button onClick={onBack} style={backBtnStyle}>← Back</button>
      <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Liability Waiver &amp; Disclaimer</div>
      <div style={{ color: GOLD, fontSize: 11, marginBottom: 16, opacity: 0.7 }}>JPG-TK-003-LiabilityWaiver-WRK-v1.0</div>
    </>
  );

  if (isSubmitted && !editMode) {
    return (
      <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
        {header}
        <div style={{ color: '#4caf50', fontSize: 13, marginBottom: 12 }}>✓ Submitted {entry.submitted_at}</div>
        <button onClick={handleEdit} style={{ ...backBtnStyle, marginBottom: 24 }}>EDIT</button>
        {Object.entries(entry.data || {}).map(([key, val]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ color: TEXT_DIM, fontSize: 11, fontWeight: 700, letterSpacing: '1px', marginBottom: 3 }}>{fieldLabel(key)}</div>
            <div style={{ color: '#ccc', fontSize: 13 }}>{fieldValue(val)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', overflowY: 'auto', background: DARKER }}>
      {header}

      <div style={secHead}>SECTION 1 — APPLICANT INFORMATION</div>
      <div style={bodyText}>This document constitutes a legally binding Liability Waiver and Disclaimer between the undersigned client and Jones Performance Group LLC. Read each section completely before signing. By submitting this form, you acknowledge that you have read, understood, and agreed to all terms contained herein.</div>
      <TI label="Full Name" req value={values.full_name} onChange={e => handleChange('full_name', e.target.value)} />
      <TI label="Email Address" req value={values.email} onChange={e => handleChange('email', e.target.value)} />
      <TI label="Phone Number" req value={values.phone} onChange={e => handleChange('phone', e.target.value)} />

      <div style={secHead}>SECTION 2 — HEALTH &amp; MEDICAL DISCLAIMER</div>
      <div style={subHead}>JPG IS NOT A MEDICAL PROVIDER</div>
      <div style={bodyText}>Doug Jones and Jones Performance Group LLC are not licensed physicians, medical doctors, nurses, or registered dietitians. No content, programming, communication, or coaching provided by JPG constitutes medical advice of any kind. Nothing communicated verbally, in writing, digitally, or through any JPG platform should be interpreted as a diagnosis, treatment recommendation, or medical opinion.</div>
      <div style={subHead}>MEDICAL CLEARANCE REQUIRED</div>
      <div style={bodyText}>Clients must consult a licensed medical professional and obtain clearance before beginning any fitness, nutrition, or performance program offered by JPG. By signing this document, the client confirms they have done so or assume full responsibility for participating without doing so.</div>
      <div style={italicText}>I understand that JPG does not provide medical advice and I have consulted or will consult a licensed medical professional before beginning any fitness or nutrition programming.</div>
      <CB label="I understand that JPG does not provide medical advice and I have consulted or will consult a licensed medical professional before beginning any fitness or nutrition programming." checked={values.ack_medical} onChange={e => handleChange('ack_medical', e.target.checked)} />

      <div style={secHead}>SECTION 3 — MENTAL HEALTH DISCLAIMER</div>
      <div style={subHead}>COACHING IS NOT THERAPY</div>
      <div style={bodyText}>JPG coaches are not licensed therapists, psychologists, psychiatrists, or mental health counselors. Coaching provided by JPG is performance and accountability-based and does not constitute mental health treatment, psychological evaluation, or clinical intervention of any kind. JPG is not licensed or qualified to diagnose, treat, or evaluate any mental health condition.</div>
      <div style={subHead}>MENTAL HEALTH SUPPORT</div>
      <div style={bodyText}>Clients experiencing mental health challenges — including but not limited to depression, anxiety, trauma, substance dependency, or any condition requiring clinical support — must seek qualified professional care. JPG coaching is not a substitute for clinical mental health treatment.</div>
      <div style={italicText}>I understand that JPG coaching is not therapy or mental health treatment. If I am experiencing mental health challenges, I will seek qualified clinical support separate from my JPG program.</div>
      <CB label="I understand that JPG coaching is not therapy or mental health treatment. If I am experiencing mental health challenges, I will seek qualified clinical support separate from my JPG program." checked={values.ack_mental_health} onChange={e => handleChange('ack_mental_health', e.target.checked)} />

      <div style={secHead}>SECTION 4 — RESULTS DISCLAIMER</div>
      <div style={subHead}>NO GUARANTEED OUTCOMES</div>
      <div style={bodyText}>Results achieved through JPG programs vary based on individual effort, consistency, adherence, and personal circumstances that are outside JPG's control. No specific outcome, result, transformation, or achievement is guaranteed by Jones Performance Group LLC or any JPG coach. Client testimonials and case references represent individual results only and do not imply guaranteed or typical outcomes for any other participant.</div>
      <div style={italicText}>I understand that JPG does not guarantee specific results. I accept that my outcomes are determined by my own effort, consistency, and execution.</div>
      <CB label="I understand that JPG does not guarantee specific results. I accept that my outcomes are determined by my own effort, consistency, and execution." checked={values.ack_results} onChange={e => handleChange('ack_results', e.target.checked)} />

      <div style={secHead}>SECTION 5 — ASSUMPTION OF RISK</div>
      <div style={subHead}>INHERENT RISK ACKNOWLEDGMENT</div>
      <div style={bodyText}>Physical training, performance programming, and personal development activities carry inherent risk of physical injury, discomfort, or adverse outcomes. By participating in any JPG program, the client expressly assumes all risk associated with fitness programming, performance training, mindset work, and personal development activities undertaken as part of any JPG engagement. This assumption of risk is voluntary, knowing, and made with full understanding of the nature of the program.</div>
      <div style={subHead}>FITNESS TO PARTICIPATE</div>
      <div style={bodyText}>The client confirms they are physically and medically fit to participate in the JPG program at the time of signing this waiver. The client accepts full responsibility for monitoring their own physical condition during program participation and agrees to immediately discontinue any activity that causes pain, injury, or concern, and to seek medical attention as appropriate.</div>
      <div style={italicText}>I expressly assume all risk associated with my participation in any JPG program. I confirm I am physically fit to participate and accept full responsibility for my own safety during all program activities.</div>
      <CB label="I expressly assume all risk associated with my participation in any JPG program. I confirm I am physically fit to participate and accept full responsibility for my own safety during all program activities." checked={values.ack_assumption_of_risk} onChange={e => handleChange('ack_assumption_of_risk', e.target.checked)} />

      <div style={secHead}>SECTION 6 — LIABILITY LIMITATION</div>
      <div style={subHead}>LIMITATION OF LIABILITY</div>
      <div style={bodyText}>Jones Performance Group LLC total liability for any claim arising from coaching services, program participation, or any JPG engagement is strictly limited to the total fees paid by the client in the 30 days immediately preceding the claim. Under no circumstances shall JPG be liable for indirect, incidental, consequential, special, or punitive damages of any kind, regardless of whether JPG has been advised of the possibility of such damages.</div>
      <div style={subHead}>RELEASE OF CLAIMS</div>
      <div style={bodyText}>To the fullest extent permitted by applicable law, the client hereby releases, waives, and forever discharges Jones Performance Group LLC, its owner, agents, and representatives from any and all claims, demands, actions, or causes of action arising out of or related to participation in any JPG program, coaching service, or related activity — whether known or unknown at the time of signing.</div>
      <div style={italicText}>I acknowledge and agree to the limitation of liability stated above. I understand that JPG's total liability is capped at fees paid in the 30 days preceding any claim, and I waive all claims beyond that scope to the fullest extent permitted by law.</div>
      <CB label="I acknowledge and agree to the limitation of liability stated above. I understand that JPG's total liability is capped at fees paid in the 30 days preceding any claim, and I waive all claims beyond that scope to the fullest extent permitted by law." checked={values.ack_liability} onChange={e => handleChange('ack_liability', e.target.checked)} />

      <div style={secHead}>SECTION 7 — ACKNOWLEDGMENT &amp; WAIVER</div>
      <div style={sBox}>I, the undersigned, confirm that I have read this Liability Waiver and Disclaimer in its entirety. I understand each section and its implications. I am signing this document voluntarily, without duress, and with full understanding that it is a legally binding agreement. I acknowledge that I had the opportunity to seek independent legal counsel before signing and have chosen to proceed. I agree to all terms stated herein and waive all claims within the scope defined above.</div>
      <div style={italicText}>I have read this Liability Waiver and Disclaimer in full. I understand and agree to all terms. I am signing voluntarily and with full knowledge of the implications.</div>
      <CB label="I have read this Liability Waiver and Disclaimer in full. I understand and agree to all terms. I am signing voluntarily and with full knowledge of the implications." checked={values.ack_full_waiver} onChange={e => handleChange('ack_full_waiver', e.target.checked)} />
      <TI label="Full Name (typed — serves as electronic signature)" req value={values.signature} onChange={e => handleChange('signature', e.target.value)} />

      {error && <div style={errBox}>{error}</div>}
      <button onClick={handleSubmit} style={{ background: GOLD, color: '#000', fontWeight: 700, fontSize: 13, padding: '10px 28px', borderRadius: 4, border: 'none', cursor: 'pointer', letterSpacing: '1px', marginTop: 8 }}>
        SUBMIT
      </button>
    </div>
  );
}

// ── Client agreements list ───────────────────────────────────────

function ClientAgreementsView({ user, onSessionUpgrade }) {
  const [activeForm, setActiveForm] = useState(null);
  const [prospectCredentials, setProspectCredentials] = useState(null);
  const [showCredentialBanner, setShowCredentialBanner] = useState(false);

  const agreements = getAgreements(user.username);
  const complete = countComplete(agreements);

  async function handleFormSubmitted() {
    if (activeForm === 'form_001' && user.role === 'prospect') {
      const updatedAgreements = getAgreements(user.username);
      const formData = updatedAgreements['form_001'].data;
      const firstName = formData.full_name?.split(' ')[0] || 'Client';
      const lastName = formData.full_name?.split(' ').slice(1).join(' ') || 'User';
      const phone = formData.phone || '0000000000';
      const today = new Date().toISOString().split('T')[0];
      const newUsername = generateUsername(firstName, lastName);
      const newPassword = generatePassword(lastName, phone, today);
      const newRecord = createClientRecord(firstName, lastName, phone,
        formData.email || '', today);
      newRecord.username = newUsername;
      newRecord.password = newPassword;
      await addClient(newRecord);
      const oldKey = 'jpg_agreements_prospect';
      const newKey = `jpg_agreements_${newUsername}`;
      const existing = localStorage.getItem(oldKey);
      if (existing) localStorage.setItem(newKey, existing);
      const newSession = {
        id: newRecord.id,
        role: 'client',
        username: newUsername,
        first_name: firstName,
        last_name: lastName,
      };
      setProspectCredentials({ username: newUsername, password: newPassword });
      setShowCredentialBanner(true);
      setActiveForm(null);
      if (onSessionUpgrade) onSessionUpgrade(newSession);
      return;
    }
    setActiveForm(null);
  }

  if (activeForm) {
    const formDef = FORMS.find(f => f.key === activeForm);
    const entry = agreements[activeForm];
    return (
      <ClientFormView
        formDef={formDef}
        entry={entry}
        username={user.username}
        onBack={() => setActiveForm(null)}
        onSubmitted={handleFormSubmitted}
      />
    );
  }

  return (
    <div style={{ padding: 24, minHeight: '100vh', background: DARKER }}>
      {showCredentialBanner && prospectCredentials && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#1a1a1a', border: '2px solid #ddb94a',
            borderRadius: 8, padding: 32, maxWidth: 420, width: '90%',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#ddb94a',
              letterSpacing: 1, marginBottom: 16 }}>
              YOUR LOGIN CREDENTIALS
            </div>
            <div style={{ fontSize: 13, color: '#ccc', marginBottom: 20,
              lineHeight: 1.7 }}>
              Your personal account has been created. Save these credentials
              before you close this window — they will not be shown again.
            </div>
            <div style={{ background: '#111', borderRadius: 4, padding: 16,
              marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
                USERNAME
              </div>
              <div style={{ fontSize: 16, color: '#fff', fontWeight: 700,
                marginBottom: 14 }}>
                {prospectCredentials.username}
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 6 }}>
                PASSWORD
              </div>
              <div style={{ fontSize: 16, color: '#fff', fontWeight: 700 }}>
                {prospectCredentials.password}
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#e05a5a', marginBottom: 20,
              lineHeight: 1.6 }}>
              ⚠ You are now logged in with your personal account. The next time
              you log in, use the credentials above — not the prospect login.
            </div>
            <button
              onClick={() => setShowCredentialBanner(false)}
              style={{
                width: '100%', padding: '10px 0', background: '#ddb94a',
                color: '#000', border: 'none', borderRadius: 4,
                fontSize: 13, fontWeight: 700, letterSpacing: 1,
                cursor: 'pointer',
              }}
            >
              I HAVE SAVED MY CREDENTIALS
            </button>
          </div>
        </div>
      )}
      <div style={{
        color: '#fff', fontWeight: 700, fontSize: 20,
        marginBottom: 6, paddingBottom: 12, borderBottom: `2px solid ${GOLD}`,
      }}>
        AGREEMENTS
      </div>
      <div style={{ color: TEXT_DIM, fontSize: 13, marginBottom: 24 }}>
        {complete} of 4 complete
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

      {agreements['form_007']?.sent === true && (
        <ClientFormRow
          key="form_007"
          form={{ key: 'form_007', label: 'Promotional Discount Program Agreement' }}
          submitted={!!agreements['form_007']?.submitted}
          submittedAt={agreements['form_007']?.submitted_at}
          onClick={() => setActiveForm('form_007')}
        />
      )}
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
        background: DARK, border: `1px solid ${GOLD}`,
        borderRadius: 6, padding: '14px 20px', marginBottom: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', filter: hovered ? 'brightness(1.15)' : 'none',
        transition: 'filter 0.1s',
      }}
    >
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{form.label}</div>
      {submitted ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: GOLD, fontSize: 13 }}>✓ {submittedAt}</span>
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
          {complete} of 4 complete
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

      {client.agreements_unlocked === true && (
        <TK007GeneratorView client={client} />
      )}

    </div>
  );
}

// ── Coach roster view ────────────────────────────────────────────

function CoachAgreementsView() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [expandedFormSend, setExpandedFormSend] = useState(null);
  const [emailInputs, setEmailInputs] = useState({});
  const [promoClientId, setPromoClientId] = useState('');
  const [promoType, setPromoType] = useState('');
  const [promoNotes, setPromoNotes] = useState('');
  const [promoExpiration, setPromoExpiration] = useState('');
  const [promoConfirm, setPromoConfirm] = useState('');

  let clients = [];
  try {
    const clientsRaw = localStorage.getItem('hub_clients');
    clients = clientsRaw
      ? JSON.parse(clientsRaw).filter(c => c.role === 'client')
      : [];
  } catch (_) {
    clients = [];
  }

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

  function handleSendPromo() {
    if (!promoClientId || !promoType) {
      setPromoConfirm('Please select a client and promotion type.');
      return;
    }
    const client = clients.find(c => c.id === promoClientId);
    if (!client) return;

    const existing = getAgreements(client.username);
    existing['form_007'] = {
      sent: true,
      sent_at: new Date().toISOString().split('T')[0],
      promotion_type: promoType,
      coach_notes: promoNotes,
      expiration: promoExpiration,
      submitted: false,
      submitted_at: null,
      data: {}
    };
    saveAgreements(client.username, existing);

    setPromoConfirm(`Promotional Agreement sent to ${client.first_name} ${client.last_name}.`);
    setTimeout(() => setPromoConfirm(''), 4000);
    setPromoClientId('');
    setPromoType('');
    setPromoNotes('');
    setPromoExpiration('');
  }

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

      {/* form_007 row */}
      <div style={{ background: DARK, border: '1px solid #5a4a1a', borderRadius: 6, padding: '14px 20px', marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, flex: 1, marginRight: 16 }}>
            Promotional Discount Program Agreement
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
            <button
              onClick={() => handleDownload('form_007')}
              style={{ background: 'none', border: `1px solid ${GOLD}`, color: GOLD, fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap', minWidth: 110 }}
            >
              DOWNLOAD PDF
            </button>
            <button
              onClick={() => setExpandedFormSend(expandedFormSend === 'form_007' ? null : 'form_007')}
              style={{ background: GOLD, border: 'none', color: '#000', fontWeight: 700, fontSize: 11, padding: '4px 8px', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap', minWidth: 128 }}
            >
              {expandedFormSend === 'form_007' ? '▲ SEND OPTIONS' : '▼ SEND OPTIONS'}
            </button>
          </div>
        </div>

        {/* form_007 send panel */}
        {expandedFormSend === 'form_007' && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Client selector */}
            <select
              value={promoClientId}
              onChange={e => setPromoClientId(e.target.value)}
              style={{ background: '#1a1a1a', border: '1px solid #5a4a1a', color: promoClientId ? '#fff' : '#888', borderRadius: 4, padding: '8px 12px', fontSize: 13, width: '100%' }}
            >
              <option value=''>Select client...</option>
              {clients.filter(c => c.role === 'client').map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
              ))}
            </select>

            {/* Promotion type selector */}
            <select
              value={promoType}
              onChange={e => {
                const selected = PROMOTION_TYPES.find(p => p.key === e.target.value);
                setPromoType(e.target.value);
                setPromoNotes(selected ? selected.description : '');
              }}
              style={{ background: '#1a1a1a', border: '1px solid #5a4a1a', color: promoType ? '#fff' : '#888', borderRadius: 4, padding: '8px 12px', fontSize: 13, width: '100%' }}
            >
              <option value=''>Select promotion type...</option>
              {PROMOTION_TYPES.map(p => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>

            {/* Editable promotion description / notes */}
            <textarea
              value={promoNotes}
              onChange={e => setPromoNotes(e.target.value)}
              placeholder='Promotion details (auto-populated on type selection, editable)...'
              rows={3}
              style={{ background: '#1a1a1a', border: '1px solid #5a4a1a', color: '#fff', borderRadius: 4, padding: '8px 12px', fontSize: 13, width: '100%', resize: 'vertical', fontFamily: 'inherit' }}
            />

            {/* Expiration / conditions */}
            <input
              type='text'
              value={promoExpiration}
              onChange={e => setPromoExpiration(e.target.value)}
              placeholder='Expiration or conditions (optional)...'
              style={{ background: '#1a1a1a', border: '1px solid #5a4a1a', color: '#fff', borderRadius: 4, padding: '8px 12px', fontSize: 13, width: '100%' }}
            />

            {/* Send button */}
            <button
              onClick={handleSendPromo}
              style={{ background: '#ddb94a', border: '1.5px solid #000', color: '#000', borderRadius: 4, padding: '8px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', alignSelf: 'flex-start', letterSpacing: '0.08em' }}
            >
              SEND TO CLIENT
            </button>

            {/* Inline confirmation */}
            {promoConfirm && (
              <div style={{ color: promoConfirm.startsWith('Please') ? '#e05c5c' : '#ddb94a', fontSize: 13, fontStyle: 'italic' }}>
                {promoConfirm}
              </div>
            )}

          </div>
        )}
      </div>

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
      <div style={{ color: GOLD, fontSize: 13 }}>{complete} of 4 complete</div>
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

export default function AgreementsView({ user, onSessionUpgrade }) {
  if (user.role === 'coach') return <CoachAgreementsView />;
  return <ClientAgreementsView user={user} onSessionUpgrade={onSessionUpgrade} />;
}
