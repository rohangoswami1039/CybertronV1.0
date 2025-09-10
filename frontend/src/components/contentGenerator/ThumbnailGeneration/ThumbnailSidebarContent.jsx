import React, { useState, useEffect } from 'react';
import PromptFormArea from '../../thumbnailGenerator/PromptFormArea';
import { useUI } from '../../../context/UIContext';

const ThumbnailSidebarContent = ({ onGenerate, initialData }) => {
  // Form state
  const [prompt, setPrompt] = useState(initialData?.prompt || '');
  const [selectedRatio, setSelectedRatio] = useState(initialData?.selectedRatio || '16:9');
  const [referenceLinks, setReferenceLinks] = useState(initialData?.referenceLinks || '');
  const [language, setLanguage] = useState(initialData?.language || '10');
  const [type, setType] = useState(initialData?.type || 'Type');
  const [style, setStyle] = useState(initialData?.style || 'Style');
  const [isGenerating, setIsGenerating] = useState(false);

  // SubSidebar Updates
  const { isMobileView, isSubSidebarOpen, toggleSubSidebar } = useUI();

  // Update form state when initialData changes
  useEffect(() => {
    if (initialData) {
      setPrompt(initialData.prompt || '');
      setSelectedRatio(initialData.selectedRatio || '16:9');
      setReferenceLinks(initialData.referenceLinks || '');
      setLanguage(initialData.language || '10');
      setType(initialData.type || 'Type');
      setStyle(initialData.style || 'Style');
    }
  }, [initialData]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    if (isSubSidebarOpen && isMobileView) {
      toggleSubSidebar();
    }

    // Collect form data
    const formData = {
      prompt,
      selectedRatio,
      referenceLinks,
      language,
      type,
      style
    };

    // Call the parent's onGenerate with all form data
    if (onGenerate) {
      onGenerate(formData);
    }

    // Reset generating state after a delay
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <PromptFormArea
      prompt={prompt}
      setPrompt={setPrompt}
      selectedRatio={selectedRatio}
      setSelectedRatio={setSelectedRatio}
      referenceLinks={referenceLinks}
      setReferenceLinks={setReferenceLinks}
      language={language}
      setLanguage={setLanguage}
      type={type}
      setType={setType}
      style={style}
      setStyle={setStyle}
      handleGenerate={handleGenerate}
      isGenerating={isGenerating}
    />
  );
};

export default ThumbnailSidebarContent; 