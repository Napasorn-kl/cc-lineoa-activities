import { create } from 'zustand';
import axios from 'axios';

// ─── Mock data (fallback when API unavailable) ───────────────────────────────
const MOCK = {
  joined: [
    {
      id: 'act-001',
      name: 'แคมเปญซื้อครบ 4 ขั้นตอน รับคะแนนพิเศษ',
      description: 'ร่วมกิจกรรมซื้อสินค้าครบตามเป้าหมายในแต่ละขั้นตอน รับคะแนนสะสมพิเศษสูงสุด 1,000 คะแนน เพื่อแลกรับของรางวัลสุดคุ้ม!',
      status: 'joined',
      shopCode: 'CC-BKK-0042',
      dateRange: '01 มี.ค. - 31 มี.ค. 2567',
      currentStep: 2,
      totalSteps: 4,
      currentScore: 250,
      participants: 1284,
      bannerColor: '#F26522',
      bannerColorEnd: '#FF8C42',
    },
  ],
  'not-joined': [
    {
      id: 'act-002',
      name: 'กิจกรรมโปรโมชั่นสินค้าใหม่ เดือนเมษายน',
      description: 'โปรโมชั่นพิเศษสำหรับสินค้าใหม่ประจำเดือนเมษายน สั่งซื้อครบ 2,000 บาท รับคะแนนพิเศษ 200 คะแนน!',
      status: 'not-joined',
      shopCode: 'CC-BKK-0042',
      dateRange: '01 เม.ย. - 30 เม.ย. 2567',
      currentStep: 0,
      totalSteps: 4,
      currentScore: 0,
      participants: 342,
      bannerColor: '#00AEEF',
      bannerColorEnd: '#0090CC',
    },
  ],
  ended: [
    {
      id: 'act-003',
      name: 'แคมเปญปีใหม่ไทย สงกรานต์ มหาสนุก',
      description: 'ร่วมสนุกกับแคมเปญสงกรานต์สุดพิเศษ ซื้อสินค้าครบ 3 ขั้นตอน รับของรางวัลมากมาย!',
      status: 'ended',
      shopCode: 'CC-BKK-0042',
      dateRange: '01 เม.ย. - 15 เม.ย. 2567',
      currentStep: 3,
      totalSteps: 4,
      currentScore: 750,
      participants: 2156,
      bannerColor: '#28A745',
      bannerColorEnd: '#20963A',
    },
  ],
};

