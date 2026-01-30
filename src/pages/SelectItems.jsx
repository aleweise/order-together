import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { MenuItem } from '../components/MenuItem';
import { Button } from '../components/Button';
import { formatPrice } from '../utils/formatPrice';
import { getMenuByRestaurant, addOrder } from '../services/supabase';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

export const SelectItems = () => {
    const { sessionData, sessionId, currentUser } = useOrder();
    const navigate = useNavigate();
    const [cart, setCart] = useState({}); // { [itemId]: { item, quantity } }
    const [loading, setLoading] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [loadingMenu, setLoadingMenu] = useState(true);

    // Redirect if no session/user
    if (!sessionId || !currentUser) {
        // ...
    }

    // Fetch menu items when session data is available
    useEffect(() => {
        const fetchMenu = async () => {
            if (!sessionData?.restaurant_id) {
                setLoadingMenu(false);
                return;
            }

            try {
                setLoadingMenu(true);
                const items = await getMenuByRestaurant(sessionData.restaurant_id);
                setMenuItems(items || []);
            } catch (error) {
                console.error('Error loading menu:', error);
                setMenuItems([]);
            } finally {
                setLoadingMenu(false);
            }
        };

        fetchMenu();
    }, [sessionData?.restaurant_id]);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev[item.id];
            return {
                ...prev,
                [item.id]: {
                    item,
                    quantity: (existing?.quantity || 0) + 1
                }
            };
        });
    };

    const total = useMemo(() => {
        return Object.values(cart).reduce((sum, { item, quantity }) => sum + (item.price * quantity), 0);
    }, [cart]);

    const handleConfirm = async () => {
        if (total === 0) return;
        setLoading(true);
        try {
            const orderItems = Object.values(cart).map(({ item, quantity }) => ({
                name: item.name,
                price: item.price,
                quantity
            }));

            // Pass participant data directly as simple arguments
            await addOrder(sessionId, currentUser.id, currentUser.name, orderItems, total);

            navigate('/summary');
        } catch (error) {
            console.error(error);
            alert('Error al enviar el pedido');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pb-24 pt-4 px-4 max-w-2xl mx-auto min-h-screen animate-fade-in relative">
            <div className="flex items-center justify-between mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-800 flex items-center gap-1">
                    <ArrowLeft size={20} />
                </button>
                <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Restaurante</p>
                    <p className="font-bold text-gray-800">{sessionData?.restaurant_name || 'Cargando...'}</p>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Elige tu Plato</h2>
                <p className="text-gray-500">Hola {currentUser?.name}, ¿qué vas a comer hoy?</p>
            </div>

            {loadingMenu ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">Cargando menú...</p>
                </div>
            ) : menuItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">No hay items disponibles en este momento</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menuItems.map(item => (
                        <MenuItem key={item.id} item={item} onAdd={addToCart} />
                    ))}
                </div>
            )}

            {/* Floating Footer */}
            {Object.keys(cart).length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 z-40 animate-slide-up">
                    <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500">Total parcial ({Object.values(cart).reduce((acc, curr) => acc + curr.quantity, 0)} items)</span>
                            <span className="text-2xl font-bold text-gray-800">{formatPrice(total)}</span>
                        </div>
                        <Button onClick={handleConfirm} disabled={loading} className="w-auto px-8 py-3">
                            {loading ? 'Enviando...' : 'Confirmar Pedido'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
