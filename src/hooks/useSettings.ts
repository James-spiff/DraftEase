//This hook manages the user settings and handles persistence to local storage.
import { useState, useEffect } from 'react';

export type SettingsType = {
    enableHeadings: boolean;
    enableBullets: boolean;
    enableParagraphs: boolean;
    enableBold: boolean;
    enableItalics: boolean;
    enableLinks: boolean;
};

const defaultSettings: SettingsType = {
    enableHeadings: true,
    enableBullets: true,
    enableParagraphs: true,
    enableBold: true,
    enableItalics: true,
    enableLinks: true
};

export const useSettings = () => {
    const [settings, setSettings] = useState<SettingsType>(() => {
        const savedSettings = localStorage.getItem('draftEaseSettings');
        return savedSettings
        ? JSON.parse(savedSettings)
        : defaultSettings; //If no settings are saved, default settings are applied
    });

    //Save settings to local storage whenever it changes. This is like an autosave feature
    useEffect(() => {
        localStorage.setItem('draftEaseSettings', JSON.stringify(settings));
        console.log('Settings saved:', settings)
    }, [settings]);

    //Would be used with a button to reset to default settings whenever the user clicks
    const resetToDefaults = () => {
        setSettings(defaultSettings);
    };

    const updateSettings = (key: keyof SettingsType, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    } //Updates the specific setting based on user interaction

    return { settings, setSettings, resetToDefaults, updateSettings };
} 