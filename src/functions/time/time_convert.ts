export function formatDuration(seconds: number): string {
    if (seconds < 60) {
        return `${seconds}s`; // Nếu nhỏ hơn 60s, trả về giây
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
        return `${minutes}m ${remainingSeconds}s`; // Nếu nhỏ hơn 60 phút, trả về phút và giây
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`; // Trả về giờ, phút, giây
}