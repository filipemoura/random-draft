import { useCallback } from 'react';
import { Player, Role } from '../types';

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function useTeamSorter() {
    const sortTeams = useCallback((players: Player[], numberOfTeams: number) => {
        const captains = players.filter(p => p.role === Role.CAPTAIN);
        const goalkeepers = players.filter(p => p.role === Role.GOALKEEPER);
        const children = players.filter(p => p.role === Role.CHILD);
        const regulars = players.filter(p => p.role === Role.REGULAR);

        // Validações
        if (players.length < numberOfTeams) {
            throw new Error(`São necessários pelo menos ${numberOfTeams} jogadores para o sorteio.`);
        }
        if (captains.length > 0 && captains.length !== numberOfTeams) {
            throw new Error(`O número de capitães deve ser 0 ou igual ao número de times (${numberOfTeams}).`);
        }
        if (goalkeepers.length > 0 && goalkeepers.length !== numberOfTeams) {
            throw new Error(`O número de goleiros deve ser 0 ou igual ao número de times (${numberOfTeams}).`);
        }

        const newTeams: Player[][] = Array.from({ length: numberOfTeams }, () => []);

        // Distribuir capitães
        if (captains.length === numberOfTeams) {
            shuffleArray(captains).forEach((captain, index) => {
                newTeams[index].push(captain);
            });
        }

        // Distribuir goleiros
        if (goalkeepers.length === numberOfTeams) {
            shuffleArray(goalkeepers).forEach((goalkeeper, index) => {
                newTeams[index].push(goalkeeper);
            });
        }

        // Distribuir jogadores restantes
        const remainingPlayers = shuffleArray([
            ...regulars,
            ...children,
            ...(captains.length !== numberOfTeams ? captains : []),
            ...(goalkeepers.length !== numberOfTeams ? goalkeepers : []),
        ]);

        remainingPlayers.forEach(player => {
            const smallestTeam = newTeams.reduce((prev, curr) =>
                curr.length < prev.length ? curr : prev
            );
            smallestTeam.push(player);
        });

        return newTeams;
    }, []);

    return { sortTeams };
}