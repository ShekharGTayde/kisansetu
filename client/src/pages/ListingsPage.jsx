import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MapPin, Search, Wheat } from 'lucide-react'
import api from '../services/api.js'

const formatPrice = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`

export default function ListingsPage() {
  const { id } = useParams()
  const [listings, setListings] = useState([])
  const [crop, setCrop] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detail, setDetail] = useState(null)
  const [offer, setOffer] = useState({ proposedPrice: '', quantity: '', deliveryDate: '', note: '' })
  const [offerMessage, setOfferMessage] = useState('')
  useEffect(() => {
    if (id) api.get(`/listings/${id}`).then((response) => setDetail(response.data)).catch((reason) => setError(reason.message || 'Unable to load requirement'))
  }, [id])
  useEffect(() => {
    let active = true
    setLoading(true)
    api.get('/listings', { params: { crop: crop || undefined, location: location || undefined } })
      .then((response) => active && setListings(response.data?.items || []))
      .catch((reason) => active && setError(reason.message || 'Unable to load requirements'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [crop, location])

  if (id && detail) return <ListingDetail listing={detail} offer={offer} setOffer={setOffer} message={offerMessage} setMessage={setOfferMessage} />

  return (
    <main className="space-y-7">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Open marketplace</p>
        <h1 className="font-editorial text-4xl font-semibold text-[#15261b] md:text-5xl">Find a requirement worth growing for.</h1>
        <p className="mt-3 text-[#526a57]">Browse live buyer commitments with clear quantities, prices, quality expectations and delivery terms.</p>
      </header>
      <section className="grid gap-3 rounded-2xl border border-[#e1e8e2] bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
        <label className="flex items-center gap-2 rounded-xl border border-[#dce5dc] px-3 focus-within:ring-2 focus-within:ring-[#8fb89a]">
          <Search className="h-4 w-4 text-[#6d8474]" />
          <span className="sr-only">Search by crop</span>
          <input value={crop} onChange={(event) => setCrop(event.target.value)} placeholder="Search crop" className="min-h-11 w-full bg-transparent text-sm outline-none" />
        </label>
        <label className="flex items-center gap-2 rounded-xl border border-[#dce5dc] px-3 focus-within:ring-2 focus-within:ring-[#8fb89a]">
          <MapPin className="h-4 w-4 text-[#6d8474]" />
          <span className="sr-only">Filter by location</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Delivery location" className="min-h-11 w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex min-h-11 items-center justify-center rounded-xl bg-[#f4f8f4] px-4 text-xs font-semibold text-[#1b3b22]">{listings.length} open</div>
      </section>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {loading ? <p className="text-sm text-[#526a57]">Loading requirements...</p> : (
        <section className="grid gap-5 md:grid-cols-2">
          {listings.map((listing) => (
            <article key={listing._id} className="rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6d8474]"><Wheat className="h-4 w-4" /> Buyer requirement</p>
                  <h2 className="mt-2 font-editorial text-3xl font-semibold text-[#15261b]">{listing.crop}</h2>
                  <p className="text-sm text-[#526a57]">{listing.variety || 'Any suitable variety'}</p>
                </div>
                <span className="rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-semibold text-[#1b3b22]">{listing.status}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-[#6d8474]">Volume</p><p className="font-semibold">{listing.remainingQuantity} {listing.unit}</p></div>
                <div><p className="text-xs text-[#6d8474]">Target price</p><p className="font-semibold">{formatPrice(listing.priceTerms.pricePerUnit)} / {listing.unit}</p></div>
                <div><p className="text-xs text-[#6d8474]">Delivery</p><p className="font-semibold">{new Date(listing.deliveryDate).toLocaleDateString('en-IN')}</p></div>
                <div><p className="text-xs text-[#6d8474]">Location</p><p className="font-semibold">{listing.deliveryLocation}</p></div>
              </div>
              <Link to={`/listings/${listing._id}`} className="btn-forest-pill mt-6 min-h-11 w-full">View requirement</Link>
            </article>
          ))}
          {!listings.length && <p className="rounded-2xl border border-dashed border-[#cbd8cc] p-8 text-sm text-[#526a57]">No open requirements match those filters.</p>}
        </section>
      )}
    </main>
  )
}

function ListingDetail({ listing, offer, setOffer, message, setMessage }) {
  const update = (key) => (event) => setOffer((current) => ({ ...current, [key]: event.target.value }))
  const submit = async (event) => {
    event.preventDefault()
    try { await api.post(`/listings/${listing._id}/offers`, { ...offer, proposedPrice: Number(offer.proposedPrice) * 100, quantity: Number(offer.quantity) }); setMessage('Offer submitted. The buyer can now respond in the negotiation thread.') } catch (reason) { setMessage(reason.message || 'Unable to submit offer') }
  }
  return <main className="mx-auto max-w-3xl space-y-6"><Link to="/listings" className="text-sm font-semibold text-[#1b3b22]">← Back to requirements</Link><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Requirement details</p><h1 className="mt-2 font-editorial text-5xl font-semibold">{listing.crop}</h1><p className="mt-2 text-[#526a57]">{listing.variety || 'Any suitable variety'} · {listing.deliveryLocation}</p></header><section className="grid gap-4 rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm sm:grid-cols-2"><p><span className="block text-xs text-[#6d8474]">Volume</span><strong>{listing.remainingQuantity} {listing.unit}</strong></p><p><span className="block text-xs text-[#6d8474]">Buyer target</span><strong>₹{(listing.priceTerms.pricePerUnit / 100).toLocaleString('en-IN')} / {listing.unit}</strong></p><p><span className="block text-xs text-[#6d8474]">Delivery date</span><strong>{new Date(listing.deliveryDate).toLocaleDateString('en-IN')}</strong></p><p><span className="block text-xs text-[#6d8474]">Payment terms</span><strong>{listing.paymentTerms}</strong></p></section><form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#e1e8e2] bg-white p-6 shadow-sm"><h2 className="font-editorial text-3xl font-semibold">Make an offer</h2>{message && <p role="status" className="rounded-xl bg-[#e7f0e8] p-3 text-sm text-[#1b3b22]">{message}</p>}<div className="grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold">Price (INR)<input required type="number" min="1" value={offer.proposedPrice} onChange={update('proposedPrice')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label><label className="text-sm font-semibold">Quantity<input required type="number" min="1" max={listing.remainingQuantity} value={offer.quantity} onChange={update('quantity')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label><label className="text-sm font-semibold">Delivery date<input required type="date" value={offer.deliveryDate} onChange={update('deliveryDate')} className="mt-1 min-h-11 w-full rounded-xl border border-[#dce5dc] px-3 font-normal" /></label></div><label className="text-sm font-semibold">Note<textarea value={offer.note} onChange={update('note')} rows="2" className="mt-1 w-full rounded-xl border border-[#dce5dc] p-3 font-normal" /></label><button className="btn-forest-pill min-h-11 w-full">Submit offer</button></form></main>
}
