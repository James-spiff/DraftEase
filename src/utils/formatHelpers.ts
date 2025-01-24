/**
 * Formats the given text based on the provided settings.
 * @param text The text to format.
 * @param settings The formatting settings.
 * @returns The formatted HTML string.
 */
import { useSettings } from "../hooks/useSettings";

//formatting function to convert the rich text to html
export const formatContent = (text: string ): string => {

    const { settings }  = useSettings();
    const lines = text.split('\n');
    return lines.map((line: string) => {

        //links
        if (settings.enableLinks) {
          const linkRegex = /\[(.*?)\]\((.*?)\)/g;
          line = line.replace(linkRegex, '<a href="$2">$1</a>');
        }

        //bold
        if (settings.enableBold) {
          const boldRegex = /\*\*(.*?)\*\*/g;
          line = line.replace(boldRegex, '<b>$1</b>');
        }

        //italics
        if (settings.enableItalics) {
          const italicsRegex = /\*(.*?)\*/g;
          line = line.replace(italicsRegex, '<i>$1</i>');
        }

        if (settings.enableHeadings && line.startsWith('# ')) {
            return `<h1>${line.slice(2)}</h1>`; //Heading 1
        } else if (settings.enableHeadings && line.startsWith('## ')) {
            return `<h2>${line.slice(3)}</h2>`; //Heading 2
        } else if (settings.enableBullets && line.startsWith('- ')) {
            return `<li>${line.slice(2)}</li>`; //Bullet point
        } else if (settings.enableParagraphs) {
            return `<p>${line}</p>`; // Paragraph
        } else {
            return ''; //skip the line if no formatting is applied
        }
    }).join('');
  };

export const wordCount = (text: string): number => text.split(/\s+/).filter((word) => word).length;
export  const charCount = (text: string): number => text.length;