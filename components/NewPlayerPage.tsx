import React, { useState } from 'react';
import { Role } from '../types';
import { RoleIcon } from './RoleIcon';
import { CheckCircleIcon } from './Icons';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';

export const NewPlayerPage: React.FC = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<Role>(Role.REGULAR);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('new');

        if (!eventId) return;

        setLoading(true);

        const newPlayerId = crypto.randomUUID();

        try {
            // Salva novo jogador (estrutura simples)
            const newPlayerRef = ref(database, `events/${eventId}/newPlayers/${newPlayerId}`);
            await set(newPlayerRef, {
                name: name.trim(),
                role: role,
                timestamp: new Date().toISOString()
            });

            // Marca confirmação
            const confirmRef = ref(database, `events/${eventId}/confirmations/${newPlayerId}`);
            await set(confirmRef, {
                name: name.trim(),
                timestamp: new Date().toISOString(),
                isNew: true
            });

            setSubmitted(true);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('❌ Erro ao confirmar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center max-w-md">
                    <CheckCircleIcon className="w-24 h-24 text-green-400 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Bem-vindo(a)!
                    </h1>
                    <p className="text-neutral-300 text-xl mb-6">
                        <span className="text-brand-primary font-bold">{name}</span>, sua presença foi confirmada!
                    </p>
                    <p className="text-neutral-400 mb-2">
                        Você foi adicionado(a) à lista de jogadores.
                    </p>
                    <p className="text-neutral-400">
                        Nos vemos na futebol! ⚽🔥
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
            <div className="bg-neutral-700 p-6 rounded-xl max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🆕</div>
                    <h1 className="text-2xl font-bold text-brand-primary mb-2">
                        Primeira vez na futebol?
                    </h1>
                    <p className="text-neutral-400">
                        Preencha seus dados para confirmar presença
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Seu nome completo
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite seu nome..."
                            autoFocus
                            required
                            disabled={loading}
                            className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Você é:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.values(Role) as Array<Role>).map(roleOption => (
                                <label 
                                    key={roleOption}
                                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${
                                        role === roleOption 
                                            ? 'bg-brand-primary text-white' 
                                            : 'bg-neutral-600 hover:bg-neutral-500'
                                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={roleOption}
                                        checked={role === roleOption}
                                        onChange={() => setRole(roleOption)}
                                        disabled={loading}
                                        className="hidden"
                                    />
                                    <RoleIcon role={roleOption} />
                                    <span className="text-sm">{roleOption}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-500 text-white font-bold py-3 px-4 rounded-lg transition"
                    >
                        {loading ? '⏳ Confirmando...' : '✅ Confirmar Presença'}
                    </button>
                </form>

                <div className="mt-6 bg-blue-600 bg-opacity-20 border border-blue-400 p-3 rounded-lg">
                    <p className="text-blue-300 text-xs text-center">
                        Ao confirmar, você será adicionado à lista de jogadores
                    </p>
                </div>
            </div>
        </div>
    );
};