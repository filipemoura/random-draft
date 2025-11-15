import React, { useState } from 'react';
import { Role } from '../types';
import { RoleIcon } from './RoleIcon';

interface PlayerFormProps {
    onAddPlayer: (name: string, role: Role) => void;
}

export const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
    const [newPlayerName, setNewPlayerName] = useState('');
    const [newPlayerRole, setNewPlayerRole] = useState<Role>(Role.REGULAR);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;

        onAddPlayer(newPlayerName.trim(), newPlayerRole);
        setNewPlayerName('');
        setNewPlayerRole(Role.REGULAR);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                value={newPlayerName}
                onChange={e => setNewPlayerName(e.target.value)}
                placeholder="Nome do Jogador"
                className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            />
            <div className="grid grid-cols-2 gap-4">
                {(Object.values(Role) as Array<Role>).map(role => (
                    <label 
                        key={role} 
                        className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${
                            newPlayerRole === role ? 'bg-brand-primary text-white' : 'bg-neutral-600 hover:bg-neutral-500'
                        }`}
                    >
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
            <button 
                type="submit" 
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
            >
                Adicionar
            </button>
        </form>
    );
};