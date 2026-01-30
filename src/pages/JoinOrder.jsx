import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { getSessionByCode, joinSession } from '../services/supabase';

import { useOrder } from '../context/OrderContext';
import { ArrowLeft } from 'lucide-react';

export const JoinOrder = () => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setSessionId, setCurrentUser } = useOrder();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const codeParam = searchParams.get('code');
        if (codeParam) setCode(codeParam.toUpperCase());
    }, [searchParams]);

    const handleJoin = async (e) => {
        e.preventDefault();
        setError('');
        if (!code.trim() || !name.trim()) return;

        setLoading(true);
        try {
            const cleanCode = code.trim().toUpperCase();
            // 1. Verify session exists and is open
            const session = await getSessionByCode(cleanCode);

            if (!session) {
                throw new Error('Código inválido o sesión inexistente');
            }
            if (session.status !== 'open') {
                throw new Error('Esta sesión ya está cerrada');
            }

            // 2. Join session
            const participant = await joinSession(session.id, name);

            // 3. Update context
            setSessionId(session.id);
            setCurrentUser(participant);

            // 4. Navigate to Lobby/Menu
            // We'll go to the lobby (ShareCode) so they can see context
            navigate(`/share/${cleanCode}`);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Error al unirse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto min-h-[calc(100vh-64px)] flex flex-col justify-center animate-fade-in">
            <button onClick={() => navigate('/')} className="mb-6 text-gray-500 hover:text-gray-800 flex items-center gap-1">
                <ArrowLeft size={20} /> Volver
            </button>

            <h2 className="text-3xl font-bold mb-6 text-gray-800">Unirse al Pedido</h2>

            <form onSubmit={handleJoin} className="flex flex-col gap-5">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Sesión</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Ej. A7K9P2"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-lg border border-border-main font-mono text-xl tracking-widest uppercase focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Ana"
                        className="w-full px-4 py-3 rounded-lg border border-border-main focus:ring-2 focus:ring-primary outline-none"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded">{error}</p>}

                <Button type="submit" disabled={loading} className="mt-2">
                    {loading ? 'Uniéndose...' : 'Unirse'}
                </Button>
            </form>
        </div>
    )
}
