

export function makeFirstLetterCapital(string) {
    const cleanedString = string.trim();
   	const result = cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1);
    
    return result
    
}