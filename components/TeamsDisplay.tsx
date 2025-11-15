import React from 'react';
import { Player } from '../types';
import { RoleIcon } from './RoleIcon';

interface TeamsDisplayProps {
    teams: Player[][] | null;
}

export const TeamsDisplay: React.FC<TeamsDisplayProps> = ({ teams }) => {
    if (!teams) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-400">
                <p>Os times aparecerão aqui após o sorteio.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team, index) => (
                <div key={index} className="bg-neutral-600 p-4 rounded-lg flex flex-col">
                    <h3 className="text-xl font-bold text-brand-primary mb-3">
                        Time {index + 1} ({team.length})
                    </h3>
                    <ul className="space-y-2">
                        {team.map(player => (
                            <li 
                                key={player.id} 
                                className="flex items-center space-x-2 bg-neutral-700 p-2 rounded"
                            >
                                <RoleIcon role={player.role} />
                                <span>{player.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};