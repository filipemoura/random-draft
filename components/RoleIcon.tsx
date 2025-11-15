import React from 'react';
import { Role } from '../types';
import { CaptainIcon, ChildIcon, GoalkeeperIcon } from './Icons';

interface RoleIconProps {
    role: Role;
}

export const RoleIcon: React.FC<RoleIconProps> = ({ role }) => {
    const iconMap = {
        [Role.CAPTAIN]: <CaptainIcon className="w-5 h-5 text-yellow-400" />,
        [Role.GOALKEEPER]: <GoalkeeperIcon className="w-5 h-5 text-blue-400" />,
        [Role.CHILD]: <ChildIcon className="w-5 h-5 text-pink-400" />,
        [Role.REGULAR]: null,
    };
    
    return iconMap[role] ? <span title={role}>{iconMap[role]}</span> : null;
};