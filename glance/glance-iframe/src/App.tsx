import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import TrendingPage from './pages/TrendingPage';
import GoldPricePage from './pages/GoldPricePage';
import 'src/styles/global.css';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/trending' element={<TrendingPage />} />
          <Route path='/gold-price' element={<GoldPricePage />} />
          <Route path='/' element={<Navigate to='/trending' replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
