import { getBadge, getNextBadge } from './badgeSystem';

export const ACTIONS = {
  ADOPT_ZONE: { points: 50, label: 'Zone Adopted', icon: '🌍', cooldown: null },
  REPORT_TREE_PLANTED: { points: 20, label: 'Tree Reported', icon: '🌱', cooldown: 24 },
  SATELLITE_CONFIRMS_COOLING: { points: 100, label: 'Cooling Confirmed!', icon: '❄️', cooldown: null },
  UPLOAD_CITIZEN_PHOTO: { points: 15, label: 'Photo Submitted', icon: '📸', cooldown: 6 },
  SHARE_ANALYSIS: { points: 10, label: 'Analysis Shared', icon: '📤', cooldown: 12 },
  DAILY_LOGIN: { points: 5, label: 'Daily Check-in', icon: '☀️', cooldown: 20 },
  REPORT_HEAT_ANOMALY: { points: 30, label: 'Alert Reported', icon: '🌡️', cooldown: 8 },
  INVITE_FRIEND: { points: 25, label: 'Friend Invited', icon: '👥', cooldown: null },
  COMPLETE_ZONE_SURVEY: { points: 40, label: 'Survey Done', icon: '📋', cooldown: 168 },
  STREAK_7_DAYS: { points: 75, label: '7-Day Streak!', icon: '🔥', cooldown: null },
  STREAK_30_DAYS: { points: 300, label: '30-Day Legend!', icon: '⚡', cooldown: null },
};

export async function openGamificationDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('gamification-db', 1);
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('events')) {
        const store = db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
        store.createIndex('action', 'action', { unique: false });
      }
    };
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e: any) => reject(e.target.error);
  });
}

export async function awardPoints(userId: string, actionKey: keyof typeof ACTIONS, metadata: any = {}) {
  const action = ACTIONS[actionKey];
  if (!action) return null;

  const db = await openGamificationDB();
  const tx = db.transaction('events', 'readwrite');
  const store = tx.objectStore('events');

  // Cooldown check via localStorage
  if (action.cooldown) {
    const lastTime = localStorage.getItem(`cooldown_${actionKey}`);
    if (lastTime) {
      const hoursSince = (Date.now() - parseInt(lastTime)) / (1000 * 60 * 60);
      if (hoursSince < action.cooldown) return null; // Cooldown active
    }
  }

  // Calculate Streak for login
  let currentStreak = parseInt(localStorage.getItem('streakDays') || '0');
  let newStreak = currentStreak;
  let streakBonusEarned = null;

  if (actionKey === 'DAILY_LOGIN') {
    const lastLogin = parseInt(localStorage.getItem('lastLogin') || '0');
    const daysSince = (Date.now() - lastLogin) / (1000 * 60 * 60 * 24);
    
    if (daysSince > 1.5) {
      newStreak = 1; // reset streak if > 1.5 days
    } else if (daysSince > 0.5) {
      newStreak += 1;
    }
    
    localStorage.setItem('streakDays', newStreak.toString());
    localStorage.setItem('lastLogin', Date.now().toString());

    if (newStreak === 7) streakBonusEarned = 'STREAK_7_DAYS';
    if (newStreak === 30) streakBonusEarned = 'STREAK_30_DAYS';
  }

  const eventsToAdd = [{
    action: actionKey,
    points: action.points,
    timestamp: Date.now(),
    metadata
  }];

  if (streakBonusEarned) {
    eventsToAdd.push({
      action: streakBonusEarned as keyof typeof ACTIONS,
      points: ACTIONS[streakBonusEarned as keyof typeof ACTIONS].points,
      timestamp: Date.now(),
      metadata: { auto: true }
    });
  }

  eventsToAdd.forEach(ev => store.add(ev));

  if (action.cooldown) {
    localStorage.setItem(`cooldown_${actionKey}`, Date.now().toString());
  }

  await new Promise(res => tx.oncomplete = res);

  // Recompute total profile
  const profile = await getUserProfile();
  return {
    newTotal: profile.totalPoints,
    pointsEarned: eventsToAdd.reduce((sum, e) => sum + e.points, 0),
    newBadge: profile.currentBadge,
    streakDay: newStreak
  };
}

export async function getUserProfile() {
  const db = await openGamificationDB();
  const tx = db.transaction('events', 'readonly');
  const store = tx.objectStore('events');

  return new Promise<any>((resolve) => {
    const request = store.getAll();
    request.onsuccess = (e: any) => {
      const events = e.target.result;
      const totalPoints = events.reduce((sum: number, ev: any) => sum + ev.points, 0);
      const currentBadge = getBadge(totalPoints);
      const nextBadge = getNextBadge(totalPoints);
      
      const progressToNext = nextBadge 
        ? Math.min(100, ((totalPoints - currentBadge.minPoints) / (nextBadge.minPoints - currentBadge.minPoints)) * 100)
        : 100;

      const profile = {
        totalPoints,
        currentBadge,
        nextBadge,
        progressToNext,
        streakDays: parseInt(localStorage.getItem('streakDays') || '0'),
        actionsCount: events.length,
        recentActivity: events.slice(-10).reverse()
      };
      
      localStorage.setItem('cachedProfile', JSON.stringify(profile));
      resolve(profile);
    };
  });
}
