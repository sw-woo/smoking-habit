import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  UserData,
  TobaccoType,
  QuitMode,
  CigaretteConfig,
  LiquidEcigConfig,
  HeatedEcigConfig,
  GradualPlan,
  SmokingLog,
  CravingLog,
  CheckInLog,
  TriggerLog,
  ComputedStats,
  HealthMilestone,
  Badge,
} from '../types'
import { HEALTH_MILESTONES, BADGES } from '../utils/constants'

interface UserStore {
  userData: UserData | null
  isLoading: boolean

  // Actions
  loadUserData: () => void
  saveUserData: (data: UserData) => void
  clearUserData: () => void

  // Onboarding
  setQuitMode: (mode: QuitMode) => void
  setTobaccoTypes: (types: TobaccoType[]) => void
  setCigaretteConfig: (config: CigaretteConfig) => void
  setLiquidEcigConfig: (config: LiquidEcigConfig) => void
  setHeatedEcigConfig: (config: HeatedEcigConfig) => void
  setQuitDate: (date: string) => void
  setGradualPlan: (plan: GradualPlan) => void
  completeOnboarding: () => void

  // Logs
  addSmokingLog: (log: Omit<SmokingLog, 'id'>) => void
  addCravingLog: (log: Omit<CravingLog, 'id'>) => void
  addCheckInLog: (log: CheckInLog) => void
  addTriggerLog: (log: Omit<TriggerLog, 'id'>) => void

  // Settings
  toggleDarkMode: () => void
  toggleLargeText: () => void
  updateNotificationSettings: (settings: Partial<UserData['settings']['notifications']>) => void

  // Computed
  getComputedStats: () => ComputedStats | null

  // Restart
  restartQuit: (newQuitDate: string) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

const getDefaultUserData = (): Partial<UserData> => ({
  smokingLogs: [],
  cravingLogs: [],
  checkInLogs: [],
  triggerLogs: [],
  settings: {
    darkMode: false,
    largeText: false,
    notifications: {
      enabled: true,
      dailyCheckIn: '09:00',
      motivational: true,
    },
  },
  version: '1.0.0',
})

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      userData: null,
      isLoading: true,

      loadUserData: () => {
        set({ isLoading: false })
      },

      saveUserData: (data) => {
        set({ userData: data })
      },

      clearUserData: () => {
        set({ userData: null })
      },

      setQuitMode: (mode) => {
        set((state) => ({
          userData: {
            ...getDefaultUserData(),
            ...state.userData,
            quitMode: mode,
          } as UserData,
        }))
      },

      setTobaccoTypes: (types) => {
        set((state) => ({
          userData: {
            ...state.userData,
            tobaccoTypes: types,
          } as UserData,
        }))
      },

      setCigaretteConfig: (config) => {
        set((state) => ({
          userData: {
            ...state.userData,
            cigaretteConfig: config,
          } as UserData,
        }))
      },

      setLiquidEcigConfig: (config) => {
        set((state) => ({
          userData: {
            ...state.userData,
            liquidEcigConfig: config,
          } as UserData,
        }))
      },

      setHeatedEcigConfig: (config) => {
        set((state) => ({
          userData: {
            ...state.userData,
            heatedEcigConfig: config,
          } as UserData,
        }))
      },

      setQuitDate: (date) => {
        set((state) => ({
          userData: {
            ...state.userData,
            quitDate: date,
          } as UserData,
        }))
      },

      setGradualPlan: (plan) => {
        set((state) => ({
          userData: {
            ...state.userData,
            gradualPlan: plan,
          } as UserData,
        }))
      },

      completeOnboarding: () => {
        const state = get()
        if (state.userData) {
          set({
            userData: {
              ...getDefaultUserData(),
              ...state.userData,
            } as UserData,
          })
        }
      },

