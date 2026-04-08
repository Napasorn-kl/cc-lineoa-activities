import React, { useEffect, useState } from 'react';
import useActivityStore from '../store/activityStore';
import { useNavigate } from 'react-router-dom';

function SuccessScreen() {
  const { hideSuccess } = useActivityStore();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    const timer = setTimeout(() => {
      hideSuccess();
      navigate('/activities');
    }, 3000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const handleClose = () => {
    hideSuccess();
    navigate('/activities');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
    >
      <div
        className="bg-white rounded-3xl flex flex-col items-center text-center w-full"
        style={{ maxWidth: '320px', padding: '36px 28px 28px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        {/* Checkmark animation */}
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#E8F5E9' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#28A745' }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white"
                strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="font-bold mb-2" style={{ fontSize: '20px', color: '#212529', fontFamily: 'Kanit, sans-serif' }}>
          ส่งกิจกรรมสำเร็จ!
        </h2>
        <p className="mb-5" style={{ fontSize: '14px', color: '#6C757D', fontFamily: 'Kanit, sans-serif', lineHeight: '1.65' }}>
          ระบบได้รับหลักฐานของคุณเรียบร้อยแล้ว
          กรุณารอการตรวจสอบจากเจ้าหน้าที่
        </p>

        {/* Info box */}
        <div className="w-full px-4 py-3 rounded-xl mb-5"
          style={{ backgroundColor: '#F0FFF4', border: '1px solid #C3E6CB' }}>
          <div className="flex items-center justify-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p style={{ fontSize: '13px', color: '#28A745', fontFamily: 'Kanit, sans-serif', fontWeight: 500 }}>
              คะแนนจะถูกเพิ่มหลังการตรวจสอบ
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleClose}
          className="w-full rounded-xl font-bold text-white transition-all active:scale-95"
          style={{ height: '48px', backgroundColor: '#28A745', fontSize: '15px', fontFamily: 'Kanit, sans-serif', border: 'none', cursor: 'pointer' }}
        >
          กลับหน้าหลัก
        </button>

        <p className="mt-3" style={{ fontSize: '12px', color: '#ADB5BD', fontFamily: 'Kanit, sans-serif' }}>
          กลับอัตโนมัติใน {countdown} วินาที
        </p>
      </div>
    </div>
  );
}

export default SuccessScreen;
