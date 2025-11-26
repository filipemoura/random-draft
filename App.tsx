import React, { useState } from 'react';
import { Player, Role } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTeamSorter } from './hooks/useTeamSorter';
import { useEventManagement } from './hooks/useEventManagement';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { PlayerForm } from './components/PlayerForm';
import { PlayerList } from './components/PlayerList';
import { TeamsDisplay } from './components/TeamsDisplay';
import { EventHistory } from './components/EventHistory';
import { TeamControls } from './components/TeamControls';
import { WhatsAppGroupCheckIn } from './components/WhatsAppGroupCheckIn';
import { ConfirmationPage } from './components/ConfirmationPage';
import { NewPlayerPage } from './components/NewPlayerPage';
import { SelectPlayerPage } from './components/SelectPlayerPage';

const App: React.FC = () => {
    // Estados
    const [players, setPlayers] = useLocalStorage<Player[]>('team-sorter-players', []);
    const [teams, setTeams] = useState<Player[][] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [numberOfTeams, setNumberOfTeams] = useState<number>(2);
    const [showWhatsAppCheckIn, setShowWhatsAppCheckIn] = useState(false);

    // Hooks customizados
    const { sortTeams } = useTeamSorter();
    const { syncing, syncEvent } = useFirebaseSync();
    const {
        activeEventId,
        eventHistory,
        toggleEvent,
        reactivateEventManually,
        refreshActiveEvent
    } = useEventManagement();

    // Roteamento
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('confirm')) return <ConfirmationPage />;
    if (urlParams.has('new')) return <NewPlayerPage />;
    if (urlParams.has('event')) return <SelectPlayerPage />;

    // Handlers de jogadores
    const handleAddPlayer = (name: string, role: Role) => {
        const newPlayer: Player = {
            id: crypto.randomUUID(),
            name,
            role,
            present: true,
        };
        setPlayers(prev => [...prev, newPlayer]);
        setError(null);
    };

    const handleRemovePlayer = (id: string) => {
        setPlayers(prev => prev.filter(p => p.id !== id));
    };

    const handleTogglePresence = (id: string) => {
        setPlayers(prev =>
            prev.map(p => p.id === id ? { ...p, present: !p.present } : p)
        );
    };

    const handleClearAll = () => {
        if (window.confirm('⚠️ Tem certeza que deseja remover todos os jogadores? Esta ação não pode ser desfeita.')) {
            setPlayers([]);
            setTeams(null);
            setError(null);
        }
    };

    // Handler de times
    const handleSortTeams = () => {
        setError(null);
        setTeams(null);

        const presentPlayers = players.filter(p => p.present);

        if (presentPlayers.length === 0) {
            setError('Marque pelo menos um jogador como presente para o sorteio.');
            return;
        }

        try {
            const sortedTeams = sortTeams(presentPlayers, numberOfTeams);
            setTeams(sortedTeams);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao sortear times');
        }
    };

    // Handler de sincronização
    const handleSync = () => {
        if (activeEventId) {
            syncEvent(activeEventId, players, setPlayers);
        }
    };

    // Handler reativar manual
    const handleManualReactivate = () => {
        const eventId = prompt('Cole o ID do evento que deseja reativar:');
        if (eventId && eventId.trim()) {
            reactivateEventManually(eventId);
            alert('✅ Evento reativado!');
        }
    };

    const presentCount = players.filter(p => p.present).length;

    return (
        <div className="min-h-screen bg-neutral-800 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-primary tracking-tight">
                        Sorteio de Times
                    </h1>
                    <p className="text-neutral-400 mt-2">
                        Adicione os jogadores e sorteie os times de forma justa!
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Coluna Esquerda - Gerenciar Jogadores */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg flex flex-col">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">
                                Gerenciar Jogadores
                            </h2>
                            <PlayerForm onAddPlayer={handleAddPlayer} />
                            <PlayerList
                                players={players}
                                onRemovePlayer={handleRemovePlayer}
                                onTogglePresence={handleTogglePresence}
                            />
                        </div>

                        <div className="mt-auto pt-6">
                            {/* Histórico de Eventos */}
                            <EventHistory
                                events={eventHistory}
                                activeEventId={activeEventId}
                                onToggle={toggleEvent}
                            />

                            {/* Botão Sincronizar */}
                            {activeEventId && (
                                <button
                                    onClick={handleSync}
                                    disabled={syncing}
                                    className="w-full mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Confirmações'}
                                </button>
                            )}

                            {/* Botão Reativar Manual */}
                            {!activeEventId && (
                                <button
                                    onClick={handleManualReactivate}
                                    className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition text-sm"
                                >
                                    🔑 Reativar com ID Manual
                                </button>
                            )}

                            {/* Botão WhatsApp */}
                            <button
                                onClick={() => setShowWhatsAppCheckIn(true)}
                                disabled={players.length === 0}
                                className="w-full mb-4 bg-green-600 hover:bg-green-700 disabled:bg-neutral-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                            >
                                📱 Enviar Confirmação para Grupo
                            </button>

                            {/* Controles de Times */}
                            <TeamControls
                                numberOfTeams={numberOfTeams}
                                setNumberOfTeams={setNumberOfTeams}
                                presentCount={presentCount}
                                onSortTeams={handleSortTeams}
                                onClearAll={handleClearAll}
                                error={error}
                            />
                        </div>
                    </div>

                    {/* Coluna Direita - Times Sorteados */}
                    <div className="bg-neutral-700 p-6 rounded-xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-brand-primary pb-2">
                            Times Sorteados
                        </h2>
                        <TeamsDisplay teams={teams} />
                    </div>
                </main>

                {/* Footer */}
                <footer className="text-center text-neutral-500 mt-12">
                    <p>@filipealves</p>
                </footer>
            </div>

            {/* Modal WhatsApp */}
            {showWhatsAppCheckIn && (
                <WhatsAppGroupCheckIn
                    players={players}
                    onClose={() => {
                        setShowWhatsAppCheckIn(false);
                        refreshActiveEvent();
                    }}
                />
            )}
        </div>
    );
};

export default App;