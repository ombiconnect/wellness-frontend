import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { upsertFocusArea } from "../../../Thunks/FocusArea";
import { getAllPrograms } from "../../../Thunks/Program";
import DropDown from "../../../Components/DropDown";
import { HexColorPicker } from "react-colorful";

const FocusAreaUpsertForm = ({
  focusAreaData,
  handleCancelClick,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    label: "",
    color: "#3b82f6",
    icon: "",
    programId: "",
  });

  const fontAwesomeIcons = [
    "bullseye",
    "dumbbell",
    "heart",
    "star",
    "trophy",
    "fire",
    "bolt",
    "leaf",
    "mountain",
    "bicycle",
    "running",
    "swimming-pool",
    "volleyball-ball",
    "basketball-ball",
    "football-ball",
    "table-tennis",
    "golf-ball",
    "hockey-puck",
    "skiing",
    "snowboarding",
    "hiking",
    "weight-hanging",
    "apple-alt",
    "carrot",
    "pizza-slice",
    "coffee",
    "graduation-cap",
    "book",
    "laptop",
    "mobile-alt",
    "camera",
    "music",
    "guitar",
    "palette",
    "briefcase",
    "home",
    "car",
    "plane",
  ];

  const [errors, setErrors] = useState({});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  const programs = useSelector((state) => state.program);
  const focusAreas = useSelector((state) => state.focusArea);

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.label.trim()) newErrors.label = "Label is required";
    if (!formData.color.trim()) newErrors.color = "Color is required";
    if (!formData.icon.trim()) newErrors.icon = "Icon is required";
    if (!formData.programId)
      newErrors.programId = "Program selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(upsertFocusArea(formData)).then((action) => {
      if (upsertFocusArea.fulfilled.match(action)) {
        if (onSuccess) onSuccess();
      }
    });
  };

  useEffect(() => {
    if (focusAreas.error?.alreadyExist) {
      setErrors((prev) => ({
        ...prev,
        name: focusAreas?.error?.alreadyExist,
      }));
    }
  }, [focusAreas.error]);

  useEffect(() => {
    setFormData({
      id: focusAreaData?.id || "",
      name: focusAreaData?.name || "",
      label: focusAreaData?.label || "",
      color: focusAreaData?.color || "#3b82f6",
      icon: focusAreaData?.icon?.replace(/^fa-/, "") || "bullseye", // strip fa-
      programId: focusAreaData?.programId || "",
    });
    setErrors({});
  }, [focusAreaData]);

  useEffect(() => {
    dispatch(getAllPrograms());
  }, [dispatch]);

  return (
    <div>
      <form>
        <InputField
          label="Name"
          placeholder="e.g. Fitness"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          required
        />

        <InputField
          className="mt-4"
          label="Label"
          placeholder="Display label for the focus area"
          value={formData.label}
          onChange={(e) => handleChange("label", e.target.value)}
          error={errors.label}
          required
        />

        {/* Color Picker Field */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Color <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 mr-3"
              style={{ backgroundColor: formData.color }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <InputField
              placeholder="e.g. #FF5733"
              value={formData.color}
              onChange={(e) => handleChange("color", e.target.value)}
              error={errors.color}
              required
              className="flex-1"
            />
          </div>
          {showColorPicker && (
            <div className="mt-2">
              <HexColorPicker
                color={formData.color}
                onChange={(color) => handleChange("color", color)}
              />
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={() => setShowColorPicker(false)}
                >
                  Close Picker
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Icon Picker Field */}
        <div className="mt-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Icon <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-md cursor-pointer border border-gray-300 mr-3 flex items-center justify-center bg-gray-50"
              onClick={() => setShowIconPicker(!showIconPicker)}
            >
              <i
                className={`fas fa-${formData.icon} text-lg`}
                style={{ color: formData.color }}
              ></i>
            </div>
            <InputField
              placeholder="e.g. fa-dumbbell"
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              error={errors.icon}
              required
              className="flex-1"
            />
          </div>
          {showIconPicker && (
            <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-white">
              <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                {fontAwesomeIcons.map((icon) => (
                  <div
                    key={icon}
                    className={`w-10 h-10 rounded-md cursor-pointer border border-gray-300 flex items-center justify-center hover:bg-gray-100 ${
                      formData.icon === icon
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50"
                    }`}
                    onClick={() => handleChange("icon", icon)}
                  >
                    <i
                      className={`fas fa-${icon}`}
                      style={{ color: formData.color }}
                    ></i>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-center">
                <button
                  type="button"
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  onClick={() => setShowIconPicker(false)}
                >
                  Close Picker
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown for Programs */}
        <div className="mt-4">
          <DropDown
            id="program"
            label="Program"
            required
            optionsObject={
              programs.items.filter((p) => p.status == "ACTIVE") || []
            }
            selected={formData.programId}
            onChange={(e) => handleChange("programId", e.target.value)}
            placeholder="Select a program"
            error={errors.programId}
          />
        </div>

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
            Save Focus Area
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FocusAreaUpsertForm;
