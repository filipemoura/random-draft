import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';

export const SelectPlayerPage: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('event');

    useEffect(() => {
        if (!eventId) {
            setError(true);
            setLoading(false);
            return;
        }

        const eventRef = ref(database, `events/${eventId}`);
        get(eventRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    setPlayers(snapshot.val().players || []);
                } else {
                    setError(true);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Erro ao carregar evento:', err);
                setError(true);
                setLoading(false);
            });
    }, [eventId]);

    const handlePlayerClick = (player: Player) => {
        const basePath = window.location.pathname.replace(/\/$/, '') || '';
        window.location.href = `${window.location.origin}${basePath}/?confirm=${eventId}&p=${player.id}`;
    };

    const handleNewPlayer = () => {
        const basePath = window.location.pathname.replace(/\/$/, '') || '';
        window.location.href = `${window.location.origin}${basePath}/?new=${eventId}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
                    <p className="text-white text-xl">Carregando...</p>
                </div>
            </div>
        );
    }

    if (error || !players || players.length === 0) {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center max-w-md">
                    <div className="text-red-400 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Link Inválido</h1>
                    <p className="text-neutral-300">
                        Este evento não foi encontrado ou expirou.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-800 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 pt-8">
                    <div className="text-6xl mb-4">⚽</div>
                    <h1 className="text-3xl font-bold text-brand-primary mb-2">
                        Confirme sua Presença
                    </h1>
                    <p className="text-neutral-400">
                        Clique no seu nome para confirmar
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    {players.map((player: Player) => (
                        <button
                            key={player.id}
                            onClick={() => handlePlayerClick(player)}
                            className="w-full bg-neutral-700 hover:bg-brand-primary text-white font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] text-xl shadow-lg"
                        >
                            {player.name}
                        </button>
                    ))}
                </div>

                <div className="border-t border-neutral-600 pt-6">
                    <p className="text-neutral-400 text-center mb-3 text-sm">
                        Primeira vez no futebol?
                    </p>
                    <button
                        onClick={handleNewPlayer}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] text-xl shadow-lg"
                    >
                        🆕 Sou Novo Aqui
                    </button>
                </div>
            </div>
        </div>
    );
};