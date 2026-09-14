import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { GOLD, DARK, DARKER, BORDER_DK, TEXT_DIM } from '../utils/constants';
import logoUrl from '../assets/jpglogo.png';

const PROMO_TYPES = [
  { key: 'A', label: 'Type A — Full Scholarship ($0)' },
  { key: 'B', label: 'Type B — Two Month Trial ($0 months 1–2, then $1,500/mo)' },
  { key: 'C', label: 'Type C — Reduced Rate (custom)' },
  { key: 'D', label: 'Type D — Greatness Prepay ($9,450 — 7 months)' },
  { key: 'E', label: 'Type E — Unstoppable Prepay ($13,500 — 10 months)' },
  { key: 'F', label: 'Type F — Friends & Family ($500/mo)' },
];

// pdf-lib StandardFonts use WinAnsi — em dash and en dash are outside safe range
function pdfSafe(str) {
  return str.replace(/—/g, '-').replace(/–/g, '-');
}

export default function TK007GeneratorView({ client }) {
  const [clientName, setClientName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [promoType, setPromoType] = useState('');
  const [promoRate, setPromoRate] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const showRate = promoType === 'C';
  const isReady =
    clientName.trim() !== '' &&
    effectiveDate !== '' &&
    promoType !== '' &&
    (!showRate || promoRate !== '');

  async function handleGenerate() {
    setGenerating(true);
    try {
      const promoTypeObj = PROMO_TYPES.find(pt => pt.key === promoType);

      const pdfDoc = await PDFDocument.create();
      const fB = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fR = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fI = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

      // embed logo
      const logoResponse = await fetch(logoUrl);
      const logoArrayBuffer = await logoResponse.arrayBuffer();
      const logoImage = await pdfDoc.embedPng(logoArrayBuffer);

      const W = 612, H = 792, ML = 50, MR = 562;
      const black = rgb(0, 0, 0);
      const lgray = rgb(0.55, 0.55, 0.55);
      const dgray = rgb(0.25, 0.25, 0.25);

      // pg and y are shared state — all helpers read/write them via closure
      let pg, y;
      let pageCount = 0;

      function addPageWithFooter() {
        pageCount++;
        pg = pdfDoc.addPage([W, H]);
        const ftxt = pdfSafe(
          `JPG-TK-007-PromotionalAgreement-WRK-v1.1 | Jones Performance Group LLC | Promotional Discount Program Agreement | CONFIDENTIAL | Page ${pageCount}`
        );
        const ftw = fR.widthOfTextAtSize(ftxt, 7);
        pg.drawText(ftxt, { x: (W - ftw) / 2, y: 20, size: 7, font: fR, color: lgray });
        if (pageCount > 1) {
          pg.drawImage(logoImage, { x: ML, y: 745, width: 120, height: 50 });
          pg.drawText('JPG-TK-007-PromotionalAgreement-WRK-v1.1', { x: ML, y: 728, size: 8, font: fR, color: rgb(0.5, 0.5, 0.5) });
          pg.drawLine({ start: { x: ML, y: 718 }, end: { x: MR, y: 718 }, thickness: 0.5, color: lgray });
          y = 700;
        } else {
          y = 750;
        }
      }

      function checkPage(needed = 20) {
        if (y < 60 + needed) addPageWithFooter();
      }

      // draw single-line text at current y (does not advance y)
      function dt(text, x, sz, f, col = black) {
        if (text) pg.drawText(pdfSafe(text), { x, y, size: sz, font: f, color: col });
      }

      // draw word-wrapped text, advances y after each line
      function dwt(text, x, sz, f, lh, col = black) {
        const avW = MR - x;
        const words = pdfSafe(text).split(' ');
        let line = '';
        for (const w of words) {
          const test = line ? `${line} ${w}` : w;
          if (f.widthOfTextAtSize(test, sz) > avW && line) {
            checkPage(lh);
            pg.drawText(line, { x, y, size: sz, font: f, color: col });
            y -= lh;
            line = w;
          } else {
            line = test;
          }
        }
        if (line) {
          checkPage(lh);
          pg.drawText(line, { x, y, size: sz, font: f, color: col });
          y -= lh;
        }
      }

      function gap(n = 8) { y -= n; }

      function rule(col = lgray) {
        pg.drawLine({ start: { x: ML, y }, end: { x: MR, y }, thickness: 0.5, color: col });
      }

      // 11pt bold section header, advances y by 20
      function secHead(text) {
        checkPage(20);
        pg.drawText(pdfSafe(text), { x: ML, y, size: 11, font: fB, color: black });
        y -= 20;
      }

      // 10pt bold sub-header, advances y by 16
      function subHead(text) {
        checkPage(16);
        pg.drawText(pdfSafe(text), { x: ML, y, size: 10, font: fB, color: black });
        y -= 16;
      }

      // 9pt oblique acknowledgment paragraph
      function ackLine(text) {
        dwt(text, ML, 9, fI, 13);
      }

      // label (bold) + value or blank line, advances y by 18
      function fieldLine(label, value) {
        checkPage(18);
        pg.drawText(pdfSafe(label), { x: ML, y, size: 10, font: fB, color: black });
        if (value) {
          pg.drawText(pdfSafe(value), { x: ML + 160, y, size: 10, font: fR, color: dgray });
        } else {
          pg.drawLine({ start: { x: ML + 160, y: y - 2 }, end: { x: MR, y: y - 2 }, thickness: 0.5, color: lgray });
        }
        y -= 18;
      }

      // label + 3 blank writing lines for client response
      function blankField(label) {
        checkPage(72);
        pg.drawText(pdfSafe(label), { x: ML, y, size: 10, font: fB, color: black });
        y -= 16;
        for (let i = 0; i < 3; i++) {
          pg.drawLine({ start: { x: ML, y: y - 2 }, end: { x: MR, y: y - 2 }, thickness: 0.5, color: lgray });
          y -= 18;
        }
        y -= 4;
      }

      // ── PAGE 1: logo header ──────────────────────────────────────────
      addPageWithFooter();
      pg.drawImage(logoImage, { x: ML, y: 700, width: 220, height: 75 });
      pg.drawText('JPG-TK-007-PromotionalAgreement-WRK-v1.1', { x: ML, y: 678, size: 9, font: fR, color: lgray });
      pg.drawText('PROMOTIONAL DISCOUNT PROGRAM AGREEMENT', { x: ML, y: 660, size: 14, font: fB, color: black });
      pg.drawLine({ start: { x: ML, y: 645 }, end: { x: MR, y: 645 }, thickness: 0.5, color: lgray });
      y = 625;

      // ── SECTION 1 ────────────────────────────────────────────────────
      secHead('SECTION 1 - PARTIES & EFFECTIVE DATE');
      dwt('This Agreement is entered into between Jones Performance Group LLC ("JPG") and the client identified below. Services begin only on or after the effective date and only upon full execution of this Agreement.', ML, 10, fR, 14);
      gap(10);
      fieldLine('Full Legal Name:', clientName.trim());
      fieldLine('Effective Date:', effectiveDate);
      fieldLine('Email:', '');
      fieldLine('Phone:', '');
      fieldLine('Anticipated Start Date:', '');
      gap(20);

      // ── SECTION 2 ────────────────────────────────────────────────────
      secHead('SECTION 2 - AGREEMENT BASIS');
      dwt('This Agreement serves as the complete program agreement for clients enrolled under a promotional arrangement.', ML, 10, fR, 14);
      gap(10);
      ackLine('I understand that this is my complete program agreement and governs all terms of my enrollment.');
      gap(22);

      // ── SECTION 3 ────────────────────────────────────────────────────
      secHead('SECTION 3 - SCOPE OF SERVICE');
      dwt('Jones Performance Group LLC provides performance coaching services to enrolled clients. Services include access to the JPG coaching framework, Four Foundations programming, DOP (Daily Operational Process), PIT (Personal Investment Time), OBT (14-Day Baseline Tracker), and all associated tools and materials made available through the JPG platform.', ML, 10, fR, 14);
      gap(8);
      dwt('JPG coaching is not medical advice, physical therapy, clinical treatment, or nutritional counseling. No JPG service constitutes a licensed medical, psychological, or dietary service of any kind.', ML, 10, fR, 14);
      gap(8);
      dwt('Service delivery is contingent on full execution of this Agreement and satisfaction of applicable payment terms.', ML, 10, fR, 14);
      gap(8);
      ackLine('I understand the scope of services provided by JPG and acknowledge that coaching services are not a substitute for licensed medical, psychological, or nutritional care.');
      gap(22);

      // ── SECTION 4 ────────────────────────────────────────────────────
      secHead('SECTION 4 - TIER STRUCTURE & PROGRESSION');

      checkPage(16 + 4 * 16 + 12);
      dt('Tier', ML, 9, fB, dgray);
      dt('Duration', ML + 155, 9, fB, dgray);
      dt('Description', ML + 245, 9, fB, dgray);
      y -= 4; rule(dgray); y -= 14;

      const tierRows = [
        ['Tier 4 - Apprentice', '1 month', 'Mandatory entry tier. Baseline tracking and onboarding.'],
        ['Tier 3 - Performance', '3 months', 'Active development and goal progression.'],
        ['Tier 2 - Greatness', '3 months', 'Mandatory program completion point.'],
        ['Tier 1 - Unstoppable', '3+ months (optional)', 'Peak tier. Available only after Tier 2 completion.'],
      ];
      for (const [tier, dur, desc] of tierRows) {
        checkPage(16);
        dt(tier, ML, 10, fR); dt(dur, ML + 155, 10, fR); dt(desc, ML + 245, 10, fR);
        y -= 16;
      }
      gap(12);

      const bullets4 = [
        'All clients enter JPG at Tier 4 - Apprentice. No enrollment above Tier 4 is permitted under any circumstance.',
        'Progression through Tier 4 -> Tier 3 -> Tier 2 is mandatory. No client may exit before completing Tier 2 without formal written agreement.',
        'Tier 1 - Unstoppable is optional and available only after successful completion of Tier 2. Separate written disclosure is required before Tier 1 activates.',
        'Upon completing Tier 2, the client may advance to Tier 1, join the JPG Finishers Group, enter Maintenance Stage, or complete exit.',
      ];
      for (const b of bullets4) {
        checkPage(14);
        dt('-', ML, 10, fR);
        dwt(b, ML + 14, 10, fR, 14);
        gap(4);
      }
      gap(8);
      ackLine('I understand the tier progression structure and accept that entry at Tier 4 is mandatory, progression through Tier 2 is required, and Tier 1 is optional.');
      gap(22);

      // ── SECTION 5 (SUPPRESSED — selected type only) ──────────────────
      secHead('SECTION 5 - PROMOTIONAL TERMS');
      dwt('This section identifies the specific promotional arrangement applicable to this client.', ML, 10, fR, 14);
      gap(12);
      fieldLine('Client Name:', clientName.trim());
      fieldLine('Effective Date of Promotion:', effectiveDate);
      fieldLine('Promotion Type Selected:', pdfSafe(promoTypeObj?.label ?? `Type ${promoType}`));
      gap(16);
      rule(); gap(16);

      if (promoType === 'A') {
        checkPage(18);
        dt('Type A - Full Scholarship', ML, 11, fB); y -= 18;
        dwt('Entire program through Tier 2 at no cost to the client.', ML, 10, fR, 14);
      } else if (promoType === 'B') {
        checkPage(18);
        dt('Type B - Two Month Trial', ML, 11, fB); y -= 18;
        dwt('First two months of the program at no cost to the client.', ML, 10, fR, 14);
      } else if (promoType === 'C') {
        checkPage(18);
        dt('Type C - Reduced Rate', ML, 11, fB); y -= 18;
        dwt('Reduced monthly rate as entered by coach below.', ML, 10, fR, 14);
        gap(4);
        fieldLine('Promotional Monthly Rate:', `$${promoRate}`);
      } else if (promoType === 'D') {
        checkPage(18);
        dt('Type D - Greatness Prepay', ML, 11, fB); y -= 18;
        dwt('7 months prepaid. Standard value: $10,500. Promotional prepay price: $9,450 (10% off).', ML, 10, fR, 14);
      } else if (promoType === 'E') {
        checkPage(18);
        dt('Type E - Unstoppable Prepay', ML, 11, fB); y -= 18;
        dwt('10 months prepaid. Standard value: $15,000. Promotional prepay price: $13,500 (10% off).', ML, 10, fR, 14);
      } else if (promoType === 'F') {
        checkPage(18);
        dt('Type F - Friends & Family', ML, 11, fB); y -= 18;
        dwt('Flat monthly rate of $500/month for the duration of the program.', ML, 10, fR, 14);
      }
      gap(22);

      // ── SECTION 6 (SUPPRESSED — selected type only) ──────────────────
      secHead('SECTION 6 - FINANCIAL TERMS (PROMOTIONAL)');
      dwt('The financial terms below correspond to the promotion type selected in Section 5. Only one type governs this agreement.', ML, 10, fR, 14);
      gap(16); rule(); gap(16);

      function finBlock(title, lines) {
        checkPage(18);
        dt(title, ML, 11, fB); y -= 18;
        for (const ln of lines) { dwt(ln, ML, 10, fR, 14); gap(4); }
      }

      if (promoType === 'A') {
        finBlock('Type A - Full Scholarship', [
          'Rate: $0.00 - Full program through Tier 2 at no cost to the client.',
          'Billing: No invoices generated for the duration of the scholarship.',
          'Scope: Covers Tier 4 through Tier 2 completion only.',
          'Tier 1 - Unstoppable: Not included. Standard rate applies if client elects Tier 1.',
          'Non-refundable: Scholarship carries no monetary value and is non-transferable.',
          'Termination: Standard 14-day written notice applies.',
        ]);
      } else if (promoType === 'B') {
        finBlock('Type B - Two Month Trial', [
          'Rate: $0.00 for months 1 and 2. Standard rate of $1,500/month applies from month 3 forward.',
          'Billing: No invoice for trial months. Standard billing resumes automatically on month 3.',
          'Non-refundable: Trial months carry no monetary value and are non-transferable.',
          'Termination: Standard 14-day written notice applies after trial period.',
        ]);
      } else if (promoType === 'C') {
        finBlock('Type C - Reduced Rate', [
          `Rate: $${promoRate}/month (as entered by coach).`,
          'Billing: Due on the 1st of each month. 7-day grace period applies.',
          'Non-payment by the 8th results in immediate program suspension.',
          'Reinstatement: $500 reinstatement fee plus current month payment required before re-entry.',
          'Non-refundable: Tier 4 entry period and first full month are non-refundable.',
          'Termination: Standard 14-day written notice applies.',
        ]);
      } else if (promoType === 'D') {
        finBlock('Type D - Greatness Prepay', [
          'Standard Value: $10,500 (7 months at $1,500/month).',
          'Promotional Prepay Price: $9,450 (10% discount -- $1,050 savings).',
          'Payment: Full prepay amount due before program access is granted.',
          'Scope: Covers Tier 4 (1 month) through Tier 2 (3 months) plus 3 additional months.',
          'Non-refundable: Prepay amount is non-refundable once program begins.',
          'Tier 1: Not included. Separate written disclosure and billing required if elected.',
          'Termination: Standard 14-day written notice. No refund of remaining prepay balance.',
        ]);
      } else if (promoType === 'E') {
        finBlock('Type E - Unstoppable Prepay', [
          'Standard Value: $15,000 (10 months at $1,500/month).',
          'Promotional Prepay Price: $13,500 (10% discount -- $1,500 savings).',
          'Payment: Full prepay amount due before program access is granted.',
          'Scope: Covers full Tier 4 through Tier 2 plus Tier 1 introductory period.',
          'Non-refundable: Prepay amount is non-refundable once program begins.',
          'Termination: Standard 14-day written notice. No refund of remaining prepay balance.',
        ]);
      } else if (promoType === 'F') {
        finBlock('Type F - Friends & Family', [
          'Rate: $500/month flat rate for the duration of the program.',
          'Billing: Due on the 1st of each month. 7-day grace period applies.',
          'Non-payment by the 8th results in immediate program suspension.',
          'Reinstatement: $500 reinstatement fee plus current month payment required before re-entry.',
          'Non-refundable: Tier 4 entry period and first full month are non-refundable.',
          'Termination: Standard 14-day written notice applies.',
        ]);
      }

      gap(16);
      ackLine('I understand and agree to the financial terms associated with my selected promotion type as described above. I authorize Jones Performance Group LLC to invoice me accordingly and will maintain a current payment method on file at all times.');
      gap(22);

      // ── SECTION 7 ────────────────────────────────────────────────────
      secHead('SECTION 7 - TIME COMMITMENT');
      dwt('The JPG program requires a minimum six-month commitment covering Tier 4 through Tier 2 completion. Promotional arrangements do not alter the minimum time commitment unless explicitly stated in the applicable promotion type terms in Section 6.', ML, 10, fR, 14);
      gap(10);
      ackLine('I understand the six-month minimum commitment required to complete the JPG program through Tier 2, and I am prepared to fulfill that commitment.');
      gap(24);

      // ── SECTION 8 ────────────────────────────────────────────────────
      secHead('SECTION 8 - CLIENT COMMITMENT STATEMENT');
      dwt('I am entering the Jones Performance Group program with full understanding of what is required of me. I am not here to explore the possibility of change -- I am here to make it. I understand that this program demands consistent effort, honest self-assessment, and a willingness to be challenged. I accept that results are earned through execution, not intention. I enter this program as a committed participant, not a passive observer, and I hold myself accountable to the standard JPG requires.', ML, 10, fR, 14);
      gap(16);

      blankField('Why are you applying to the Jones Performance Group program?');
      blankField('What are the top three behaviors you can see yourself implementing through this program?');
      blankField('What is your current system for overcoming difficulty when faced with challenging tasks?');
      gap(22);

      // ── SECTION 9 ────────────────────────────────────────────────────
      secHead('SECTION 9 - PROGRAM ACKNOWLEDGMENTS');
      dwt('I have read and understand the following. Each item reflects a non-negotiable condition of my enrollment.', ML, 10, fR, 14);
      gap(16);

      const ackItems9 = [
        'All clients enter JPG at Tier 4 -- Apprentice. There is no alternative entry point regardless of prior experience, fitness level, or background.',
        'Progression through Tier 4 -> Tier 3 -> Tier 2 is mandatory. I may not exit the program before completing Tier 2 without formal written agreement.',
        'Tier 1 -- Unstoppable is optional and available only after successful completion of Tier 2. Separate written disclosure is required before Tier 1 activates.',
        'Payment is governed by the promotional terms in Section 6. The 7-day grace period is a professional courtesy -- not a negotiable extension. Non-payment by the 8th results in immediate program removal.',
        'Program removal for non-payment is immediate and without exception. All sessions are cancelled and access is suspended until the account is current and reinstatement fee is paid.',
        "The Tier 4 entry period and first full month payment terms are governed by my selected promotion type. Refund eligibility for Tier 3 and Tier 2 is reviewed at the coach's sole discretion.",
        'No specific outcome or result is guaranteed. Results are determined by my consistency, effort, and execution. JPG provides the framework -- I am responsible for applying it.',
        'JPG coaching is not medical advice, therapy, or clinical treatment of any kind. I will consult a licensed medical professional before beginning any fitness or nutrition programming.',
        'I am entering this program voluntarily and with full commitment. I understand that my results are a direct reflection of my effort and I hold myself to the standard this program requires.',
      ];

      for (const item of ackItems9) {
        checkPage(22);
        dt('[ ]', ML, 10, fR);
        dwt(item, ML + 24, 10, fR, 14);
        gap(8);
      }
      gap(14);

      // ── SECTION 10 ───────────────────────────────────────────────────
      secHead('SECTION 10 - INTELLECTUAL PROPERTY & CONFIDENTIALITY');

      subHead('JPG IP OWNERSHIP');
      dwt('All JPG frameworks, systems, methodologies, program content, training materials, tracking tools, and operational documents are exclusively owned by Jones Performance Group LLC. This includes but is not limited to: the Four Foundations framework, LIMITLESS doctrine, tier progression system, JPG Hub, Personal Investment Time (PIT), Daily Operational Process (DOP), and all associated tools, templates, and proprietary content.', ML, 10, fR, 14);
      gap(12);

      subHead('CLIENT IP OBLIGATIONS');
      dwt('The client may not disclose, share, reproduce, publish, distribute, or transmit any JPG system, methodology, framework, or content to any third party without prior written authorization from Jones Performance Group LLC. This obligation survives termination of this Agreement.', ML, 10, fR, 14);
      gap(12);

      subHead('JPG CONFIDENTIALITY OBLIGATION');
      dwt('Jones Performance Group LLC will not disclose client personal information, progress data, biometrics, or session content to any third party without written client consent, except where disclosure is required by applicable law or court order.', ML, 10, fR, 14);
      gap(12);

      subHead('CLIENT CONFIDENTIALITY OBLIGATION');
      dwt('The client acknowledges that all JPG program materials, frameworks, and operational systems are proprietary and confidential. The client will not disclose, share, reproduce, or publish any JPG system, methodology, or content without prior written authorization from Jones Performance Group LLC. This obligation survives termination of this Agreement.', ML, 10, fR, 14);
      gap(12);

      ackLine('I acknowledge that all JPG frameworks, systems, and content are the exclusive intellectual property of Jones Performance Group LLC. I will not share, reproduce, or distribute any JPG materials without prior written authorization. I acknowledge the mutual confidentiality obligations stated above.');
      gap(22);

      // ── SECTION 11 ───────────────────────────────────────────────────
      secHead('SECTION 11 - DISPUTE RESOLUTION');

      subHead('GOVERNING LAW');
      dwt('This Agreement shall be governed by and construed in accordance with the laws of the state in which Jones Performance Group LLC is legally organized at the time of the dispute. In the event of entity relocation, active clients will be notified in writing before any change in governing jurisdiction takes effect. Client agreements executed prior to relocation remain governed by the law in effect at time of signing unless a written amendment is fully executed by both parties.', ML, 10, fR, 14);
      gap(12);

      subHead('DISPUTE PROCESS');
      dwt("The parties agree to attempt good-faith resolution of any dispute through direct communication before pursuing formal legal action. In the event good-faith resolution is not achieved, disputes shall be submitted to binding arbitration in accordance with the rules of a mutually agreed arbitration body. The prevailing party shall be entitled to recover reasonable attorney's fees and costs.", ML, 10, fR, 14);
      gap(12);

      ackLine('I agree to attempt good-faith resolution before pursuing formal legal action and accept binding arbitration as the dispute resolution mechanism for this Agreement.');
      gap(22);

      // ── SECTION 12 ───────────────────────────────────────────────────
      secHead('SECTION 12 - ACKNOWLEDGMENT & EXECUTION');
      dwt('I, the undersigned, confirm that I have read this Promotional Discount Program Agreement in its entirety and understand each section and its implications. I am entering this Agreement voluntarily, without duress, and with full understanding that it is a legally binding document. I acknowledge that I had the opportunity to seek independent legal counsel before signing and have chosen to proceed.', ML, 10, fR, 14);
      gap(10);
      dwt('I agree to all terms stated herein. I understand that no services will begin until this Agreement is fully executed and all applicable payment requirements have been satisfied.', ML, 10, fR, 14);
      gap(10);
      ackLine('I have read this Promotional Discount Program Agreement in full. I understand and agree to all terms. I am signing voluntarily and with full knowledge of my obligations under this Agreement.');
      gap(24); rule(); gap(16);

      fieldLine('Full Name (typed -- serves as client signature):', '');
      fieldLine('Date:', '');
      gap(24); rule(); gap(12);

      checkPage(16);
      dt('FOR JONES PERFORMANCE GROUP LLC -- COACH USE ONLY', ML, 9, fB, dgray);
      y -= 16;
      fieldLine('Coach Name:', '');
      fieldLine('Coach Signature:', '');
      fieldLine('Date Executed (MM/DD/YYYY):', '');
      gap(40);

      // ── END OF AGREEMENT ─────────────────────────────────────────────
      checkPage(30);
      const endTxt = pdfSafe('END OF AGREEMENT');
      const etw = fB.widthOfTextAtSize(endTxt, 14);
      pg.drawText(endTxt, { x: (W - etw) / 2, y, size: 14, font: fB, color: lgray });

      // ── save & download ────────────────────────────────────────────
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const filename = `JPGTK007-${clientName.trim().replace(/\s+/g, '-')}-${effectiveDate}.pdf`;
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      const storageKey = `jpg_agreements_${client.username}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const updated = {
        ...existing,
        form_007: {
          sent: true,
          sentDate: new Date().toISOString(),
          promoType: promoType,
          clientName: clientName.trim(),
          effectiveDate: effectiveDate,
        },
      };
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setGenerated(true);
    } finally {
      setGenerating(false);
    }
  }

  const inputStyle = {
    width: '100%',
    background: DARK,
    border: `1px solid ${BORDER_DK}`,
    color: '#fff',
    fontSize: 13,
    padding: '8px 12px',
    borderRadius: 4,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    color: TEXT_DIM,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '1px',
    marginBottom: 6,
    display: 'block',
  };

  const btnDisabled = !isReady || generating;

  return (
    <div style={{
      background: DARKER,
      border: `1px solid ${BORDER_DK}`,
      borderRadius: 6,
      padding: '20px 24px',
      marginTop: 20,
    }}>
      <div style={{
        color: GOLD,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '2px',
        marginBottom: 18,
      }}>
        GENERATE TK-007 PROMOTIONAL AGREEMENT
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>CLIENT NAME</label>
        <input
          type="text"
          value={clientName}
          onChange={e => { setClientName(e.target.value); setGenerated(false); }}
          placeholder="Full name as it will appear on the agreement"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>EFFECTIVE DATE</label>
        <input
          type="date"
          value={effectiveDate}
          onChange={e => { setEffectiveDate(e.target.value); setGenerated(false); }}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 14 }}>
        <label style={labelStyle}>PROMO TYPE</label>
        <select
          value={promoType}
          onChange={e => {
            setPromoType(e.target.value);
            setPromoRate('');
            setGenerated(false);
          }}
          style={{ ...inputStyle, color: promoType ? '#fff' : '#888' }}
        >
          <option value="">Select promo type...</option>
          {PROMO_TYPES.map(pt => (
            <option key={pt.key} value={pt.key}>{pt.label}</option>
          ))}
        </select>
      </div>

      {showRate && (
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>PROMOTIONAL MONTHLY RATE ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={promoRate}
            onChange={e => { setPromoRate(e.target.value); setGenerated(false); }}
            placeholder="0.00"
            style={inputStyle}
          />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={btnDisabled}
        style={{
          background: btnDisabled ? DARK : '#ddb94a',
          color: btnDisabled ? TEXT_DIM : '#000',
          border: `1px solid ${btnDisabled ? BORDER_DK : '#ddb94a'}`,
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: '2px',
          padding: '9px 24px',
          borderRadius: 4,
          cursor: btnDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {generating ? 'GENERATING...' : 'GENERATE AGREEMENT'}
      </button>
      {generated && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#4caf7d', letterSpacing: '0.5px' }}>
          Agreement generated and sent to client agreements spoke.
        </div>
      )}
    </div>
  );
}
