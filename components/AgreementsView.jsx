import React, { useState, useEffect } from 'react';
import { GOLD, DARK, DARKER, TEXT_DIM } from '../utils/constants';

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
};

const FORM_EMAIL_SUBJECTS = {
  form_001: 'Jones Performance Group — Client Application',
  form_002: 'Jones Performance Group — Program Overview & Agreement',
  form_003: 'Jones Performance Group — Liability Waiver & Disclaimer',
  form_005: 'Jones Performance Group — Photo / Testimonial Release',
};

const EMAIL_BODY_SINGLE = (formLabel) =>
  `Please find the attached JPG form enclosed: ${formLabel}.\n\nComplete and return this document at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

const EMAIL_BODY_ALL =
  `Please find all five Jones Performance Group program forms attached to this email.\n\nComplete and return all documents at your earliest convenience. If you have any questions, reply to this email.\n\nJones Performance Group`;

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

  const [values, setValues] = useState(() => initValues());
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setValues(initValues());
  }, [formDef.key]);

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

// ── Client agreements list ───────────────────────────────────────

function ClientAgreementsView({ user }) {
  const [activeForm, setActiveForm] = useState(null);

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
        onSubmitted={() => setActiveForm(null)}
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

    </div>
  );
}

// ── Coach roster view ────────────────────────────────────────────

function CoachAgreementsView() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [expandedFormSend, setExpandedFormSend] = useState(null);
  const [emailInputs, setEmailInputs] = useState({});

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

export default function AgreementsView({ user }) {
  if (user.role === 'coach') return <CoachAgreementsView />;
  return <ClientAgreementsView user={user} />;
}
