import React, { useEffect, useState } from "react";
import InputField from "../../../Components/Form/InputField";
import Button from "../../../Components/Form/Button";
import { useDispatch, useSelector } from "react-redux";
import { upsertChallenge } from "../../../Thunks/Challenge";
import DropDown from "../../../Components/DropDown";
import { getAllFocusAreas } from "../../../Thunks/FocusArea";

const ChallengeUpsertForm = ({
  challengeData,
  handleCancelClick,
  onSuccess,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    subtitle: "",
    about: "",
    benefits: [""],
    available: true,
    averageDuration: "",
    difficultyLevel: "BEGINNER",
    xp: 0,
    imageUrl: "",
    focusAreaId: "",
    durationDays: "",
  });

  const [errors, setErrors] = useState({});
  const focusAreas = useSelector((state) => state.focusArea);

  const difficultyLevels = [
    { id: "BEGINNER", name: "Beginner" },
    { id: "ADVANCED", name: "Advanced" },
    { id: "PRO", name: "PRO" },
  ];

  const handleChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleBenefitsChange = (value, index) => {
    setFormData((prev) => {
      const updatedBenefits = [...prev.benefits];
      updatedBenefits[index] = value;
      return { ...prev, benefits: updatedBenefits };
    });
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index) => {
    if (formData.benefits.length > 1) {
      setFormData((prev) => {
        const updatedBenefits = [...prev.benefits];
        updatedBenefits.splice(index, 1);
        return { ...prev, benefits: updatedBenefits };
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Challenge title is required";
    }
    if (!formData.about.trim()) {
      newErrors.about = "About is required";
    }
    if (!formData.focusAreaId) {
      newErrors.focusAreaId = "Focus area is required";
    }

    if (formData.xp <= 0) {
      newErrors.xp = "XP must be greater than 0";
    }

    if (!formData.averageDuration && formData.averageDuration <= 0) {
      newErrors.averageDuration = "Duration be greater than 0";
    }

    if (!formData.durationDays && formData.durationDays <= 0) {
      newErrors.durationDays = "Duration days be greater than 0";
    }
    if (!formData.difficultyLevel.trim()) {
      newErrors.difficultyLevel = "Difficulty Level is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpsert = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filter out empty benefits and convert number fields
    const payload = {
      ...formData,
      benefits: formData.benefits.filter((benefit) => benefit.trim() !== ""),
      xp: parseInt(formData.xp) || 0,
      averageDuration: formData.averageDuration
        ? parseInt(formData.averageDuration)
        : null,
      durationDays: formData.durationDays
        ? parseInt(formData.durationDays)
        : null,
    };

    dispatch(upsertChallenge(payload)).then((action) => {
      if (upsertChallenge.fulfilled.match(action)) {
        if (onSuccess) onSuccess();
      }
    });
  };

  useEffect(() => {
    if (challengeData) {
      setFormData({
        id: challengeData.id || "",
        title: challengeData.title || "",
        subtitle: challengeData.subtitle || "",
        about: challengeData.about || "",
        benefits:
          challengeData.benefits && challengeData.benefits.length > 0
            ? challengeData.benefits
            : [""],
        available:
          challengeData.available !== undefined
            ? challengeData.available
            : true,
        averageDuration: challengeData.averageDuration || "",
        difficultyLevel: challengeData.difficultyLevel || "BEGINNER",
        xp: challengeData.xp || 0,
        imageUrl: challengeData.imageUrl || "",
        focusAreaId: challengeData.focusAreaId || "",
        durationDays: challengeData.durationDays || "",
      });
    }
    setErrors({});
  }, [challengeData]);

  useEffect(() => {
    dispatch(getAllFocusAreas());
  }, [dispatch]);

  return (
    <div>
      <form>
        <InputField
          placeholder={"e.g. 30-Day Fitness Challenge"}
          label={"Challenge Title"}
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        <InputField
          className="mt-4"
          placeholder={"Brief subtitle for the challenge"}
          label={"Subtitle"}
          value={formData.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
        />

        <InputField
          className="mt-4"
          label={"About Challenge"}
          placeholder={"Describe the challenge in detail"}
          value={formData.about}
          type="textarea"
          rows="3"
          error={errors.about}
          onChange={(e) => handleChange("about", e.target.value)}
          required
        />

        {/* Benefits Section */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 ">Benefits</h3>

          <div className="p-4 border border-gray-200 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Challenge Benefits
            </label>
            {formData.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center mb-2">
                <InputField
                  placeholder={`Benefit ${index + 1}`}
                  value={benefit}
                  onChange={(e) => handleBenefitsChange(e.target.value, index)}
                  className="flex-1"
                />
                {formData.benefits.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => removeBenefit(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
              onClick={addBenefit}
            >
              <i className="fas fa-plus mr-1"></i> Add Benefit
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField
            type="number"
            label={"XP Reward"}
            placeholder={"e.g. 100"}
            value={formData.xp}
            onChange={(e) => handleChange("xp", e.target.value)}
            error={errors.xp}
            required
            min="0"
          />

          <InputField
            type="number"
            label={"Avg. Duration (minutes)"}
            placeholder={"e.g. 30"}
            value={formData.averageDuration}
            onChange={(e) => handleChange("averageDuration", e.target.value)}
            error={errors.averageDuration}
            required
            min="0"
          />

          <InputField
            type="number"
            label={"Duration (days)"}
            placeholder={"e.g. 30"}
            value={formData.durationDays}
            onChange={(e) => handleChange("durationDays", e.target.value)}
            error={errors.durationDays}
            required
            min="0"
          />
        </div>

        {/* Difficulty Level */}
        <div className="mt-4">
          <DropDown
            id="difficultyLevel"
            label="Difficulty Level"
            required
            optionsObject={difficultyLevels}
            selected={formData.difficultyLevel}
            onChange={(e) => handleChange("difficultyLevel", e.target.value)}
            placeholder="Select difficulty level"
            error={errors.difficultyLevel}
          />
        </div>

        {/* Image URL */}
        <InputField
          className="mt-4"
          label={"Image URL"}
          placeholder={"https://example.com/image.jpg"}
          value={formData.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
        />

        {/* Availability Toggle */}
        <div className="mt-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700 mr-3">
            Available to Participants
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => handleChange("available", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Focus Area Dropdown */}
        <div className="mt-4">
          <DropDown
            id="focusArea"
            label="Focus Area"
            required
            optionsObject={focusAreas.items || []}
            selected={formData.focusAreaId}
            onChange={(e) => handleChange("focusAreaId", e.target.value)}
            placeholder="Select a focus area"
            error={errors.focusAreaId}
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
            {"Save Challenge"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChallengeUpsertForm;
