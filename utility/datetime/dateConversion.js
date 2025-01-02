
export function formattedISOnoTime (dateString) {
    const date = new Date(dateString); 

    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const fullDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `${day}, ${fullDate}`


}

export function formattedISO (isoString) {
    const date = new Date(isoString);

    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const fullDate = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const time = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short",
    });

    return `${day}, ${fullDate}, ${time}`;

}

