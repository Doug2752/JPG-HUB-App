import React from 'react';
import { GOLD, TEXT_DIM } from '../../utils/constants';

const titleStyle = { color: GOLD, fontWeight: 700, fontSize: 20, letterSpacing: '3px' };

export default function InterfacePreferenceView({ user }) {
  return (
    <div style={{ padding: 28, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ ...titleStyle, marginBottom: 6 }}>APP INTERFACE PREFERENCE</div>
        <div style={{ color: TEXT_DIM, fontSize: 13, fontStyle: 'italic' }}>
          Your personalized app experience is coming. This spoke will guide you through selecting the version of DOP and PIT that best fits how you work.
        </div>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
      }}>
        <div style={{ color: GOLD, fontWeight: 700, fontSize: 16, letterSpacing: '3px', marginBottom: 12 }}>
          COMING SOON
        </div>
        <div style={{ color: TEXT_DIM, fontSize: 13 }}>
          Interface customization options will appear here.
        </div>
      </div>
    </div>
  );
}
