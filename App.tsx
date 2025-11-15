import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Player, Role } from './types';
import { CaptainIcon, ChildIcon, GoalkeeperIcon, ShuffleIcon, TrashIcon } from './components/Icons';

// FIX: Changed from a generic arrow function to a standard function declaration
// to avoid issues with TypeScript's parser in .tsx files, ensuring the
// generic type T is correctly inferred.
// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const RoleIcon: React.FC<{ role: Role }> = ({ role }) => {
    const iconMap = {
        [Role.CAPTAIN]: <CaptainIcon className="w-5 h-5 text-yellow-400" />,
        [Role.GOALKEEPER]: <GoalkeeperIcon className="w-5 h-5 text-blue-400" />,
        [Role.CHILD]: <ChildIcon className="w-5 h-5 text-pink-400" />,
        [Role.REGULAR]: null,
    };
    return iconMap[role] ? <span title={role}>{iconMap[role]}</span> : null;
};


const App: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>(() => {
        try {
            const savedPlayers = localStorage.getItem('team-sorter-players');
            return savedPlayers ? JSON.parse(savedPlayers) : [];
        } catch (error) {
            console.error("Falha ao carregar jogadores do localStorage", error);
            return [];
        }
    });
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerRole, setNewPlayerRole] = useState<Role>(Role.REGULAR);
    const [teams, setTeams] = useState<Player[][] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numberOfTeams, setNumberOfTeams] = useState<number>(2);

    useEffect(() => {
        try {
            localStorage.setItem('team-sorter-players', JSON.stringify(players));
        } catch (error) {
            console.error("Falha ao salvar jogadores no localStorage", error);
        }
    }, [players]);

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;

        const newPlayer: Player = {
            id: crypto.randomUUID(),
            name: newPlayerName.trim(),
            role: newPlayerRole,
        };

        setPlayers(prev => [...prev, newPlayer]);
        setNewPlayerName('');
        setNewPlayerRole(Role.REGULAR);
        setError(null);
    };

    const handleRemovePlayer = (id: string) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    };

    const handleClearAll = () => {
        setPlayers([]);
        setTeams(null);
        setError(null);
    }
    
    const handleSortTeams = useCallback(() => {
        setError(null);
        setTeams(null);

        const captains = players.filter(p => p.role === Role.CAPTAIN);
        const goalkeepers = players.filter(p => p.role === Role.GOALKEEPER);
        const children = players.filter(p => p.role === Role.CHILD);
        const regulars = players.filter(p => p.role === Role.REGULAR);
        
        if (players.length < numberOfTeams) {
            setError(`São necessários pelo menos ${numberOfTeams} jogadores para o sorteio.`);
            return;
        }
        if (captains.length > 0 && captains.length !== numberOfTeams) {
            setError(`O número de capitães deve ser 0 ou igual ao número de times (${numberOfTeams}).`);
            return;
        }
        if (goalkeepers.length > 0 && goalkeepers.length !== numberOfTeams) {
            setError(`O número de goleiros deve ser 0 ou igual ao número de times (${numberOfTeams}).`);
            return;
        }

        let newTeams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

        // 1. Assign Captains if the rule is met (one per team)
        if (captains.length === numberOfTeams) {
            shuffleArray(captains).forEach((captain, index) => {
                newTeams[index].push(captain);
            });
        }

        // 2. Assign Goalkeepers if the rule is met (one per team)
        if (goalkeepers.length === numberOfTeams) {
            shuffleArray(goalkeepers).forEach((goalkeeper, index) => {
                newTeams[index].push(goalkeeper);
            });
        }
        
        // 3. Gather all remaining players to be sorted
        const remainingPlayers = shuffleArray([
            ...regulars,
            ...children,
            ...(captains.length !== numberOfTeams ? captains : []),
            ...(goalkeepers.length !== numberOfTeams ? goalkeepers : []),
        ]);

        // 4. Distribute remaining players one by one to the smallest team to ensure balance
        remainingPlayers.forEach(player => {
            // FIX: Explicitly typing the reduce function's parameters (`prev` and `curr`)
            // ensures that TypeScript correctly infers them as Player arrays, preventing
            // potential errors where they might be treated as 'unknown'.
            const smallestTeam = newTeams.reduce((prev: Player[], curr: Player[]) =>
                (curr.length < prev.length ? curr : prev)
            );
            smallestTeam.push(player);
        });

        setTeams(newTeams);
    }, [players, numberOfTeams]);

    const roleCounts = useMemo(() => {
        // FIX: Replaced the type assertion on the initial value with a generic type
        // argument on the `reduce` function. This provides stronger type checking for
        // the accumulator and resolves errors where it could be inferred as an empty
        // object `{}` instead of `Record<Role, number>`.
        return players.reduce<Record<Role, number>>((acc, player) => {
            if (!acc[player.role]) {
                acc[player.role] = 0;
            }
            acc[player.role]++;
            return acc;
        }, {} as Record<Role, number>);
    }, [players]);


    return (
        <div className="min-h-screen bg-neutral-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary tracking-tight">Sorteio de Times</h1>
                    <p className="text-neutral-400 mt-2">Adicione os jogadores e sorteie os times de forma justa!</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Player Management Section */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg flex flex-col">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">Gerenciar Jogadores</h2>
                            <form onSubmit={handleAddPlayer} className="space-y-4">
                                <input
                                    type="text"
                                    value={newPlayerName}
                                    onChange={e => setNewPlayerName(e.target.value)}
                                    placeholder="Nome do Jogador"
                                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    {(Object.values(Role) as Array<Role>).map(role => (
                                        <label key={role} className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${newPlayerRole === role ? 'bg-brand-primary text-white' : 'bg-neutral-600 hover:bg-neutral-500'}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role}
                                                checked={newPlayerRole === role}
                                                onChange={() => setNewPlayerRole(role)}
                                                className="hidden"
                                            />
                                            <RoleIcon role={role} />
                                            <span>{role}</span>
                                        </label>
                                    ))}
                                </div>
                                <button type="submit" className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                                    Adicionar
                                </button>
                            </form>

                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-3">Jogadores ({players.length})</h3>
                                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                    {players.length === 0 && <p className="text-neutral-400">Nenhum jogador adicionado ainda.</p>}
                                    {players.map(p => (
                                        <li key={p.id} className="flex items-center justify-between bg-neutral-600 p-3 rounded-lg animate-fade-in">
                                            <div className="flex items-center space-x-3">
                                                <RoleIcon role={p.role} />
                                                <span className="font-medium">{p.name}</span>
                                            </div>
                                            <button onClick={() => handleRemovePlayer(p.id)} className="text-red-400 hover:text-red-500 transition">
                                                <TrashIcon />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-auto pt-6">
                             <div className="mb-4">
                                <label htmlFor="num-teams" className="block text-sm font-medium text-neutral-300 mb-2">
                                    Número de Times
                                </label>
                                <input
                                    id="num-teams"
                                    type="number"
                                    value={numberOfTeams}
                                    onChange={e => setNumberOfTeams(Math.max(2, parseInt(e.target.value) || 2))}
                                    min="2"
                                    className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={handleSortTeams} 
                                    disabled={players.length < 2}
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
                            {error && <p className="text-red-400 mt-4 text-center font-semibold">{error}</p>}
                        </div>
                    </div>

                    {/* Teams Display Section */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">Times Sorteados</h2>
                        {teams ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {teams.map((team, index) => (
                                    <div key={index} className="bg-neutral-600 p-4 rounded-lg flex flex-col">
                                        <h3 className="text-xl font-bold text-brand-primary mb-3">Time {index + 1} ({team.length})</h3>
                                        <ul className="space-y-2">
                                            {team.map(player => (
                                                <li key={player.id} className="flex items-center space-x-2 bg-neutral-700 p-2 rounded">
                                                    <RoleIcon role={player.role} />
                                                    <span>{player.name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-neutral-400">
                                <p>Os times aparecerão aqui após o sorteio.</p>
                            </div>
                        )}
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
