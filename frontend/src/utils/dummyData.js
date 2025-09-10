import { GrDocumentImage } from "react-icons/gr";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineLanguage,
} from "react-icons/hi2";
import { IoLogoYoutube } from "react-icons/io";
import { LuFileText, LuImage } from "react-icons/lu";
import {
  MdBrush,
  MdLandscape,
  MdMusicNote,
  MdSubscriptions,
  MdVideoCall,
} from "react-icons/md";
import { PiFileAudioFill, PiFileVideoBold } from "react-icons/pi";
import { TbTransform } from "react-icons/tb";

// Main tool categories for the initial view
export const mainTools = [
  {
    id: "text-generator",
    name: "Start Chat",
    description: "Begin an AI-powered conversation for any topic.",
    icon: HiOutlineChatBubbleLeftRight,
    category: "Start Chat",
    route: "/chat",
  },
  {
    id: "content-generator",
    icon: MdBrush,
    name: "Content Creation",
    color: "#e8f5e8",
    route: "/tools/content-generator",
  },
  {
    id: "script-writing",
    icon: LuFileText,
    name: "Script Writing",
    color: "#f0e8f5",
    route: "/tools/script-writing",
  },
  {
    id: "text-to-image",
    icon: LuImage,
    name: "Text to Image",
    color: "#fff8e8",
    route: "/tools/text-to-image",
  },
  {
    id: "text-to-audio",
    icon: PiFileAudioFill,
    name: "Text to Audio",
    color: "#e8e8f5",
    route: "/tools/text-to-audio",
  },
  {
    id: "text-to-video",
    icon: PiFileVideoBold,
    name: "Text to Video",
    color: "#f5e8e8",
    route: "/tools/text-to-video",
  },
  {
    id: "video-to-text",
    icon: LuFileText,
    name: "Video to text",
    color: "#e8f5f0",
    route: "/tools/video-to-text",
  },
  {
    id: "image-to-text",
    icon: GrDocumentImage,
    name: "Image to text",
    color: "#e8f0f5",
    route: "/tools/image-to-text",
  },
];

// AI Tools Data
export const aiTools = [
  {
    id: "text-generator",
    name: "Start Chat",
    description: "Begin an AI-powered conversation for any topic.",
    icon: HiOutlineChatBubbleLeftRight,
    category: "Start Chat",
    route: "/chat",
  },
  {
    id: "text-to-image",
    name: "Image Generation",
    description:
      "Generate stunning images from text prompts using advanced AI models.",
    icon: MdLandscape,
    category: "Image Generation",
    platforms: [],
    popular: true,
    route: "/tools/text-to-image",
  },
  {
    id: "video-generator",
    name: "Video Generation",
    description: "Create professional videos from text or images using AI.",
    icon: MdSubscriptions,
    category: "Video Generation",
    platforms: [],
    popular: true,
    route: "/tools/video-generator",
  },
  {
    id: "audio-generator",
    name: "Audio Generation",
    description: "Generate music, voice-overs, and sound effects with AI.",
    icon: MdMusicNote,
    category: "Audio Generation",
    platforms: [],
    popular: true,
    route: "/tools/audio-generator",
  },
  {
    id: "content-generator",
    name: "Content Creation",
    description:
      "Generate engaging content for social media, blogs, and marketing.",
    icon: MdBrush,
    category: "Content Creation",
    platforms: ["Instagram", "Facebook", "Twitter", "LinkedIn"],
    popular: true,
    route: "/tools/content-generator",
  },
  {
    id: "script-writing",
    name: "Script Writing",
    description: "Create and format professional scripts for videos, podcasts, and presentations.",
    icon: MdBrush,
    category: "Script Writing",
    platforms: [],
    popular: false,
    route: "/tools/script-writing",
  },
  {
    id: "thumbnail-creation",
    name: "Thumbnail creation",
    description: "Generate eye-catching thumbnails for your video content.",
    icon: IoLogoYoutube,
    category: "Thumbnail creation",
    platforms: [],
    popular: false,
    route: "/tools/thumbnail-creation",
  },
  // {
  //   id: "ai-video-editing",
  //   name: "AI Video Editing",
  //   description: "Edit and enhance videos automatically using AI algorithms.",
  //   icon: MdVideoCall,
  //   category: "AI Video Editing",
  //   platforms: [],
  //   popular: false,
  //   route: "/tools/ai-video-editing",
  // },
];

