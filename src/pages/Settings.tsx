import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Moon,
  Type,
  Bell,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  AlertTriangle,
  X,
  Calendar,
  CigaretteOff,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { useUserStore } from '../stores/userStore'

export default function Settings() {
  const navigate = useNavigate()
  const { userData, toggleDarkMode, toggleLargeText, restartQuit, clearUserData } = useUserStore()
  const [showRestartModal, setShowRestartModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newQuitDate, setNewQuitDate] = useState(
    new Date().toISOString().split('T')[0]
  )

  if (!userData) {
    return null
  }

  const handleExportData = () => {
    const dataStr = JSON.stringify(userData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `smoking-habit-backup-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            JSON.parse(event.target?.result as string)
            // TODO: 데이터 유효성 검사 후 저장
            alert('데이터를 가져왔습니다. (기능 구현 예정)')
          } catch {
            alert('올바른 JSON 파일이 아닙니다.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleRestart = () => {
    restartQuit(new Date(newQuitDate).toISOString())
    setShowRestartModal(false)
  }

  const handleDelete = () => {
    clearUserData()
    setShowDeleteModal(false)
    navigate('/')
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">설정</h1>
      </div>

      {/* My Info */}
      <Section title="내 정보">
        <InfoRow
          icon={Calendar}
          label="금연 시작일"
          value={formatDate(userData.quitDate)}
        />
        {userData.cigaretteConfig && (
          <>
            <InfoRow
              icon={CigaretteOff}
              label="하루 흡연량"
              value={`${userData.cigaretteConfig.cigarettesPerDay}개비`}
            />
            <InfoRow
              icon={Wallet}
              label="담배 가격"
              value={`${userData.cigaretteConfig.pricePerPack.toLocaleString()}원`}
            />
          </>
        )}
      </Section>

      {/* App Settings */}
      <Section title="앱 설정">
        <ToggleRow
          icon={Moon}
          label="다크 모드"
          checked={userData.settings.darkMode}
          onChange={toggleDarkMode}
        />
        <ToggleRow
          icon={Type}
          label="큰 글씨 모드"
          checked={userData.settings.largeText}
          onChange={toggleLargeText}
        />
        <ToggleRow
          icon={Bell}
          label="알림"
          checked={userData.settings.notifications.enabled}
          onChange={() => {}}
          disabled
        />
      </Section>

      {/* Data */}
      <Section title="데이터">
        <ActionRow
          icon={Download}
          label="데이터 내보내기"
          onClick={handleExportData}
        />
        <ActionRow
          icon={Upload}
          label="데이터 가져오기"
          onClick={handleImportData}
        />
      </Section>

      {/* Danger Zone */}
      <Section title="위험 구역" danger>
        <ActionRow
          icon={RotateCcw}
          label="금연 다시 시작하기"
          onClick={() => setShowRestartModal(true)}
          danger
        />
        <ActionRow
          icon={Trash2}
          label="모든 데이터 삭제"
          onClick={() => setShowDeleteModal(true)}
          danger
        />
      </Section>

      {/* Info */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>금연 챌린지 v1.0.0</p>
        <p className="mt-1">Made with ❤️ for your health</p>
      </div>

      {/* Restart Modal */}
      <AnimatePresence>
        {showRestartModal && (
          <Modal onClose={() => setShowRestartModal(false)}>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="text-orange-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                금연 다시 시작하기
              </h2>
              <p className="text-gray-500 mb-4">
                금연 시작일이 재설정됩니다. 기존 기록은 유지됩니다.
              </p>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  새로운 금연 시작일
                </label>
                <input
                  type="date"
                  value={newQuitDate}
                  onChange={(e) => setNewQuitDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestartModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleRestart}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-medium"
                >
                  다시 시작
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-500" size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                정말 삭제하시겠어요?
              </h2>
              <p className="text-gray-500 mb-6">
                모든 데이터가 삭제되며 복구할 수 없습니다. 금연 기록, 업적, 통계가 모두 사라집니다.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

function Section({
  title,
  children,
  danger,
}: {
  title: string
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <div className="mb-6">
      <h2
        className={`text-sm font-medium mb-2 ${
          danger ? 'text-red-500' : 'text-gray-500'
        }`}
      >
        {title}
      </h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-gray-900 dark:text-white font-medium">{value}</span>
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  checked,
  onChange,
  disabled,
}: {
  icon: LucideIcon
  label: string
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0">
      <div className="flex items-center gap-3">
        <Icon size={20} className="text-gray-400" />
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <button
        onClick={onChange}
        disabled={disabled}
        className={`w-12 h-7 rounded-full transition-colors relative ${
          checked ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.div
          animate={{ x: checked ? 22 : 2 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
        />
      </button>
    </div>
  )
}

function ActionRow({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0 text-left hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
    >
      <Icon
        size={20}
        className={danger ? 'text-red-500' : 'text-gray-400'}
      />
      <span
        className={danger ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}
      >
        {label}
      </span>
    </button>
  )
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}
