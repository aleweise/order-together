import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { generateCode } from '../utils/generateCode';
import { createSession, getRestaurants } from '../services/supabase';
import { Header } from '../components/Header';

import { useOrder } from '../context/OrderContext';
import { ArrowLeft } from 'lucide-react';

export const CreateOrder = () => {
    const [organizer, setOrganizer] = useState('');
    const [restaurant, setRestaurant] = useState(''); // Removed default value
    const [restaurantsList, setRestaurantsList] = useState([]); // State for list
    const [loading, setLoading] = useState(false);
    const [loadingRestaurants, setLoadingRestaurants] = useState(true); // Loading state for rest fetch
    const { setSessionId, setCurrentUser } = useOrder();
    const navigate = useNavigate();

    // Fetch restaurants on mount
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getRestaurants();
                if (data) {
                    setRestaurantsList(data);
                }
            } catch (error) {
                console.error("Failed to load restaurants", error);
            } finally {
                setLoadingRestaurants(false);
            }
        };

        fetchRestaurants();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!organizer.trim() || !restaurant) return;

        setLoading(true);
        try {
            const code = generateCode();
            const selectedRestaurant = restaurantsList.find(r => r.id === restaurant);
            const restaurantName = selectedRestaurant?.name || '';
            const session = await createSession(code, organizer, restaurantName, restaurant);

            // Set context
            setSessionId(session.id);
            setCurrentUser(session.participants[0]); // The organizer

            navigate(`/share/${session.code}`);
        } catch (error) {
            console.error(error);
            alert('Error al crear la sesión: ' + (error.message || 'Verifica tu conexión.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center animate-fade-in">
            <button onClick={() => navigate(-1)} className="mb-6 text-gray-500 hover:text-gray-800 flex items-center gap-1">
                <ArrowLeft size={20} /> Volver
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Crear Pedido</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre (Organizador)</label>
                    <input
                        type="text"
                        value={organizer}
                        onChange={(e) => setOrganizer(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-4 py-3 rounded-lg border border-border-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Restaurante</label>
                    {loadingRestaurants ? (
                        <div className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 animate-pulse">
                            Cargando restaurantes...
                        </div>
                    ) : (
                        <select
                            value={restaurant}
                            onChange={(e) => setRestaurant(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-border-main focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow bg-white appearance-none"
                            required
                        >
                            <option value="" disabled>Selecciona un restaurante</option>
                            {restaurantsList.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <Button type="submit" disabled={loading || loadingRestaurants || !restaurant} className="mt-2">
                    {loading ? 'Creando...' : 'Crear Pedido'}
                </Button>
            </form>
        </div>
    )
}
