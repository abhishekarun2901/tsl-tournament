import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Fixtures from './pages/Fixtures';
import Table from './pages/Table';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Awards from './pages/Awards';
import UpdateTournament from './pages/UpdateTournament';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-surface-200">
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/fixtures" element={<Fixtures />} />
                    <Route path="/table" element={<Table />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/teams/:id" element={<TeamDetail />} />
                    <Route path="/awards" element={<Awards />} />
                    <Route path="/top-scorers" element={<Awards />} /> {/* Redirect for old URL */}
                    <Route path="/update-tournament" element={<UpdateTournament />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
