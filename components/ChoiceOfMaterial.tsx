"use client"

type Mode = "resource" | "collection" | "career"

type ModeOption = { value: Mode; title: string; description: string }

const modes: ModeOption[] = [
  { value: "resource",   title: "A resource",  description: "One video, doc, or repo" },
  { value: "collection", title: "A collection", description: "Stacks, frameworks, or libraries" },
  { value: "career",     title: "A career path", description: "A roadmap for a role or field" },
]

type ModeSelectorProps = {
  onSelect: (mode: Mode) => void;
};

export default function ChoiceOfMaterial({ onSelect }: ModeSelectorProps) {
  return (
    <form>
        <div className="flex flex-col gap-2 ">
            {modes.map((mode) => (
                <label key={mode.value} className="flex items-center gap-2 cursor-pointer bg-[linear-gradient(to_right,#9f9cf2,#05033a)] rounded-2xl p-2 text-white">
                    <input
                        type="radio"
                        name="mode"
                        value={mode.value}
                        onChange={() => onSelect(mode.value)}
                        className="appearance-none w-4 h-4 rounded-full border border-tertiary checked:bg-primary checked:border-primary cursor-pointer "
                    />
                    <div>
                        <h3 className="font-bold">{mode.title}</h3>
                        <p className="text-sm text-gray-300">{mode.description}</p>
                    </div>
                </label>
            ))}
        </div>
    </form>
  )
}