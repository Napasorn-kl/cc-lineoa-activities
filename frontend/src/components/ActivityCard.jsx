import React from 'react';
import { useNavigate } from 'react-router-dom';
import useActivityStore from '../store/activityStore';

function ProgressBar({ currentStep, totalSteps }) {
  const percentage = (currentStep / totalSteps) * 100;
  const barColor = percentage === 100 ? '#28A745' : percentage >= 50 ? '#F26522' : '#FFC107';

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span style={{ fontSize: '12px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
          ความคืบหน้า
        </span>
        <span style={{ fontSize: '12px', fontFamily: 'Kanit, sans-serif', fontWeight: 600, color: barColor }}>
          ขั้นที่ {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '7px', backgroundColor: '#E9ECEF' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      {/* Step indicators */}
      <div className="flex mt-2.5 gap-1">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < currentStep ? barColor : '#E9ECEF' }}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity }) {
  const navigate = useNavigate();
  const { joinActivity } = useActivityStore();

  const handleAction = async () => {
    if (activity.status === 'not-joined') {
      await joinActivity(activity.id);
    }
    navigate(`/activities/${activity.id}`);
  };

  const statusConfig = {
    joined: { bg: '#00AEEF', label: 'กำลังดำเนินการ' },
    'not-joined': { bg: '#28A745', label: 'เปิดรับสมัคร' },
    ended: { bg: '#6C757D', label: 'สิ้นสุดแล้ว' },
  };

  const btnConfig = {
    joined: { bg: '#F26522', color: '#fff', border: 'none', text: 'ดำเนินการต่อ' },
    'not-joined': { bg: '#F26522', color: '#fff', border: 'none', text: 'เข้าร่วมกิจกรรม' },
    ended: { bg: 'transparent', color: '#6C757D', border: '1.5px solid #6C757D', text: 'ดูรายละเอียด' },
  };

  const status = activity.status;
  const badge = statusConfig[status];
  const btn = btnConfig[status];

  return (
    <div
      className="rounded-2xl overflow-hidden mb-4"
      style={{
        backgroundColor: '#FFFFFF',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #F0F0F0',
      }}
    >
      {/* Banner */}
      <div
        className="w-full relative"
        style={{
          height: '150px',
          background: `linear-gradient(135deg, ${activity.bannerColor || '#F26522'}, ${activity.bannerColorEnd || '#FF8C42'})`,
          overflow: 'hidden',
        }}
      >
        {activity.bannerUrl ? (
          <img src={activity.bannerUrl} alt={activity.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span
              className="text-white font-bold text-center mt-2 leading-snug"
              style={{ fontSize: '14px', opacity: 0.9, maxWidth: '100%' }}
            >
              {activity.name}
            </span>
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-white font-medium"
            style={{ fontSize: '11px', backgroundColor: badge.bg, fontFamily: 'Kanit, sans-serif' }}
          >
            {badge.label}
          </span>
        </div>
        {/* Gradient overlay bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: '48px', background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="px-4 pt-4 pb-5">
        {/* Title */}
        <h3
          className="font-bold leading-snug mb-3"
          style={{
            fontSize: '16px',
            color: '#212529',
            fontFamily: 'Kanit, sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {activity.name}
        </h3>

        {/* Meta info */}
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
              {activity.dateRange}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
              รหัสร้าน: <span style={{ color: '#495057', fontWeight: 500 }}>{activity.shopCode}</span>
            </span>
          </div>

          {status !== 'not-joined' && (
            <div className="flex items-center gap-2">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
                คะแนน: <span style={{ color: '#F26522', fontWeight: 600 }}>{activity.currentScore || 0}</span> คะแนน
              </span>
            </div>
          )}
        </div>

        {/* Progress */}
        {(status === 'joined' || status === 'ended') && (
          <ProgressBar currentStep={activity.currentStep || 0} totalSteps={activity.totalSteps || 4} />
        )}

        {/* CTA */}
        <button
          onClick={handleAction}
          className="w-full mt-5 rounded-xl font-bold transition-all duration-200 active:scale-95 active:opacity-80"
          style={{
            backgroundColor: btn.bg,
            color: btn.color,
            border: btn.border,
            fontSize: '15px',
            fontFamily: 'Kanit, sans-serif',
            height: '48px',
            cursor: 'pointer',
            letterSpacing: '0.3px',
          }}
        >
          {btn.text}
          {status === 'not-joined' && <span className="ml-1.5">→</span>}
        </button>
      </div>
    </div>
  );
}

export default ActivityCard;
