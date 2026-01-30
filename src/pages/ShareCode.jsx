import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { getSessionByCode } from '../services/supabase';
import { authClient } from '../services/auth';
import { Button } from '../components/Button';
import { ParticipantList } from '../components/ParticipantList';
import { Copy, Check, ArrowRight, ArrowLeft } from 'lucide-react';

export const ShareCode = () => {
    const { code } = useParams();
    const { sessionData, setSessionId, sessionId, currentUser } = useOrder();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            if (!code) return;
            // If we already have the correct session data loaded
            if (sessionData && sessionData.code === code) {
                setLoading(false);
                return;
            }

            // Otherwise fetch it
            try {
                setLoading(true);
                // Try fetching directly. If it fails due to auth (401/403 or empty), we might need to sign in.
                // But getSessionByCode does the fetch. 
                // Let's force an auth check if we get an error or maybe just preemptively.
                // A better approach: check if we are authenticated?
                // The neonFetch will error if 401.

                let session = null;
                try {
                    session = await getSessionByCode(code);
                } catch (firstErr) {
                    // If error is related to auth, try to sign in
                    if (firstErr.message && (firstErr.message.includes('401') || firstErr.message.includes('403') || firstErr.message.includes('credentials'))) {
                        const { error: authError } = await authClient.signIn.anonymous();
                        if (!authError) {
                            session = await getSessionByCode(code);
                        } else {
                            throw firstErr; // rethrow original if auth fails
                        }
                    } else {
                        throw firstErr;
                    }
                }

                if (session) {
                    setSessionId(session.id);
                } else {
                    alert('Sesión no encontrada!');
                    navigate('/');
                }
            } catch (e) {
                console.error(e);
                alert("Error cargando sesión. Intenta recargar.");
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, [code, sessionData, setSessionId, navigate]);

    const handleStart = () => {
        if (!currentUser) {
            navigate(`/join?code=${code}`);
        } else {
            navigate(`/order`);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(sessionData?.code || code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Cargando...</div>;
    if (!sessionData) return null;

    return (
        <div className="p-6 max-w-md mx-auto min-h-[calc(100vh-64px)] flex flex-col items-center gap-8 animate-fade-in text-center">
            {!currentUser && (
                <button onClick={() => navigate('/')} className="self-start text-gray-500 hover:text-gray-800 flex items-center gap-1 -mb-4">
                    <ArrowLeft size={20} /> Ir al Inicio
                </button>
            )}

            <div className="w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Código de Pedido</h2>
                <p className="text-gray-500 text-sm mb-4">Comparte este código con tu grupo</p>

                <button
                    className="w-full bg-white border-2 border-primary border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-orange-50 transition-colors group"
                    onClick={copyToClipboard}
                >
                    <span className="text-5xl font-mono font-bold text-gray-800 tracking-widest group-hover:scale-105 transition-transform">{sessionData.code}</span>
                    <span className="text-primary text-sm font-medium flex items-center gap-1">
                        {copied ? <><Check size={16} /> Copiado al portapapeles</> : <><Copy size={16} /> Tocar para copiar</>}
                    </span>
                </button>
            </div>

            <div className="w-full text-left">
                <ParticipantList participants={sessionData.participants || []} />
            </div>

            <div className="w-full mt-auto pb-6">
                <Button onClick={handleStart} className="flex items-center justify-center gap-2 shadow-lg shadow-orange-200">
                    {currentUser ? 'Empezar a Elegir Platos' : 'Unirse al Pedido'}
                    <ArrowRight size={20} />
                </Button>
            </div>
        </div>
    );
};
