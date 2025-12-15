import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

// A plausible birth date for the portfolio owner, "Raul Lee"
const BIRTH_DATE = '1988-08-08';
const LIFESPAN_YEARS = 80;

const LifetimeTracker: React.FC = () => {
    const { width } = useWindowSize();
    const [weeksLived, setWeeksLived] = useState(0);
    const [weeksRemaining, setWeeksRemaining] = useState(0);
    const [totalWeeks, setTotalWeeks] = useState(1);
    
    useEffect(() => {
        const calculateWeeks = () => {
            const birthDate = new Date(BIRTH_DATE);
            const now = new Date();

            const msInWeek = 1000 * 60 * 60 * 24 * 7;
            const lived = Math.floor((now.getTime() - birthDate.getTime()) / msInWeek);
            
            const total = Math.floor(LIFESPAN_YEARS * 52.1775); // Average weeks in a year
            const remaining = total - lived;

            setWeeksLived(lived);
            setWeeksRemaining(remaining > 0 ? remaining : 0);
            setTotalWeeks(total > 0 ? total : 1);
        };

        calculateWeeks();
        const intervalId = setInterval(calculateWeeks, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, []);

    const percentageLived = (weeksLived / totalWeeks) * 100;
    const isMobile = width < 768;

    return (
        <div className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-xs font-mono text-gray-400 tracking-wider backdrop-blur-sm">
            <div className={`flex items-center ${isMobile ? 'flex-col gap-1 items-start' : 'gap-4'}`}>
                <div>
                    <span className="text-gray-600">LIVED:</span> {weeksLived.toLocaleString()} WKS
                </div>
                <div>
                    <span className="text-gray-600">REMAINING:</span> {weeksRemaining.toLocaleString()} WKS
                </div>
            </div>
             <div className="w-full bg-gray-700/50 rounded-full h-1 mt-2" title={`${percentageLived.toFixed(2)}% complete`}>
                <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full" 
                    style={{ width: `${percentageLived}%`, transition: 'width 1s ease-out' }}
                ></div>
            </div>
        </div>
    );
};

export default LifetimeTracker;