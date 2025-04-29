export function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Erstes Zeichen großschreiben
    .join(" ");
}