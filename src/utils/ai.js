// Simple heuristic for auto-priority suggestion
export function suggestPriority(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const highKeywords = ['not working', 'down', 'error', 'failed', 'urgent', 'cannot', 'blocked'];
    const mediumKeywords = ['slow', 'delay', 'issue', 'problem'];

    if (highKeywords.some(k => text.includes(k))) return 'high';
    if (mediumKeywords.some(k => text.includes(k))) return 'medium';
    return 'low';
}
