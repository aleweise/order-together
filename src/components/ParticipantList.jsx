import { User } from 'lucide-react';
import { clsx } from 'clsx';

export const ParticipantList = ({ participants = [] }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-border-main p-4 w-full">
            <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center gap-2">
                <User size={20} className="text-primary" /> Participantes ({participants.length})
            </h3>
            <ul className="max-h-60 overflow-y-auto space-y-1">
                {participants.length === 0 && <li className="text-gray-400 italic text-sm">Esperando a que se unan...</li>}
                {participants.map(p => (
                    <li key={p.id} className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded transition-colors border-b border-gray-50 last:border-0">
                        <span className={clsx("font-medium", (p.isOrganizer || p.is_organizer) ? "text-primary" : "text-gray-800")}>{p.name}</span>
                        {(p.isOrganizer || p.is_organizer) && <span className="text-[10px] bg-secondary text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Host</span>}
                    </li>
                ))}
            </ul>
        </div>
    )
}
