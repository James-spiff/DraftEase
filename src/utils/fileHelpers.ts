//Downloads the formatted content as a HTML file
//content reps the formattedContent state that will be passed to it

export const saveToFile = (content: string) => {
    const blob = new Blob([content], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'formatted-content.html';
    link.click();
};