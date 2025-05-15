import { JSX } from "react";

export type TypeAppMode = 'exercise' | 'weight'; // Or 'weightfood' if you prefer

export interface IScreen {
    path: string;
    component: JSX.Element;
}

export interface IScreenList {
    [key: string]: IScreen;
}

// New type for a single exercise entry
export interface IExerciseEntry {
    id: string; // Unique ID for the entry (e.g., timestamp or uuid)
    name: string;
    sets: number;
    reps: number;
}

// New type for daily exercise data
export interface IDailyExercises {
    date: string; // Store date as ISO string (YYYY-MM-DD) for easy keying
    entries: IExerciseEntry[];
}

// New type for daily weight data
export interface IDailyWeight {
    date: string; // Store date as ISO string (YYYY-MM-DD)
    morningWeight?: number | null; // Optional weight in kg/lbs
    eveningWeight?: number | null; // Optional weight in kg/lbs
    // Add food entries later if needed
}

// --- New Food Entry Type ---
export interface IFoodEntry {
    id: string; // Unique ID
    name: string;
    calories: number;
    // Optional: Add protein, carbs, fat if needed later
}
// --- End New Food Entry Type ---

// --- Modified Daily Data Type ---
// Combines weight and food for a single day
export interface IDailyWeightFood {
    date: string; // YYYY-MM-DD format
    morningWeight: number | null;
    eveningWeight: number | null;
    foodEntries: IFoodEntry[]; // Array to hold multiple food items
}
// --- End Modified Daily Data Type ---

// Calendar Tile Properties (if not already defined elsewhere)
export interface CalendarTileProperties {
    date: Date;
    view: string;
}