const MOCK_DETAIL = {
  'act-001': {
    ...MOCK.joined[0],
    steps: [
      { id: 'step-001', title: 'ขั้นที่ 1: ซื้อสินค้าครบ 1,000 บาท', dateRange: '01 มี.ค. - 10 มี.ค. 2567', description: 'ซื้อสินค้าจากแคตาล็อกที่ร่วมรายการให้ครบ 1,000 บาทในช่วงระยะเวลาที่กำหนด และอัปโหลดใบเสร็จรับเงินเป็นหลักฐาน', locked: false, evidenceUrl: null },
      { id: 'step-002', title: 'ขั้นที่ 2: ซื้อสินค้าครบ 2,500 บาท', dateRange: '11 มี.ค. - 20 มี.ค. 2567', description: 'ซื้อสินค้าเพิ่มเติมให้ยอดรวมครบ 2,500 บาท แล้วอัปโหลดใบเสร็จใหม่ในช่วงเวลาที่กำหนด', locked: false, evidenceUrl: null },
      { id: 'step-003', title: 'ขั้นที่ 3: ซื้อสินค้าครบ 5,000 บาท', dateRange: '21 มี.ค. - 28 มี.ค. 2567', description: 'ยอดซื้อรวมต้องครบ 5,000 บาท ถ่ายภาพใบเสร็จทุกใบรวมกันเป็นหลักฐาน', locked: true, evidenceUrl: null },
      { id: 'step-004', title: 'ขั้นที่ 4: ซื้อสินค้าครบ 10,000 บาท', dateRange: '29 มี.ค. - 31 มี.ค. 2567', description: 'ขั้นตอนสุดท้าย! ยอดซื้อรวมครบ 10,000 บาท รับคะแนนพิเศษสูงสุด 1,000 คะแนนทันที', locked: true, evidenceUrl: null },
    ],
  },
  'act-002': {
    ...MOCK['not-joined'][0],
    steps: [
      { id: 'step-101', title: 'ขั้นที่ 1: สั่งซื้อสินค้าใหม่', dateRange: '01 เม.ย. - 10 เม.ย. 2567', description: 'สั่งซื้อสินค้าใหม่จากแคตาล็อกเดือนเมษายน ขั้นต่ำ 500 บาท', locked: true, evidenceUrl: null },
      { id: 'step-102', title: 'ขั้นที่ 2: ซื้อครบ 1,000 บาท', dateRange: '11 เม.ย. - 20 เม.ย. 2567', description: 'เพิ่มยอดสั่งซื้อให้ครบ 1,000 บาทภายในช่วงเวลาที่กำหนด', locked: true, evidenceUrl: null },
      { id: 'step-103', title: 'ขั้นที่ 3: ซื้อครบ 1,500 บาท', dateRange: '21 เม.ย. - 25 เม.ย. 2567', description: 'ยอดสั่งซื้อรวมครบ 1,500 บาท ถ่ายภาพใบเสร็จเป็นหลักฐาน', locked: true, evidenceUrl: null },
      { id: 'step-104', title: 'ขั้นที่ 4: ซื้อครบ 2,000 บาท', dateRange: '26 เม.ย. - 30 เม.ย. 2567', description: 'ยอดสั่งซื้อรวมครบ 2,000 บาท รับ 200 คะแนนพิเศษทันที!', locked: true, evidenceUrl: null },
    ],
  },
  'act-003': {
    ...MOCK.ended[0],
    steps: [
      { id: 'step-201', title: 'ขั้นที่ 1: ซื้อสินค้าสงกรานต์', dateRange: '01 เม.ย. - 05 เม.ย. 2567', description: 'ซื้อสินค้าในธีมสงกรานต์ครบ 1,000 บาท', locked: false, evidenceUrl: null },
      { id: 'step-202', title: 'ขั้นที่ 2: ซื้อครบ 3,000 บาท', dateRange: '06 เม.ย. - 10 เม.ย. 2567', description: 'เพิ่มยอดซื้อรวมให้ครบ 3,000 บาท', locked: false, evidenceUrl: null },
      { id: 'step-203', title: 'ขั้นที่ 3: ซื้อครบ 5,000 บาท', dateRange: '11 เม.ย. - 15 เม.ย. 2567', description: 'ยอดซื้อรวมครบ 5,000 บาท รับ 750 คะแนน', locked: false, evidenceUrl: null },
      { id: 'step-204', title: 'ขั้นที่ 4: โบนัสพิเศษ', dateRange: '11 เม.ย. - 15 เม.ย. 2567', description: 'ซื้อครบ 8,000 บาท รับโบนัส 250 คะแนนเพิ่มเติม', locked: false, evidenceUrl: null },
    ],
  },
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const apiFetch = async (path) => {
  const res = await axios.get(`${API_BASE}${path}`);
  return res.data;
};

const useActivityStore = create((set, get) => ({
  joinedActivities: [],
  notJoinedActivities: [],
  endedActivities: [],
  currentActivity: null,
  uploadStates: {},
  loading: false,
  error: null,
  activeTab: 'joined',
  showSuccess: false,
  successActivityId: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  fetchAllActivities: async () => {
    set({ loading: true, error: null });
    try {
      const [j, nj, e] = await Promise.all([
        apiFetch('/api/activities?status=joined'),
        apiFetch('/api/activities?status=not-joined'),
        apiFetch('/api/activities?status=ended'),
      ]);
      set({
        joinedActivities: j.activities,
        notJoinedActivities: nj.activities,
        endedActivities: e.activities,
      });
    } catch {
      // API unavailable — use mock data for demo
      set({
        joinedActivities: MOCK.joined,
        notJoinedActivities: MOCK['not-joined'],
        endedActivities: MOCK.ended,
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchActivityDetail: async (id) => {
    set({ loading: true, error: null, currentActivity: null });
    try {
      const data = await apiFetch(`/api/activities/${id}`);
      const activity = data.activity;
      set({ currentActivity: activity });
      const uploadStates = {};
      activity.steps.forEach((step) => {
        uploadStates[step.id] = { uploading: false, uploaded: !!step.evidenceUrl, imageUrl: step.evidenceUrl || null, error: null };
      });
      set({ uploadStates });
    } catch {
      // API unavailable — use mock detail
      const activity = MOCK_DETAIL[id];
      if (activity) {
        set({ currentActivity: activity });
        const uploadStates = {};
        activity.steps.forEach((step) => {
          uploadStates[step.id] = { uploading: false, uploaded: false, imageUrl: null, error: null };
        });
        set({ uploadStates });
      }
    } finally {
      set({ loading: false });
    }
  },

  joinActivity: async (activityId) => {
    try {
      await axios.post(`${API_BASE}/api/activity/join`, { activityId });
    } catch { /* mock: silent */ }
    const { notJoinedActivities, joinedActivities } = get();
    const activity = notJoinedActivities.find((a) => a.id === activityId);
    if (activity) {
      set({
        notJoinedActivities: notJoinedActivities.filter((a) => a.id !== activityId),
        joinedActivities: [...joinedActivities, { ...activity, status: 'joined', currentStep: 1 }],
      });
    }
  },

  uploadEvidence: async (activityId, stepId, file) => {
    set((state) => ({
      uploadStates: { ...state.uploadStates, [stepId]: { ...state.uploadStates[stepId], uploading: true, error: null } },
    }));
    try {
      const formData = new FormData();
      formData.append('activityId', activityId);
      formData.append('stepId', stepId);
      formData.append('evidence', file);
      const res = await axios.post(`${API_BASE}/api/activity/upload-evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = res.data.imageUrl;
      set((state) => ({
        uploadStates: { ...state.uploadStates, [stepId]: { uploading: false, uploaded: true, imageUrl, error: null } },
      }));
      get()._checkAllUploaded(activityId, stepId, imageUrl);
    } catch {
      // Demo mode: simulate success with local preview URL
      const imageUrl = URL.createObjectURL(file);
      set((state) => ({
        uploadStates: { ...state.uploadStates, [stepId]: { uploading: false, uploaded: true, imageUrl, error: null } },
      }));
      get()._checkAllUploaded(activityId, stepId, imageUrl);
    }
  },

  _checkAllUploaded: (activityId, stepId, imageUrl) => {
    const { currentActivity, uploadStates } = get();
    if (!currentActivity) return;
    const newStates = { ...uploadStates, [stepId]: { uploading: false, uploaded: true, imageUrl, error: null } };
    const unlockedSteps = currentActivity.steps.filter((s) => !s.locked);
    if (unlockedSteps.every((s) => newStates[s.id]?.uploaded)) {
      const nextStep = Math.min(currentActivity.currentStep + 1, currentActivity.steps.length);
      set((state) => ({ currentActivity: { ...state.currentActivity, currentStep: nextStep }, showSuccess: true, successActivityId: activityId }));
    }
  },

  hideSuccess: () => set({ showSuccess: false, successActivityId: null }),
}));

export default useActivityStore;
