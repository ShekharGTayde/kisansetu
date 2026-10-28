import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api.js'

const initial = { crop: '', variety: '', cropType: 'available', quantity: '', unit: 'quintal', price: '', location: '', availableFrom: '', qualityNotes: '' }
export default function CreateCropListingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await api.post('/crops', { ...form, quantity: Number(form.quantity), pricePerUnit: Number(form.price) * 100 }); navigate('/farmer/crops') } catch (reason) { setError(reason.message || 'Unable to publish crop') } finally { setSaving(false) }
  }
  return <main className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Farmer workspace</p><h1 className="mt-2 font-editorial text-4xl font-semibold">List your crop for direct buyers</h1><form onSubmit={submit} className="mt-7 space-y-5 rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm">{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="grid gap-4 md:grid-cols-2">{[['crop','Crop'],['variety','Variety'],['quantity','Quantity'],['price','Price per unit (INR)'],['location','Location'],['availableFrom','Available from']].map(([key,label]) => <label key={key} className="text-sm font-semibold text-[#314936]">{label}<input required={!['variety'].includes(key)} type={key === 'availableFrom' ? 'date' : key === 'quantity' || key === 'price' ? 'number' : 'text'} value={form[key]} onChange={update(key)} className="mt-2 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label>)}</div><label className="text-sm font-semibold text-[#314936]">Crop type<select value={form.cropType} onChange={update('cropType')} className="mt-2 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal"><option value="available">Available now</option><option value="expected">Expected harvest</option></select></label><label className="text-sm font-semibold text-[#314936]">Quality notes<textarea value={form.qualityNotes} onChange={update('qualityNotes')} rows="3" className="mt-2 w-full rounded-xl border border-[#dce5dc] p-3 font-normal" /></label><button disabled={saving} className="btn-forest-pill min-h-11 w-full disabled:opacity-60">{saving ? 'Publishing...' : 'Publish crop listing'}</button></form></main>
}
