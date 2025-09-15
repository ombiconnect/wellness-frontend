// src/Pages/ContentManagement.jsx
import { useState } from "react";
import ContentHeader from "./Components/ContentHeader";
import QuadrantTabs from "./Components/QuadrantTabs";
import ActionBar from "./Components/ActionBar";
import StatsOverview from "./Components/StatsOverview";
import HabitGrid from "./Components/HabitGrid";

const ContentManagement = () => {
  const [activeQuadrant, setActiveQuadrant] = useState("health");

  const statsData = {
    health: 24,
    growth: 18,
    relationships: 15,
    wealth: 12,
  };

  const habitsData = [
    {
      id: 1,
      quadrant: "health",
      icon: "fa-glass-water",
      level: "Basic",
      status: "Active",
      title: "Hydration Master",
      description: "Drink 2-3L of water daily for optimal hydration and health",
      difficulty: 1,
    },
    {
      id: 2,
      quadrant: "health",
      icon: "fa-dumbbell",
      level: "Advanced",
      status: "Active",
      title: "Morning Workout",
      description:
        "30-45 minute workout routine focusing on strength and cardio",
      difficulty: 3,
    },
    {
      id: 3,
      quadrant: "health",
      icon: "fa-snowflake",
      level: "Pro",
      status: "Draft",
      title: "Cold Exposure",
      description: "Take cold showers or ice baths for 2-3 minutes daily",
      difficulty: 5,
    },
    {
      id: 4,
      quadrant: "growth",
      icon: "fa-book-open",
      level: "Basic",
      status: "Active",
      title: "Daily Journaling",
      description: "5 minutes of journaling to reflect on your day and goals",
      difficulty: 1,
    },
  ];

  const handleQuadrantChange = (quadrant) => {
    setActiveQuadrant(quadrant);
  };

  return (
    // <div>
    //   <div className="p-8">
    //     <QuadrantTabs
    //       activeQuadrant={activeQuadrant}
    //       onQuadrantChange={handleQuadrantChange}
    //     />
    //     <ActionBar />
    //     <StatsOverview stats={statsData} />
    //     <HabitGrid
    //       habits={habitsData.filter(
    //         (habit) => habit.quadrant === activeQuadrant
    //       )}
    //     />
    //   </div>
    // </div>
    <h1>This is content page </h1>
  );
};

export default ContentManagement;
