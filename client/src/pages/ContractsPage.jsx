import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [error, setError] = useState('')
  useEffect(() => { api.get('/contracts/mine').then((response) => setContracts(response.data || [])).catch((reason) => setError(reason.message || 'Unable to load contracts')) }, [])
  return <main className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Agreements</p><h1 className="font-editorial text-4xl font-semibold">My contracts</h1><p className="mt-2 text-sm text-[#526a57]">Both parties confirm before an agreement becomes active and locked.</p></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<div className="grid gap-4 md:grid-cols-2">{contracts.map((contract) => <Link key={contract._id} to={`/contracts/${contract._id}`} className="rounded-2xl border border-[#e1e8e2] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"><p className="text-xs font-semibold text-[#6d8474]">{contract.contractNo}</p><h2 className="mt-2 font-editorial text-2xl">{contract.terms.crop}</h2><p className="mt-2 text-sm text-[#526a57]">{contract.terms.quantity} {contract.terms.unit} · ₹{(contract.terms.totalAmount / 100).toLocaleString('en-IN')}</p><span className="mt-4 inline-block rounded-full bg-[#e7f0e8] px-3 py-1 text-xs font-semibold text-[#1b3b22]">{contract.status.replace('_', ' ')}</span></Link>)}</div>{!contracts.length && <p className="rounded-2xl border border-dashed border-[#cbd8cc] p-8 text-sm text-[#526a57]">Accepted offers will appear here.</p>}</main>
}
