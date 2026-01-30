import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getSessionDetails, supabase } from '../services/supabase';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || null);
    const [sessionData, setSessionData] = useState(null);
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    // Persist session ID
    useEffect(() => {
        if (sessionId) localStorage.setItem('sessionId', sessionId);
        else localStorage.removeItem('sessionId');
    }, [sessionId]);

    // Persist user
    useEffect(() => {
        if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
        else localStorage.removeItem('currentUser');
    }, [currentUser]);

    // Polling for session updates (Neon Data API doesn't support WebSocket listeners natively like Firestore)
    // We will poll every 3 seconds if there is an active session id
    const refreshSession = useCallback(async () => {
        if (!sessionId) return;
        try {
            const data = await getSessionDetails(sessionId);
            if (data) {
                // Ensure orders items are parsed if string
                if (data.orders) {
                    data.orders = data.orders.map(o => ({
                        ...o,
                        items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items
                    }));
                }
                setSessionData(data);
            }
        } catch (error) {
            console.error("Error polling session:", error);
        }
    }, [sessionId]);

    // Realtime subscriptions
    useEffect(() => {
        if (!sessionId) {
            setSessionData(null);
            return;
        }

        // Initial fetch
        const fetchInitialData = async () => {
            await refreshSession();
        };
        fetchInitialData();

        const channel = supabase.channel(`session_${sessionId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sessions', filter: `id=eq.${sessionId}` },
                (payload) => {
                    if (payload.new) {
                        setSessionData(prev => ({ ...prev, ...payload.new }));
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
                async () => {
                    // Refresh full session to simplify state management for now (avoids duplicating logic)
                    await refreshSession();
                }
            )
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `session_id=eq.${sessionId}` },
                async () => {
                    // Refresh full session to simplify state management for now
                    await refreshSession();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [sessionId, refreshSession]);

    const value = {
        sessionId,
        setSessionId,
        sessionData,
        currentUser,
        setCurrentUser,
        isOrganizer: currentUser?.isOrganizer || currentUser?.is_organizer || false,
        refreshSession
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
