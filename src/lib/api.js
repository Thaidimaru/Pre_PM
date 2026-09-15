/**
 * Centralized API service for NBTC Microwave Pre-PM Survey Control Room
 * Provides dual-layer persistence (Serverless backend + LocalStorage client cache)
 */

const LOCAL_SURVEYS_KEY = 'nbtc_pre_pm_saved_surveys';

export function getLocalSurveys() {
  try {
    const raw = localStorage.getItem(LOCAL_SURVEYS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to read local surveys from localStorage:', e);
    return [];
  }
}

export function saveLocalSurvey(survey) {
  try {
    const current = getLocalSurveys();
    const index = current.findIndex(
      (s) => s.recordId === survey.recordId || (s.station && s.station === survey.station && s.savedAt === survey.savedAt)
    );

    if (index >= 0) {
      current[index] = { ...current[index], ...survey };
    } else {
      current.unshift(survey);
    }

    // Keep up to 50 recent surveys
    const trimmed = current.slice(0, 50);

    try {
      localStorage.setItem(LOCAL_SURVEYS_KEY, JSON.stringify(trimmed));
    } catch (quotaErr) {
      // If quota exceeded, strip base64 dataUrl from older surveys
      console.warn('localStorage quota exceeded, trimming older photos...');
      const light = trimmed.map((s, idx) => {
        if (idx === 0) return s;
        return {
          ...s,
          photos: (s.photos || []).map((p) => ({
            id: p.id,
            name: p.name,
            contentType: p.contentType,
            url: p.url && !p.url.startsWith('data:') ? p.url : '',
          })),
        };
      });
      localStorage.setItem(LOCAL_SURVEYS_KEY, JSON.stringify(light));
    }
  } catch (e) {
    console.warn('Failed to save survey to localStorage:', e);
  }
}

function mergeDashboardWithLocal(serverData, localSurveys) {
  const base = serverData || {
    updatedAt: new Date().toISOString(),
    stats: { surveys: 0, stations: 197, allowed: 0, denied: 0 },
    provinces: [],
    recent: [],
  };

  const surveyMap = new Map();
  const serverRecent = Array.isArray(base.recent) ? base.recent : [];

  // Register server surveys first
  for (const s of serverRecent) {
    if (s && (s.recordId || s.station)) {
      surveyMap.set(s.recordId || s.station, s);
    }
  }

  // Merge client local surveys
  for (const ls of localSurveys) {
    if (!ls) continue;
    const key = ls.recordId || ls.station;
    if (!surveyMap.has(key)) {
      surveyMap.set(key, ls);
    } else {
      const existing = surveyMap.get(key);
      surveyMap.set(key, {
        ...existing,
        ...ls,
        fields: { ...(existing.fields || {}), ...(ls.fields || {}) },
        photos: ls.photos && ls.photos.length > 0 ? ls.photos : existing.photos || [],
      });
    }
  }

  const allSurveys = Array.from(surveyMap.values()).sort((a, b) =>
    String(b.savedAt || '').localeCompare(String(a.savedAt || ''))
  );

  let allowed = 0;
  let denied = 0;
  const provinceCounts = new Map();

  for (const s of allSurveys) {
    const permit = s.permit || s.fields?.permit;
    if (permit === 'อนุญาต' || permit === 'on') allowed++;
    else if (permit === 'ไม่อนุญาต') denied++;

    const prov = s.province || s.fields?.province || 'ไม่ระบุจังหวัด';
    provinceCounts.set(prov, (provinceCounts.get(prov) || 0) + 1);
  }

  const finalAllowed = Math.max(base.stats?.allowed || 0, allowed);
  const finalDenied = Math.max(base.stats?.denied || 0, denied);
  const totalCount = Math.max(base.stats?.surveys || 0, allSurveys.length);

  for (const p of base.provinces || []) {
    if (!provinceCounts.has(p.name)) {
      provinceCounts.set(p.name, p.count);
    } else {
      provinceCounts.set(p.name, Math.max(provinceCounts.get(p.name), p.count));
    }
  }

  const sortedProvinces = Array.from(provinceCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    updatedAt: new Date().toISOString(),
    stats: {
      surveys: totalCount,
      stations: base.stats?.stations || 197,
      allowed: finalAllowed,
      denied: finalDenied,
    },
    provinces: sortedProvinces,
    recent: allSurveys,
  };
}

export async function fetchDashboardData() {
  let serverData = null;
  try {
    const res = await fetch('/api/dashboard', { cache: 'no-store' });
    if (res.ok) {
      serverData = await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch dashboard metrics from server:', err);
  }

  const localSurveys = getLocalSurveys();
  const merged = mergeDashboardWithLocal(serverData, localSurveys);

  // Background sync: If server has no surveys but client has local surveys, attempt to re-sync them
  if (serverData && serverData.stats?.surveys === 0 && localSurveys.length > 0) {
    Promise.all(
      localSurveys.slice(0, 5).map((s) => {
        return fetch('/api/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: s.fields || {},
            photos: (s.photos || []).map((p) => ({
              name: p.name,
              type: p.contentType,
              data: p.dataUrl && p.dataUrl.startsWith('data:') ? p.dataUrl.split(',')[1] : '',
            })),
          }),
        }).catch(() => null);
      })
    ).catch(() => {});
  }

  return merged;
}

