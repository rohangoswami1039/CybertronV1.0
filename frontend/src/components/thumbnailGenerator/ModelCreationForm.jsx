import React, { useState } from 'react';
import styled from 'styled-components';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { TbTrashXFilled } from 'react-icons/tb';
import Input from '../common/Input';

const FormContainer = styled.div`
  background-color: white;
  padding: 32px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 20px;
  padding: 0;
  margin: 1rem;
  margin-left: 0;
  &:hover {
    color: #000;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  margin: 0;
  color: #111827;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  font-size: 16px;
  color: #111827;
  margin-bottom: 8px;
`;

const ImageUploadContainer = styled.div`
  margin-bottom: 32px;
`;

const ImageUploadHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ImageCounter = styled.span`
  font-size: 14px;
  color: ${props => props.isMax ? '#e53e3e' : '#666'};
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(175px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const ImageItem = styled.div`
  position: relative;
  height: 175px;
  max-width: 175px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #000;
  color: #fff;

  &:hover {
    transform: scale(1.1);
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  height: 175px;
  max-width: 175px;
  border: 4px dashed #ccc;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e0e0e0;
  }
  
  input {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background-color: #000;
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: #333;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: white;
  color: #000;
  border: 1px solid #000;
  
  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  font-size: 14px;
  margin-top: 8px;
`;

const MAX_IMAGES = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const ModelCreationForm = ({ onBack, onSubmit }) => {
  const [modelName, setModelName] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  const handleNameChange = (e) => {
    setModelName(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }
    
    const invalidFiles = files.filter(file => !ALLOWED_TYPES.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Only JPEG, JPG and PNG files are allowed.');
      return;
    }
    
    setError('');
    
    const newImages = files.map(file => ({
      id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDeleteImage = (id) => {
    setImages(prev => {
      const updatedImages = prev.filter(img => img.id !== id);
      if (updatedImages.length < MAX_IMAGES) {
        setError('');
      }
      return updatedImages;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!modelName.trim()) {
      setError('Please enter a model name.');
      return;
    }
    
    if (images.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    
    onSubmit({ modelName, images });
  };

  return (
    <FormContainer>
      <HeaderContainer>
        <BackButton onClick={onBack}>
          <FaArrowLeft />
        </BackButton>
        <FormTitle>Create your own avatar</FormTitle>
      </HeaderContainer>
      
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            label="Model Name"
            id="modelName"
            name="modelName"
            placeholder="Enter a name for your model..."
            value={modelName}
            onChange={handleNameChange}
            checks={false}
          />
        </InputGroup>
        
        <ImageUploadContainer>
          <ImageUploadHeader>
            <Label>Upload Face Images</Label>
            <ImageCounter isMax={images.length >= MAX_IMAGES}>
              {images.length}/{MAX_IMAGES} images
            </ImageCounter>
          </ImageUploadHeader>
          {error && <ErrorMessage>{error}</ErrorMessage>}          
          <ImageGrid>
              <UploadButton>
                <FaPlus size={28} />
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  multiple 
                  onChange={handleImageUpload}
                  disabled={images.length >= MAX_IMAGES}
                />
              </UploadButton>
              {images.map(image => (
                <ImageItem key={image.id}>
                  <Image src={image.preview} alt="Uploaded face" />
                  <DeleteButton onClick={() => handleDeleteImage(image.id)}>
                    <TbTrashXFilled size={20} />
                  </DeleteButton>
                </ImageItem>
              ))}
          </ImageGrid>
        </ImageUploadContainer>
        
        <ButtonContainer>
          <PrimaryButton 
            type="submit"
            disabled={!modelName.trim() || images.length === 0}
          >
            Generate Model
          </PrimaryButton>
          <SecondaryButton type="button" onClick={onBack}>
            Cancel
          </SecondaryButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default ModelCreationForm; 