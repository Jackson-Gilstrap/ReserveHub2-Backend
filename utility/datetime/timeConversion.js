

export function timeConverter (timeString) {
    const [time, offset] = timeString.split("-");
    const [hours, minutes, seconds] = time.split(":").map(Number);

// Convert 24-hour to 12-hour format
    const period = hours >= 12 ? "PM" : "AM";
    const nonMilitaryHours = hours % 12 || 12; // Convert 0 to 12 for midnight

// Format the output
    return `${nonMilitaryHours}:${String(minutes).padStart(2, '0')} ${period}`;
}