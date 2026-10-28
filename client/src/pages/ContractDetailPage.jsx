import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Download } from 'lucide-react'
import api from '../services/api.js'
import { useAuth } from '../context/useAuth.js'

export default function ContractDetailPage() {
  const { id } = useParams()
  const { role } = useAuth()
  const [contract, setContract] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)
  useEffect(() => { api.get(`/contracts/${id}`).then((response) => setContract(response.data)).catch((reason) => setError(reason.message || 'Unable to load contract')) }, [id])
  const confirm = async () => { try { const response = await api.post(`/contracts/${id}/confirm`); setContract(response.data) } catch (reason) { setError(reason.message || 'Unable to confirm contract') } }
  const download = async () => {
    setDownloading(true)
    setError('')
    try {
      const blob = await api.get(`/contracts/${id}/pdf`, { responseType: 'blob' })
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error('The contract PDF was empty')
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${contract.contractNo}.pdf`
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (reason) {
      setError(reason.message || 'Unable to download contract PDF')
    } finally {
      setDownloading(false)
    }
  }
  if (!contract) return <main>{error ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p> : 'Loading contract...'}</main>
  const confirmed = Boolean(contract.confirmedBy?.[role]?.at)
  return <main className="mx-auto max-w-3xl space-y-6"><Link to="/contracts" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1b3b22]"><ArrowLeft className="h-4 w-4" /> My contracts</Link><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">{contract.contractNo}</p><h1 className="mt-2 font-editorial text-4xl font-semibold">{contract.terms.crop} agreement</h1><span className="mt-3 inline-block rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-semibold capitalize text-[#1b3b22]">{contract.status.replace('_', ' ')}</span></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<section className="grid gap-4 rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm sm:grid-cols-2">{Object.entries({ Crop: contract.terms.crop, Variety: contract.terms.variety || '—', Quantity: `${contract.terms.quantity} ${contract.terms.unit}`, 'Price per unit': `₹${(contract.terms.pricePerUnit / 100).toLocaleString('en-IN')}`, 'Total amount': `₹${(contract.terms.totalAmount / 100).toLocaleString('en-IN')}`, Delivery: `${contract.terms.deliveryLocation} · ${new Date(contract.terms.deliveryDate).toLocaleDateString('en-IN')}`, 'Payment terms': contract.terms.paymentTerms }).map(([label, value]) => <div key={label}><p className="text-xs text-[#6d8474]">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>)}</section><div className="flex flex-wrap gap-3">{contract.status === 'pending_confirmation' && <button disabled={confirmed} onClick={confirm} className="btn-forest-pill min-h-11 disabled:opacity-60"><Check className="h-4 w-4" /> {confirmed ? 'You confirmed' : 'Confirm contract'}</button>}<button disabled={downloading} onClick={download} className="min-h-11 rounded-full border border-[#cbd8cc] px-4 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"><Download className="mr-1 inline h-4 w-4" /> {downloading ? 'Preparing PDF...' : 'Download PDF'}</button></div></main>
}
