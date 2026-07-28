interface DatePickerProps {
  value: string;
  onChange: (dateISO: string) => void;
  disabled?: boolean;
}

export default function DatePicker({ value, onChange, disabled }: DatePickerProps) {
  return (
    <label className="inline-flex items-center gap-2 rounded-md border border-line bg-card px-3 py-1.5">
      <input
        type="date"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-mono text-sm text-ink disabled:cursor-not-allowed disabled:text-muted"
      />
    </label>
  );
}
