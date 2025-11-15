import React, { useState } from 'react';
import { Player, Role } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTeamSorter } from './hooks/useTeamSorter';
import { PlayerForm } from './components/PlayerForm';
import { PlayerList } from './components/PlayerList';
import { TeamsDisplay } from './components/TeamsDisplay';
import { ShuffleIcon } from './components/Icons';

const App: React.FC = () => {
    const [players, setPlayers] = useLocalStorage<Player[]>('team-sorter-players', []);
    const [teams, setTeams] = useState<Player[][] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numberOfTeams, setNumberOfTeams] = useState<number>(2);
    const { sortTeams } = useTeamSorter();

    const handleAddPlayer = (name: string, role: Role) => {
        const newPlayer: Player = {
            id: crypto.randomUUID(),
            name,
            role,
        };
        setPlayers(prev => [...prev, newPlayer]);
        setError(null);
    };

    const handleRemovePlayer = (id: string) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    };

    const handleClearAll = () => {
        setPlayers([]);
        setTeams(null);
        setError(null);
    };

    const handleSortTeams = () => {
        setError(null);
        setTeams(null);

        try {
            const sortedTeams = sortTeams(players, numberOfTeams);
            setTeams(sortedTeams);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao sortear times');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary tracking-tight">
                        Sorteio de Times
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Adicione os jogadores e sorteie os times de forma justa!
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Player Management Section */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg flex flex-col">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">
                                Gerenciar Jogadores
                            </h2>
                            <PlayerForm onAddPlayer={handleAddPlayer} />
                            <PlayerList players={players} onRemovePlayer={handleRemovePlayer} />
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Número de Times
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfTeams(prev => Math.max(2, prev - 1))}
                                        className="w-12 h-12 bg-neutral-600 hover:bg-neutral-500 text-white font-bold text-2xl rounded-lg transition"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        value={numberOfTeams}
                                        onChange={e => setNumberOfTeams(Math.max(2, parseInt(e.target.value) || 2))}
                                        min="2"
                                        className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-center text-lg font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfTeams(prev => prev + 1)}
                                        className="w-12 h-12 bg-neutral-600 hover:bg-neutral-500 text-white font-bold text-2xl rounded-lg transition"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleSortTeams}
                                    disabled={players.length < numberOfTeams}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-neutral-500 disabled:cursor-not-allowed"
                                >
                                    <ShuffleIcon />
                                    Sortear Times
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                                >
                                    Limpar Tudo
                                </button>
                            </div>
                            {error && (
                                <p className="text-red-400 mt-4 text-center font-semibold">{error}</p>
                            )}
                        </div>
                    </div>

                    {/* Teams Display Section */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">
                            Times Sorteados
                        </h2>
                        <TeamsDisplay teams={teams} />
                    </div>
                </main>

                <footer className="text-center text-neutral-500 mt-12">
                    <p>@filipealves</p>
                </footer>
            </div>
        </div>
    );
};

export default App;