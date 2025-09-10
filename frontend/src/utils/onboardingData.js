// onboardingData.js - Complete dummy data for your onboarding flow

export const onboardingQuestions = [
  {
    name: 'whatDoYouDo',
    label: 'What do you do for work?',
    type: 'input',
    placeholder: 'e.g., Software Developer, Marketing Manager, Student'
  },
  {
    name: 'describe',
    label: 'Describe your role in more detail',
    type: 'input',
    placeholder: 'Brief description of your responsibilities and expertise'
  },
  {
    name: 'purpose',
    label: 'What do you plan to use Cybertron.ai for?',
    type: 'select',
    placeholder: 'Select your primary use case',
    options: [
      '',
      'Content Creation',
      'Code Development',
      'Research & Analysis',
      'Customer Support',
      'Marketing & Sales',
      'Education & Learning',
      'Personal Assistant',
      'Business Operations',
      'Creative Writing',
      'Data Analysis'
    ]
  },
  {
    name: 'whoYouAre',
    label: 'Which best describes you?',
    type: 'select',
    placeholder: 'Select your category',
    options: [
      '',
      'Individual Professional',
      'Freelancer',
      'Small Business Owner',
      'Enterprise Employee',
      'Student',
      'Researcher',
      'Content Creator',
      'Developer',
      'Entrepreneur',
      'Other'
    ]
  }
];

export const accountTypes = [
  {
    id: 'INDIVIDUAL',
    title: 'Individual',
    features: [
      'Personal workspace',
      'Basic AI assistance',
      'Standard support',
      'Personal project management',
      'Individual usage analytics'
    ]
  },
  {
    id: 'AGENCY',
    title: 'Agency',
    features: [
      'Team collaboration tools',
      'Client project management',
      'Advanced AI models',
      'Priority support',
      'Team analytics & reporting',
      'Custom branding options'
    ]
  },
  {
    id: 'COMPANY',
    title: 'Company',
    features: [
      'Enterprise-grade security',
      'Advanced team management',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced analytics',
      'SLA guarantees',
      'Custom AI training'
    ]
  },
  // {
  //   id: 'OTHER',
  //   title: 'Other',
  //   features: [
  //     'Flexible configuration',
  //     'Custom use case support',
  //     'Consultation included',
  //     'Tailored features',
  //     'Specialized support'
  //   ]
  // }
];

export const planTabs = [
  { id: 'INDIVIDUAL', label: 'Individual' },
  { id: 'AGENCY', label: 'Agency' },
  { id: 'COMPANY', label: 'Company' },
  // { id: 'OTHER', label: 'Other' }
];

