import React from 'react';
import { ShuffleIcon } from './Icons';

interface TeamControlsProps {
    numberOfTeams: number;
    setNumberOfTeams: (value: number) => void;
    presentCount: number;
    onSortTeams: () => void;
    onClearAll: () => void;
    error: string | null;
}

export const TeamControls: React.FC<TeamControlsProps> = ({
    numberOfTeams,
    setNumberOfTeams,
    presentCount,
    onSortTeams,
    onClearAll,
    error
}) => {
    return (
        <>
            {/* Número de times */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Número de Times
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setNumberOfTeams(Math.max(2, numberOfTeams - 1))}
                        className="w-12 h-12 bg-neutral-600 hover:bg-neutral-500 text-white font-bold text-2xl rounded-lg transition"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        value={numberOfTeams}
                        onChange={e => setNumberOfTeams(Math.max(2, parseInt(e.target.value) || 2))}
                        min="2"
                        className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg px-4 py-3 text-center text-lg font-semibold focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    />
                    <button
                        type="button"
                        onClick={() => setNumberOfTeams(numberOfTeams + 1)}
                        className="w-12 h-12 bg-neutral-600 hover:bg-neutral-500 text-white font-bold text-2xl rounded-lg transition"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Botões sortear e limpar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onSortTeams}
                    disabled={presentCount < numberOfTeams}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:bg-neutral-500 disabled:cursor-not-allowed"
                >
                    <ShuffleIcon />
                    Sortear Times
                </button>
                <button
                    onClick={onClearAll}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition"
                >
                    Limpar Tudo
                </button>
            </div>

            {/* Mensagem de erro */}
            {error && (
                <p className="text-red-400 mt-4 text-center font-semibold">{error}</p>
            )}
        </>
    );
};