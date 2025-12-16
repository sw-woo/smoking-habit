import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Timer,
  Wind,
  Trophy,
  Heart,
  Wallet,
  CigaretteOff,
  Clock,
  CheckCircle,
  Play,
  Pause,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import { BREATHING_STEPS, MOTIVATIONAL_MESSAGES } from '../utils/constants'

type ViewMode = 'main' | 'timer' | 'breathing' | 'success'

export default function Craving() {
  const navigate = useNavigate()
  const { getComputedStats, addCravingLog } = useUserStore()
  const [stats, setStats] = useState(getComputedStats())
  const [viewMode, setViewMode] = useState<ViewMode>('main')
  const [timerSeconds, setTimerSeconds] = useState(5 * 60) // 5분
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [breathingStep, setBreathingStep] = useState(0)
  const [breathingCount, setBreathingCount] = useState(0)
  const [breathingSeconds, setBreathingSeconds] = useState<number>(BREATHING_STEPS[0].duration)
  const [startTime] = useState(Date.now())

  // 동기부여 메시지 랜덤 선택
  const [motivationalMessage] = useState(
    MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getComputedStats())
    }, 1000)
    return () => clearInterval(interval)
  }, [getComputedStats])

  // 5분 타이머
  useEffect(() => {
    if (!isTimerRunning || timerSeconds <= 0) return

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false)
          handleTimerComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, timerSeconds])

  // 호흡 타이머
  useEffect(() => {
    if (viewMode !== 'breathing') return

    const interval = setInterval(() => {
      setBreathingSeconds((prev) => {
        if (prev <= 1) {
          // 다음 단계로
          const nextStep = (breathingStep + 1) % BREATHING_STEPS.length
          if (nextStep === 0) {
            // 한 사이클 완료
            const newCount = breathingCount + 1
            setBreathingCount(newCount)
            if (newCount >= 3) {
              // 3회 완료
              handleBreathingComplete()
              return 0
            }
          }
          setBreathingStep(nextStep)
          return BREATHING_STEPS[nextStep].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [viewMode, breathingStep, breathingCount])

  const handleTimerComplete = useCallback(() => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    addCravingLog({
      timestamp: new Date().toISOString(),
      overcome: true,
      duration,
      copingMethod: 'timer',
    })
    setViewMode('success')
  }, [addCravingLog, startTime])

  const handleBreathingComplete = useCallback(() => {
    const duration = Math.floor((Date.now() - startTime) / 1000)
    addCravingLog({
      timestamp: new Date().toISOString(),
      overcome: true,
      duration,
      copingMethod: 'breathing',
    })
    setViewMode('success')
  }, [addCravingLog, startTime])

  const handleClose = () => {
    // 중간에 닫으면 극복 실패로 기록
    if (viewMode !== 'success' && viewMode !== 'main') {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      addCravingLog({
        timestamp: new Date().toISOString(),
        overcome: false,
        duration,
      })
    }
    navigate(-1)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatMoney = (amount: number) => amount.toLocaleString('ko-KR')

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-orange-400 to-rose-500 text-white p-6 flex flex-col">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
      >
        <X size={24} />
      </button>

      <AnimatePresence mode="wait">
        {viewMode === 'main' && (
          <MainView
            key="main"
            onStartTimer={() => {
              setViewMode('timer')
              setIsTimerRunning(true)
            }}
            onStartBreathing={() => {
              setViewMode('breathing')
              setBreathingStep(0)
              setBreathingCount(0)
              setBreathingSeconds(BREATHING_STEPS[0].duration)
            }}
            onViewStats={() => navigate('/statistics')}
            motivationalMessage={motivationalMessage}
          />
        )}

        {viewMode === 'timer' && stats && (
          <TimerView
            key="timer"
            seconds={timerSeconds}
            isRunning={isTimerRunning}
            onToggle={() => setIsTimerRunning(!isTimerRunning)}
            stats={stats}
            formatTime={formatTime}
            formatMoney={formatMoney}
          />
        )}

        {viewMode === 'breathing' && (
          <BreathingView
            key="breathing"
            step={breathingStep}
            seconds={breathingSeconds}
            count={breathingCount}
          />
        )}

        {viewMode === 'success' && (
          <SuccessView key="success" onClose={() => navigate(-1)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function MainView({
  onStartTimer,
  onStartBreathing,
  onViewStats,
  motivationalMessage,
}: {
  onStartTimer: () => void
  onStartBreathing: () => void
  onViewStats: () => void
  motivationalMessage: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
        <Heart size={40} />
      </div>

      <h1 className="text-2xl font-bold mb-2">충동이 왔나요?</h1>
      <p className="text-white/80 text-center mb-8">
        충동은 보통 5분이면 지나가요
        <br />
        조금만 참아볼까요?
      </p>

      <div className="w-full space-y-3 mb-8">
        <button
          onClick={onStartTimer}
          className="w-full py-4 bg-white text-orange-500 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <Timer size={20} />
          5분 타이머 시작하기
        </button>

        <button
          onClick={onStartBreathing}
          className="w-full py-4 bg-white/20 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <Wind size={20} />
          심호흡 가이드
        </button>

        <button
          onClick={onViewStats}
          className="w-full py-4 bg-white/20 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >
          <Trophy size={20} />
          내 성과 보기
        </button>
      </div>

      <p className="text-white/60 text-sm text-center italic">
        "{motivationalMessage}"
      </p>
    </motion.div>
  )
}

function TimerView({
  seconds,
  isRunning,
  onToggle,
  stats,
  formatTime,
  formatMoney,
}: {
  seconds: number
  isRunning: boolean
  onToggle: () => void
  stats: { moneySaved: number; cigarettesNotSmoked: number; lifeRegainedMinutes: number }
  formatTime: (s: number) => string
  formatMoney: (n: number) => string
}) {
  const progress = ((5 * 60 - seconds) / (5 * 60)) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <p className="text-white/80 mb-4">잘하고 있어요!</p>

      {/* Timer Circle */}
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="8"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="white"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 88}
            animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100) }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{formatTime(seconds)}</span>
          <span className="text-white/60 text-sm">남음</span>
        </div>
      </div>

      {/* Play/Pause */}
      <button
        onClick={onToggle}
        className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-8"
      >
        {isRunning ? <Pause size={28} /> : <Play size={28} />}
      </button>

      {/* Stats Reminder */}
      <div className="w-full bg-white/10 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Wallet size={20} />
          <span>지금까지 {formatMoney(stats.moneySaved)}원 절약</span>
        </div>
        <div className="flex items-center gap-3">
          <CigaretteOff size={20} />
          <span>{stats.cigarettesNotSmoked}개비 안 핀 당신!</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock size={20} />
          <span>수명 {Math.floor(stats.lifeRegainedMinutes / 60)}시간 연장!</span>
        </div>
      </div>

      <p className="mt-6 text-white/60 text-center">
        조금만 더 참으면 지나가요
      </p>
    </motion.div>
  )
}

function BreathingView({
  step,
  seconds,
  count,
}: {
  step: number
  seconds: number
  count: number
}) {
  const currentStep = BREATHING_STEPS[step]
  const isInhale = currentStep.phase === 'inhale'
  const isHold = currentStep.phase === 'hold'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <p className="text-white/80 mb-2">4-7-8 심호흡</p>
      <p className="text-white/60 text-sm mb-8">{count + 1}/3 사이클</p>

      {/* Breathing Animation */}
      <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isInhale ? 1.3 : isHold ? 1.3 : 1,
          }}
          transition={{ duration: isInhale ? 4 : isHold ? 0 : 8, ease: 'easeInOut' }}
          className="w-32 h-32 bg-white/30 rounded-full flex items-center justify-center"
        >
          <motion.div
            animate={{
              scale: isInhale ? 1.2 : isHold ? 1.2 : 1,
            }}
            transition={{ duration: isInhale ? 4 : isHold ? 0 : 8, ease: 'easeInOut' }}
            className="w-20 h-20 bg-white/50 rounded-full"
          />
        </motion.div>
      </div>

      <motion.p
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-2"
      >
        {currentStep.label}
      </motion.p>

      <p className="text-5xl font-bold mb-4">{seconds}</p>

      <div className="flex gap-2 mt-4">
        {BREATHING_STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === step ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <p className="mt-8 text-white/60 text-sm">
        {currentStep.phase === 'inhale' && '코로 천천히 숨을 들이쉬세요'}
        {currentStep.phase === 'hold' && '숨을 참고 있어요'}
        {currentStep.phase === 'exhale' && '입으로 천천히 내쉬세요'}
      </p>
    </motion.div>
  )
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex-1 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle size={48} className="text-emerald-500" />
      </motion.div>

      <h1 className="text-3xl font-bold mb-2">훌륭해요!</h1>
      <p className="text-white/80 text-center mb-8">
        충동을 이겨냈어요!
        <br />
        당신은 정말 대단합니다
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full bg-white/10 rounded-2xl p-4 mb-8"
      >
        <p className="text-center">
          충동은 평균 3-5분만 지속됩니다.
          <br />
          매번 이겨낼 때마다 더 쉬워져요!
        </p>
      </motion.div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-white text-orange-500 rounded-2xl font-semibold"
      >
        확인
      </button>
    </motion.div>
  )
}
