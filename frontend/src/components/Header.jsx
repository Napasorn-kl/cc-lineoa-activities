import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ title = 'กิจกรรม', showBack = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="sticky top-0 z-20 flex items-center gap-3 px-4"
      style={{ backgroundColor: '#F26522', height: '56px', minHeight: '56px' }}
    >
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center flex-shrink-0 rounded-full bg-white/20 active:bg-white/30 transition-colors"
          style={{ width: '36px', height: '36px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <div style={{ width: '36px', flexShrink: 0 }} />
      )}

      <h1
        className="flex-1 text-white font-bold text-center"
        style={{
          fontSize: '16px',
          fontFamily: 'Kanit, sans-serif',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </h1>

      <div
        className="flex-shrink-0 rounded-full bg-white/20 flex items-center justify-center"
        style={{ width: '36px', height: '36px' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      </div>
    </div>
  );
}

export default Header;
