import React, { useRef } from 'react';
import useActivityStore from '../store/activityStore';

function StepCard({ step, activityId, stepIndex, isLast }) {
  const { uploadEvidence, uploadStates } = useActivityStore();
  const fileInputRef = useRef(null);
  const uploadState = uploadStates[step.id] || { uploading: false, uploaded: false, imageUrl: null, error: null };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadEvidence(activityId, step.id, file);
  };

  const handleUploadClick = () => {
    if (step.locked || uploadState.uploading) return;
    fileInputRef.current?.click();
  };

  const isActive = !step.locked && !uploadState.uploaded;
  const isDone = uploadState.uploaded;

  // Step circle icon
  const StepIcon = () => {
    if (isDone) return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#28A745' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
    if (step.locked) return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#F0F0F0', border: '2px solid #DEE2E6' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
    );
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
        style={{ backgroundColor: '#F26522', fontSize: '15px', fontFamily: 'Kanit, sans-serif' }}>
        {stepIndex + 1}
      </div>
    );
  };

  const borderColor = isDone ? '#C3E6CB' : isActive ? '#FFD6B8' : '#E9ECEF';
  const headerBg = isDone ? '#F0FFF4' : isActive ? '#FFF8F5' : '#FAFAFA';

  return (
    <div className="flex gap-3">
      {/* Timeline line */}
      <div className="flex flex-col items-center" style={{ paddingTop: '2px' }}>
        <StepIcon />
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1"
            style={{
              backgroundColor: isDone ? '#28A745' : '#E9ECEF',
              minHeight: '24px',
            }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 rounded-2xl mb-5 overflow-hidden"
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${borderColor}`,
          boxShadow: step.locked ? 'none' : '0 2px 10px rgba(0,0,0,0.06)',
          opacity: step.locked ? 0.65 : 1,
        }}
      >
        {/* Card Header */}
        <div className="px-4 py-3.5" style={{ backgroundColor: headerBg, borderBottom: `1px solid ${borderColor}` }}>
          <div className="flex items-start gap-2" style={{ minWidth: 0 }}>
            <h4
              className="font-bold leading-snug flex-1"
              style={{
                fontSize: '14px',
                color: step.locked ? '#ADB5BD' : '#212529',
                fontFamily: 'Kanit, sans-serif',
                minWidth: 0,
              }}
            >
              {step.title}
            </h4>
            {/* Badge — flex-shrink-0 prevents overflow */}
            {isDone && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-white"
                style={{ fontSize: '11px', backgroundColor: '#28A745', fontFamily: 'Kanit, sans-serif', whiteSpace: 'nowrap' }}>
                ส่งแล้ว ✓
              </span>
            )}
            {isActive && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-white"
                style={{ fontSize: '11px', backgroundColor: '#F26522', fontFamily: 'Kanit, sans-serif', whiteSpace: 'nowrap' }}>
                รอหลักฐาน
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ADB5BD" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span style={{ fontSize: '12px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif' }}>
              {step.dateRange}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="px-4 pt-4 pb-5">
          <p className="mb-4" style={{ fontSize: '13px', color: '#6C757D', fontFamily: 'Kanit, sans-serif', lineHeight: '1.7' }}>
            {step.description}
          </p>

          {/* Evidence image area */}
          <div
            className="w-full rounded-xl mb-4 flex items-center justify-center overflow-hidden"
            style={{
              height: '140px',
              backgroundColor: '#F8F9FA',
              border: `2px dashed ${isDone ? '#28A745' : step.locked ? '#E0E0E0' : '#F26522'}`,
            }}
          >
            {uploadState.imageUrl ? (
              <img src={uploadState.imageUrl} alt="หลักฐาน" className="w-full h-full object-cover rounded-xl" />
            ) : uploadState.uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#F26522', borderTopColor: 'transparent' }} />
                <span style={{ fontSize: '12px', color: '#6C757D', fontFamily: 'Kanit, sans-serif' }}>
                  กำลังอัปโหลด...
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                  stroke={step.locked ? '#D0D0D0' : '#F26522'}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={step.locked ? 0.5 : 0.7}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span style={{ fontSize: '12px', color: step.locked ? '#C0C0C0' : '#ADB5BD', fontFamily: 'Kanit, sans-serif' }}>
                  {step.locked ? 'ยังไม่ถึงขั้นตอนนี้' : 'แตะเพื่ออัปโหลดรูปภาพ'}
                </span>
              </div>
            )}
          </div>

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={handleUploadClick}
            disabled={step.locked || uploadState.uploading}
            className="w-full rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 active:scale-95"
            style={{
              height: '46px',
              backgroundColor: step.locked
                ? '#F0F0F0'
                : uploadState.uploading
                ? '#E9ECEF'
                : isDone
                ? '#E8F5E9'
                : '#00AEEF',
              color: step.locked
                ? '#C0C0C0'
                : uploadState.uploading
                ? '#ADB5BD'
                : isDone
                ? '#28A745'
                : '#FFFFFF',
              fontSize: '14px',
              fontFamily: 'Kanit, sans-serif',
              border: 'none',
              cursor: step.locked ? 'not-allowed' : 'pointer',
            }}
          >
            {uploadState.uploading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#ADB5BD', borderTopColor: 'transparent' }} />
                กำลังอัปโหลด...
              </>
            ) : isDone ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                อัปโหลดสำเร็จ — เปลี่ยนรูป
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                ถ่ายภาพ / อัปโหลด
              </>
            )}
          </button>

          {uploadState.error && (
            <p className="mt-2 text-center" style={{ fontSize: '12px', color: '#DC3545', fontFamily: 'Kanit, sans-serif' }}>
              เกิดข้อผิดพลาด: {uploadState.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default StepCard;
