export const ImageGeneratorSettings = {
    ratioOptions: [
      { value: '16:9', label: '16:9' },
      { value: '9:16', label: '9:16' },
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' }
    ],
  
    languageOptions: [
      { value: '10', label: '10' },
      { value: '20', label: '20' },
      { value: '30', label: '30' },
      { value: '40', label: '40' }
    ],
  
    typeOptions: [
      { value: 'Type', label: 'Type' },
      { value: 'Photography', label: 'Photography' },
      { value: 'Illustration', label: 'Illustration' },
      { value: 'Digital Art', label: 'Digital Art' },
      { value: '3D Render', label: '3D Render' }
    ],
  
    styleOptions: [
      { value: 'Style', label: 'Style' },
      { value: 'Modern', label: 'Modern' },
      { value: 'Vintage', label: 'Vintage' },
      { value: 'Minimalist', label: 'Minimalist' },
      { value: 'Abstract', label: 'Abstract' },
      { value: 'Realistic', label: 'Realistic' }
    ],
  };

export const historyItems = [
    {
        id: 1,
        prompt: 'A futuristic city with flying cars and neon lights',
        date: 'Today, 2:30 PM',
        timestamp: Date.now() - 3600000
    },
    {
        id: 2,
        prompt: 'Mountain landscape with sunset and lake reflection',
        date: 'Today, 11:45 AM',
        timestamp: Date.now() - 10800000
    },
    {
        id: 3,
        prompt: 'Cyberpunk character with glowing tech implants',
        date: 'Yesterday, 8:15 PM',
        timestamp: Date.now() - 86400000
    },
    {
        id: 4,
        prompt: 'Abstract digital art with geometric shapes',
        date: 'Yesterday, 3:20 PM',
        timestamp: Date.now() - 104400000
    },
    {
        id: 5,
        prompt: 'Serene forest path with morning mist',
        date: '2 days ago, 4:45 PM',
        timestamp: Date.now() - 172800000
    }
]