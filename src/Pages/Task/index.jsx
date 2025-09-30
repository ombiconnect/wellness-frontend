import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import TaskUpsertForm from "./Components/TaskUpsertForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, getAllTasks } from "../../Thunks/Task";
import Button from "../../Components/Form/Button";
import NoData from "../../Components/NoData";
import PageHeader from "../../Components/PageHeader";
import UniversalCard from "../../Components/UniversalCard";
import Loader from "../../Components/Loader";

const Task = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateTaskData, setUpdateTaskData] = useState({});
  const [deleteTaskData, setDeleteTaskData] = useState({});

  const taskState = useSelector((state) => state.task);

  const dispatch = useDispatch();

  const handleEditTask = (task) => {
    setUpdateTaskData(task);
    setIsEditModalOpen(true);
  };

  const setDeleteTask = (task) => {
    setIsDeleteModalOpen(true);
    setDeleteTaskData({
      id: task.id,
      name: task.title,
    });
  };

  const handleCreateTask = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = () => {
    isAddModalOpen && setIsAddModalOpen(false);
    isEditModalOpen && setIsEditModalOpen(false);
    isDeleteModalOpen && setIsDeleteModalOpen(false);
  };

  const handleDeleteTask = async () => {
    await dispatch(deleteTask(deleteTaskData.id));
    setIsDeleteModalOpen(false);
    fetchTasks();
  };

  const fetchTasks = async () => {
    await dispatch(getAllTasks());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const Tasks = (Array.isArray(taskState?.items) ? taskState.items : []).map(
    (task) => ({
      id: task.id ?? "",
      title: task.title ?? "",
      subtitle: task.description ?? "",
      metrics: {
        order: task.order ?? 0,
        xp: task.xp ?? 0,
      },
      color: "#06b6d4",
      icon: "list-check",
      created: task.createdAt ?? new Date().toISOString(),
      originalData: task,
    })
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <PageHeader
        onCreateButtonClick={handleCreateTask}
        createButtonText="Create Task"
      />

      {Tasks.length === 0 ? (
        <NoData name={"task"} icon={"fa-list-check"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Tasks.map((task) => (
            <UniversalCard
              key={task.id}
              item={task}
              onEdit={handleEditTask}
              onDelete={setDeleteTask}
            />
          ))}
        </div>
      )}
      {taskState.loading && (
        <Loader size="large" color="blue" showText={false} />
      )}

      <Modal
        size={"max-w-2xl"}
        title={"Create Task Details"}
        body={
          <TaskUpsertForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchTasks();
            }}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        size={"max-w-2xl"}
        title={"Edit Task Details"}
        body={
          <TaskUpsertForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchTasks();
            }}
            taskData={updateTaskData.originalData || updateTaskData}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        title={"Delete Task"}
        body={
          <h1>
            Are you sure you want to delete
            <span className="text-red-700"> {deleteTaskData?.name}</span>?
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
              onClick={handleDeleteTask}
            >
              Delete Task
            </Button>
          </div>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Task;
