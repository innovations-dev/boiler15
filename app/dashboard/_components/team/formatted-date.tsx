// New server component
export function FormattedDate({ date }: { date: Date }) {
  return date.toISOString().split("T")[0];
}
