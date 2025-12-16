import type { HealthMilestone, Badge, TriggerType } from '../types'

// 건강 마일스톤 (분 단위)
export const HEALTH_MILESTONES: Omit<HealthMilestone, 'achieved'>[] = [
  {
    id: '20min',
    timeInMinutes: 20,
    title: '혈압 정상화',
    description: '혈압과 맥박이 정상으로 돌아오기 시작합니다',
    icon: 'Heart',
  },
  {
    id: '8hour',
    timeInMinutes: 8 * 60,
    title: '산소 정상화',
    description: '혈중 산소 수치가 정상으로 회복됩니다',
    icon: 'Wind',
  },
  {
    id: '24hour',
    timeInMinutes: 24 * 60,
    title: '심장 보호',
    description: '심장마비 위험이 감소하기 시작합니다',
    icon: 'HeartPulse',
  },
  {
    id: '48hour',
    timeInMinutes: 48 * 60,
    title: '감각 회복',
    description: '미각과 후각이 회복되기 시작합니다',
    icon: 'Sparkles',
  },
  {
    id: '72hour',
    timeInMinutes: 72 * 60,
    title: '호흡 개선',
    description: '기관지가 이완되어 호흡이 편해집니다',
    icon: 'Leaf',
  },
  {
    id: '1week',
    timeInMinutes: 7 * 24 * 60,
    title: '니코틴 배출',
    description: '니코틴 갈망이 줄어들기 시작합니다',
    icon: 'Brain',
  },
  {
    id: '2week',
    timeInMinutes: 14 * 24 * 60,
    title: '순환 개선',
    description: '혈액순환이 개선되고 걷기가 편해집니다',
    icon: 'Activity',
  },
  {
    id: '1month',
    timeInMinutes: 30 * 24 * 60,
    title: '폐 기능 향상',
    description: '폐 기능이 30% 향상됩니다',
    icon: 'TrendingUp',
  },
  {
    id: '3month',
    timeInMinutes: 90 * 24 * 60,
    title: '심폐 기능',
    description: '심폐 기능이 크게 개선됩니다',
    icon: 'Smile',
  },
  {
    id: '6month',
    timeInMinutes: 180 * 24 * 60,
    title: '기침 감소',
    description: '기침과 숨가쁨이 크게 줄어듭니다',
    icon: 'Shield',
  },
  {
    id: '1year',
    timeInMinutes: 365 * 24 * 60,
    title: '심장병 위험 절반',
    description: '심장병 위험이 50% 감소합니다',
    icon: 'Star',
  },
  {
    id: '5year',
    timeInMinutes: 5 * 365 * 24 * 60,
    title: '뇌졸중 위험 정상',
    description: '뇌졸중 위험이 비흡연자 수준이 됩니다',
    icon: 'Award',
  },
  {
    id: '10year',
    timeInMinutes: 10 * 365 * 24 * 60,
    title: '폐암 위험 절반',
    description: '폐암 위험이 50% 감소합니다',
    icon: 'Trophy',
  },
]

// 배지 시스템
export const BADGES: Omit<Badge, 'achieved' | 'achievedAt'>[] = [
  {
    id: 'start',
    name: '첫 걸음',
    description: '금연을 시작했습니다',
    icon: 'Flag',
    color: '#9CA3AF',
    daysRequired: 0,
  },
  {
    id: '1day',
    name: '하루 완주',
    description: '24시간 금연 성공',
    icon: 'Circle',
    color: '#CD7F32',
    daysRequired: 1,
  },
  {
    id: '3day',
    name: '3일 고비 극복',
    description: '가장 힘든 3일을 이겨냈습니다',
    icon: 'Flame',
    color: '#F59E0B',
    daysRequired: 3,
  },
  {
    id: '1week',
    name: '일주일',
    description: '7일 금연 달성',
    icon: 'Medal',
    color: '#C0C0C0',
    daysRequired: 7,
  },
  {
    id: '2week',
    name: '2주',
    description: '14일 금연 달성',
    icon: 'Medal',
    color: '#60A5FA',
    daysRequired: 14,
  },
  {
    id: '1month',
    name: '한 달',
    description: '30일 금연 달성',
    icon: 'Award',
    color: '#FFD700',
    daysRequired: 30,
  },
  {
    id: '2month',
    name: '두 달',
    description: '60일 금연 달성',
    icon: 'Award',
    color: '#34D399',
    daysRequired: 60,
  },
  {
    id: '3month',
    name: '석 달',
    description: '90일 금연 달성',
    icon: 'Gem',
    color: '#10B981',
    daysRequired: 90,
  },
  {
    id: '6month',
    name: '반 년',
    description: '180일 금연 달성',
    icon: 'Crown',
    color: '#8B5CF6',
    daysRequired: 180,
  },
  {
    id: '1year',
    name: '일 년',
    description: '365일 금연 달성',
    icon: 'Trophy',
    color: '#E5E4E2',
    daysRequired: 365,
  },
]

// 트리거 라벨
export const TRIGGER_LABELS: Record<TriggerType, string> = {
  after_meal: '식후',
  with_coffee: '커피와 함께',
  stress: '스트레스',
  boredom: '심심할 때',
  social: '사교 자리',
  morning: '아침 기상 후',
  alcohol: '음주 시',
  other: '기타',
}

// 트리거 아이콘
export const TRIGGER_ICONS: Record<TriggerType, string> = {
  after_meal: 'UtensilsCrossed',
  with_coffee: 'Coffee',
  stress: 'Frown',
  boredom: 'Clock',
  social: 'Users',
  morning: 'Sunrise',
  alcohol: 'Wine',
  other: 'MoreHorizontal',
}

// 기분 라벨
export const MOOD_LABELS = {
  great: '아주 좋음',
  good: '좋음',
  okay: '보통',
  bad: '안 좋음',
  terrible: '최악',
}

// 기분 이모지 (아이콘 대체)
export const MOOD_ICONS = {
  great: 'Laugh',
  good: 'Smile',
  okay: 'Meh',
  bad: 'Frown',
  terrible: 'Angry',
}

// 동기부여 메시지
export const MOTIVATIONAL_MESSAGES = [
  '오늘도 금연을 선택한 당신이 자랑스럽습니다!',
  '한 번의 충동을 이기면, 평생의 건강을 얻습니다.',
  '담배 없이도 충분히 행복할 수 있어요.',
  '지금 이 순간, 당신의 폐가 회복되고 있습니다.',
  '포기하지 마세요. 당신은 할 수 있습니다!',
  '금연은 당신이 줄 수 있는 가장 큰 선물입니다.',
  '오늘 하루도 건강하게 보내세요!',
  '매일 조금씩 더 강해지고 있어요.',
  '충동은 일시적이지만, 건강은 영원합니다.',
  '당신의 결심이 미래를 바꾸고 있습니다.',
]

// 호흡법 단계
export const BREATHING_STEPS = [
  { phase: 'inhale', duration: 4, label: '숨을 들이쉬세요' },
  { phase: 'hold', duration: 7, label: '숨을 참으세요' },
  { phase: 'exhale', duration: 8, label: '천천히 내쉬세요' },
] as const

// 담배 종류 라벨
export const TOBACCO_TYPE_LABELS = {
  cigarette: '일반 담배',
  liquid_ecig: '액상 전자담배',
  heated_ecig: '궐련형 전자담배',
}

// 담배 종류 아이콘
export const TOBACCO_TYPE_ICONS = {
  cigarette: 'Cigarette',
  liquid_ecig: 'Cloud',
  heated_ecig: 'Flame',
}
