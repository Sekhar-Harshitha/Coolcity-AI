export const BADGES = [
  { id: 'starter', label: 'Green Starter', minPoints: 0, icon: '🌱', color: '--mint-200', desc: 'First Report' },
  { id: 'guardian', label: 'Tree Guardian', minPoints: 50, icon: '🌳', color: '--mint-300', desc: '5 Reports' },
  { id: 'cooler', label: 'City Cooler', minPoints: 100, icon: '🏙️', color: '--sky-200', desc: '10 Reports' },
  { id: 'champion', label: 'Climate Champion', minPoints: 200, icon: '🌍', color: '--lavender-200', desc: '20 Reports' },
  { id: 'hunter', label: 'Heat Hunter', minPoints: 500, icon: '🔥', color: '--peach-200', desc: 'Critical Heat Detection' },
];

export function getBadge(points: number) {
  return BADGES.slice().reverse().find(b => points >= b.minPoints) || BADGES[0];
}

export function getNextBadge(points: number) {
  return BADGES.find(b => b.minPoints > points) || null;
}
