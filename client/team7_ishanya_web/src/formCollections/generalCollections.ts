import { createListCollection } from "@chakra-ui/react";
// Enrollment Year Collection
const currentYear = new Date().getFullYear();
export const enrollmentYearCollection = createListCollection({
  items: Array.from({ length: currentYear - 1999 }, (_, i) => {
    const year = 2000 + i;
    return { label: year.toString(), value: year.toString() };
  })
});

// Timings Collection
export const timingsCollection = createListCollection({
  items: Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour > 12 ? hour - 12 : hour;
    return { 
      label: `${hour12}:00 ${ampm}`, 
      value: `${hour.toString().padStart(2, '0')}:00` 
    };
  })
});

// Days of Week Collection
export const daysOfWeekCollection = createListCollection({
  items: [
    { label: "Monday", value: "Monday" },
    { label: "Tuesday", value: "Tuesday" },
    { label: "Wednesday", value: "Wednesday" },
    { label: "Thursday", value: "Thursday" },
    { label: "Friday", value: "Friday" },
    { label: "Saturday", value: "Saturday" },
    { label: "Sunday", value: "Sunday" }
  ]
});

// Session Type Collection
export const sessionTypeCollection = createListCollection({
  items: [
    { label: "Offline", value: "Offline" },
    { label: "Online", value: "Online" }
  ]
});