export const plansData = {
  INDIVIDUAL: [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: [
        '1,000 tokens per month',
        'Basic AI models',
        'Community support',
        'Personal workspace',
        'Basic templates'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      features: [
        '10,000 tokens per month',
        'Standard AI models',
        'Email support',
        'Personal workspace',
        'Premium templates',
        'Export options'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 29.99,
      features: [
        '50,000 tokens per month',
        'Advanced AI models',
        'Priority support',
        'Advanced workspace',
        'Custom templates',
        'API access',
        'Analytics dashboard'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      features: [
        'Unlimited tokens',
        'All AI models',
        'Dedicated support',
        'Custom integration',
        'Advanced security',
        'SLA guarantee',
        'Custom training'
      ]
    }
  ],
  AGENCY: [
    {
      id: 'agency_starter',
      name: 'Agency Starter',
      price: 49.99,
      features: [
        '100,000 tokens per month',
        'Team collaboration (5 users)',
        'Client management',
        'Priority support',
        'Brand customization',
        'Project templates'
      ]
    },
    {
      id: 'agency_pro',
      name: 'Agency Pro',
      price: 99.99,
      features: [
        '250,000 tokens per month',
        'Team collaboration (15 users)',
        'Advanced client management',
        'White-label options',
        'Custom integrations',
        'Advanced analytics',
        'Priority support'
      ]
    },
    {
      id: 'agency_scale',
      name: 'Agency Scale',
      price: 199.99,
      features: [
        '500,000 tokens per month',
        'Unlimited team members',
        'Advanced white-labeling',
        'Custom AI training',
        'Dedicated account manager',
        'SLA guarantee',
        'Custom integrations'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: null,
      features: [
        'Custom token allocation',
        'Full platform customization',
        'Dedicated infrastructure',
        'Custom AI models',
        '24/7 dedicated support',
        'Custom SLA',
        'On-premise deployment'
      ]
    }
  ],
  COMPANY: [
    {
      id: 'company_starter',
      name: 'Company Starter',
      price: 199.99,
      features: [
        '500,000 tokens per month',
        'Team management (50 users)',
        'Enterprise security',
        'Advanced analytics',
        'API access',
        'Priority support'
      ]
    },
    {
      id: 'company_pro',
      name: 'Company Pro',
      price: 399.99,
      features: [
        '1,000,000 tokens per month',
        'Team management (150 users)',
        'Advanced security features',
        'Custom integrations',
        'Dedicated support',
        'Custom AI training',
        'SLA guarantee'
      ]
    },
    {
      id: 'company_enterprise',
      name: 'Company Enterprise',
      price: 799.99,
      features: [
        '2,500,000 tokens per month',
        'Unlimited users',
        'Enterprise-grade security',
        'Custom deployment',
        'Dedicated account manager',
        'Custom AI models',
        '99.9% SLA guarantee'
      ]
    },
    {
      id: 'enterprise',
      name: 'Custom Enterprise',
      price: null,
      features: [
        'Unlimited tokens',
        'Custom user management',
        'On-premise deployment',
        'Custom AI development',
        '24/7 dedicated support',
        'Custom SLA',
        'Compliance certifications'
      ]
    }
  ],
  // OTHER: [
  //   {
  //     id: 'flexible_basic',
  //     name: 'Flexible Basic',
  //     price: 39.99,
  //     features: [
  //       '25,000 tokens per month',
  //       'Flexible configuration',
  //       'Custom use case support',
  //       'Standard support',
  //       'Basic analytics'
  //     ]
  //   },
  //   {
  //     id: 'flexible_pro',
  //     name: 'Flexible Pro',
  //     price: 79.99,
  //     features: [
  //       '75,000 tokens per month',
  //       'Advanced configuration',
  //       'Priority support',
  //       'Custom templates',
  //       'Advanced analytics',
  //       'API access'
  //     ]
  //   },
  //   {
  //     id: 'enterprise',
  //     name: 'Custom Solution',
  //     price: null,
  //     features: [
  //       'Custom token allocation',
  //       'Fully customized solution',
  //       'Dedicated consultation',
  //       'Custom development',
  //       'Dedicated support',
  //       'Custom SLA'
  //     ]
  //   }
  // ]
};

// Additional utility functions for data mapping
export const mapFormDataToBackend = (formData) => {
  return {
    // Basic user info
    displayName: formData.fullName || '',
    email: formData.email || '',
    phoneNumber: formData.phoneNumber || '',
    password: formData.password || '',
    
    // Onboarding specific fields that map to backend schema
    occupation: formData.whatDoYouDo || '',
    occupationDescription: formData.describe || '',
    accountPurposes: formData.purpose ? [formData.purpose] : [],
    accountType: formData.accountType || 'INDIVIDUAL',
    selectedPlan: formData.plan || 'free',
    planDuration: formData.billing === 'yearly' ? 'YEARLY' : 'MONTHLY'
  };
};

// Default form state
export const defaultFormState = {
  whatDoYouDo: '',
  describe: '',
  purpose: '',
  whoYouAre: '',
  accountType: 'INDIVIDUAL',
  planTab: 'INDIVIDUAL',
  plan: '',
  billing: 'yearly',
};

// Validation helpers
export const validateStep1 = (form) => {
  return form.whatDoYouDo.trim() !== '' && 
         form.describe.trim() !== '' && 
         form.purpose !== '' && 
         form.whoYouAre !== '';
};

export const validateStep2 = (form) => {
  return form.accountType !== '';
};

export const validateStep3 = (form) => {
  return form.plan !== '';
};

// Plan pricing helpers
export const calculatePrice = (plan, billing) => {
  if (!plan.price) return null;
  
  const basePrice = plan.price;
  if (billing === 'yearly') {
    // 20% discount for yearly billing
    return basePrice * 10; // 10 months price for 12 months
  }
  return basePrice;
};

export const calculateOldPrice = (plan, billing) => {
  if (!plan.price) return null;
  
  const basePrice = plan.price;
  if (billing === 'yearly') {
    return basePrice * 12; // Full 12 months price
  }
  return basePrice;
};

// Token limits based on plans
export const getTokenAllocation = (planId) => {
  const tokenMap = {
    'free': 1000,
    'basic': 10000,
    'pro': 50000,
    'agency_starter': 100000,
    'agency_pro': 250000,
    'agency_scale': 500000,
    'company_starter': 500000,
    'company_pro': 1000000,
    'company_enterprise': 2500000,
    'flexible_basic': 25000,
    'flexible_pro': 75000,
    'enterprise': -1 // Unlimited
  };
  
  return tokenMap[planId] || 1000;
};