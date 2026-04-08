import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useActivityStore from '../store/activityStore';
import Header from '../components/Header';
import StepCard from '../components/StepCard';
import SuccessScreen from '../components/SuccessScreen';

function ProgressSummary({ currentStep, totalSteps }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const barColor = percentage === 100 ? '#28A745' : '#F26522';

  return (
    <div
      className="mx-4 mt-4 mb-1 rounded-2xl p-4"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
          ความคืบหน้ารวม
        </span>
        <span style={{ fontSize: '17px', fontFamily: 'Kanit, sans-serif', fontWeight: 700, color: barColor }}>
          {percentage}%
        </span>
      </div>
      <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', backgroundColor: '#E9ECEF' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span style={{ fontSize: '12px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif' }}>
          ขั้นที่ {currentStep} จาก {totalSteps} ขั้นตอน
        </span>
        {percentage === 100 && (
          <span style={{ fontSize: '12px', color: '#28A745', fontFamily: 'Kanit, sans-serif', fontWeight: 600 }}>
            ครบทุกขั้นตอน!
          </span>
        )}
      </div>
    </div>
  );
}

function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentActivity, fetchActivityDetail, loading, showSuccess } = useActivityStore();

  useEffect(() => {
    fetchActivityDetail(id);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <Header title="รายละเอียดกิจกรรม" showBack />
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 animate-spin rounded-full"
            style={{ border: '3px solid #F26522', borderTopColor: 'transparent' }} />
          <p style={{ fontSize: '14px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <Header title="รายละเอียดกิจกรรม" showBack />
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p style={{ fontSize: '15px', color: '#495057', fontFamily: 'Kanit, sans-serif' }}>
            ไม่พบกิจกรรมที่ต้องการ
          </p>
          <button
            onClick={() => navigate('/activities')}
            style={{
              backgroundColor: '#F26522', color: '#FFFFFF', border: 'none',
              borderRadius: '12px', padding: '12px 28px',
              fontSize: '14px', fontFamily: 'Kanit, sans-serif', cursor: 'pointer',
            }}
          >
            กลับหน้ากิจกรรม
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      <Header title={currentActivity.name} showBack />

      {/* Banner */}
      <div
        className="w-full relative"
        style={{
          height: '160px',
          background: `linear-gradient(135deg, ${currentActivity.bannerColor || '#F26522'}, ${currentActivity.bannerColorEnd || '#FF8C42'})`,
          overflow: 'hidden',
        }}
      >
        {currentActivity.bannerUrl ? (
          <img src={currentActivity.bannerUrl} alt={currentActivity.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center px-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <p className="text-white font-bold mt-2 text-center leading-snug"
              style={{ fontSize: '15px', opacity: 0.9 }}>
              {currentActivity.name}
            </p>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
        {/* Bottom info bar */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
          <span className="text-white" style={{ fontSize: '12px', fontFamily: 'Kanit, sans-serif', opacity: 0.95 }}>
            รหัสร้าน: {currentActivity.shopCode}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-white"
            style={{ fontSize: '11px', fontFamily: 'Kanit, sans-serif', backgroundColor: 'rgba(0,0,0,0.3)' }}
          >
            {currentActivity.dateRange}
          </span>
        </div>
      </div>

      {/* Info card */}
      <div className="mx-4 mt-4 rounded-2xl p-5"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F0F0F0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h2 className="font-bold mb-2" style={{ fontSize: '16px', color: '#212529', fontFamily: 'Kanit, sans-serif' }}>
          {currentActivity.name}
        </h2>
        <p style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif', lineHeight: '1.7' }}>
          {currentActivity.description}
        </p>

        {/* Stats row */}
        <div
          className="flex mt-4 rounded-xl overflow-hidden"
          style={{ border: '1px solid #F0F0F0' }}
        >
          <div className="flex-1 flex flex-col items-center py-2.5" style={{ borderRight: '1px solid #F0F0F0' }}>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#F26522', fontFamily: 'Kanit, sans-serif' }}>
              {currentActivity.currentScore || 0}
            </span>
            <span style={{ fontSize: '11px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif', marginTop: '1px' }}>
              คะแนนสะสม
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center py-2.5">
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#00AEEF', fontFamily: 'Kanit, sans-serif' }}>
              {(currentActivity.participants || 0).toLocaleString()}
            </span>
            <span style={{ fontSize: '11px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif', marginTop: '1px' }}>
              ผู้เข้าร่วม
            </span>
          </div>
        </div>
      </div>

      {/* Progress summary */}
      <ProgressSummary
        currentStep={currentActivity.currentStep || 0}
        totalSteps={currentActivity.steps?.length || 4}
      />

      {/* Steps section */}
      <div className="px-4 pt-3 pb-10">
        <h3 className="font-bold mb-5" style={{ fontSize: '14px', color: '#495057', fontFamily: 'Kanit, sans-serif' }}>
          ขั้นตอนกิจกรรม
        </h3>
        {currentActivity.steps?.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            activityId={currentActivity.id}
            stepIndex={index}
            isLast={index === currentActivity.steps.length - 1}
          />
        ))}
      </div>

      {showSuccess && <SuccessScreen />}
    </div>
  );
}

export default ActivityDetailPage;