export async function fetchStations(token = '') {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch('/api/database', { headers }).catch(() => null);

  if (!res || res.status === 404) {
    res = await fetch('/database', { headers });
  }

  if (!res.ok) {
    throw new Error(`Failed to load station directory (status ${res.status})`);
  }
  return res.json();
}

export async function loginUser(password = '') {
  return { token: 'public', ok: true };
}

export async function submitSurvey(arg1, arg2, arg3) {
  // Support both submitSurvey(fields, photos) and submitSurvey(token, fields, photos)
  let token = '';
  let fields = {};
  let photos = [];

  if (typeof arg1 === 'string') {
    token = arg1;
    fields = arg2 || {};
    photos = arg3 || [];
  } else {
    fields = arg1 || {};
    photos = arg2 || [];
  }

  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let serverResult = null;
  let serverError = null;

  try {
    let res = await fetch('/api/save', {
      method: 'POST',
      headers,
      body: JSON.stringify({ fields, photos }),
    }).catch(() => null);

    if (!res || res.status === 404) {
      res = await fetch('/save', {
        method: 'POST',
        headers,
        body: JSON.stringify({ fields, photos }),
      }).catch(() => null);
    }

    if (res && res.ok) {
      serverResult = await res.json();
    } else if (res) {
      const data = await res.json().catch(() => ({}));
      serverError = data.message || data.error || 'บันทึกข้อมูลไม่สำเร็จ';
    }
  } catch (err) {
    serverError = err.message;
  }

  // Construct local survey snapshot to ensure instant display on Dashboard
  const recordId =
    serverResult?.recordId ||
    `PM-${new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 15)}-${Math.random().toString(16).slice(2, 6)}`;
  const savedAt = serverResult?.savedAt || new Date().toISOString();
  const stationName = fields.station || fields.stationSelect || 'ไม่ระบุสถานี';
  const province = fields.province || '';
  const permit = fields.permit === 'on' ? 'อนุญาต' : fields.permit || 'ยังไม่ระบุ';

  const formattedPhotos = (photos || []).map((p, idx) => ({
    id: idx + 1,
    name: p.name || `photo_${idx + 1}.jpg`,
    contentType: p.type || 'image/jpeg',
    size: p.data ? Math.round((p.data.length * 3) / 4) : 0,
    url: p.data ? `data:${p.type || 'image/jpeg'};base64,${p.data}` : `/photos/${encodeURIComponent(p.name)}`,
    dataUrl: p.data ? `data:${p.type || 'image/jpeg'};base64,${p.data}` : null,
  }));

  const localSurvey = {
    recordId,
    savedAt,
    station: stationName,
    province,
    permit,
    fields: {
      ...fields,
      station: stationName,
      province,
      permit,
      photos: formattedPhotos,
    },
    photos: formattedPhotos,
  };

  saveLocalSurvey(localSurvey);

  if (serverError && !serverResult) {
    console.warn('Server save had issue, saved to local cache:', serverError);
  }

  return serverResult || { saved: true, recordId, savedAt };
}
