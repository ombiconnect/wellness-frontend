import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import HabitUpsertForm from "./Components/HabitUpsertForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteHabit, getAllHabits } from "../../Thunks/Habit";
import Button from "../../Components/Form/Button";
import NoData from "../../Components/NoData";
import PageHeader from "../../Components/PageHeader";
import UniversalCard from "../../Components/UniversalCard";
import Loader from "../../Components/Loader";

const Habit = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateHabitData, setUpdateHabitData] = useState({});
  const [deleteHabitData, setDeleteHabitData] = useState({});

  const habitState = useSelector((state) => state.habit);

  const dispatch = useDispatch();

  const handleEditHabit = (habit) => {
    setUpdateHabitData(habit);
    setIsEditModalOpen(true);
  };

  const setDeleteHabit = (habit) => {
    setIsDeleteModalOpen(true);
    setDeleteHabitData({
      id: habit.id,
      name: habit.title,
    });
  };

  const handleCreateHabit = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = () => {
    isAddModalOpen && setIsAddModalOpen(false);
    isEditModalOpen && setIsEditModalOpen(false);
    isDeleteModalOpen && setIsDeleteModalOpen(false);
  };

  const handleDeleteHabit = async () => {
    await dispatch(deleteHabit(deleteHabitData.id));
    setIsDeleteModalOpen(false);
    fetchHabits();
  };

  const fetchHabits = async () => {
    await dispatch(getAllHabits());
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const Habits = (Array.isArray(habitState?.items) ? habitState.items : []).map(
    (habit) => ({
      id: habit.id ?? "",
      title: habit.title ?? "",
      subtitle: `Difficulty: ${habit.difficultyLevel}`,
      color: habit.focusArea?.color ?? "#10b981",
      icon: habit.focusArea?.icon ?? "fa-repeat",
      metrics: {
        participants: habit.participants ?? 0,
      },
      created: habit.createdAt ?? new Date().toISOString(),
      originalData: habit,
    })
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <PageHeader
        onCreateButtonClick={handleCreateHabit}
        createButtonText="Create Habit"
      />

      {Habits.length === 0 ? (
        <NoData name={"habit"} icon={"fa-repeat"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Habits.map((habit) => (
            <UniversalCard
              key={habit.id}
              item={habit}
              onEdit={handleEditHabit}
              onDelete={setDeleteHabit}
            />
          ))}
        </div>
      )}
      {habitState.loading && (
        <Loader size="large" color="blue" showText={false} />
      )}
      <Modal
        size={"max-w-xl"}
        title={"Create Habit Details"}
        body={
          <HabitUpsertForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchHabits();
            }}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        size={"max-w-xl"}
        title={"Edit Habit Details"}
        body={
          <HabitUpsertForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchHabits();
            }}
            habitData={updateHabitData.originalData || updateHabitData}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        title={"Delete Habit"}
        body={
          <h1>
            Are you sure you want to delete
            <span className="text-red-700"> {deleteHabitData?.name}</span>?
          </h1>
        }
        footer={
          <div className="mt-4 border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              variant="primary"
              size="medium"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="medium"
              onClick={handleDeleteHabit}
            >
              Delete Habit
            </Button>
          </div>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Habit;
