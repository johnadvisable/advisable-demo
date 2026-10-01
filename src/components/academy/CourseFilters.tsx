// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Filters {
  modes: string[];
  duration: string;
  topic: string;
  dateFrom: string;
  dateTo: string;
}

export const EMPTY_FILTERS: Filters = { modes: [], duration: 'all', topic: 'all', dateFrom: '', dateTo: '' };

const MODE_OPTIONS = [
  { value: 'digital', label: 'Digital' },
  { value: 'physical', label: 'In Person' },
];

const DURATION_OPTIONS = [
  { value: 'all', label: 'Any duration' },
  { value: '1-2', label: '1-2 days' },
  { value: '3-7', label: '3-7 days' },
  { value: '1-4w', label: '1-4 weeks' },
  { value: '1m', label: '1+ month' },
];

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  topicOptions: string[];
}

export default function CourseFilters({ filters, setFilters, topicOptions }: Props) {
  const toggleMode = (val: string) => {
    setFilters({
      ...filters,
      modes: filters.modes.includes(val) ? filters.modes.filter(x => x !== val) : [...filters.modes, val],
    });
  };

  const hasFilters = filters.modes.length || filters.duration !== 'all' || filters.topic !== 'all' || filters.dateFrom || filters.dateTo;

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-5 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Group label="Mode">
          {MODE_OPTIONS.map(opt => (
            <Chip key={opt.value} active={filters.modes.includes(opt.value)} onClick={() => toggleMode(opt.value)}>{opt.label}</Chip>
          ))}
        </Group>

        <Group label="Duration">
          <Select value={filters.duration} onValueChange={v => setFilters({ ...filters, duration: v })}>
            <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DURATION_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </Group>

        <Group label="Topic">
          <Select value={filters.topic} onValueChange={v => setFilters({ ...filters, topic: v })}>
            <SelectTrigger className="h-9 w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All topics</SelectItem>
              {topicOptions.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </Group>

        <Group label="Date">
          <Input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} className="h-9 w-auto" />
          <span className="text-muted-foreground">–</span>
          <Input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} className="h-9 w-auto" />
        </Group>

        {hasFilters && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setFilters(EMPTY_FILTERS)}>
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-1">{label}</span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/40'
      }`}
    >
      {children}
    </button>
  );
}
