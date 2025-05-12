// @ts-nocheck
import React from 'react';
import PersonInput from './PersonInput';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';

interface Person {
    id: string;
    name: string;
    mustBeOnDuty: number[];
    mustNotBeOnDuty: number[];
}

interface PeopleInputSectionProps {
    numberOfPeople: number;
    onNumberOfPeopleChange: (count: number) => void;
    people: Person[];
    onPersonChange: (id: string, field: keyof Person, value: unknown) => void;
}

const PeopleInputSection: React.FC<PeopleInputSectionProps> = ({
    numberOfPeople,
    onNumberOfPeopleChange,
    people,
    onPersonChange,
}) => {
    return (
        <Card className="w-full shadow-sm">
            <CardHeader>
                <CardTitle>Налаштування людей</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 space-y-2">
                    <Label htmlFor="num-people">Кількість людей</Label>
                    <Input
                        type="number"
                        id="num-people"
                        value={numberOfPeople}
                        onChange={(e) => onNumberOfPeopleChange(Math.max(1, Number(e.target.value)))}
                        min="1"
                        className="md:w-1/2"
                    />
                </div>
                <div className="space-y-4">
                    {people.map((person) => (
                        <PersonInput key={person.id} person={person} onPersonChange={onPersonChange} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default PeopleInputSection;