import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarPage.css"; // Optional CSS for styling

const CalendarPage = () => {
  const [events, setEvents] = useState([
    { title: "Employee Meeting", date: "2024-10-15" },
    { title: "Project Deadline", date: "2024-10-20" },
  ]);

  const handleDateClick = (arg) => {
    // Add new event on date click
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick} // Handle date click to add events
        editable={true} // Allows dragging and dropping events
        selectable={true} // Allows selecting dates
      />
    </div>
  );
};
export default CalendarPage;