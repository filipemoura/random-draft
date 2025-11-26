import { useState, useEffect } from 'react';

interface EventHistory {
    id: string;
    date: string;
}

export function useEventManagement() {
    const [activeEventId, setActiveEventId] = useState<string | null>(null);
    const [eventHistory, setEventHistory] = useState<EventHistory[]>([]);

    // Carrega dados do localStorage
    useEffect(() => {
        const savedEventId = localStorage.getItem('active-event-id');
        if (savedEventId) {
            setActiveEventId(savedEventId);
        }
        
        const history = JSON.parse(localStorage.getItem('event-history') || '[]');
        setEventHistory(history);
    }, []);

    // Recarrega histórico quando evento muda
    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('event-history') || '[]');
        setEventHistory(history);
    }, [activeEventId]);

    // Toggle evento (ativa/pausa)
    const toggleEvent = (eventId: string) => {
        if (eventId === activeEventId) {
            localStorage.removeItem('active-event-id');
            setActiveEventId(null);
        } else {
            localStorage.setItem('active-event-id', eventId);
            setActiveEventId(eventId);
        }
    };

    // Reativa evento manualmente
    const reactivateEventManually = (eventId: string) => {
        localStorage.setItem('active-event-id', eventId.trim());
        setActiveEventId(eventId.trim());
        
        // Adiciona ao histórico se não existir
        const history = JSON.parse(localStorage.getItem('event-history') || '[]');
        if (!history.find((e: EventHistory) => e.id === eventId.trim())) {
            const newEvent = {
                id: eventId.trim(),
                date: new Date().toLocaleString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                })
            };
            const updatedHistory = [newEvent, ...history].slice(0, 5);
            localStorage.setItem('event-history', JSON.stringify(updatedHistory));
            setEventHistory(updatedHistory);
        }
    };

    // Atualiza evento ativo (usado após enviar WhatsApp)
    const refreshActiveEvent = () => {
        const savedEventId = localStorage.getItem('active-event-id');
        setActiveEventId(savedEventId);
    };

    return {
        activeEventId,
        eventHistory,
        toggleEvent,
        reactivateEventManually,
        refreshActiveEvent
    };
}