// Audio generation history data
export const audioGenerationHistory = [
  {
    id: 'audio1',
    title: 'Marketing Campaign Script',
    dateCreated: '2023-06-10T12:30:00Z',
    duration: '01:45',
    voiceType: 'Female, Professional',
    scriptPreview: 'Introducing our new product line designed to revolutionize...'
  },
  {
    id: 'audio2',
    title: 'Product Tutorial',
    dateCreated: '2023-06-08T14:15:00Z',
    duration: '03:22',
    voiceType: 'Male, Casual',
    scriptPreview: "In this tutorial, I'll show you how to use our new software to..."
  },
  {
    id: 'audio3',
    title: 'Company Introduction',
    dateCreated: '2023-06-05T09:45:00Z',
    duration: '02:10',
    voiceType: 'Female, Enthusiastic',
    scriptPreview: "Welcome to our company! We're dedicated to providing the best..."
  }
];

// Voice options for audio generation
export const voiceOptions = [
  { id: 'male-pro', name: 'Male, Professional', language: 'English' },
  { id: 'female-pro', name: 'Female, Professional', language: 'English' },
  { id: 'male-casual', name: 'Male, Casual', language: 'English' },
  { id: 'female-casual', name: 'Female, Casual', language: 'English' },
  { id: 'male-enthusiastic', name: 'Male, Enthusiastic', language: 'English' },
  { id: 'female-enthusiastic', name: 'Female, Enthusiastic', language: 'English' },
  { id: 'male-serious', name: 'Male, Serious', language: 'English' },
  { id: 'female-serious', name: 'Female, Serious', language: 'English' }
];

// Audio settings options
export const audioSettings = {
  speeds: [
    { id: 'slow', name: 'Slow', value: 0.8 },
    { id: 'normal', name: 'Normal', value: 1.0 },
    { id: 'fast', name: 'Fast', value: 1.2 }
  ],
  formats: [
    { id: 'mp3', name: 'MP3' },
    { id: 'wav', name: 'WAV' },
    { id: 'ogg', name: 'OGG' }
  ],
  qualities: [
    { id: 'standard', name: 'Standard' },
    { id: 'high', name: 'High' },
    { id: 'premium', name: 'Premium' }
  ]
}; 