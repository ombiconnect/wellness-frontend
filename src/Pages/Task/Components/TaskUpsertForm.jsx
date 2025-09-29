import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { upsertTask } from "../../../Thunks/Task";
import DropDown from "../../../Components/DropDown";
import { getAllChallenges } from "../../../Thunks/Challenge";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../Firebase/Firebase";

const TaskUpsertForm = ({ taskData, handleCancelClick, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    challengeId: "",
    order: 0,
    xp: 0,
    activity: {
      text: "",
      children: [""],
    },
    keyTakeaways: [""],
    media: {
      title: "",
      body: "",
      file: null, // This will be the media file (audio/video)
      thumbnailFile: null, // New: separate thumbnail file
      posterUrl: "",
      mediaUrl: "", // New: for storing media file path
      type: "",
    },
  });

  const [previewUrl, setPreviewUrl] = useState("");
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState(""); // New: for media preview
  const [errors, setErrors] = useState({});
  const challenges = useSelector((state) => state.challenge);

  // Fetch preview URL when taskData changes
  useEffect(() => {
    const fetchPreviewUrl = async () => {
      if (taskData?.media?.posterUrl) {
        try {
          // If it's a full URL (already uploaded), use it directly
          if (taskData.media.posterUrl.startsWith("http")) {
            setPreviewUrl(taskData.media.posterUrl);
          } else {
            // If it's a storage path, get download URL
            const url = await getDownloadURL(
              ref(storage, taskData.media.posterUrl)
            );
            setPreviewUrl(url);
          }
        } catch (error) {
          console.error("Error fetching preview URL:", error);
          setPreviewUrl("");
        }
      } else {
        setPreviewUrl("");
      }

      // Fetch media preview URL
      if (taskData?.media?.audio?.url || taskData?.media?.video?.url) {
        try {
          const mediaPath =
            taskData.media.audio?.url || taskData.media.video?.url;
          if (mediaPath.startsWith("http")) {
            setMediaPreviewUrl(mediaPath);
          } else {
            const url = await getDownloadURL(ref(storage, mediaPath));
            setMediaPreviewUrl(url);
          }
        } catch (error) {
          console.error("Error fetching media preview URL:", error);
          setMediaPreviewUrl("");
        }
      } else {
        setMediaPreviewUrl("");
      }
    };

    fetchPreviewUrl();
  }, [taskData]);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleNestedChange = (parentField, fieldName, value, index = null) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };

      if (index !== null) {
        const updatedChildren = [...updatedParent[fieldName]];
        updatedChildren[index] = value;
        updatedParent[fieldName] = updatedChildren;
      } else {
        updatedParent[fieldName] = value;
      }

      return { ...prev, [parentField]: updatedParent };
    });

    const errorKey =
      index !== null
        ? `${parentField}${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          }`
        : `${parentField}${
            fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
          }`;

    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const handleArrayChange = (fieldName, value, index) => {
    setFormData((prev) => {
      const updatedArray = [...prev[fieldName]];
      updatedArray[index] = value;
      return { ...prev, [fieldName]: updatedArray };
    });

    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const addArrayItem = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: [...prev[fieldName], ""],
    }));
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData((prev) => {
      const updatedArray = [...prev[fieldName]];
      updatedArray.splice(index, 1);
      return { ...prev, [fieldName]: updatedArray };
    });
  };

  const addChildItem = (parentField, fieldName) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };
      updatedParent[fieldName] = [...updatedParent[fieldName], ""];
      return { ...prev, [parentField]: updatedParent };
    });
  };

  const removeChildItem = (parentField, fieldName, index) => {
    setFormData((prev) => {
      const updatedParent = { ...prev[parentField] };
      const updatedChildren = [...updatedParent[fieldName]];
      updatedChildren.splice(index, 1);
      updatedParent[fieldName] = updatedChildren;
      return { ...prev, [parentField]: updatedParent };
    });
  };

  // Handle thumbnail file upload
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          thumbnailFile: file,
          posterUrl: "", // Clear existing posterUrl when new file is selected
        },
      }));
    }
  };

  // Handle media file upload (audio/video) - Modified existing function
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith("video")
        ? "VIDEO"
        : file.type.startsWith("audio")
        ? "AUDIO"
        : null;

      if (!type) {
        alert("Please select a valid audio or video file");
        return;
      }

      // Create preview URL for videos only
      if (file.type.startsWith("video") || file.type.startsWith("audio")) {
        const url = URL.createObjectURL(file);
        setMediaPreviewUrl(url);
      } else {
        setMediaPreviewUrl(""); // Clear preview for audio files
      }

      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          file: file,
          type: type,
          mediaUrl: "", // Clear existing mediaUrl when new file is selected
        },
      }));
    }
  };

  // Remove current media
  const handleRemoveMedia = () => {
    setFormData((prev) => ({
      ...prev,
      media: {
        title: "",
        body: "",
        file: null,
        thumbnailFile: null,
        posterUrl: "",
        mediaUrl: "",
        type: "",
      },
    }));
    setPreviewUrl("");
    setMediaPreviewUrl("");

    // If we're editing an existing task with media, set media to null to delete it
    if (taskData?.media) {
      setFormData((prev) => ({
        ...prev,
        media: null, // This will trigger deletion in the repository
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required";
    }

    if (!formData.challengeId.trim()) {
      newErrors.challengeId = "Challenge is required";
    }

    const orderValue = parseInt(formData.order) || 0;
    if (!formData.order && formData.order !== 0) {
      newErrors.order = "Order is required";
    } else if (orderValue <= 0) {
      newErrors.order = "Order must be greater than 0";
    }

    const xpValue = parseInt(formData.xp) || 0;
    if (!formData.xp && formData.xp !== 0) {
      newErrors.xp = "XP is required";
    } else if (xpValue <= 0) {
      newErrors.xp = "XP must be greater than 0";
    }

    if (!formData.activity.text.trim()) {
      newErrors.activityText = "Activity description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      activity: {
        ...formData.activity,
        children: formData.activity.children.filter(
          (item) => item.trim() !== ""
        ),
      },
      keyTakeaways: formData.keyTakeaways.filter((item) => item.trim() !== ""),
      order: parseInt(formData.order) || 0,
      xp: parseInt(formData.xp) || 0,
    };

    // If media is completely removed, send null
    if (formData.media === null) {
      payload.media = null;
    }

    dispatch(upsertTask(payload)).then((action) => {
      if (upsertTask.fulfilled.match(action)) {
        if (onSuccess) onSuccess();
      }
    });
  };

  useEffect(() => {
    if (taskData) {
      setFormData({
        id: taskData.id || "",
        title: taskData.title || "",
        description: taskData.description || "",
        challengeId: taskData.challengeId || "",
        order: taskData.order || 0,
        xp: taskData.xp || 0,
        activity: taskData.activity || { text: "", children: [""] },
        keyTakeaways: taskData.keyTakeaways || [""],
        media: taskData.media
          ? {
              ...taskData.media,
              file: null, // Don't include file from existing data
              thumbnailFile: null, // Don't include thumbnailFile from existing data
              mediaUrl:
                taskData.media.audio?.url || taskData.media.video?.url || "", // Set mediaUrl from audio/video
            }
          : {
              title: "",
              body: "",
              file: null,
              thumbnailFile: null,
              posterUrl: "",
              mediaUrl: "",
              type: "",
            },
      });
    } else {
      // Reset form for new task
      setFormData({
        id: "",
        title: "",
        description: "",
        challengeId: "",
        order: 0,
        xp: 0,
        activity: { text: "", children: [""] },
        keyTakeaways: [""],
        media: {
          title: "",
          body: "",
          file: null,
          thumbnailFile: null,
          posterUrl: "",
          mediaUrl: "",
          type: "",
        },
      });
      setPreviewUrl("");
      setMediaPreviewUrl("");
    }
    setErrors({});
  }, [taskData]);

  useEffect(() => {
    dispatch(getAllChallenges());
  }, [dispatch]);

  return (
    <div>
      <form>
        {/* Title Field */}
        <InputField
          placeholder={"e.g. Complete Daily Review"}
          label={"Task Title"}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        {/* Description Field */}
        <InputField
          className="mt-4"
          label={"Description"}
          placeholder={"Describe this task"}
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          type="textarea"
          rows="3"
          required
        />

        {/* Challenge Dropdown */}
        <div className="mt-4">
          <DropDown
            id="challengeId"
            label="Challenge"
            required
            optionsObject={challenges.items || []}
            selected={formData.challengeId}
            onChange={(e) => handleChange("challengeId", e.target.value)}
            placeholder="Select a challenge"
            error={errors.challengeId}
          />
        </div>

        {/* Order and XP Fields */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <InputField
            type="number"
            label={"Order"}
            placeholder={"Display order"}
            value={formData.order}
            onChange={(e) => handleChange("order", e.target.value)}
            error={errors.order}
            min="0"
            required
          />
          <InputField
            type="number"
            label={"XP Points"}
            placeholder={"Experience points"}
            value={formData.xp}
            onChange={(e) => handleChange("xp", e.target.value)}
            error={errors.xp}
            min="0"
            required
          />
        </div>

        {/* Media Section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">Media</h3>
          <div className="p-4 border border-gray-200 rounded-md">
            <InputField
              label={"Title"}
              placeholder={"Enter media title"}
              value={formData.media?.title || ""}
              onChange={(e) =>
                handleNestedChange("media", "title", e.target.value)
              }
            />
            <InputField
              className="mt-4"
              label={"Description"}
              placeholder={"Enter media description"}
              value={formData.media?.body || ""}
              onChange={(e) =>
                handleNestedChange("media", "body", e.target.value)
              }
              type="textarea"
              rows="3"
            />

            {/* Thumbnail Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail Image
              </label>

              {/* Thumbnail Preview */}
              {(previewUrl || formData.media?.posterUrl) && (
                <div className="mb-3">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl || formData.media.posterUrl}
                      alt="Thumbnail"
                      className="h-32 w-auto rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl("");
                        setFormData((prev) => ({
                          ...prev,
                          media: {
                            ...prev.media,
                            thumbnailFile: null,
                            posterUrl: "",
                          },
                        }));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnailInput"
              />
              <label
                htmlFor="thumbnailInput"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                {previewUrl || formData.media?.posterUrl
                  ? "Change Thumbnail"
                  : "Choose Thumbnail"}
              </label>
              {formData.media?.thumbnailFile && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.media.thumbnailFile.name}
                </p>
              )}
            </div>

            {/* Media File Upload */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Media File (Audio/Video)
              </label>

              {/* Audio Player */}
              {formData.media?.type === "AUDIO" &&
                (mediaPreviewUrl || formData.media?.mediaUrl) && (
                  <div className="mb-3">
                    <audio
                      controls
                      className="w-full"
                      key={mediaPreviewUrl || formData.media.mediaUrl}
                    >
                      <source
                        src={mediaPreviewUrl || formData.media.mediaUrl}
                      />
                      Your browser does not support the audio element.
                    </audio>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPreviewUrl("");
                        // Check if there's a thumbnail, if not set media to null
                        if (
                          !formData.media?.posterUrl &&
                          !formData.media?.thumbnailFile
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            media: null,
                          }));
                        } else {
                          // Keep thumbnail, just remove audio
                          setFormData((prev) => ({
                            ...prev,
                            media: {
                              ...prev.media,
                              file: null,
                              mediaUrl: "",
                              type: "",
                            },
                          }));
                        }
                      }}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Audio
                    </button>
                  </div>
                )}

              {/* Video Player */}
              {formData.media?.type === "VIDEO" &&
                (mediaPreviewUrl || formData.media?.mediaUrl) && (
                  <div className="mb-3">
                    <div className="relative inline-block">
                      <video
                        src={mediaPreviewUrl || formData.media.mediaUrl}
                        controls
                        className="h-48 w-auto rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaPreviewUrl("");
                          // Check if there's a thumbnail, if not set media to null
                          if (
                            !formData.media?.posterUrl &&
                            !formData.media?.thumbnailFile
                          ) {
                            setFormData((prev) => ({
                              ...prev,
                              media: null,
                            }));
                          } else {
                            // Keep thumbnail, just remove video
                            setFormData((prev) => ({
                              ...prev,
                              media: {
                                ...prev.media,
                                file: null,
                                mediaUrl: "",
                                type: "",
                              },
                            }));
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

              <input
                type="file"
                accept="audio/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="mediaFileInput"
              />
              <label
                htmlFor="mediaFileInput"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
              >
                {formData.media?.file || formData.media?.mediaUrl
                  ? "Change Media File"
                  : "Choose Media File"}
              </label>
              {formData.media?.file && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.media.file.name}
                </p>
              )}
            </div>

            {/* Remove Media Button */}
            {(previewUrl ||
              mediaPreviewUrl ||
              formData.media?.file ||
              formData.media?.thumbnailFile ||
              formData.media?.posterUrl ||
              formData.media?.mediaUrl) && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove All Media
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Activity Details
          </h3>
          <div className="p-4 border border-gray-200 rounded-md">
            <InputField
              label={"Activity Description"}
              placeholder={"Describe the task activity"}
              value={formData.activity.text}
              type="textarea"
              rows="3"
              onChange={(e) =>
                handleNestedChange("activity", "text", e.target.value)
              }
              error={errors.activityText}
              required
            />

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Steps
              </label>
              {formData.activity.children.map((step, index) => (
                <div key={index} className="flex items-center mb-2">
                  <InputField
                    placeholder={`Step ${index + 1}`}
                    value={step}
                    onChange={(e) =>
                      handleNestedChange(
                        "activity",
                        "children",
                        e.target.value,
                        index
                      )
                    }
                    className="flex-1"
                  />
                  {formData.activity.children.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() =>
                        removeChildItem("activity", "children", index)
                      }
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => addChildItem("activity", "children")}
              >
                + Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Key Takeaways Section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-1">
            Key Takeaways
          </h3>
          <div className="p-4 border border-gray-200 rounded-md">
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Takeaways
              </label>
              {formData.keyTakeaways.map((takeaway, index) => (
                <div key={index} className="flex items-center mb-2">
                  <InputField
                    placeholder={`Key takeaway ${index + 1}`}
                    value={takeaway}
                    onChange={(e) =>
                      handleArrayChange("keyTakeaways", e.target.value, index)
                    }
                    className="flex-1"
                  />
                  {formData.keyTakeaways.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => removeArrayItem("keyTakeaways", index)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="mt-1 text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                onClick={() => addArrayItem("keyTakeaways")}
              >
                + Add Key Takeaway
              </button>
            </div>
          </div>
        </div>

        {/* Buttons */}
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
            variant="primary"
            size="medium"
            onClick={handleUpsert}
          >
            {formData.id ? "Update Task" : "Save Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskUpsertForm;
