import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Check } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import { HEALTH_MILESTONES } from '../utils/constants'

export default function Health() {
  const navigate = useNavigate()
  const { getComputedStats } = useUserStore()
  const [stats, setStats] = useState(getComputedStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getComputedStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [getComputedStats])

  if (!stats) return null

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>
    return icons[iconName] || LucideIcons.Heart
  }

  const formatTimeRemaining = (targetMinutes: number, currentMinutes: number) => {
    const remaining = targetMinutes - currentMinutes
    if (remaining <= 0) return null

    const days = Math.floor(remaining / (24 * 60))
    const hours = Math.floor((remaining % (24 * 60)) / 60)
    const mins = remaining % 60

    if (days > 0) return `${days}일 ${hours}시간 남음`
    if (hours > 0) return `${hours}시간 ${mins}분 남음`
    return `${mins}분 남음`
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--color-background)] z-10 px-6 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            건강 회복 타임라인
          </h1>
        </div>
      </div>

      <div className="p-6 max-w-lg mx-auto">
        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-5 text-white mb-8"
        >
          <p className="text-teal-100 text-sm mb-1">현재 상태</p>
          <p className="text-2xl font-bold mb-2">
            {stats.currentHealthMilestone?.title || '금연 시작'}
          </p>
          <p className="text-teal-100">
            {stats.currentHealthMilestone?.description || '몸이 회복되기 시작합니다'}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-slate-700" />

          {HEALTH_MILESTONES.map((milestone, index) => {
            const isAchieved = stats.elapsedMinutes >= milestone.timeInMinutes
            const isCurrent =
              stats.currentHealthMilestone?.id === milestone.id
            const Icon = getIcon(milestone.icon)
            const timeRemaining = formatTimeRemaining(
              milestone.timeInMinutes,
              stats.elapsedMinutes
            )

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative pl-16 pb-8 ${
                  index === HEALTH_MILESTONES.length - 1 ? 'pb-0' : ''
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`absolute left-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isAchieved
                      ? 'bg-emerald-500 text-white'
                      : isCurrent
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 ring-2 ring-emerald-500'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-400'
                  }`}
                >
                  {isAchieved ? <Check size={20} /> : <Icon size={20} />}
                </div>

                {/* Content */}
                <div
                  className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm ${
                    isCurrent ? 'ring-2 ring-emerald-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3
                      className={`font-semibold ${
                        isAchieved
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {milestone.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isAchieved
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                      }`}
                    >
                      {milestone.timeInMinutes < 60
                        ? `${milestone.timeInMinutes}분`
                        : milestone.timeInMinutes < 24 * 60
                        ? `${Math.floor(milestone.timeInMinutes / 60)}시간`
                        : milestone.timeInMinutes < 365 * 24 * 60
                        ? `${Math.floor(milestone.timeInMinutes / (24 * 60))}일`
                        : `${Math.floor(milestone.timeInMinutes / (365 * 24 * 60))}년`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {milestone.description}
                  </p>
                  {!isAchieved && timeRemaining && (
                    <p className="text-xs text-gray-400 mt-2">{timeRemaining}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
