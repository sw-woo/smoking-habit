import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CigaretteOff,
  Wallet,
  Heart,
  Wind,
  AlertCircle,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'

export default function Dashboard() {
  const navigate = useNavigate()
  const { userData, getComputedStats } = useUserStore()
  const [stats, setStats] = useState(getComputedStats())

  // 1초마다 통계 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getComputedStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [getComputedStats])

  if (!userData || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)

    if (days > 0) {
      return { main: `${days}일`, sub: `${hours}시간 ${minutes}분` }
    } else if (hours > 0) {
      return { main: `${hours}시간`, sub: `${minutes}분 ${seconds}초` }
    } else {
      return { main: `${minutes}분`, sub: `${seconds}초` }
    }
  }

  const timeDisplay = formatTime(stats.elapsedMs)

  const formatMoney = (amount: number) => {
    return amount.toLocaleString('ko-KR')
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 text-white mb-6 shadow-lg"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <CigaretteOff size={32} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-emerald-100 text-sm mb-1">금연 시작한 지</p>
          <motion.p
            key={timeDisplay.main}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-extrabold mb-1"
          >
            {timeDisplay.main}
          </motion.p>
          <p className="text-emerald-100">{timeDisplay.sub}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20">
          <p className="text-center text-emerald-100 text-sm">
            {stats.currentHealthMilestone
              ? `✓ ${stats.currentHealthMilestone.title}`
              : '금연 시작!'}
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center shadow-sm"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Wallet className="text-amber-500" size={20} />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {formatMoney(stats.moneySaved)}
          </p>
          <p className="text-xs text-gray-500">원 절약</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center shadow-sm"
        >
          <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
            <CigaretteOff className="text-rose-500" size={20} />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {stats.cigarettesNotSmoked}
          </p>
          <p className="text-xs text-gray-500">개비 안 핌</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 text-center shadow-sm"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
            <Clock className="text-purple-500" size={20} />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            +{Math.floor(stats.lifeRegainedMinutes / 60)}
          </p>
          <p className="text-xs text-gray-500">시간 수명</p>
        </motion.div>
      </div>

      {/* Health Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => navigate('/health')}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
              <Wind className="text-teal-500" size={20} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                폐 건강
              </p>
              <p className="text-sm text-gray-500">
                {stats.nextHealthMilestone
                  ? `다음: ${stats.nextHealthMilestone.title}`
                  : '최고 단계 달성!'}
              </p>
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.healthProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
          />
        </div>

        {stats.currentHealthMilestone && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">
            ✓ {stats.currentHealthMilestone.description}
          </p>
        )}
      </motion.div>

      {/* Craving Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/craving')}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-orange-400 to-rose-500 text-white rounded-2xl p-5 shadow-sm flex items-center justify-center gap-3"
      >
        <AlertCircle size={24} />
        <span className="font-semibold text-lg">도움이 필요해요</span>
      </motion.button>

      {/* Next Badge Preview */}
      {stats.nextBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => navigate('/achievements')}
          className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl cursor-pointer"
        >
          <p className="text-sm text-gray-500 mb-1">다음 배지</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart size={16} style={{ color: stats.nextBadge.color }} />
              <span className="font-medium text-gray-900 dark:text-white">
                {stats.nextBadge.name}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {stats.nextBadge.daysRequired - stats.elapsedDays}일 남음
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
