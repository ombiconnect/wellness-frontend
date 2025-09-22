import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import FocusAreaUpsertForm from "./Components/FocusAreaUpsertForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteFocusArea, getAllFocusAreas } from "../../Thunks/FocusArea";
import Button from "../../Components/Form/Button";
import NoData from "../../Components/NoData";
import PageHeader from "../../Components/PageHeader";
import UniversalCard from "../../Components/UniversalCard";
import Loader from "../../Components/Loader";

const FocusArea = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateFocusAreaData, setUpdateFocusAreaData] = useState({});
  const [deleteFocusAreaData, setDeleteFocusAreaData] = useState({});

  const focusAreaState = useSelector((state) => state.focusArea);

  const dispatch = useDispatch();

  const handleEditFocusArea = (focusArea) => {
    setUpdateFocusAreaData(focusArea);
    setIsEditModalOpen(true);
  };

  const setDeleteFocusArea = (focusArea) => {
    setIsDeleteModalOpen(true);
    setDeleteFocusAreaData({
      id: focusArea.id,
      name: focusArea.title,
    });
  };

  const handleCreateFocusArea = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = () => {
    isAddModalOpen ? setIsAddModalOpen(false) : true;
    isEditModalOpen ? setIsEditModalOpen(false) : true;
    isDeleteModalOpen ? setIsDeleteModalOpen(false) : true;
  };

  const handleDeleteFocusArea = async () => {
    await dispatch(deleteFocusArea(deleteFocusAreaData.id));
    setIsDeleteModalOpen(false);
    fetchFocusAreas();
  };

  const fetchFocusAreas = async () => {
    await dispatch(getAllFocusAreas());
  };

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  const FocusAreas = (
    Array.isArray(focusAreaState?.items) ? focusAreaState.items : []
  ).map((fa) => ({
    id: fa.id ?? "",
    title: fa.name ?? "",
    subtitle: fa.label ?? "",
    color: fa.color ?? "#ccc",
    icon: fa.icon ?? "fa-bullseye",
    metrics: {
      quadrants: fa.quadrants ?? 0,
      habits: fa.habits ?? 0,
      members: fa.members ?? 0,
    },
    created: fa.createdAt ?? new Date().toISOString(),
    originalData: fa,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <PageHeader
        onCreateButtonClick={handleCreateFocusArea}
        createButtonText="Create Focus Area"
      />

      {FocusAreas.length === 0 ? (
        <NoData name={"focus area"} icon={"fa-bullseye"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {FocusAreas.map((fa) => (
            <UniversalCard
              key={fa.id}
              item={fa}
              onEdit={handleEditFocusArea}
              onDelete={setDeleteFocusArea}
            />
          ))}
        </div>
      )}
      {focusAreaState.loading && (
        <Loader size="large" color="blue" showText={false} />
      )}
      <Modal
        title={"Create Focus Area Details"}
        body={
          <FocusAreaUpsertForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchFocusAreas();
            }}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        title={"Edit Focus Area Details"}
        body={
          <FocusAreaUpsertForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchFocusAreas();
            }}
            focusAreaData={
              updateFocusAreaData.originalData || updateFocusAreaData
            }
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        title={"Delete Focus Area"}
        body={
          <h1>
            Are you sure you want to delete
            <span className="text-red-700"> {deleteFocusAreaData?.name}</span>?
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
              onClick={handleDeleteFocusArea}
            >
              Delete Focus Area
            </Button>
          </div>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default FocusArea;
