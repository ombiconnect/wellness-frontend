import React, { useEffect, useState } from "react";
import UniversalCard from "../../Components/UniversalCard";
import Modal from "../../Modal";
import ProgramUpsertForm from "./Components/ProgramUpsertForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteProgram, getAllPrograms } from "../../Thunks/Program";
import Button from "../../Components/Form/Button";
import NoData from "../../Components/NoData";
import PageHeader from "../../Components/PageHeader";

const Program = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModelOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModelOpen, setIsDeleteModalOpen] = useState(false);

  const [updateProgramData, setUpdateProgramData] = useState({});
  const [deleteProgramData, setDeleteProgramData] = useState({});

  const programsState = useSelector((state) => state.program);

  const dispatch = useDispatch();

  const handleEditProgram = (program) => {
    const originalFormat = {
      id: program.id,
      name: program.title,
      description: program.subtitle,
      status: program.status,
    };
    setUpdateProgramData(originalFormat);
    setIsEditModalOpen(true);
  };

  const setDeleteProgram = (program) => {
    setIsDeleteModalOpen(true);
    setDeleteProgramData({
      id: program.id,
      name: program.title,
    });
  };

  const handleCreateProgram = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = () => {
    isAddModelOpen ? setIsAddModalOpen(false) : true;
    isEditModalOpen ? setIsEditModalOpen(false) : true;
    isDeleteModelOpen ? setIsDeleteModalOpen(false) : true;
  };

  const handleDeleteProgram = async () => {
    await dispatch(deleteProgram(deleteProgramData.id));
    setIsDeleteModalOpen(false);
    fetchPrograms();
  };

  const fetchPrograms = async () => {
    await dispatch(getAllPrograms());
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const Programs = (programsState?.items ?? []).map((program) => ({
    id: program.id ?? "",
    title: program.name ?? "",
    subtitle: program.description ?? "",
    status: program.status?.toLowerCase() ?? "draft",
    metrics: {
      quadrants: program.quadrants ?? 0,
      habits: program.habits ?? 0,
      members: program.members ?? 0,
    },
    color: "#2563eb",
    icon: "fa-layer-group",
    created: program.created ?? new Date().toISOString(),
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <PageHeader onCreateButtonClick={handleCreateProgram} />

      {Programs.length == 0 ? (
        <NoData name={"program"} icon={"fa-layer-group"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Programs.map((program) => (
            <UniversalCard
              key={program.id}
              item={program}
              onEdit={handleEditProgram}
              onDelete={setDeleteProgram}
            />
          ))}
        </div>
      )}

      <Modal
        title={"Create Program Details"}
        body={
          <ProgramUpsertForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchPrograms();
            }}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        title={"Edit Program Details"}
        body={
          <ProgramUpsertForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchPrograms();
            }}
            programData={updateProgramData}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        title={"Delete Program"}
        body={
          <h1>
            Are you sure you want to delete
            <span className="text-red-700"> {deleteProgramData?.name}</span>?
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
              onClick={handleDeleteProgram}
            >
              Delete Program
            </Button>
          </div>
        }
        isOpen={isDeleteModelOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Program;
