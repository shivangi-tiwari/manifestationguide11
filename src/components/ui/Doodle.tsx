interface DoodleProps {
  name: string
}

export function Doodle({ name }: DoodleProps) {
  return (
    <div
      data-doodle={name}
      aria-hidden="true"
      className="absolute inset-[12%] rounded-[48%_52%_58%_42%/48%_42%_58%_52%] bg-[#FBD86B]/40"
    />
  )
}