      addSmokingLog: (log) => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              smokingLogs: [...state.userData.smokingLogs, { ...log, id: generateId() }],
            },
          }
        })
      },

      addCravingLog: (log) => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              cravingLogs: [...state.userData.cravingLogs, { ...log, id: generateId() }],
            },
          }
        })
      },

      addCheckInLog: (log) => {
        set((state) => {
          if (!state.userData) return state
          // 같은 날짜 기록이 있으면 업데이트
          const existingIndex = state.userData.checkInLogs.findIndex(
            (l) => l.date === log.date
          )
          const newLogs = [...state.userData.checkInLogs]
          if (existingIndex >= 0) {
            newLogs[existingIndex] = log
          } else {
            newLogs.push(log)
          }
          return {
            userData: {
              ...state.userData,
              checkInLogs: newLogs,
            },
          }
        })
      },

      addTriggerLog: (log) => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              triggerLogs: [...state.userData.triggerLogs, { ...log, id: generateId() }],
            },
          }
        })
      },

      toggleDarkMode: () => {
        set((state) => {
          if (!state.userData) return state
          const newDarkMode = !state.userData.settings.darkMode
          // DOM에 다크모드 클래스 토글
          document.documentElement.classList.toggle('dark', newDarkMode)
          return {
            userData: {
              ...state.userData,
              settings: {
                ...state.userData.settings,
                darkMode: newDarkMode,
              },
            },
          }
        })
      },

      toggleLargeText: () => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              settings: {
                ...state.userData.settings,
                largeText: !state.userData.settings.largeText,
              },
            },
          }
        })
      },

      updateNotificationSettings: (settings) => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              settings: {
                ...state.userData.settings,
                notifications: {
                  ...state.userData.settings.notifications,
                  ...settings,
                },
              },
            },
          }
        })
      },

      getComputedStats: () => {
        const { userData } = get()
        if (!userData) return null

        const now = Date.now()
        const quitTime = new Date(userData.quitDate).getTime()
        const elapsedMs = Math.max(0, now - quitTime)

        const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60))
        const elapsedHours = Math.floor(elapsedMs / (1000 * 60 * 60))
        const elapsedDays = Math.floor(elapsedMs / (1000 * 60 * 60 * 24))

        // 안 핀 개비 수 계산
        let cigarettesNotSmoked = 0
        let dailyCost = 0

        if (userData.cigaretteConfig) {
          const { cigarettesPerDay, pricePerPack, cigarettesPerPack } = userData.cigaretteConfig
          cigarettesNotSmoked += (elapsedMs / (1000 * 60 * 60 * 24)) * cigarettesPerDay
          dailyCost += (cigarettesPerDay / cigarettesPerPack) * pricePerPack
        }

        if (userData.heatedEcigConfig) {
          const { sticksPerDay, pricePerPack } = userData.heatedEcigConfig
          cigarettesNotSmoked += (elapsedMs / (1000 * 60 * 60 * 24)) * sticksPerDay
          dailyCost += (sticksPerDay / 20) * pricePerPack
        }

        if (userData.liquidEcigConfig) {
          const { liquidPrice, expectedDays } = userData.liquidEcigConfig
          dailyCost += liquidPrice / expectedDays
        }

        // 절약 금액
        const moneySaved = Math.floor((elapsedMs / (1000 * 60 * 60 * 24)) * dailyCost)

        // 수명 회복 (담배 1개비 = 11분)
        const lifeRegainedMinutes = Math.floor(cigarettesNotSmoked * 11)

        // 건강 마일스톤
        const milestones: HealthMilestone[] = HEALTH_MILESTONES.map((m) => ({
          ...m,
          achieved: elapsedMinutes >= m.timeInMinutes,
        }))

        const achievedMilestones = milestones.filter((m) => m.achieved)
        const currentHealthMilestone = achievedMilestones[achievedMilestones.length - 1] || null
        const nextHealthMilestone = milestones.find((m) => !m.achieved) || null

        // 건강 진행률
        let healthProgress = 0
        if (nextHealthMilestone && currentHealthMilestone) {
          const current = currentHealthMilestone.timeInMinutes
          const next = nextHealthMilestone.timeInMinutes
          healthProgress = Math.min(100, ((elapsedMinutes - current) / (next - current)) * 100)
        } else if (currentHealthMilestone && !nextHealthMilestone) {
          healthProgress = 100
        }

        // 배지
        const badges: Badge[] = BADGES.map((b) => ({
          ...b,
          achieved: elapsedDays >= b.daysRequired,
          achievedAt: elapsedDays >= b.daysRequired ? new Date().toISOString() : undefined,
        }))

        const earnedBadges = badges.filter((b) => b.achieved)
        const nextBadge = badges.find((b) => !b.achieved) || null

        return {
          elapsedMs,
          elapsedDays,
          elapsedHours,
          elapsedMinutes,
          cigarettesNotSmoked: Math.floor(cigarettesNotSmoked),
          moneySaved,
          lifeRegainedMinutes,
          currentHealthMilestone,
          nextHealthMilestone,
          healthProgress,
          earnedBadges,
          nextBadge,
        }
      },

      restartQuit: (newQuitDate) => {
        set((state) => {
          if (!state.userData) return state
          return {
            userData: {
              ...state.userData,
              quitDate: newQuitDate,
              // 기록은 보존 (통계용)
            },
          }
        })
      },
    }),
    {
      name: 'smoking-habit-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userData: state.userData }),
    }
  )
)
