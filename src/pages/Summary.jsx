import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/Button';
import { formatPrice } from '../utils/formatPrice';
import { closeSession } from '../services/supabase';
import { ArrowLeft, Share2, Receipt, Lock } from 'lucide-react';
import { clsx } from 'clsx';

export const Summary = () => {
    const { sessionData, sessionId, currentUser, isOrganizer } = useOrder();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    if (!sessionData) return <div className="p-8 text-center text-gray-500">Cargando pedido...</div>;

    const orders = sessionData.orders || [];
    const participants = sessionData.participants || [];

    // Calculate totals
    const totalGeneral = orders.reduce((sum, order) => sum + order.total, 0);
    const uniqueOrderParticipants = new Set(orders.map(o => o.participantId || o.participant_id)).size;

    // Group orders by participant if multiple allowed per person? 
    // Spec says "Lista de participantes con sus pedidos".
    // We can assume one order entry per person per "Confirm", but maybe they order twice?
    // Let's group by participantId.
    // Group orders by participant
    const groupedOrders = orders.reduce((acc, order) => {
        const pId = order.participantId || order.participant_id;
        const pName = order.participantName || order.participant_name;

        if (!acc[pId]) {
            acc[pId] = {
                name: pName,
                items: [],
                total: 0
            };
        }
        acc[pId].items.push(...(order.items || []));
        acc[pId].total += Number(order.total);
        return acc;
    }, {});

    const handleClose = async () => {
        if (!window.confirm('¿Seguro que quieres cerrar el pedido? Nadie más podrá unirse ni pedir.')) return;
        setLoading(true);
        try {
            await closeSession(sessionId);
        } catch (error) {
            console.error(error);
            alert('Error al cerrar');
        } finally {
            setLoading(false);
        }
    };

    const handleShare = () => {
        // Generate text summary
        let text = `🧾 *Resumen Pedido ${sessionData.restaurantName}*\n\n`;
        Object.values(groupedOrders).forEach(p => {
            text += `👤 *${p.name}*: ${formatPrice(p.total)}\n`;
            p.items.forEach(item => {
                text += `   - ${item.quantity}x ${item.name}\n`;
            });
            text += '\n';
        });
        text += `💰 *TOTAL: ${formatPrice(totalGeneral)}*`;

        navigator.clipboard.writeText(text);
        alert('Resumen copiado al portapapeles!');
    };

    return (
        <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto min-h-screen animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800 flex items-center gap-1">
                    <ArrowLeft size={20} /> Inicio
                </button>
                <div className="flex items-center gap-2">
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide", sessionData.status === 'open' ? "bg-status-open/10 text-status-open" : "bg-status-closed/10 text-status-closed")}>
                        {sessionData.status === 'open' ? 'Abierto' : 'Cerrado'}
                    </span>
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-2">Resumen del Pedido</h2>
            <p className="text-gray-500 mb-8">Código: <span className="font-mono font-bold text-gray-800">{sessionData.code}</span></p>

            <div className="space-y-4 mb-8">
                {Object.values(groupedOrders).length === 0 && (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
                        Aún no hay pedidos.
                    </div>
                )}

                {Object.values(groupedOrders).map((order, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-border-main overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span className="font-bold text-gray-800">{order.name}</span>
                            <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-2 text-sm text-gray-600">
                                {order.items.map((item, i) => (
                                    <li key={i} className="flex justify-between">
                                        <span>{item.quantity}x {item.name}</span>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-gray-800 text-white rounded-xl p-6 shadow-lg mb-8">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-mono text-lg">{formatPrice(totalGeneral)}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold border-t border-gray-700 pt-4">
                    <span>Total General</span>
                    <span>{formatPrice(totalGeneral)}</span>
                </div>
                {participants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400 text-center">
                        ~ {formatPrice(totalGeneral / participants.length)} por persona ({participants.length})
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-3">
                <Button variant="secondary" onClick={handleShare} className="flex items-center justify-center gap-2">
                    <Share2 size={20} /> Compartir Resumen
                </Button>

                {isOrganizer && sessionData.status === 'open' && (
                    <Button variant="primary" onClick={handleClose} disabled={loading} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 border-gray-800">
                        <Lock size={20} /> Cerrar Pedido
                    </Button>
                )}

                {sessionData.status === 'open' && (
                    <Button variant="outline" onClick={() => navigate('/order')} className="flex items-center justify-center gap-2">
                        <Receipt size={20} /> Hacer otro pedido
                    </Button>
                )}
            </div>
        </div>
    );
}
