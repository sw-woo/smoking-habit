import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Lock,
  CheckCircle,
  Flag,
  Circle,
  Flame,
  Medal,
  Award,
  Gem,
  Crown,
  type LucideIcon,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import type { Badge } from '../types'

const iconMap: Record<string, LucideIcon> = {
  Flag,
  Circle,
  Flame,
  Medal,
  Award,
  Gem,
  Crown,
  Trophy,
}

export default function Achievements() {
  const { getComputedStats } = useUserStore()
  const [stats, setStats] = useState(getComputedStats())

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getComputedStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [getComputedStats])

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  const { earnedBadges, nextBadge } = stats

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          나의 업적
        </h1>
        <p className="text-gray-500 mt-1">
          달성한 배지: {earnedBadges.length}개
        </p>
      </div>

      {/* Next Badge Progress */}
      {nextBadge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 mb-6 text-white"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              {iconMap[nextBadge.icon] ? (
                (() => {
                  const Icon = iconMap[nextBadge.icon]
                  return <Icon size={32} />
                })()
              ) : (
                <Trophy size={32} />
              )}
            </div>
            <div className="flex-1">
              <p className="text-amber-100 text-sm">다음 목표</p>
              <p className="text-xl font-bold">{nextBadge.name}</p>
              <p className="text-amber-100 text-sm mt-1">
                {nextBadge.daysRequired - stats.elapsedDays}일 남음
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{stats.elapsedDays}일</span>
              <span>{nextBadge.daysRequired}일</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(stats.elapsedDays / nextBadge.daysRequired) * 100}%`,
                }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Earned Badges */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          달성한 배지
        </h2>
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {earnedBadges.map((badge, index) => (
              <BadgeCard key={badge.id} badge={badge} delay={index * 0.1} achieved />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            아직 달성한 배지가 없습니다
          </div>
        )}
      </div>

      {/* Locked Badges */}
      {nextBadge && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            도전 중
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <BadgeCard
              key={nextBadge.id}
              badge={nextBadge}
              delay={0}
              achieved={false}
              isNext
              progress={(stats.elapsedDays / nextBadge.daysRequired) * 100}
            />
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center"
      >
        <p className="text-emerald-700 dark:text-emerald-300">
          {earnedBadges.length === 0
            ? '첫 번째 배지까지 조금만 더 힘내세요!'
            : earnedBadges.length < 5
            ? '잘하고 있어요! 계속 도전하세요!'
            : '대단해요! 금연 마스터가 되어가고 있어요!'}
        </p>
      </motion.div>
    </div>
  )
}

interface BadgeCardProps {
  badge: Badge
  delay: number
  achieved: boolean
  isNext?: boolean
  progress?: number
}

function BadgeCard({ badge, delay, achieved, isNext, progress }: BadgeCardProps) {
  const Icon = iconMap[badge.icon] || Trophy

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`relative rounded-2xl p-4 text-center ${
        achieved
          ? 'bg-white dark:bg-slate-800 shadow-sm'
          : 'bg-gray-100 dark:bg-slate-800/50'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
          achieved ? '' : 'bg-gray-200 dark:bg-slate-700'
        }`}
        style={achieved ? { backgroundColor: `${badge.color}20` } : {}}
      >
        {achieved ? (
          <Icon size={24} style={{ color: badge.color }} />
        ) : (
          <Lock size={24} className="text-gray-400" />
        )}
      </div>

      <p
        className={`text-sm font-medium ${
          achieved ? 'text-gray-900 dark:text-white' : 'text-gray-400'
        }`}
      >
        {badge.name}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {achieved ? (
          <span className="flex items-center justify-center gap-1 text-emerald-500">
            <CheckCircle size={12} />
            달성
          </span>
        ) : (
          `${badge.daysRequired}일`
        )}
      </p>

      {isNext && progress !== undefined && (
        <div className="mt-2">
          <div className="h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
