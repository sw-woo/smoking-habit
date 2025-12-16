// 담배 종류
export type TobaccoType = 'cigarette' | 'liquid_ecig' | 'heated_ecig'

// 금연 모드
export type QuitMode = 'cold_turkey' | 'gradual'

// 기분 타입
export type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'terrible'

// 트리거 타입
export type TriggerType =
  | 'after_meal'
  | 'with_coffee'
  | 'stress'
  | 'boredom'
  | 'social'
  | 'morning'
  | 'alcohol'
  | 'other'

// 일반 담배 설정
export interface CigaretteConfig {
  cigarettesPerDay: number
  pricePerPack: number
  cigarettesPerPack: number
}

// 액상 전자담배 설정
export interface LiquidEcigConfig {
  puffsPerDay: number
  liquidVolume: number
  liquidPrice: number
  expectedDays: number
  nicotineContent?: number
}

// 궐련형 전자담배 설정
export interface HeatedEcigConfig {
  sticksPerDay: number
  pricePerPack: number
}

// 점진적 금연 계획
export interface GradualPlan {
  targetQuitDate: string
  currentPhase: number
  totalPhases: number
  dailyLimit: number
  reductionType: 'count' | 'nicotine'
}

// 흡연 기록
export interface SmokingLog {
  id: string
  timestamp: string
  tobaccoType: TobaccoType
  amount: number
  trigger?: TriggerType
  mood?: MoodType
}

// 충동 기록
export interface CravingLog {
  id: string
  timestamp: string
  overcome: boolean
  duration: number
  trigger?: TriggerType
  copingMethod?: string
}

// 체크인 기록
export interface CheckInLog {
  date: string
  mood: MoodType
  cravingLevel: number
  notes?: string
  smokeFree: boolean
}

// 트리거 기록
export interface TriggerLog {
  id: string
  timestamp: string
  trigger: TriggerType
  situation: string
  outcome: 'smoked' | 'resisted'
}

// 알림 설정
export interface NotificationSettings {
  enabled: boolean
  dailyCheckIn: string
  motivational: boolean
}

// 앱 설정
export interface AppSettings {
  darkMode: boolean
  largeText: boolean
  notifications: NotificationSettings
}

// 사용자 데이터
export interface UserData {
  // 기본 설정
  quitMode: QuitMode
  quitDate: string
  tobaccoTypes: TobaccoType[]

  // 담배 종류별 설정
  cigaretteConfig?: CigaretteConfig
  liquidEcigConfig?: LiquidEcigConfig
  heatedEcigConfig?: HeatedEcigConfig

  // 점진적 금연 설정
  gradualPlan?: GradualPlan

  // 기록들
  smokingLogs: SmokingLog[]
  cravingLogs: CravingLog[]
  checkInLogs: CheckInLog[]
  triggerLogs: TriggerLog[]

  // 설정
  settings: AppSettings

  // 백업
  lastBackup?: string

  // 버전
  version: string
}

// 건강 마일스톤
export interface HealthMilestone {
  id: string
  timeInMinutes: number
  title: string
  description: string
  icon: string
  achieved: boolean
}

// 배지
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  daysRequired: number
  achieved: boolean
  achievedAt?: string
}

// 계산된 통계
export interface ComputedStats {
  elapsedMs: number
  elapsedDays: number
  elapsedHours: number
  elapsedMinutes: number
  cigarettesNotSmoked: number
  moneySaved: number
  lifeRegainedMinutes: number
  currentHealthMilestone: HealthMilestone | null
  nextHealthMilestone: HealthMilestone | null
  healthProgress: number
  earnedBadges: Badge[]
  nextBadge: Badge | null
}
