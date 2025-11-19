import React, { useEffect, useState } from 'react';
import { CheckCircleIcon } from './Icons';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebase';

export const ConfirmationPage: React.FC = () => {
    const [playerName, setPlayerName] = useState<string>('');
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('confirm');
        const playerId = urlParams.get('p');

        if (!eventId || !playerId) {
            setStatus('error');
            return;
        }

        // Busca dados do evento no Firebase
        const eventRef = ref(database, `events/${eventId}`);
        get(eventRef)
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    setStatus('error');
                    return;
                }

                const { players } = snapshot.val();
                const player = players.find((p: any) => p.id === playerId);

                if (!player) {
                    setStatus('error');
                    return;
                }

                setPlayerName(player.name);

                // Verifica se já confirmou
                const confirmRef = ref(database, `events/${eventId}/confirmations/${playerId}`);
                get(confirmRef).then((confirmSnapshot) => {
                    if (confirmSnapshot.exists()) {
                        setStatus('already');
                        return;
                    }

                    // Marca confirmação no Firebase
                    set(confirmRef, {
                        name: player.name,
                        timestamp: new Date().toISOString()
                    }).then(() => {
                        setStatus('success');
                    });
                });
            })
            .catch((err) => {
                console.error('Erro ao confirmar:', err);
                setStatus('error');
            });
    }, []);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-primary mx-auto mb-4"></div>
                    <p className="text-white text-xl">Confirmando presença...</p>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center max-w-md">
                    <div className="text-red-400 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Link Inválido</h1>
                    <p className="text-neutral-300">
                        Este link de confirmação não é válido ou expirou.
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'already') {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center max-w-md">
                    <CheckCircleIcon className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Já Confirmado!
                    </h1>
                    <p className="text-neutral-300 text-xl mb-6">
                        <span className="text-brand-primary font-bold">{playerName}</span>, você já confirmou presença anteriormente!
                    </p>
                    <p className="text-neutral-400">
                        Nos vemos no futebol! ⚽
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
            <div className="bg-neutral-700 p-8 rounded-xl text-center max-w-md">
                <CheckCircleIcon className="w-24 h-24 text-green-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold text-white mb-2">
                    Presença Confirmada!
                </h1>
                <p className="text-neutral-300 text-xl mb-6">
                    Obrigado, <span className="text-brand-primary font-bold">{playerName}</span>!
                </p>
                <p className="text-neutral-400 mb-4">
                    Sua presença foi confirmada com sucesso.
                </p>
                <p className="text-neutral-400">
                    Nos vemos no futebol! ⚽🔥
                </p>
            </div>
        </div>
    );
};