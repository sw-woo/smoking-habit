import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  TrendingDown,
  Cigarette,
  Cloud,
  Flame,
  ChevronRight,
  ChevronLeft,
  Calendar,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'
import type { QuitMode, TobaccoType } from '../types'

type Step = 'mode' | 'tobacco' | 'config' | 'date'

export default function Onboarding() {
  const navigate = useNavigate()
  const {
    setQuitMode,
    setTobaccoTypes,
    setCigaretteConfig,
    setLiquidEcigConfig,
    setHeatedEcigConfig,
    setQuitDate,
    completeOnboarding,
  } = useUserStore()

  const [step, setStep] = useState<Step>('mode')
  const [, setSelectedMode] = useState<QuitMode | null>(null)
  const [selectedTobacco, setSelectedTobacco] = useState<TobaccoType[]>([])

  // 담배 설정
  const [cigarettesPerDay, setCigarettesPerDay] = useState(20)
  const [pricePerPack, setPricePerPack] = useState(4500)
  const [puffsPerDay, setPuffsPerDay] = useState(200)
  const [liquidPrice, setLiquidPrice] = useState(15000)
  const [expectedDays, setExpectedDays] = useState(7)
  const [sticksPerDay, setSticksPerDay] = useState(20)
  const [heatedPrice, setHeatedPrice] = useState(4500)
  const [quitDateInput, setQuitDateInput] = useState(
    new Date().toISOString().split('T')[0]
  )

  const handleModeSelect = (mode: QuitMode) => {
    setSelectedMode(mode)
    setQuitMode(mode)
    setStep('tobacco')
  }

  const handleTobaccoToggle = (type: TobaccoType) => {
    setSelectedTobacco((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleTobaccoNext = () => {
    if (selectedTobacco.length === 0) return
    setTobaccoTypes(selectedTobacco)
    setStep('config')
  }

  const handleConfigNext = () => {
    if (selectedTobacco.includes('cigarette')) {
      setCigaretteConfig({
        cigarettesPerDay,
        pricePerPack,
        cigarettesPerPack: 20,
      })
    }
    if (selectedTobacco.includes('liquid_ecig')) {
      setLiquidEcigConfig({
        puffsPerDay,
        liquidVolume: 30,
        liquidPrice,
        expectedDays,
      })
    }
    if (selectedTobacco.includes('heated_ecig')) {
      setHeatedEcigConfig({
        sticksPerDay,
        pricePerPack: heatedPrice,
      })
    }
    setStep('date')
  }

  const handleComplete = () => {
    setQuitDate(new Date(quitDateInput).toISOString())
    completeOnboarding()
    navigate('/dashboard')
  }

  const goBack = () => {
    if (step === 'tobacco') setStep('mode')
    else if (step === 'config') setStep('tobacco')
    else if (step === 'date') setStep('config')
  }

  return (
    <div className="min-h-screen min-h-dvh bg-gradient-to-b from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-md mx-auto">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {['mode', 'tobacco', 'config', 'date'].map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                ['mode', 'tobacco', 'config', 'date'].indexOf(step) >= i
                  ? 'bg-emerald-500'
                  : 'bg-gray-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Back Button */}
        {step !== 'mode' && (
          <button
            onClick={goBack}
            className="flex items-center text-gray-500 mb-6 hover:text-gray-700"
          >
            <ChevronLeft size={20} />
            <span>이전</span>
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Mode Selection */}
          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                금연 방법을 선택하세요
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                자신에게 맞는 방법으로 시작하세요
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => handleModeSelect('cold_turkey')}
                  className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-left shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                      <Zap className="text-amber-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        바로 금연
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        오늘부터 완전히 담배를 끊어요
                      </p>
                      <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• 즉시 금연 시작</li>
                        <li>• 빠른 건강 회복</li>
                      </ul>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </button>

                <button
                  onClick={() => handleModeSelect('gradual')}
                  className="w-full p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-left shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <TrendingDown className="text-blue-500" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        점진적 금연
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        천천히 줄여서 자연스럽게 끊어요
                      </p>
                      <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li>• 2~4주 감량 기간</li>
                        <li>• 부담이 적음</li>
                      </ul>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Tobacco Type */}
          {step === 'tobacco' && (
            <motion.div
              key="tobacco"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                어떤 담배를 피우시나요?
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                여러 개를 선택할 수 있어요
              </p>

              <div className="space-y-4">
                {[
                  { type: 'cigarette' as TobaccoType, icon: Cigarette, label: '일반 담배', desc: '연초' },
                  { type: 'liquid_ecig' as TobaccoType, icon: Cloud, label: '액상 전자담배', desc: '쥴, 릴베이퍼 등' },
                  { type: 'heated_ecig' as TobaccoType, icon: Flame, label: '궐련형 전자담배', desc: 'IQOS, 릴, 글로 등' },
                ].map(({ type, icon: Icon, label, desc }) => (
                  <button
                    key={type}
                    onClick={() => handleTobaccoToggle(type)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      selectedTobacco.includes(type)
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedTobacco.includes(type)
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-500'
                        }`}
                      >
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {label}
                        </h3>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleTobaccoNext}
                disabled={selectedTobacco.length === 0}
                className="w-full mt-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
              >
                다음
              </button>
            </motion.div>
          )}

          {/* Step 3: Configuration */}
          {step === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                흡연 정보를 입력하세요
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                정확한 통계를 위해 필요해요
              </p>

              <div className="space-y-6">
                {selectedTobacco.includes('cigarette') && (
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Cigarette size={20} />
                      <span className="font-medium">일반 담배</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        하루 평균 흡연량
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={cigarettesPerDay}
                          onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">개비</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        한 갑 가격
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={pricePerPack}
                          onChange={(e) => setPricePerPack(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">원</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTobacco.includes('liquid_ecig') && (
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Cloud size={20} />
                      <span className="font-medium">액상 전자담배</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        하루 평균 퍼프 수
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={puffsPerDay}
                          onChange={(e) => setPuffsPerDay(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">퍼프</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        액상 가격 (30ml 기준)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={liquidPrice}
                          onChange={(e) => setLiquidPrice(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">원</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        예상 사용 기간
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={expectedDays}
                          onChange={(e) => setExpectedDays(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">일</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTobacco.includes('heated_ecig') && (
                  <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <Flame size={20} />
                      <span className="font-medium">궐련형 전자담배</span>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        하루 평균 사용량
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={sticksPerDay}
                          onChange={(e) => setSticksPerDay(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">개비</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-2">
                        한 갑 가격
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={heatedPrice}
                          onChange={(e) => setHeatedPrice(Number(e.target.value))}
                          className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent"
                        />
                        <span className="text-gray-500">원</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleConfigNext}
                className="w-full mt-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                다음
              </button>
            </motion.div>
          )}

          {/* Step 4: Quit Date */}
          {step === 'date' && (
            <motion.div
              key="date"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                금연 시작일을 선택하세요
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                오늘부터 시작하는 것을 추천해요
              </p>

              <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <Calendar className="text-emerald-500" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      금연 시작일
                    </h3>
                    <p className="text-sm text-gray-500">
                      마지막 담배를 피운 시점
                    </p>
                  </div>
                </div>
                <input
                  type="date"
                  value={quitDateInput}
                  onChange={(e) => setQuitDateInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-transparent text-gray-900 dark:text-white"
                />
              </div>

              <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  🎉 금연을 시작하면 20분 후부터 혈압이 정상화되기 시작합니다!
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full mt-8 py-4 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
              >
                금연 시작하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
