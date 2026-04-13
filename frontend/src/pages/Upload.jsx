import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { receiptsApi } from '../api/receipts'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import DropZone from '../components/upload/DropZone'
import FilePreview from '../components/upload/FilePreview'
import ProgressStepper from '../components/upload/ProgressStepper'
import { useToast } from '../context/ToastContext'
import { validateFile } from '../utils/validators'

export default function Upload() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [step, setStep] = useState(null) // null | 0 | 1 | 2

  function handleFile(selected) {
    const err = validateFile(selected)
    if (err) {
      setFileError(err)
      setFile(null)
    } else {
      setFileError('')
      setFile(selected)
    }
  }

  async function handleUpload() {
    if (!file) return
    setStep(0)
    try {
      setStep(1)
      const res = await receiptsApi.upload(file, (evt) => {
        if (evt.loaded === evt.total) setStep(1)
      })
      setStep(2)
      const id = res.data?.data?.id ?? res.data?.id
      addToast('영수증 분석이 완료됐습니다.', 'success')
      setTimeout(() => navigate(`/expenses/${id}`), 600)
    } catch (err) {
      setStep(null)
      addToast(err.message || '업로드에 실패했습니다. 다시 시도해주세요.', 'error')
    }
  }

  const isUploading = step !== null && step < 2

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-xl font-bold text-gray-900">영수증 업로드</h1>

      <Card className="p-8 space-y-6">
        {step === null ? (
          <>
            {file ? (
              <FilePreview file={file} onRemove={() => setFile(null)} />
            ) : (
              <DropZone onFile={handleFile} error={fileError} />
            )}
            <Button className="w-full justify-center" disabled={!file} onClick={handleUpload}>
              AI 분석 시작
            </Button>
          </>
        ) : (
          <div className="py-4">
            <ProgressStepper step={step} />
            {step === 1 && (
              <p className="mt-6 text-center text-sm text-gray-500 animate-pulse">
                AI가 영수증을 분석하고 있습니다...
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
