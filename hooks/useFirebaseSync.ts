import { useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase';
import { Player } from '../types';

export function useFirebaseSync() {
    const [syncing, setSyncing] = useState(false);

    const syncEvent = async (
        eventId: string,
        players: Player[],
        setPlayers: React.Dispatch<React.SetStateAction<Player[]>>
    ) => {
        if (!eventId) {
            alert('❌ Nenhum evento ativo para sincronizar');
            return;
        }

        setSyncing(true);
        try {
            console.log('🔄 Sincronizando evento:', eventId);

            // Busca confirmações
            const confirmationsRef = ref(database, `events/${eventId}/confirmations`);
            const confirmationsSnapshot = await get(confirmationsRef);

            let confirmedCount = 0;
            if (confirmationsSnapshot.exists()) {
                const confirmations = confirmationsSnapshot.val();
                console.log('✅ Confirmações:', confirmations);

                setPlayers(prev => 
                    prev.map(p => {
                        if (confirmations[p.id]) {
                            if (!p.present) {
                                confirmedCount++;
                            }
                            return { ...p, present: true };
                        }
                        return p;
                    })
                );
            }

            // Busca novos jogadores
            const newPlayersRef = ref(database, `events/${eventId}/newPlayers`);
            const newPlayersSnapshot = await get(newPlayersRef);

            let newPlayersCount = 0;
            if (newPlayersSnapshot.exists()) {
                const newPlayers = newPlayersSnapshot.val();
                console.log('🆕 Novos jogadores:', newPlayers);

                const playersToAdd: Player[] = [];
                Object.entries(newPlayers).forEach(([playerId, playerData]: [string, any]) => {
                    const alreadyExists = players.find(p => p.id === playerId);
                    if (!alreadyExists && playerData.name) {
                        playersToAdd.push({
                            id: playerId,
                            name: playerData.name,
                            role: playerData.role,
                            present: true
                        });
                        newPlayersCount++;
                    }
                });

                if (playersToAdd.length > 0) {
                    setPlayers(prev => [...prev, ...playersToAdd]);
                }
            }

            // Mensagem - ✅ TIPAGEM EXPLÍCITA
            const messages: string[] = [];
            if (confirmedCount > 0) {
                messages.push(`${confirmedCount} nova(s) confirmação(ões)`);
            }
            if (newPlayersCount > 0) {
                messages.push(`${newPlayersCount} novo(s) jogador(es)`);
            }

            if (messages.length > 0) {
                alert(`✅ Sincronizado!\n${messages.join('\n')}`);
            } else {
                alert('ℹ️ Nenhuma atualização encontrada.');
            }
        } catch (error: any) {
            console.error('❌ Erro ao sincronizar:', error);
            alert(`❌ Erro: ${error.message}`);
        } finally {
            setSyncing(false);
        }
    };

    return { syncing, syncEvent };
}