// AI Works Data
export const aiWorks = [
  {
    id: "text-to-video",
    name: "Text to Video",
    description: "Convert written content into engaging video presentations.",
    icon: PiFileVideoBold,
    category: "Text to Video",
    route: "/works/text-to-video",
  },
  {
    id: "script-writing",
    name: "Script writing",
    description:
      "Generate compelling scripts for videos, podcasts, and presentations.",
    icon: LuFileText,
    category: "Script writing",
    route: "/works/script-writing",
  },
  {
    id: "text-to-image",
    name: "Text to image",
    description: "Create beautiful images from text descriptions.",
    icon: LuImage,
    category: "Text to image",
    route: "/works/text-to-image",
  },
  {
    id: "image-to-text",
    name: "Image to Text",
    description: "Extract detailed text descriptions from images.",
    icon: GrDocumentImage,
    category: "Image to Text",
    route: "/works/image-to-text",
  },
  {
    id: "text-to-audio",
    name: "Text to Audio",
    description: "Convert text into natural-sounding speech and audio.",
    icon: PiFileAudioFill,
    category: "Text to Audio",
    route: "/works/text-to-audio",
  },
  {
    id: "text-paraphrasing",
    name: "Text paraphrasing",
    description: "Rewrite and improve text while maintaining original meaning.",
    icon: TbTransform,
    category: "Text paraphrasing",
    route: "/works/text-paraphrasing",
  },
  {
    id: "text-translation",
    name: "Text Translation",
    description: "Translate text between multiple languages accurately.",
    icon: HiOutlineLanguage,
    category: "Text Translation",
    route: "/works/text-translation",
  },
];

// Onboarding Options
export const onboardingOptions = {
  goals: [
    { id: "content-creation", label: "Content Creation", icon: "📝" },
    { id: "image-generation", label: "Image Generation", icon: "🖼️" },
    { id: "code-development", label: "Code Development", icon: "💻" },
    { id: "audio-creation", label: "Audio Creation", icon: "🔊" },
    { id: "video-creation", label: "Video Creation", icon: "🎬" },
    { id: "chatbot-development", label: "Chatbot Development", icon: "🤖" },
  ],
  roles: [
    { id: "creator", label: "Creator", icon: "🎨" },
    { id: "developer", label: "Developer", icon: "💻" },
    { id: "marketer", label: "Marketer", icon: "📊" },
    { id: "writer", label: "Writer", icon: "✍️" },
    { id: "student", label: "Student", icon: "🎓" },
    { id: "business-owner", label: "Business Owner", icon: "💼" },
  ],
  professions: [
    { id: "technology", label: "Technology", icon: "💻" },
    { id: "marketing", label: "Marketing", icon: "📊" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "healthcare", label: "Healthcare", icon: "🏥" },
    { id: "finance", label: "Finance", icon: "💰" },
    { id: "creative", label: "Creative Arts", icon: "🎨" },
    { id: "retail", label: "Retail", icon: "🛍️" },
    { id: "other", label: "Other", icon: "🔍" },
  ],
  accountTypes: [
    {
      id: "individual",
      title: "Individual",
      icon: "👤",
      description: "For personal use or freelancers working alone.",
    },
    {
      id: "team",
      title: "Team",
      icon: "👥",
      description: "For small teams and businesses with multiple users.",
    },
    {
      id: "enterprise",
      title: "Enterprise",
      icon: "🏢",
      description: "For large organizations with advanced needs.",
    },
  ],
};

// Subscription Plans
export const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals and beginners",
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    features: [
      "Access to basic AI tools",
      "100 generations per month",
      "Standard quality outputs",
      "Email support",
      "No watermarks on outputs",
    ],
    popular: false,
  },
  {
    id: "business",
    name: "Business",
    description: "Ideal for professionals and small teams",
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    features: [
      "Access to all AI tools",
      "Unlimited generations",
      "High quality outputs",
      "Priority support",
      "API access",
      "Team collaboration features",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: {
      monthly: 99.99,
      yearly: 999.99,
    },
    features: [
      "Everything in Business plan",
      "Premium quality outputs",
      "Dedicated account manager",
      "Custom model training",
      "Advanced analytics",
      "SSO and advanced security",
    ],
    popular: false,
  },
];

