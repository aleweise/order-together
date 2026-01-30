import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SESSION MANAGEMENT
 */

export const createSession = async (code, organizerName, restaurantName, restaurantId) => {
    // 1. Create session
    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
            code,
            organizer_name: organizerName,
            restaurant_name: restaurantName,
            restaurant_id: restaurantId,
            status: 'open'
        })
        .select()
        .single();

    if (sessionError) throw sessionError;

    // 2. Create organizer participant
    const { data: participant, error: participantError } = await supabase
        .from('participants')
        .insert({
            session_id: session.id,
            name: organizerName,
            is_organizer: true
        })
        .select()
        .single();

    if (participantError) throw participantError;

    return {
        ...session,
        participants: [participant]
    };
};

export const getSessionByCode = async (code) => {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', code)
        .eq('status', 'open')
        .single();

    if (error) throw error;
    return data;
};

export const getSessionDetails = async (sessionId) => {
    // Get session with restaurant data
    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select(`
            *,
            restaurant:restaurants(id, name)
        `)
        .eq('id', sessionId)
        .single();

    if (sessionError) throw sessionError;

    // Get participants
    const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('session_id', sessionId);

    if (participantsError) throw participantsError;

    // Get orders
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('session_id', sessionId);

    if (ordersError) throw ordersError;

    // Return combined data with flattened restaurant fields
    return {
        ...session,
        restaurant_id: session.restaurant?.id,
        restaurant_name: session.restaurant?.name,
        participants: participants || [],
        orders: orders || []
    };
};

export const joinSession = async (sessionId, participantName) => {
    const { data, error } = await supabase
        .from('participants')
        .insert({
            session_id: sessionId,
            name: participantName,
            is_organizer: false
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const closeSession = async (sessionId) => {
    const { data, error } = await supabase
        .from('sessions')
        .update({
            status: 'closed',
            closed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

/**
 * RESTAURANTS & MENU
 */

export const getRestaurants = async () => {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');

    if (error) throw error;
    return data;
};

export const getMenuByRestaurant = async (restaurantId) => {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('available', true);

    if (error) {
        console.warn('Menu fetch failed:', error);
        return [];
    }
    return data;
};

/**
 * ORDERS
 */

export const addOrder = async (sessionId, participantId, participantName, items, total) => {
    const { data, error } = await supabase
        .from('orders')
        .insert({
            session_id: sessionId,
            participant_id: participantId,
            participant_name: participantName,
            items,
            total
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};
