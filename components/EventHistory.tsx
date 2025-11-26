import React from 'react';

interface EventHistoryItem {
    id: string;
    date: string;
}

interface EventHistoryProps {
    events: EventHistoryItem[];
    activeEventId: string | null;
    onToggle: (eventId: string) => void;
}

export const EventHistory: React.FC<EventHistoryProps> = ({ events, activeEventId, onToggle }) => {
    if (events.length === 0) return null;

    return (
        <div className="mb-4 bg-neutral-600 p-3 rounded-lg">
            <p className="text-sm text-neutral-300 mb-2 font-semibold">📋 Eventos:</p>
            <div className="space-y-2">
                {events.map((event) => {
                    const isActive = event.id === activeEventId;
                    return (
                        <button
                            key={event.id}
                            onClick={() => onToggle(event.id)}
                            className={`w-full text-white text-sm py-2 px-3 rounded transition text-left flex justify-between items-center ${isActive
                                    ? 'bg-green-600 hover:bg-green-700 font-bold'
                                    : 'bg-neutral-700 hover:bg-neutral-500'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                {isActive ? '✅' : '⚪'} {event.id.slice(0, 8)}...
                            </span>
                            <span className="text-xs text-neutral-300">{event.date}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};