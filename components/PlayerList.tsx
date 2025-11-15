import React from 'react';
import { Player } from '../types';
import { RoleIcon } from './RoleIcon';
import { TrashIcon } from './Icons';

interface PlayerListProps {
    players: Player[];
    onRemovePlayer: (id: string) => void;
}

export const PlayerList: React.FC<PlayerListProps> = ({ players, onRemovePlayer }) => {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Jogadores ({players.length})</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {players.length === 0 ? (
                    <p className="text-neutral-400">Nenhum jogador adicionado ainda.</p>
                ) : (
                    players.map(player => (
                        <li 
                            key={player.id} 
                            className="flex items-center justify-between bg-neutral-600 p-3 rounded-lg animate-fade-in"
                        >
                            <div className="flex items-center space-x-3">
                                <RoleIcon role={player.role} />
                                <span className="font-medium">{player.name}</span>
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