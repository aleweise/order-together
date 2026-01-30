import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { CreateOrder } from './pages/CreateOrder';
import { JoinOrder } from './pages/JoinOrder';
import { ShareCode } from './pages/ShareCode';
import { SelectItems } from './pages/SelectItems';
import { Summary } from './pages/Summary';

function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pt-16">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateOrder />} />
            <Route path="/join" element={<JoinOrder />} />
            <Route path="/share/:code" element={<ShareCode />} />
            <Route path="/order" element={<SelectItems />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </OrderProvider>
    </BrowserRouter>
  )
}

export default App;
