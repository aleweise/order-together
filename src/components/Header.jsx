import { Pizza } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
            <div className="max-w-md mx-auto h-full px-4 flex items-center justify-center relative">
                <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity no-underline">
                    <Pizza size={28} />
                    <span className="text-xl font-bold text-gray-800">Ordernemos Juntos</span>
                </Link>
            </div>
        </header>
    );
}
