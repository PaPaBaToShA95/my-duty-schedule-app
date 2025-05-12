
interface Person {
    id: string;
    name: string;
    mustBeOnDuty: number[];
    mustNotBeOnDuty: number[];
}

interface ScheduleCell {
    status: 'duty' | 'off' | 'weekend' | 'empty';
    isFixed: boolean; // true if manually set by user
}

interface GeneratedSchedule {
    daysInMonth: number;
    startDayOfWeek: number; // 0 for Sunday, 1 for Monday
    schedule: Record<string, Record<number, ScheduleCell>>;
    weekendDays: number[]; // Array of day numbers that are Sat/Sun
}

export const generateSchedule = (
    month: number,
    year: number,
    people: Person[]
): GeneratedSchedule => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDayOfWeek = new Date(year, month - 1, 1).getDay();

    const schedule: Record<string, Record<number, ScheduleCell>> = {};
    const weekendDays: number[] = [];
    const assignedDays: Record<number, string | null> = {};

    // Initialize schedule and find weekend days
    for (const person of people) {
        schedule[person.id] = {};
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

            if (isWeekend && !weekendDays.includes(day)) {
                weekendDays.push(day);
            }

            schedule[person.id][day] = {
                status: 'empty',
                isFixed: false,
            };
        }
    }

    // Enhanced helper function to check if a person can be on duty on a specific day
    const canAssignDuty = (personId: string, day: number): boolean => {
        // Basic checks
        if (day < 1 || day > daysInMonth || schedule[personId][day].status !== 'empty') {
            return false;
        }

        // Check previous day
        if (day > 1 && schedule[personId][day - 1].status === 'duty') {
            return false;
        }

        // Check next day (if already assigned as duty)
        if (day < daysInMonth && schedule[personId][day + 1].status === 'duty') {
            return false;
        }

        return true;
    };

    // Enhanced assignDuty function
    const assignDuty = (personId: string, day: number, isFixed: boolean = false): boolean => {
        // Check if we can assign duty
        if (!isFixed && !canAssignDuty(personId, day)) {
            return false;
        }

        // For fixed duties, if we can't assign, mark as off instead of failing
        if (isFixed && !canAssignDuty(personId, day)) {
            schedule[personId][day] = { status: 'off', isFixed: true };
            return false;
        }

        // Assign the duty
        schedule[personId][day] = { status: 'duty', isFixed: isFixed };
        assignedDays[day] = personId;

        // Mark next day as off if empty
        if (day + 1 <= daysInMonth && schedule[personId][day + 1].status === 'empty') {
            schedule[personId][day + 1] = { status: 'off', isFixed: false };
        }

        // Mark previous day as off if empty (to prevent others from being assigned there)
        if (day > 1 && schedule[personId][day - 1].status === 'empty') {
            schedule[personId][day - 1] = { status: 'off', isFixed: false };
        }

        return true;
    };

    // 1. Apply Fixed Off-Duties (Highest priority)
    for (const person of people) {
        for (const day of person.mustNotBeOnDuty) {
            if (day >= 1 && day <= daysInMonth) {
                schedule[person.id][day] = { status: 'off', isFixed: true };
            }
        }
    }

    // 2. Apply Fixed Duties (Second priority)
    for (const person of people) {
        for (const day of person.mustBeOnDuty) {
            if (day >= 1 && day <= daysInMonth) {
                // If day is already assigned to someone else, mark as off for this person
                if (assignedDays[day] && assignedDays[day] !== person.id) {
                    schedule[person.id][day] = { status: 'off', isFixed: true };
                    continue;
                }

                assignDuty(person.id, day, true);
            }
        }
    }

    // Calculate duty counts
    const dutyCounts: Record<string, number> = {};
    people.forEach(p => {
        dutyCounts[p.id] = Object.values(schedule[p.id]).filter(cell => cell.status === 'duty').length;
    });

    const idealDutiesPerPerson = Math.floor(daysInMonth / people.length);

    // 3. Assign special days (Thursdays, Saturdays, Sundays)
    const specialDays: number[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 4 || dayOfWeek === 6 || dayOfWeek === 0) {
            specialDays.push(day);
        }
    }

    for (const day of specialDays) {
        if (assignedDays[day]) continue;

        const availablePeople = people
            .filter(person => canAssignDuty(person.id, day))
            .sort((a, b) => dutyCounts[a.id] - dutyCounts[b.id]);

        for (const person of availablePeople) {
            if (assignDuty(person.id, day)) {
                dutyCounts[person.id]++;
                break;
            }
        }
    }

    // 4. Fill remaining days
    for (let day = 1; day <= daysInMonth; day++) {
        if (assignedDays[day]) continue;

        const availablePeople = people
            .filter(person => canAssignDuty(person.id, day))
            .sort((a, b) => dutyCounts[a.id] - dutyCounts[b.id]);

        for (const person of availablePeople) {
            if (dutyCounts[person.id] < idealDutiesPerPerson + 1) {
                if (assignDuty(person.id, day)) {
                    dutyCounts[person.id]++;
                    break;
                }
            }
        }
    }

    return {
        daysInMonth,
        startDayOfWeek,
        schedule,
        weekendDays,
    };
};