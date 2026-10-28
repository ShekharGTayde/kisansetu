import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

const initial = { crop: '', variety: '', quantity: '', unit: 'quintal', pricePerUnit: '', deliveryLocation: '', deliveryDate: '', paymentTerms: '', qualityGrade: '', qualityNotes: '' }

export default function NewListingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post('/listings', {
        crop: form.crop, variety: form.variety, quantity: Number(form.quantity), unit: form.unit,
        priceTerms: { pricePerUnit: Number(form.pricePerUnit) * 100 },
        qualitySpec: { grade: form.qualityGrade, notes: form.qualityNotes },
        deliveryLocation: form.deliveryLocation, deliveryDate: form.deliveryDate, paymentTerms: form.paymentTerms,
      })
      navigate('/buyer/listings')
    } catch (reason) { setError(reason.message || 'Unable to publish requirement') }
    finally { setSaving(false) }
  }
  return (
    <main className="mx-auto max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Buyer workspace</p>
      <h1 className="mt-2 font-editorial text-4xl font-semibold text-[#15261b]">Publish a crop requirement</h1>
      <form onSubmit={submit} className="mt-7 space-y-5 rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm">
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">{[['crop', 'Crop'], ['variety', 'Variety'], ['quantity', 'Quantity'], ['pricePerUnit', 'Price per unit (INR)'], ['deliveryLocation', 'Delivery location'], ['deliveryDate', 'Delivery date'], ['paymentTerms', 'Payment terms'], ['qualityGrade', 'Quality grade']].map(([key, label]) => (
          <label key={key} className="text-sm font-semibold text-[#314936]">{label}<input required={!['variety', 'qualityGrade'].includes(key)} type={key === 'deliveryDate' ? 'date' : key === 'quantity' || key === 'pricePerUnit' ? 'number' : 'text'} value={form[key]} onChange={update(key)} className="mt-2 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal outline-none focus:ring-2 focus:ring-[#8fb89a]" /></label>
        ))}</div>
        <label className="text-sm font-semibold text-[#314936]">Unit<select value={form.unit} onChange={update('unit')} className="mt-2 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal"><option>quintal</option><option>kg</option><option>ton</option></select></label>
        <label className="text-sm font-semibold text-[#314936]">Quality notes<textarea value={form.qualityNotes} onChange={update('qualityNotes')} rows="3" className="mt-2 w-full rounded-xl border border-[#dce5dc] p-3 font-normal outline-none focus:ring-2 focus:ring-[#8fb89a]" /></label>
        <button disabled={saving} className="btn-forest-pill min-h-11 w-full disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Publishing...' : 'Publish requirement'}</button>
      </form>
    </main>
  )
}
