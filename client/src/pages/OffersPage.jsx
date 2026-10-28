import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import api from '../services/api.js'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { api.get('/offers/mine').then((response) => setOffers(response.data || [])).catch((reason) => setError(reason.message || 'Unable to load offers')) }, [])
  return <main className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Offers</p><h1 className="font-editorial text-4xl font-semibold">Negotiation threads</h1><p className="mt-2 text-sm text-[#526a57]">Review proposals and keep every agreement in one transparent thread.</p></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<section className="grid gap-4 md:grid-cols-2">{offers.map((offer) => <Link key={offer._id} to={`/offers/${offer._id}`} className="rounded-2xl border border-[#e1e8e2] bg-white p-5 shadow-sm hover:shadow-md"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs font-semibold uppercase text-[#6d8474]"><MessageSquare className="h-4 w-4" /> {offer.listingId?.crop || 'Requirement'}</span><span className="rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-semibold capitalize text-[#1b3b22]">{offer.status}</span></div><p className="mt-4 font-semibold">Latest: ₹{((offer.latestProposal?.price || offer.proposedPrice) / 100).toLocaleString('en-IN')} · {offer.latestProposal?.quantity || offer.quantity} units</p><p className="mt-1 text-sm text-[#526a57]">Open negotiation thread</p></Link>)}</section>{!offers.length && <p className="rounded-2xl border border-dashed border-[#cbd8cc] p-8 text-sm text-[#526a57]">No offers yet.</p>}</main>
}
