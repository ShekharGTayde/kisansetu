import { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/useAuth.js'

export default function CropOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const { role } = useAuth()
  useEffect(() => { api.get('/crops/orders/mine').then((response) => setOrders(response.data || [])).catch((reason) => setError(reason.message || 'Unable to load orders')) }, [])
  const decide = async (id, status) => { try { const response = await api.patch(`/crops/orders/${id}/status`, { status }); setOrders((current) => current.map((order) => order._id === id ? { ...order, status: response.data.status } : order)) } catch (reason) { setError(reason.message || 'Unable to update order') } }
  return <main className="space-y-6"><header><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d8474]">Direct crop orders</p><h1 className="font-editorial text-4xl font-semibold">{role === 'farmer' ? 'Purchase requests' : 'My crop purchases'}</h1></header>{error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}<section className="grid gap-4">{orders.map((order) => <article key={order._id} className="flex flex-col justify-between gap-4 rounded-2xl border border-[#e1e8e2] bg-white p-5 shadow-sm md:flex-row md:items-center"><div><h2 className="font-editorial text-2xl font-semibold">{order.cropListingId?.crop || 'Crop order'}</h2><p className="text-sm text-[#526a57]">{order.quantity} {order.unit} · ₹{(order.totalAmount / 100).toLocaleString('en-IN')} · {order.buyerId?.name || order.farmerId?.name}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-[#e7f0e8] px-3 py-2 text-xs font-semibold capitalize text-[#1b3b22]">{order.status}</span>{role === 'farmer' && order.status === 'pending' && <><button onClick={() => decide(order._id, 'accepted')} className="btn-forest-pill min-h-11">Accept</button><button onClick={() => decide(order._id, 'rejected')} className="min-h-11 rounded-full border border-red-200 px-4 text-xs font-semibold text-red-800">Reject</button></>}</div></article>)}{!orders.length && <p className="rounded-2xl border border-dashed border-[#cbd8cc] p-8 text-sm text-[#526a57]">No direct crop orders yet.</p>}</section></main>
}
