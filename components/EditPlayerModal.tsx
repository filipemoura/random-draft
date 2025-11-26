import React, { useState } from 'react';
import { Player, Role } from '../types';
import { RoleIcon } from './RoleIcon';
import { X, Save, Edit } from 'lucide-react';

interface EditPlayerModalProps {
    player: Player;
    onSave: (id: string, name: string, role: Role) => void;
    onClose: () => void;
}

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({ player, onSave, onClose }) => {
    const [name, setName] = useState(player.name);
    const [role, setRole] = useState(player.role);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(player.id, name.trim(), role);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-700 rounded-xl p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-primary flex items-center gap-2">
                        <Edit className="w-6 h-6" />
                        Editar Jogador
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white transition p-1 rounded-lg hover:bg-neutral-600"
                        title="Fechar"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome do jogador"
                            autoFocus
                            required
                            className="w-full bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-2">
                            Posição
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {(Object.values(Role) as Array<Role>).map(roleOption => (
                                <label
                                    key={roleOption}
                                    className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition ${role === roleOption
                                            ? 'bg-brand-primary text-white'
                                            : 'bg-neutral-600 hover:bg-neutral-500'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value={roleOption}
                                        checked={role === roleOption}
                                        onChange={() => setRole(roleOption)}
                                        className="hidden"
                                    />
                                    <RoleIcon role={roleOption} />
                                    <span className="text-sm">{roleOption}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};