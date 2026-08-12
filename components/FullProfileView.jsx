import React from 'react';
import { S } from '../utils/styles';
import { GOLD, DARKER, BORDER_DK, TEXT_DIM, TEXT_MID } from '../utils/constants';

const sectionHeading = {
  fontSize: 13, fontWeight: 900, letterSpacing: '2px', color: '#fff',
  paddingBottom: 10, borderBottom: `1px solid ${GOLD}`, marginBottom: 18,
};

const fieldLabel = {
  fontSize: 9, fontWeight: 700, letterSpacing: '2px', color: GOLD, marginBottom: 4,
};

const fieldValue = {
  fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16,
};

const unavailable = {
  fontSize: 13, color: TEXT_DIM, fontStyle: 'italic', marginBottom: 16,
};

const sectionCard = {
  background: DARKER, border: `1px solid ${BORDER_DK}`, borderRadius: 3,
  padding: '20px 24px', marginBottom: 20,
};

function Field({ label, value }) {
  const hasValue = value && value !== 'Not set' && value !== 'Not provided';
  return (
    <div>
      <div style={fieldLabel}>{label}</div>
      {hasValue ? (
        <div style={fieldValue}>{value}</div>
      ) : (
        <div style={unavailable}>{value || 'Available after backend migration'}</div>
      )}
    </div>
  );
}

function MigrationField({ label }) {
  return (
    <div>
      <div style={fieldLabel}>{label}</div>
      <div style={unavailable}>Available after backend migration</div>
    </div>
  );
}

export default function FullProfileView({ client, onBack }) {
  if (!client) return null;

  const fullName = (client.first_name + ' ' + client.last_name).toUpperCase();

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        <div
          onClick={onBack}
          style={{
            color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: '1px',
            cursor: 'pointer', marginBottom: 20, display: 'inline-block',
          }}
        >
          ← Back
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '3px', color: GOLD, marginBottom: 6 }}>
            CLIENT PROFILE
          </div>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '2px', color: '#fff' }}>
            {fullName}
          </div>
        </div>

        <div style={sectionCard}>
          <div style={sectionHeading}>PERSONAL INFORMATION</div>
          <Field label="FULL NAME" value={client.first_name + ' ' + client.last_name} />
          <MigrationField label="PREFERRED NAME" />
          <Field label="PHONE" value={client.phone || 'Not provided'} />
          <Field label="EMAIL" value={client.email || 'Not provided'} />
          <MigrationField label="AGE" />
          <Field label="DATE STARTED" value={client.program_start_date || 'Not set'} />
          <Field label="TRACKING START DATE" value={client.tracking_start_date || 'Not set'} />
        </div>

        <div style={sectionCard}>
          <div style={sectionHeading}>BACKGROUND</div>
          <MigrationField label="OCCUPATION & WORK SCHEDULE" />
          <MigrationField label="DESIRED OUTCOME 1" />
          <MigrationField label="DESIRED OUTCOME 2" />
          <MigrationField label="DESIRED OUTCOME 3" />
          <MigrationField label="HOBBIES" />
        </div>

        <div style={sectionCard}>
          <div style={sectionHeading}>CURRENT HABITS & HEALTH</div>
          <MigrationField label="CURRENT FITNESS ACTIVITIES" />
          <MigrationField label="CURRENT EATING HABITS" />
          <MigrationField label="CURRENT SLEEP HABITS" />
          <MigrationField label="INJURIES / MEDICAL CONDITIONS / PHYSICAL LIMITATIONS" />
        </div>

        <div style={sectionCard}>
          <div style={sectionHeading}>PROGRAM STATUS</div>
          <Field label="CURRENT TIER" value={client.tier_name || 'Apprentice'} />
          <MigrationField label="TIME IN CURRENT TIER" />
          <MigrationField label="TIER HISTORY" />
        </div>

        <div style={sectionCard}>
          <div style={sectionHeading}>4x4 METRICS</div>
          <MigrationField label="CURRENT 4x4 METRICS" />
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: '0.5px', fontStyle: 'italic' }}>
            Live metrics will populate from DOP after backend migration.
          </div>
        </div>

      </div>
    </div>
  );
}
