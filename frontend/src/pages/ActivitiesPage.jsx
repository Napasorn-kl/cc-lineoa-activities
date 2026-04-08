import React, { useEffect } from 'react';
import useActivityStore from '../store/activityStore';
import ActivityCard from '../components/ActivityCard';
import Header from '../components/Header';

const TABS = [
  { key: 'joined', label: 'เข้าร่วมแล้ว' },
  { key: 'not-joined', label: 'ยังไม่ได้เข้าร่วม' },
  { key: 'ended', label: 'สิ้นสุด' },
];

function EmptyState({ tab }) {
  const config = {
    joined: { icon: '📋', text: 'ยังไม่มีกิจกรรมที่เข้าร่วม', sub: 'ไปดูกิจกรรมที่เปิดรับสมัครได้เลย' },
    'not-joined': { icon: '🎯', text: 'ไม่มีกิจกรรมเปิดรับสมัคร', sub: 'โปรดติดตามกิจกรรมใหม่เร็วๆ นี้' },
    ended: { icon: '📅', text: 'ยังไม่มีกิจกรรมที่สิ้นสุด', sub: '' },
  };
  const m = config[tab] || config['joined'];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span style={{ fontSize: '52px', marginBottom: '14px', lineHeight: 1 }}>{m.icon}</span>
      <p style={{ fontSize: '15px', color: '#495057', fontFamily: 'Kanit, sans-serif', fontWeight: 500 }}>
        {m.text}
      </p>
      {m.sub && (
        <p style={{ fontSize: '13px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif', marginTop: '6px' }}>
          {m.sub}
        </p>
      )}
    </div>
  );
}

function ActivitiesPage() {
  const {
    joinedActivities,
    notJoinedActivities,
    endedActivities,
    fetchAllActivities,
    loading,
    activeTab,
    setActiveTab,
  } = useActivityStore();

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const counts = {
    joined: joinedActivities.length,
    'not-joined': notJoinedActivities.length,
    ended: endedActivities.length,
  };

  const activities =
    activeTab === 'joined' ? joinedActivities :
    activeTab === 'not-joined' ? notJoinedActivities :
    endedActivities;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <Header title="กิจกรรมทั้งหมด" />

      {/* Tab Bar */}
      <div
        className="sticky z-10 flex"
        style={{ top: '56px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9ECEF', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = counts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 flex flex-col items-center justify-center transition-all duration-200"
              style={{
                height: '48px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2.5px solid #F26522' : '2.5px solid transparent',
                cursor: 'pointer',
                gap: '2px',
              }}
            >
              <div className="flex items-center gap-1">
                <span style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#F26522' : '#6C757D',
                  fontFamily: 'Kanit, sans-serif',
                }}>
                  {tab.label}
                </span>
                {count > 0 && (
                  <span
                    className="rounded-full text-white"
                    style={{
                      fontSize: '10px',
                      fontFamily: 'Kanit, sans-serif',
                      backgroundColor: isActive ? '#F26522' : '#ADB5BD',
                      minWidth: '17px',
                      height: '17px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 4px',
                    }}
                  >
                    {count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '3px solid #F26522', borderTopColor: 'transparent' }} />
            <p style={{ fontSize: '14px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
              กำลังโหลดข้อมูล...
            </p>
          </div>
        ) : activities.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

export default ActivitiesPage;
