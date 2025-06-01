import React, { useState, useEffect } from "react";
import {
   getAllExerciseNames,
   getExercisesForDateRangeFormatted,
   saveUnitPreferences, // Import saveUnitPreferences
   loadUnitPreferences, // Import loadUnitPreferences
} from "../../Utils/LocalStorageUtils";
import { EditExerciseModal } from "../../Components/SettingsPage/EditExerciseModal";
import { DeleteExerciseModal } from "../../Components/SettingsPage/DeleteExerciseModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IUnitPreferences, WeightUnit, HeightUnit, CalendarWeekStart } from "../../Types/AppTypes"; // Import unit types and CalendarWeekStart

export const Settings: React.FC = () => {
   const [exerciseNames, setExerciseNames] = useState<string[]>([]);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedExercise, setSelectedExercise] = useState("");
   const [newExerciseName, setNewExerciseName] = useState("");
   const [copyStatus, setCopyStatus] = useState<string | null>(null); // State for copy status message
   const [startDate, setStartDate] = useState<Date | null>(null);
   const [endDate, setEndDate] = useState<Date | null>(null);
   const [unitPreferences, setUnitPreferences] = useState<IUnitPreferences>(
      loadUnitPreferences()
   );

   useEffect(() => {
      loadExerciseNames();
      setUnitPreferences(loadUnitPreferences()); // Load preferences on mount
   }, []);

   const loadExerciseNames = () => {
      const names = getAllExerciseNames();
      setExerciseNames(names);
   };

   const handleEditClick = (exercise: string) => {
      setSelectedExercise(exercise);
      setNewExerciseName(exercise);
      setShowEditModal(true);
   };

   const handleDeleteClick = (exercise: string) => {
      setSelectedExercise(exercise);
      setShowDeleteModal(true);
   };

   const handleSaveEdit = () => {
      // This will be implemented in the EditExerciseModal component
      setShowEditModal(false);
      loadExerciseNames(); // Refresh the list
   };

   const handleConfirmDelete = () => {
      // This will be implemented in the DeleteExerciseModal component
      setShowDeleteModal(false);
      loadExerciseNames(); // Refresh the list
   };

   // Handler to copy last week's exercises
   const handleCopySelectedDates = async () => {
      if (!startDate || !endDate) {
         setCopyStatus("Please select both start and end dates.");
         setTimeout(() => setCopyStatus(null), 3000);
         return;
      }
      const formattedData = getExercisesForDateRangeFormatted(
         startDate,
         endDate
      );
      try {
         await navigator.clipboard.writeText(Array.isArray(formattedData) ? formattedData.join("\n") : formattedData);
         setCopyStatus("Copied to clipboard!");
      } catch (err) {
         console.error("Failed to copy:", err);
         setCopyStatus("Failed to copy data.");
      }
      // Clear status message after a few seconds
      setTimeout(() => setCopyStatus(null), 3000);
   };

   // Handler to save unit preferences
   const handleUnitChange = (
      type: keyof IUnitPreferences,
      value: WeightUnit | HeightUnit | CalendarWeekStart // Added CalendarWeekStart
   ) => {
      const newPreferences = { ...unitPreferences, [type]: value };
      setUnitPreferences(newPreferences);
      saveUnitPreferences(newPreferences);
   };

   const getWeekStartsOn = () => {
      return unitPreferences.calendarWeekStart === 'monday' ? 1 : 0;
   };

   return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200">
         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-green-dark mb-5 sm:mb-6">
            Settings
         </h2>

         {/* Measurement Units Section */}
         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               Measurement Units
            </h3>
            <div className="space-y-4">
               {/* Weight Unit Selector */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Weight Unit
                  </label>
                  <div className="flex space-x-2">
                     {(["kg", "lbs"] as WeightUnit[]).map((unit) => (
                        <button
                           key={unit}
                           onClick={() => handleUnitChange("weight", unit)}
                           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                     ${
                                        unitPreferences.weight === unit
                                           ? "bg-brand-green text-white shadow-sm"
                                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                     }`}
                        >
                           {unit.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Height Unit Selector */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     Height Unit
                  </label>
                  <div className="flex space-x-2">
                     {(["cm", "ft/in"] as HeightUnit[]).map((unit) => (
                        <button
                           key={unit}
                           onClick={() => handleUnitChange("height", unit)}
                           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                     ${
                                        unitPreferences.height === unit
                                           ? "bg-brand-green text-white shadow-sm"
                                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                     }`}
                        >
                           {unit.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Calendar Week Start Section */}
         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               Calendar Week Start
            </h3>
            <div className="flex space-x-2">
               {(['sunday', 'monday'] as CalendarWeekStart[]).map((day) => (
                  <button
                     key={day}
                     onClick={() => handleUnitChange('calendarWeekStart', day)}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                               ${unitPreferences.calendarWeekStart === day
                                  ? 'bg-brand-green text-white shadow-sm'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                               }`}
                  >
                     {day.charAt(0).toUpperCase() + day.slice(1)}
                  </button>
               ))}
            </div>
         </div>

         {/* New section for copying data */}
         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               Data Export
            </h3>
            <div className="flex flex-col items-start sm:flex-row md:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
               <div className="flex flex-col">
                  <label
                     htmlFor="startDate"
                     className="text-sm font-medium text-gray-700 mb-1"
                  >
                     Start Date:
                  </label>
                  <DatePicker
                     id="startDate"
                     selected={startDate}
                     onChange={(date: Date | null) => setStartDate(date)}
                     selectsStart
                     startDate={startDate}
                     endDate={endDate}
                     className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto"
                     dateFormat="yyyy-MM-dd"
                     placeholderText="Select start date"
                     calendarStartDay={getWeekStartsOn()} // Using correct prop name for react-datepicker
                  />
               </div>
               <div className="flex flex-col">
                  <label
                     htmlFor="endDate"
                     className="text-sm font-medium text-gray-700 mb-1"
                  >
                     End Date:
                  </label>
                  <DatePicker
                     id="endDate"
                     selected={endDate}
                     onChange={(date: Date | null) => setEndDate(date)}
                     selectsEnd
                     startDate={startDate}
                     endDate={endDate}
                     minDate={startDate || undefined}
                     className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto"
                     dateFormat="yyyy-MM-dd"
                     placeholderText="Select end date"
                     calendarStartDay={getWeekStartsOn()} // Using correct prop name for react-datepicker
                  />
               </div>
            </div>
            <button
               onClick={handleCopySelectedDates}
               className="px-4 py-2 bg-brand-green text-white font-medium rounded-md shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition duration-150 ease-in-out text-sm"
            >
               Copy Selected Dates' Exercises
            </button>
            {copyStatus && (
               <p
                  className={`mt-2 text-sm ${
                     copyStatus.startsWith("Failed")
                        ? "text-red-600"
                        : "text-green-600"
                  }`}
               >
                  {copyStatus}
               </p>
            )}
         </div>

         <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               Saved Exercises
            </h3>
            {exerciseNames.length === 0 ? (
               <p className="text-center text-gray-500 italic mt-4">
                  No custom exercises saved yet.
               </p>
            ) : (
               <div className="space-y-2">
                  {exerciseNames.map((exercise) => (
                     <div
                        key={exercise}
                        className="p-3 sm:p-4 border border-gray-200 rounded-lg flex justify-between items-center max-w-[100%] overflow-hidden"
                     >
                        {/* Added break-words class */}
                        <span className="font-medium text-brand-text break-words text-wrap max-w-[100%] overflow-hidden">
                           {exercise}
                        </span>
                        <div className="flex space-x-2">
                           <button
                              onClick={() => handleEditClick(exercise)}
                              className="p-1.5 text-gray-600 hover:text-brand-green transition-colors"
                              aria-label={`Edit ${exercise}`}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                 />
                              </svg>
                           </button>
                           <button
                              onClick={() => handleDeleteClick(exercise)}
                              className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                              aria-label={`Delete ${exercise}`}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                 />
                              </svg>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {showEditModal && (
            <EditExerciseModal
               exercise={selectedExercise}
               newName={newExerciseName}
               setNewName={setNewExerciseName}
               onSave={handleSaveEdit}
               onCancel={() => setShowEditModal(false)}
            />
         )}

         {showDeleteModal && (
            <DeleteExerciseModal
               exercise={selectedExercise}
               onConfirm={handleConfirmDelete}
               onCancel={() => setShowDeleteModal(false)}
            />
         )}
      </div>
   );
};