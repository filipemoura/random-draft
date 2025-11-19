import React, { useState } from 'react';
import { Player } from '../types';
import { ref, set } from 'firebase/database';
import { database } from '../firebase';

interface WhatsAppGroupCheckInProps {
    players: Player[];
    onClose: () => void;
}

export const WhatsAppGroupCheckIn: React.FC<WhatsAppGroupCheckInProps> = ({ players, onClose }) => {
    const [eventId] = useState(() => crypto.randomUUID());
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const sendToGroup = async () => {
        setLoading(true);

        try {
            // Salva no Firebase
            const eventRef = ref(database, `events/${eventId}`);
            await set(eventRef, {
                players: players.map(p => ({ id: p.id, name: p.name, role: p.role })),
                createdAt: new Date().toISOString()
            });

            const basePath = window.location.pathname.replace(/\/$/, '') || '';
            const confirmLink = `${window.location.origin}${basePath}/?event=${eventId}`;

            const groupMessage = `🏆 *FUTEBOL - CONFIRME SUA PRESENÇA!* 🏆

👇 *Clique aqui para confirmar:*
${confirmLink}

⚽ Vai abrir uma página com seu nome
⚡ É só clicar!`;

            window.open(`https://wa.me/?text=${encodeURIComponent(groupMessage)}`, '_blank');
            setSent(true);
        } catch (error) {
            console.error('Erro ao salvar no Firebase:', error);
            alert('❌ Erro ao gerar link. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const copyMessage = async () => {
        setLoading(true);

        try {
            // Salva no Firebase
            const eventRef = ref(database, `events/${eventId}`);
            await set(eventRef, {
                players: players.map(p => ({ id: p.id, name: p.name, role: p.role })),
                createdAt: new Date().toISOString()
            });

            const basePath = window.location.pathname.replace(/\/$/, '') || '';
            const confirmLink = `${window.location.origin}${basePath}/?event=${eventId}`;

            const groupMessage = `🏆 FUTEBOL - CONFIRME SUA PRESENÇA! 🏆

👇 Clique aqui para confirmar:
${confirmLink}

⚽ Vai abrir uma página com seu nome
⚡ É só clicar!`;

            await navigator.clipboard.writeText(groupMessage);
            alert('✅ Mensagem copiada! Cole no grupo do WhatsApp.');
        } catch (error) {
            console.error('Erro ao salvar no Firebase:', error);
            alert('❌ Erro ao gerar link. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-700 rounded-xl p-6 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-primary">
                        📱 Enviar para Grupo
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="bg-blue-600 bg-opacity-20 border border-blue-400 p-4 rounded-lg mb-6">
                    <p className="text-blue-300 text-sm mb-2">
                        <strong>💡 Como funciona:</strong>
                    </p>
                    <ol className="text-blue-300 text-sm space-y-1 list-decimal list-inside">
                        <li>Você envia o link no grupo</li>
                        <li>Jogadores clicam no link</li>
                        <li>Abre página com botões de cada nome</li>
                        <li>Clicam no botão = confirmado! ✅</li>
                    </ol>
                </div>

                <div className="bg-neutral-600 p-4 rounded-lg mb-6">
                    <p className="text-neutral-300 text-sm mb-2">📋 Preview da mensagem:</p>
                    <div className="bg-neutral-800 p-3 rounded text-xs text-neutral-300">
                        <p className="font-bold mb-2">🏆 FUTEBOL - CONFIRME SUA PRESENÇA! 🏆</p>
                        <p className="mb-1">👇 Clique aqui para confirmar:</p>
                        <p className="text-blue-400 mb-2">[link único]</p>
                        <p className="text-neutral-400">⚽ Vai abrir uma página com seu nome</p>
                        <p className="text-neutral-400">⚡ É só clicar!</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={sendToGroup}
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-neutral-500 text-white font-bold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? '⏳ Gerando...' : '📱 Abrir WhatsApp e Enviar'}
                    </button>

                    <button
                        onClick={copyMessage}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                    >
                        {loading ? '⏳ Gerando...' : '📋 Copiar Mensagem'}
                    </button>
                </div>

                {sent && (
                    <div className="mt-4 bg-green-600 bg-opacity-20 border border-green-400 p-3 rounded-lg">
                        <p className="text-green-300 text-sm text-center">
                            ✅ Link gerado! Cole no grupo do WhatsApp.
                        </p>
                    </div>
                )}

                <div className="mt-4 bg-yellow-600 bg-opacity-20 border border-yellow-400 p-3 rounded-lg">
                    <p className="text-yellow-300 text-xs text-center">
                        💡 Dica: Jogadores verão botões grandes com cada nome!
                    </p>
                </div>
            </div>
        </div>
    );
};