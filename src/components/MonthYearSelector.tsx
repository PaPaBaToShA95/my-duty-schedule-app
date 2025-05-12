import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';

interface MonthYearSelectorProps {
    selectedMonth: number;
    setSelectedMonth: (month: number) => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
}

const MonthYearSelector: React.FC<MonthYearSelectorProps> = ({
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
}) => {
    const months = [
        { value: 1, name: 'Січень' },
        { value: 2, name: 'Лютий' },
        { value: 3, name: 'Березень' },
        { value: 4, name: 'Квітень' },
        { value: 5, name: 'Травень' },
        { value: 6, name: 'Червень' },
        { value: 7, name: 'Липень' },
        { value: 8, name: 'Серпень' },
        { value: 9, name: 'Вересень' },
        { value: 10, name: 'Жовтень' },
        { value: 11, name: 'Листопад' },
        { value: 12, name: 'Грудень' },
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>Вибір місяця та року</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="month-select">Місяць</Label>
                        <Select
                            value={String(selectedMonth)}
                            onValueChange={(value) => setSelectedMonth(Number(value))}
                        >
                            <SelectTrigger id="month-select">
                                <SelectValue placeholder="Оберіть місяць" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((month) => (
                                    <SelectItem key={month.value} value={String(month.value)}>
                                        {month.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="year-select">Рік</Label>
                        <Select
                            value={String(selectedYear)}
                            onValueChange={(value) => setSelectedYear(Number(value))}
                        >
                            <SelectTrigger id="year-select">
                                <SelectValue placeholder="Оберіть рік" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((year) => (
                                    <SelectItem key={year} value={String(year)}>
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default MonthYearSelector;