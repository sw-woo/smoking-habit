import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Wallet,
  CigaretteOff,
  Clock,
  Calendar,
  Target,
  Activity,
  type LucideIcon,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'

export default function Statistics() {
  const { userData, getComputedStats } = useUserStore()
  const [stats, setStats] = useState(getComputedStats())

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

  const formatMoney = (amount: number) => amount.toLocaleString('ko-KR')

  const formatLifeTime = (minutes: number) => {
    const days = Math.floor(minutes / (60 * 24))
    const hours = Math.floor((minutes % (60 * 24)) / 60)
    if (days > 0) {
      return `${days}일 ${hours}시간`
    }
    return `${hours}시간 ${minutes % 60}분`
  }

  // 예상 절약 금액 (1년 기준)
  let dailySaving = 0
  if (userData.cigaretteConfig) {
    const { cigarettesPerDay, pricePerPack, cigarettesPerPack } = userData.cigaretteConfig
    dailySaving += (cigarettesPerDay / cigarettesPerPack) * pricePerPack
  }
  if (userData.heatedEcigConfig) {
    const { sticksPerDay, pricePerPack } = userData.heatedEcigConfig
    dailySaving += (sticksPerDay / 20) * pricePerPack
  }
  if (userData.liquidEcigConfig) {
    const { liquidPrice, expectedDays } = userData.liquidEcigConfig
    dailySaving += liquidPrice / expectedDays
  }

  const monthlySaving = Math.floor(dailySaving * 30)
  const yearlySaving = Math.floor(dailySaving * 365)

  // 충동 극복 통계
  const cravingStats = {
    total: userData.cravingLogs.length,
    overcome: userData.cravingLogs.filter((l) => l.overcome).length,
    rate: userData.cravingLogs.length > 0
      ? Math.round(
          (userData.cravingLogs.filter((l) => l.overcome).length /
            userData.cravingLogs.length) *
            100
        )
      : 0,
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">통계</h1>
        <p className="text-gray-500 mt-1">나의 금연 성과를 확인하세요</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Calendar}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-500"
          value={`${stats.elapsedDays}일`}
          label="금연 일수"
          delay={0}
        />
        <StatCard
          icon={CigaretteOff}
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          iconColor="text-rose-500"
          value={`${stats.cigarettesNotSmoked}개비`}
          label="안 핀 담배"
          delay={0.1}
        />
        <StatCard
          icon={Wallet}
          iconBg="bg-amber-100 dark:bg-amber-900/30"
          iconColor="text-amber-500"
          value={`${formatMoney(stats.moneySaved)}원`}
          label="절약한 금액"
          delay={0.2}
        />
        <StatCard
          icon={Clock}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-500"
          value={formatLifeTime(stats.lifeRegainedMinutes)}
          label="되찾은 수명"
          delay={0.3}
        />
      </div>

      {/* Savings Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 mb-6 text-white"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} />
          <span className="font-semibold">예상 절약 금액</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-emerald-100 text-sm">월간</p>
            <p className="text-2xl font-bold">{formatMoney(monthlySaving)}원</p>
          </div>
          <div>
            <p className="text-emerald-100 text-sm">연간</p>
            <p className="text-2xl font-bold">{formatMoney(yearlySaving)}원</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-emerald-100">
            계속 금연하면 1년에 {formatMoney(yearlySaving)}원을 절약할 수 있어요!
          </p>
        </div>
      </motion.div>

      {/* Craving Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-6 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="text-orange-500" size={20} />
          <span className="font-semibold text-gray-900 dark:text-white">
            충동 극복 현황
          </span>
        </div>

        {cravingStats.total > 0 ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500">총 충동</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {cravingStats.total}회
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-500">극복 성공</span>
              <span className="font-medium text-emerald-500">
                {cravingStats.overcome}회
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">성공률</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {cravingStats.rate}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${cravingStats.rate}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-400 to-rose-500 rounded-full"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Activity className="mx-auto mb-2" size={32} />
            <p>아직 기록된 충동이 없습니다</p>
            <p className="text-sm mt-1">충동이 올 때 "도움이 필요해요" 버튼을 눌러주세요</p>
          </div>
        )}
      </motion.div>

      {/* Health Milestones Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-teal-500" size={20} />
          <span className="font-semibold text-gray-900 dark:text-white">
            건강 회복 단계
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">달성한 단계</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {stats.currentHealthMilestone ? stats.earnedBadges.length : 0}개
          </span>
        </div>

        {stats.currentHealthMilestone && (
          <div className="mt-3 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-xl">
            <p className="text-sm text-teal-700 dark:text-teal-300">
              현재: {stats.currentHealthMilestone.title}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">
              {stats.currentHealthMilestone.description}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

interface StatCardProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  value: string
  label: string
  delay: number
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm"
    >
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon size={20} className={iconColor} />
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </motion.div>
  )
}
