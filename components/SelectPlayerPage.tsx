import React from "react";
import { Player } from "../types";

export const SelectPlayerPage: React.FC = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("event");

    if (!eventId) {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center">
                    <p className="text-red-400">Link inválido</p>
                </div>
            </div>
        );
    }

    const eventData = localStorage.getItem(`event-${eventId}`);
    if (!eventData) {
        return (
            <div className="min-h-screen bg-neutral-800 flex items-center justify-center p-4">
                <div className="bg-neutral-700 p-8 rounded-xl text-center">
                    <p className="text-red-400">Evento não encontrado</p>
                </div>
            </div>
        );
    }

    const { players } = JSON.parse(eventData);

    const handlePlayerClick = (player: Player) => {
        const basePath = window.location.pathname.replace(/\/$/, "") || "";
        window.location.href = `${window.location.origin}${basePath}/?confirm=${eventId}&p=${player.id}`;
    };

    const handleNewPlayer = () => {
        const basePath = window.location.pathname.replace(/\/$/, "") || "";
        window.location.href = `${window.location.origin}${basePath}/?new=${eventId}`;
    };

    return (
        <div className="min-h-screen bg-neutral-800 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 pt-8">
                    <div className="text-6xl mb-4">⚽</div>
                    <h1 className="text-3xl font-bold text-brand-primary mb-2">
                        Confirme sua Presença
                    </h1>
                    <p className="text-neutral-400">Clique no seu nome para confirmar</p>
                </div>

                <div className="space-y-3 mb-8">
                    {players.map((player: Player) => (
                        <button
                            key={player.id}
                            onClick={() => handlePlayerClick(player)}
                            className="w-full bg-neutral-700 hover:bg-brand-primary text-white font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] text-xl shadow-lg"
                        >
                            {player.name}
                        </button>
                    ))}
                </div>

                <div className="border-t border-neutral-600 pt-6">
                    <p className="text-neutral-400 text-center mb-3 text-sm">
                        Primeira vez na futebol?
                    </p>
                    <button
                        onClick={handleNewPlayer}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-5 px-6 rounded-xl transition-all transform hover:scale-[1.02] text-xl shadow-lg"
                    >
                        🆕 Sou Novo Aqui
                    </button>
                </div>
            </div>
        </div>
    );
};
