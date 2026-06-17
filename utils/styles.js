// ── STYLES ────────────────────────────────────────────────────
import {
  GOLD, DARK, DARKER, RED, GREEN,
  BORDER_LT, BORDER_DK, CHAR,
  TEXT_DIM, TEXT_MID, TEXT_ROLE
} from './constants.js';

export const S = {

  // ── App shell ────────────────────────────────────────────────
  appShell: {
    display: 'flex', width: '100%', height: '100vh', overflow: 'hidden',
    background: DARK, color: '#fff', fontFamily: "'Lato', sans-serif"
  },

  // ── Login ────────────────────────────────────────────────────
  loginScreen: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', width: '100%', height: '100vh',
    background: GOLD, padding: '20px'
  },
  loginLogo: {
    width: '320px', marginBottom: '28px', display: 'block', mixBlendMode: 'multiply'
  },
  loginCard: {
    background: '#fff', borderRadius: '6px', padding: '28px 28px 24px',
    width: '100%', maxWidth: '380px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
  },
  loginTitle: {
    fontSize: '18px', fontWeight: '900', color: '#000',
    letterSpacing: '1.5px', marginBottom: '4px', textAlign: 'center'
  },
  loginSub: {
    fontSize: '13px', fontWeight: '600', color: DARK,
    textAlign: 'center', marginBottom: '24px', letterSpacing: '0.5px'
  },
  loginLabel: {
    display: 'block', fontSize: '11px', fontWeight: '700', color: CHAR,
    letterSpacing: '1px', marginBottom: '4px'
  },
  loginInput: {
    width: '100%', padding: '8px 10px', border: `1px solid ${BORDER_LT}`,
    borderRadius: '3px', fontSize: '13px', fontFamily: "'Lato', sans-serif",
    color: DARK, marginBottom: '14px', outline: 'none', boxSizing: 'border-box',
    display: 'block'
  },
  loginInputLast: { marginBottom: '18px' },
  loginInputError: { borderColor: RED },
  loginBtn: {
    width: '100%', background: GOLD, color: '#fff', border: 'none',
    padding: '11px', borderRadius: '3px', cursor: 'pointer', fontWeight: '700',
    fontSize: '13px', fontFamily: "'Lato', sans-serif", letterSpacing: '2px'
  },
  loginFooter: {
    color: 'rgba(0,0,0,0.7)', fontSize: '11px', marginTop: '18px',
    letterSpacing: '1px', textAlign: 'center', fontWeight: '600'
  },

  // ── Nav ──────────────────────────────────────────────────────
  nav: {
    width: '220px', background: DARKER, display: 'flex', flexDirection: 'column',
    flexShrink: 0, borderRight: `1px solid ${BORDER_DK}`, zIndex: 10
  },
  navLogoWrap: {
    padding: '18px 18px 14px', borderBottom: `1px solid ${BORDER_DK}`, cursor: 'pointer'
  },
  navLogoImg: { width: '130px', display: 'block', mixBlendMode: 'multiply' },
  navRole: { color: TEXT_ROLE, fontSize: '9px', letterSpacing: '2px', fontWeight: '700', marginTop: '8px' },
  navItems: { padding: '10px 0', flex: 1 },
  navItem: {
    padding: '12px 20px', fontSize: '11px', color: TEXT_MID, letterSpacing: '1.5px',
    cursor: 'pointer', borderLeft: '3px solid transparent', fontWeight: '700',
    display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s'
  },
  navItemActive: {
    color: GOLD, borderLeft: `3px solid ${GOLD}`, background: 'rgba(184,134,11,0.08)'
  },
  navItemHover: {
    color: GOLD, background: 'rgba(184,134,11,0.05)'
  },
  navDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    background: BORDER_DK, flexShrink: 0
  },
  navDotActive: { background: GOLD },
  neverTwice: {
    padding: '16px 20px 20px', borderTop: `1px solid ${BORDER_DK}`, textAlign: 'center'
  },
  ntLabel: { color: TEXT_DIM, fontSize: '8px', letterSpacing: '2px', fontWeight: '700', marginBottom: '5px' },
  ntPhrase: { color: GOLD, fontSize: '13px', fontWeight: '900', letterSpacing: '4px' },

  // ── Main content ─────────────────────────────────────────────
  mainContent: {
    flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative'
  },

  // ── Topbar ───────────────────────────────────────────────────
  topbar: {
    background: DARKER, padding: '14px 28px',
    borderBottom: `1px solid ${BORDER_DK}`, flexShrink: 0
  },
  topbarRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  topbarRow1: { marginBottom: '8px' },
  topbarTitle: {
    color: GOLD, fontSize: '22px', fontWeight: '900',
    letterSpacing: '3px', lineHeight: '1', whiteSpace: 'nowrap'
  },
  topbarJpg: { color: '#ccc', fontSize: '11px', letterSpacing: '2px', fontWeight: '700', whiteSpace: 'nowrap' },
  topbarCoach: { fontSize: '11px', color: TEXT_MID, whiteSpace: 'nowrap' },
  topbarCoachName: { color: GOLD, fontWeight: '700' },
  topbarLogout: {
    background: 'none', border: `1px solid ${BORDER_DK}`, color: TEXT_MID,
    padding: '6px 14px', borderRadius: '2px', fontFamily: "'Lato', sans-serif",
    fontSize: '10px', letterSpacing: '1px', cursor: 'pointer', transition: 'all 0.15s'
  },

  // ── View area ────────────────────────────────────────────────
  viewArea: {
    flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'
  },

  // ── Wheel / Dashboard view ───────────────────────────────────
  wheelView: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #1f1f1f 0%, #1A1A1A 70%)',
    padding: '20px', overflow: 'hidden'
  },
  wheelSvg: { width: '100%', maxWidth: '720px', height: 'auto' },

  // ── Clients view ─────────────────────────────────────────────
  clientsScroll: { padding: '28px', overflowY: 'auto', flex: 1 },
  pageHdr: { marginBottom: '22px' },
  pageHdrH2: { fontSize: '18px', fontWeight: '900', letterSpacing: '2px', color: '#fff' },
  pageHdrP: { color: TEXT_MID, fontSize: '11px', letterSpacing: '1px', marginTop: '4px' },

  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px'
  },
  statBox: {
    background: DARKER, border: `1px solid ${BORDER_DK}`, borderRadius: '3px',
    padding: '12px 14px', display: 'flex', flexDirection: 'column', height: '90px', minWidth: 0
  },
  statLabel: {
    color: TEXT_DIM, fontSize: '9px', letterSpacing: '1.5px', fontWeight: '700',
    height: '14px', lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  },
  statValue: {
    color: GOLD, fontSize: '26px', fontWeight: '900', lineHeight: '1', marginTop: '6px', height: '26px'
  },
  statValueAlert: { color: RED },
  statSub: {
    color: TEXT_MID, fontSize: '10px', marginTop: 'auto',
    height: '14px', lineHeight: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  },

  sectionBar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: '8px', borderBottom: `1px solid ${GOLD}`, marginBottom: '14px'
  },
  sectionBarH3: { fontSize: '12px', fontWeight: '900', letterSpacing: '2px', color: '#fff' },
  sectionBarSpan: { color: TEXT_DIM, fontSize: '10px', letterSpacing: '1px' },

  clientTable: {
    background: DARKER, border: `1px solid ${BORDER_DK}`, borderRadius: '3px', overflow: 'hidden'
  },
  ctGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(140px,1.4fr) 130px minmax(140px,1.4fr) 100px 110px',
    gap: '12px', padding: '12px 18px', alignItems: 'center'
  },
  ctHead: { background: '#161616', borderBottom: `1px solid ${BORDER_DK}` },
  ctHeadCell: { color: TEXT_DIM, fontSize: '9px', letterSpacing: '1.5px', fontWeight: '700' },
  ctRow: { borderBottom: `1px solid #1a1a1a`, cursor: 'pointer', height: '52px' },
  ctName: {
    fontSize: '13px', fontWeight: '700', color: '#fff',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
  },
  ctMeta: { color: TEXT_MID, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  ctAction: { color: GOLD, fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },
  ctWarn:   { color: RED,  fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' },

  // ── Phase tags ───────────────────────────────────────────────
  phaseTag: {
    fontSize: '9px', fontWeight: '700', padding: '4px 8px', borderRadius: '2px',
    letterSpacing: '1px', display: 'inline-block', textAlign: 'center',
    width: '100px', boxSizing: 'border-box'
  },
  ptWarm:  { background: 'rgba(192,57,43,0.12)',  color: RED,       border: `1px solid ${RED}` },
  ptFound: { background: 'rgba(184,134,11,0.12)', color: GOLD,      border: `1px solid ${GOLD}` },
  ptPerf:  { background: 'rgba(44,74,107,0.2)',   color: '#6B9BD3', border: '1px solid #2C4A6B' },
  ptStop:  { background: 'rgba(46,90,75,0.15)',   color: '#4FA388', border: `1px solid ${GREEN}` },

  // ── Slide panel ──────────────────────────────────────────────
  slidePanel: {
    position: 'fixed', top: 0, width: '420px', height: '100%',
    background: '#111', borderLeft: `1px solid ${BORDER_DK}`, zIndex: 100,
    display: 'flex', flexDirection: 'column',
    boxShadow: '-8px 0 32px rgba(0,0,0,0.5)', transition: 'right 0.25s ease'
  },
  spHeader: {
    padding: '18px 20px', borderBottom: `1px solid ${BORDER_DK}`,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
  },
  spHeaderName: { color: GOLD, fontSize: '13px', fontWeight: '900', letterSpacing: '2px' },
  spClose: {
    background: 'none', border: `1px solid ${BORDER_DK}`, color: TEXT_MID,
    width: '28px', height: '28px', borderRadius: '2px', cursor: 'pointer',
    fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'inherit'
  },
  spBody: { padding: '20px', flex: 1, overflowY: 'auto' },
  spRow: { marginBottom: '16px' },
  spRowLbl: { color: TEXT_DIM, fontSize: '9px', letterSpacing: '2px', fontWeight: '700', marginBottom: '5px' },
  spRowVal: { color: '#fff', fontSize: '13px', fontWeight: '700' },
  spRowValGold: { color: GOLD },
  spDivider: { border: 'none', borderTop: `1px solid ${BORDER_DK}`, margin: '18px 0' },
  spAlert: {
    background: 'rgba(192,57,43,0.1)', border: `1px solid ${RED}`,
    borderRadius: '2px', padding: '10px 14px', marginBottom: '16px'
  },
  spAlertLabel: { color: RED, fontSize: '9px', letterSpacing: '2px', fontWeight: '700', marginBottom: '4px' },
  spAlertMsg: { color: '#fff', fontSize: '12px' },
  spFooter: { padding: '16px 20px', borderTop: `1px solid ${BORDER_DK}`, flexShrink: 0 },
  spFullBtn: {
    width: '100%', background: GOLD, color: '#fff', border: 'none', padding: '13px',
    fontFamily: "'Lato', sans-serif", fontSize: '11px', fontWeight: '900',
    letterSpacing: '3px', cursor: 'pointer', borderRadius: '2px'
  },

  // ── Placeholder view ─────────────────────────────────────────
  emptyView: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '14px'
  },
  comingSoonIcon: {
    width: '80px', height: '80px', border: `2px solid ${BORDER_DK}`,
    borderRadius: '50%', display: 'flex', alignItems: 'center',
    justifyContent: 'center', color: TEXT_DIM, fontSize: '28px'
  },
  emptyLabel: { color: TEXT_DIM, fontSize: '11px', letterSpacing: '3px', fontWeight: '700' },
  emptySub:   { color: TEXT_DIM, fontSize: '10px', letterSpacing: '1px' },

  // ── App footer ───────────────────────────────────────────────
  appFooter: {
    background: DARKER, padding: '8px 28px', fontSize: '10px', color: TEXT_DIM,
    letterSpacing: '1.5px', textAlign: 'center', borderTop: `1px solid ${BORDER_DK}`, flexShrink: 0
  },
  footerConf: { color: GOLD, fontWeight: '700' }

};
