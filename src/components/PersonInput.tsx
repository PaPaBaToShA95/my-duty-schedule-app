// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

interface Person {
    id: string;
    name: string;
    mustBeOnDuty: number[];
    mustBeOnDutyInput?: string; 
    mustNotBeOnDuty: number[];
    mustNotBeOnDutyInput?: string; 
}

interface PersonInputProps {
    person: Person;
    onPersonChange: (id: string, field: keyof Person, value: unknown) => void;
}

const PersonInput: React.FC<PersonInputProps> = ({ person, onPersonChange }) => {
    const parseDaysInput = (input: string): number[] => {
        if (!input) return []; 
        return input
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(num => !isNaN(num) && num >= 1 && num <= 31);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl">{person.name}</CardTitle> 
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4"> 
                    <div className="flex-1 space-y-2"> 
                        <Label htmlFor={`name-${person.id}`}>Ім'я</Label>
                        <Input
                            type="text"
                            id={`name-${person.id}`}
                            value={person.name}
                            onChange={(e) => onPersonChange(person.id, 'name', e.target.value)}
                            className="w-full" 
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor={`must-on-duty-${person.id}`}>Обов'язково в наряді</Label>
                        <Input
                            type="text"
                            id={`must-on-duty-${person.id}`}
                            value={person.mustBeOnDutyInput ?? person.mustBeOnDuty.join(', ')}
                            onChange={(e) => onPersonChange(person.id, 'mustBeOnDutyInput', e.target.value)}
                            onBlur={(e) => {
                                onPersonChange(person.id, 'mustBeOnDuty', parseDaysInput(e.target.value));
                                onPersonChange(person.id, 'mustBeOnDutyInput', undefined);
                            }}
                            placeholder="наприклад, 5, 10, 25"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor={`must-not-on-duty-${person.id}`}>Точно не в наряді</Label>
                        <Input
                            type="text"
                            id={`must-not-on-duty-${person.id}`}
                            value={person.mustNotBeOnDutyInput ?? person.mustNotBeOnDuty.join(', ')}
                            onChange={(e) => onPersonChange(person.id, 'mustNotBeOnDutyInput', e.target.value)}
                            onBlur={(e) => {
                                onPersonChange(person.id, 'mustNotBeOnDuty', parseDaysInput(e.target.value));
                                onPersonChange(person.id, 'mustNotBeOnDutyInput', undefined);
                            }}
                            placeholder="наприклад, 1, 2, 3, 15"
                            className="w-full"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default PersonInput;