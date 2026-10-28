import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, Send, X } from 'lucide-react'
import api from '../services/api.js'
import { useAuth } from '../context/useAuth.js'

const initial = { price: '', quantity: '', deliveryDate: '', message: '' }

export default function NegotiationPage() {
  const { id } = useParams()
  const { user, role } = useAuth()
  const [data, setData] = useState(null)
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    api.get(`/offers/${id}/history`).then((response) => setData(response.data)).catch((reason) => setError(reason.message || 'Unable to load negotiation'))
  }, [id])

  useEffect(() => {
    load()
    const timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [load])

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('')
    try {
      await api.post(`/offers/${id}/counter`, { price: Number(form.price) * 100, quantity: Number(form.quantity), deliveryDate: form.deliveryDate, message: form.message })
      setForm(initial); load()
    } catch (reason) { setError(reason.message || 'Unable to send counter-proposal') }
    finally { setSaving(false) }
  }
  const decide = async (action) => {
    setSaving(true); setError('')
    try { await api.post(`/offers/${id}/${action}`); load() } catch (reason) { setError(reason.message || `Unable to ${action} offer`) } finally { setSaving(false) }
  }
  if (!data) return <main className="text-sm text-[#526a57]">Loading negotiation...</main>
  const { offer, history } = data
  const latestByMe = offer.latestProposal?.by === user?.id || offer.latestProposal?.by === user?._id
  const canAccept = offer.status === 'negotiating' && !latestByMe
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <Link to="/offers" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1b3b22]"><ArrowLeft className="h-4 w-4" /> My offers</Link>
      <header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Negotiation thread</p><h1 className="mt-2 font-editorial text-4xl font-semibold">{offer.listingId?.crop || 'Crop requirement'}</h1><p className="mt-2 text-sm text-[#526a57]">Status: <span className="font-semibold capitalize">{offer.status}</span> · Your role: {role}</p></header>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <section className="space-y-3 rounded-2xl border border-[#e1e8e2] bg-white p-5 shadow-sm" aria-label="Negotiation history">
        {history.map((entry) => <div key={entry._id} className={`flex ${entry.senderId === (user?.id || user?._id) ? 'justify-end' : 'justify-start'}`}><div className="max-w-[85%] rounded-2xl bg-[#f4f8f4] p-4"><p className="text-xs font-semibold uppercase text-[#6d8474]">{entry.senderRole} · {new Date(entry.createdAt).toLocaleString('en-IN')}</p><p className="mt-2 text-sm font-semibold">₹{(entry.price / 100).toLocaleString('en-IN')} · {entry.quantity} units</p>{entry.message && <p className="mt-1 text-sm text-[#526a57]">{entry.message}</p>}</div></div>)}
      </section>
      {offer.status === 'negotiating' && <section className="rounded-2xl border border-[#e1e8e2] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {canAccept && <button disabled={saving} onClick={() => decide('accept')} className="btn-forest-pill min-h-11"><Check className="h-4 w-4" /> Accept latest terms</button>}
          <button disabled={saving} onClick={() => decide('reject')} className="min-h-11 rounded-full border border-red-200 px-4 text-sm font-semibold text-red-800"><X className="mr-1 inline h-4 w-4" /> Reject</button>
          {role === 'farmer' && <button disabled={saving} onClick={() => decide('withdraw')} className="min-h-11 rounded-full border border-[#cbd8cc] px-4 text-sm font-semibold">Withdraw</button>}
        </div>
        {!latestByMe && <p className="mt-3 text-xs text-[#6d8474]">You can respond with a counter-proposal or accept the latest terms.</p>}
        {latestByMe && <p className="mt-3 text-xs text-[#6d8474]">Waiting for the other party to respond.</p>}
        {!latestByMe && <form onSubmit={submit} className="mt-5 grid gap-3 md:grid-cols-3">
          <label className="text-sm font-semibold">Price (INR)<input required type="number" min="1" value={form.price} onChange={update('price')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label>
          <label className="text-sm font-semibold">Quantity<input required type="number" min="1" value={form.quantity} onChange={update('quantity')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label>
          <label className="text-sm font-semibold">Delivery date<input required type="date" value={form.deliveryDate} onChange={update('deliveryDate')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label>
          <label className="text-sm font-semibold md:col-span-3">Message<textarea value={form.message} onChange={update('message')} rows="2" className="mt-1 w-full rounded-xl border border-[#dce5dc] p-3 font-normal" /></label>
          <button disabled={saving} className="btn-forest-pill min-h-11 md:col-span-3"><Send className="h-4 w-4" /> {saving ? 'Sending...' : 'Send counter-proposal'}</button>
        </form>}
      </section>}
    </main>
  )
}
