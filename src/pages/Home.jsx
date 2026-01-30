import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 gap-6 text-center animate-fade-in">
            <div className="mb-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Order<span className="text-primary">Together</span>
                </h1>
                <p className="text-gray-600 text-lg max-w-xs mx-auto">
                    Pide comida en grupo sin caos.
                </p>
            </div>

            <div className="w-full max-w-xs flex flex-col gap-4">
                <Button onClick={() => navigate('/create')} className="text-lg py-4">
                    Crear Pedido Grupal
                </Button>
                <Button variant="outline" onClick={() => navigate('/join')} className="text-lg py-4">
                    Unirse con Código
                </Button>
            </div>

            {/* Optional: Recent Orders List (Post-MVP) */}
        </div>
    );
};
