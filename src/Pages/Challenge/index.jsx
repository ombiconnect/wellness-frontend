import React, { useEffect, useState } from "react";
import Modal from "../../Modal";
import ChallengeUpsertForm from "./Components/ChallengeUpsertForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteChallenge, getAllChallenges } from "../../Thunks/Challenge";
import Button from "../../Components/Form/Button";
import NoData from "../../Components/NoData";
import PageHeader from "../../Components/PageHeader";
import UniversalCard from "../../Components/UniversalCard";

const Challenge = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [updateChallengeData, setUpdateChallengeData] = useState({});
  const [deleteChallengeData, setDeleteChallengeData] = useState({});

  const challengeState = useSelector((state) => state.challenge);

  const dispatch = useDispatch();

  const handleEditChallenge = (challenge) => {
    setUpdateChallengeData(challenge);
    setIsEditModalOpen(true);
  };

  const setDeleteChallenge = (challenge) => {
    setIsDeleteModalOpen(true);
    setDeleteChallengeData({
      id: challenge.id,
      name: challenge.title,
    });
  };

  const handleCreateChallenge = () => {
    setIsAddModalOpen(true);
  };

  const handleCancelClick = () => {
    isAddModalOpen && setIsAddModalOpen(false);
    isEditModalOpen && setIsEditModalOpen(false);
    isDeleteModalOpen && setIsDeleteModalOpen(false);
  };

  const handleDeleteChallenge = async () => {
    await dispatch(deleteChallenge(deleteChallengeData.id));
    setIsDeleteModalOpen(false);
    fetchChallenges();
  };

  const fetchChallenges = async () => {
    await dispatch(getAllChallenges());
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const Challenges = (challengeState?.items ?? []).map((challenge) => ({
    id: challenge.id ?? "",
    title: challenge.title ?? "",
    subtitle: challenge.subtitle ?? "",
    difficultyLevel: challenge.difficultyLevel?.toLowerCase() ?? "",
    metrics: {
      participants: challenge.participants ?? 0,
      tasks: challenge.tasks ?? 0,
      duration: challenge.durationDays
        ? `${challenge.durationDays} days`
        : "N/A",
    },
    color: "#8b5cf6",
    icon: "fa-trophy",
    created: challenge.createdAt ?? new Date().toISOString(),
    originalData: challenge,
  }));

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <PageHeader
        onCreateButtonClick={handleCreateChallenge}
        createButtonText="Create Challenge"
      />

      {Challenges.length === 0 ? (
        <NoData name={"challenge"} icon={"fa-trophy"} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Challenges.map((challenge) => (
            <UniversalCard
              key={challenge.id}
              item={challenge}
              onEdit={handleEditChallenge}
              onDelete={setDeleteChallenge}
            />
          ))}
        </div>
      )}

      <Modal
        size={"max-w-2xl"}
        title={"Create Challenge Details"}
        body={
          <ChallengeUpsertForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              fetchChallenges();
            }}
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modal
        size={"max-w-2xl"}
        title={"Edit Challenge Details"}
        body={
          <ChallengeUpsertForm
            onSuccess={() => {
              setIsEditModalOpen(false);
              fetchChallenges();
            }}
            challengeData={
              updateChallengeData.originalData || updateChallengeData
            }
            handleCancelClick={handleCancelClick}
          />
        }
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <Modal
        title={"Delete Challenge"}
        body={
          <h1>
            Are you sure you want to delete
            <span className="text-red-700"> {deleteChallengeData?.name}</span>?
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
              onClick={handleDeleteChallenge}
            >
              Delete Challenge
            </Button>
          </div>
        }
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default Challenge;
