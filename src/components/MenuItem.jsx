import { Plus } from 'lucide-react';
import { Button } from './Button';
import { formatPrice } from '../utils/formatPrice';

export const MenuItem = ({ item, onAdd }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                <span className="font-bold text-primary whitespace-nowrap">{formatPrice(item.price)}</span>
            </div>
            <p className="text-gray-500 text-sm flex-1">{item.description}</p>
            <Button onClick={() => onAdd(item)} variant="outline" className="mt-2 py-2 text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white active:bg-orange-700 transition-colors">
                <Plus size={16} /> Agregar al Pedido
            </Button>
        </div>
    )
}
