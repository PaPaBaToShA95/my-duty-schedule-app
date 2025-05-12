import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';

interface Person {
    id: string;
    name: string;
    mustBeOnDuty: number[];
    mustNotBeOnDuty: number[];
}

interface ScheduleCell {
    status: 'duty' | 'off' | 'weekend'  | 'empty';
    isFixed: boolean;
    day?: number; 
}

interface GeneratedSchedule {
    daysInMonth: number;
    startDayOfWeek: number;
    schedule: Record<string, Record<number, ScheduleCell>>;
    weekendDays: number[];
}

interface ScheduleTableProps {
    scheduleData: GeneratedSchedule;
    people: Person[];
}

const ScheduleTable: React.FC<ScheduleTableProps> = ({ scheduleData, people }) => {
    const { daysInMonth, weekendDays, schedule } = scheduleData;

    if (!scheduleData || Object.keys(schedule).length === 0) {
        return <div className="text-center text-gray-600 mt-8">Графік не згенеровано.</div>;
    }

    const getCellClassName = (cell: ScheduleCell & { day: number; status: 'duty' | 'off' | 'weekend' | 'empty' }) => {
            if (cell.status === 'duty') {
            return 'bg-black text-white w-8 h-8 text-sm align-middle';
        }
        if (weekendDays.includes(cell.day) && (cell.status as 'duty' | 'off' | 'weekend' | 'empty') !== 'duty') {
            return 'bg-blue-100 w-8 h-8 text-sm align-middle';
        }
        return 'bg-white w-8 h-8 text-sm align-middle';
    };

    return (
        <div className="overflow-x-auto shadow-lg rounded-lg border">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-gray-100 text-left text-sm font-semibold z-10 min-w-[8rem]">
                            Ім'я
                        </TableHead>
                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                            <TableHead
                                key={day}
                                className={`text-center text-sm font-semibold whitespace-nowrap ${weekendDays.includes(day) ? 'bg-blue-100' : 'bg-gray-100'
                                    }`}
                            >
                                {day}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {people.map((person) => (
                        <TableRow key={person.id}>
                            <TableCell className="sticky left-0 bg-white whitespace-nowrap text-sm font-medium z-10">
                                {person.name}
                            </TableCell>
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                const cell = schedule[person.id]?.[day] || { status: 'empty', isFixed: false };
                                const isWeekend = weekendDays.includes(day);
                                const displayStatus = cell.status === 'duty' ? 'duty' : isWeekend ? 'weekend' : 'empty';

                                return (
                                    <TableCell
                                        key={`${person.id}-${day}`}
                                        className={getCellClassName({ ...cell, day, status: displayStatus })}
                                    >
                                        {cell.status === 'duty' ? (
                                            <div className="flex items-center justify-center w-full h-full">●</div>
                                        ) : null}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ScheduleTable;