// Tool Results (Dummy outputs for tools)
export const toolResults = {
  "text-generator": {
    result: `# The Future of Artificial Intelligence

Artificial intelligence has made remarkable strides in recent years, transforming from a concept of science fiction into a tangible reality that influences our daily lives. As we stand at the precipice of a new technological era, it's worth exploring what the future might hold for AI and its impact on society.

## Current State of AI

Today's AI systems excel at specific tasks, from natural language processing to image recognition and complex decision-making processes. Machine learning algorithms power recommendation systems, virtual assistants, and autonomous vehicles, while deep learning networks can generate creative content, translate languages, and even diagnose medical conditions.

## Emerging Trends

Several key trends are shaping the future of AI:

1. **Multimodal AI**: Systems that can process and generate multiple types of data (text, images, audio) simultaneously.

2. **Explainable AI**: Moving beyond "black box" models to AI systems that can explain their decision-making processes.

3. **AI Democratization**: Making AI tools accessible to non-specialists through no-code platforms and user-friendly interfaces.

4. **Edge AI**: Deploying AI capabilities directly on devices rather than in the cloud, enhancing privacy and reducing latency.

## Potential Impact

The widespread adoption of AI technologies will likely reshape:

- **Work**: Automation of routine tasks, creation of new roles, and transformation of existing professions.
- **Healthcare**: Personalized medicine, accelerated drug discovery, and improved diagnostic accuracy.
- **Education**: Customized learning experiences and intelligent tutoring systems.
- **Transportation**: Autonomous vehicles and optimized logistics networks.

## Challenges Ahead

Despite its promise, AI faces significant challenges:

- **Ethical Considerations**: Ensuring AI systems are fair, transparent, and respect human autonomy.
- **Regulatory Frameworks**: Developing appropriate governance structures for AI development and deployment.
- **Environmental Impact**: Addressing the energy consumption of large AI models.
- **Digital Divide**: Preventing inequalities in access to AI benefits.

## Conclusion

The future of AI will be shaped by our collective choices today. By fostering responsible innovation, inclusive development practices, and thoughtful regulation, we can harness AI's potential to address humanity's greatest challenges while mitigating its risks.`,
  },
  "image-generator": {
    result:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  "script-writing": {
    result: `Are you just getting started with Fantasy games? Whether it is fantasy cricket, fantasy football, fantasy kabaddi or fantasy basketball, having an understanding about the points system is the best way to select matches and get started with it.

The total points calculated for each player is based on their real-world performance in the actual game. Different fantasy platforms may have slightly different scoring systems, but they generally follow similar principles.

For fantasy cricket, points are awarded for batting achievements like runs scored, boundaries, centuries, and for bowling feats such as wickets taken, maidens bowled, and economy rate. Additional points come from fielding contributions like catches and run-outs.

In fantasy football, points typically come from goals, assists, clean sheets for defenders and goalkeepers, and saves. Players lose points for yellow/red cards or conceding goals.

Fantasy kabaddi rewards raid points, tackle points, super tackles, and all-out points, while fantasy basketball considers points scored, rebounds, assists, blocks, and steals.

Understanding this points system allows you to strategically select players who are likely to perform well in categories that earn the most points. This knowledge forms the foundation for building winning teams consistently across different fantasy sports platforms.`,
  },
  "code-assistant": {
    result: `import React, { useState } from 'react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Add a new todo item
  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false
      };
      
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  // Toggle todo completion status
  const toggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo item
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div className="todo-list-container">
      <h1>Todo List</h1>
      
      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-button">Add</button>
      </form>
      
      <ul className="todo-items">
        {todos.length === 0 ? (
          <li className="empty-message">No tasks yet. Add one above!</li>
        ) : (
          todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                />
                <span className={todo.completed ? 'completed' : ''}>
                  {todo.text}
                </span>
              </div>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
      
      <div className="todo-stats">
        <p>{todos.filter(todo => !todo.completed).length} tasks remaining</p>
      </div>
    </div>
  );
};

export default TodoList;`,
  },
  "audio-generator": {
    result: "https://example.com/audio.mp3",
  },
};

// Sidebar Navigation Data
export const sidebarNav = [
  { path: "/chat", icon: "AiOutlineHome", label: "Home" },
  { path: "/seo", icon: "FaChartBar", label: "SEO" },
  { path: "/automation", icon: "FaMagic", label: "Automation" },
  { path: "/billing", icon: "FaCreditCard", label: "Billing" },
  { path: "/trending", icon: "MdOutlineTrendingUp", label: "Trending" },
];

export const dummyVideos = [
  {
    id: 1,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "184.8K",
    duration: "15:32",
    percentage: "99%",
    bgGradient: "linear-gradient(135deg, #3b82f6, #1e40af)"
  },
  {
    id: 2,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "184.8K",
    duration: "22:15",
    percentage: "99%",
    bgGradient: "linear-gradient(135deg, #10b981, #047857)"
  },
  {
    id: 3,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "107K",
    duration: "18:45",
    percentage: "95%",
    bgGradient: "linear-gradient(135deg, #ef4444, #dc2626)"
  },
  {
    id: 4,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "1003",
    duration: "12:30",
    percentage: "99%",
    bgGradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
  },
  {
    id: 5,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "434K",
    duration: "20:15",
    percentage: "98%",
    bgGradient: "linear-gradient(135deg, #f59e0b, #d97706)"
  },
  {
    id: 6,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "122K",
    duration: "14:22",
    percentage: "97%",
    bgGradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
  },
  {
    id: 7,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "300K",
    duration: "16:45",
    percentage: "96%",
    bgGradient: "linear-gradient(135deg, #ec4899, #db2777)"
  },
  {
    id: 8,
    title: "How to EDIT Documentary Style Videos | After Effects Tutorial",
    channel: "YesItssElemental",
    views: "333K",
    duration: "19:30",
    percentage: "98%",
    bgGradient: "linear-gradient(135deg, #84cc16, #65a30d)"
  }
];
