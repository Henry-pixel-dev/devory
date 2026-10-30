type RadioOptionProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export default function RadioOption({ name, value, label, checked, onChange }: RadioOptionProps) {
  return (
     <label className="cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span className="flex items-center justify-between rounded-lg border border-primary/30 px-3 py-2 text-sm text-foreground
              peer-hover:bg-foreground/10
              peer-checked:border-primary peer-checked:bg-primary/15 peer-checked:text-primary
            peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
        {label}
        <span
          aria-hidden="true"
          className={`flex h-4 w-4 items-center justify-center rounded-full border text-xs font-bold ${
            checked ? "border-primary bg-primary text-primary-foreground" : "border-primary/40"
          }`}
        >
          {checked ? "✓" : ""}
        </span>
      </span>
    </label>
  )
}