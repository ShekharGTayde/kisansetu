import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../services/api.js'

export default function ListingOffersPage() {
  const { id } = useParams()
  const [offers, setOffers] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { api.get(`/listings/${id}/offers`).then((response) => setOffers(response.data || [])).catch((reason) => setError(reason.message || 'Unable to load offers')) }, [id])
  return <main className="space-y-6"><Link to="/buyer/listings" className="text-sm font-semibold text-[#1b3b22]">← My requirements</Link><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Buyer workspace</p><h1 className="font-editorial text-4xl font-semibold">Offers on this requirement</h1><p className="mt-2 text-sm text-[#526a57]">Compare farmer proposals and open a thread to negotiate.</p></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<section className="overflow-x-auto rounded-2xl border border-[#e1e8e2] bg-white shadow-sm"><table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">Farmer offers</caption><thead className="bg-[#f4f8f4] text-xs uppercase tracking-wider text-[#6d8474]"><tr><th className="p-4">Farmer</th><th className="p-4">Price</th><th className="p-4">Quantity</th><th className="p-4">Status</th><th className="p-4">Action</th></tr></thead><tbody>{offers.map((offer) => <tr key={offer._id} className="border-t border-[#edf0eb]"><td className="p-4 font-semibold">{offer.farmerId?.name || 'Farmer'}</td><td className="p-4">₹{((offer.latestProposal?.price || offer.proposedPrice) / 100).toLocaleString('en-IN')}</td><td className="p-4">{offer.latestProposal?.quantity || offer.quantity}</td><td className="p-4 capitalize">{offer.status}</td><td className="p-4"><Link className="font-semibold text-[#1b3b22] underline" to={`/offers/${offer._id}`}>Open thread</Link></td></tr>)}</tbody></table>{!offers.length && <p className="p-6 text-sm text-[#526a57]">No farmer offers yet.</p>}</section></main>
}
