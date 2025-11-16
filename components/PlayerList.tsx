import React from 'react';
import { Player } from '../types';
import { RoleIcon } from './RoleIcon';
import { TrashIcon, CheckCircleIcon, XCircleIcon } from './Icons';

interface PlayerListProps {
    players: Player[];
    onRemovePlayer: (id: string) => void;
    onTogglePresence: (id: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ 
    players, 
    onRemovePlayer, 
    onTogglePresence 
}) => {
    const presentCount = players.filter(p => p.present).length;

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold">
                    Jogadores ({players.length})
                </h3>
                <span className="text-sm text-neutral-400">
                    Presentes: {presentCount}/{players.length}
                </span>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {players.length === 0 ? (
                    <p className="text-neutral-400">Nenhum jogador adicionado ainda.</p>
                ) : (
                    players.map(player => (
                        <li 
                            key={player.id} 
                            className={`flex items-center justify-between bg-neutral-600 p-3 rounded-lg animate-fade-in transition ${
                                !player.present ? 'opacity-50' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <button
                                    onClick={() => onTogglePresence(player.id)}
                                    className="flex-shrink-0 hover:scale-110 transition"
                                    title={player.present ? 'Marcar como ausente' : 'Marcar como presente'}
                                >
                                    {player.present ? (
                                        <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                    ) : (
                                        <XCircleIcon className="w-6 h-6 text-red-400" />
                                    )}
                                </button>
                                <RoleIcon role={player.role} />
                                <span className={`font-medium ${!player.present ? 'line-through' : ''}`}>
                                    {player.name}
                                </span>
                            </div>
                            <button 
                                onClick={() => onRemovePlayer(player.id)} 
                                className="text-red-400 hover:text-red-500 transition"
                            >
                                <TrashIcon />
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};