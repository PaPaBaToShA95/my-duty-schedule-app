import { useState } from 'react';
import MonthYearSelector from './components/MonthYearSelector';
import PeopleInputSection from './components/PeopleInputSection';
import ScheduleTable from './components/ScheduleTable';
import { generateSchedule } from './components/scheduleGenerator';
import { Button } from './components/ui/button'; 

interface Person {
  id: string;
  name: string;
  mustBeOnDuty: number[];
  mustNotBeOnDuty: number[];
}

interface ScheduleCell {
  status: 'duty' | 'off' | 'weekend' | 'empty';
  isFixed: boolean;
}

interface GeneratedSchedule {
  daysInMonth: number;
  startDayOfWeek: number;
  schedule: Record<string, Record<number, ScheduleCell>>;
  weekendDays: number[];
}

function App() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [numberOfPeople, setNumberOfPeople] = useState<number>(3);
  const [people, setPeople] = useState<Person[]>(
    Array.from({ length: 3 }, (_, i) => ({
      id: `person-${i + 1}`,
      name: `Людина ${i + 1}`,
      mustBeOnDuty: [],
      mustNotBeOnDuty: [],
    }))
  );
  const [generatedSchedule, setGeneratedSchedule] = useState<GeneratedSchedule | null>(null);

  const handleGenerateSchedule = () => {
    const schedule = generateSchedule(selectedMonth, selectedYear, people);
    setGeneratedSchedule(schedule);
  };

  const handlePersonChange = (id: string, field: keyof Person, value: unknown) => {
    setPeople(prevPeople =>
      prevPeople.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleNumberOfPeopleChange = (count: number) => {
    setNumberOfPeople(count);
    setPeople(prevPeople => {
      const newPeople: Person[] = [];
      for (let i = 0; i < count; i++) {
        if (prevPeople[i]) {
          newPeople.push(prevPeople[i]);
        } else {
          newPeople.push({
            id: `person-${i + 1}`,
            name: `Людина ${i + 1}`,
            mustBeOnDuty: [],
            mustNotBeOnDuty: [],
          });
        }
      }
      return newPeople;
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Генератор графіків нарядів</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <MonthYearSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <PeopleInputSection
          numberOfPeople={numberOfPeople}
          onNumberOfPeopleChange={handleNumberOfPeopleChange}
          people={people}
          onPersonChange={handlePersonChange}
        />
      </div>

      <Button
        onClick={handleGenerateSchedule}
        className="block mx-auto mb-8" // shadcn Button вже має базові стилі, залишаємо тільки для центрування та відступу
      >
        Згенерувати графік
      </Button>

      {generatedSchedule && <ScheduleTable scheduleData={generatedSchedule} people={people} />}
    </div>
  );
}

export default App;