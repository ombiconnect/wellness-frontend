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
      file: null,
      posterUrl: "",
      type: "",
    },
  });

  const [previewUrl, setPreviewUrl] = useState("");
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

  // Handle file upload with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";

      // Create preview URL for images
      if (file.type.startsWith("image")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(""); // Clear preview for videos
      }

      setFormData((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          file: file,
          type: type,
          // Clear existing posterUrl when new file is selected
          posterUrl: "",
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
        posterUrl: "",
        type: "",
      },
    }));
    setPreviewUrl("");

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
            }
          : {
              title: "",
              body: "",
              file: null,
              posterUrl: "",
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
          posterUrl: "",
          type: "",
        },
      });
      setPreviewUrl("");
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
            {/* Preview Image */}
            {(previewUrl || formData.media?.posterUrl) && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div className="relative inline-block">
                  <img
                    src={previewUrl || formData.media.posterUrl}
                    alt="Preview"
                    className="h-32 w-auto rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveMedia}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <InputField
              label={"Title"}
              placeholder={"Enter Title"}
              value={formData.media?.title || ""}
              onChange={(e) =>
                handleNestedChange("media", "title", e.target.value)
              }
            />
            <InputField
              className="mt-4"
              label={"Description"}
              placeholder={"Enter Description"}
              value={formData.media?.body || ""}
              onChange={(e) =>
                handleNestedChange("media", "body", e.target.value)
              }
              type="textarea"
              rows="3"
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media File
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="border p-2 rounded w-full"
              />
              {formData.media?.file && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected file: {formData.media.file.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Supported types: Images and Videos
              </p>
            </div>
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
