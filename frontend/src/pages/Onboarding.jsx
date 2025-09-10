import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronDown } from 'react-icons/fa';

// Components
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import OnboardingPortraitLayout from '../components/onboarding/OnboardingPortraitLayout';
import AccountTypeCard from '../components/onboarding/AccountTypeCard';
import Step3PlansLayout from '../components/onboarding/Step3PlansLayout';

// Context
import { useAuth } from '../context/AuthContext';

// Data
import { onboardingQuestions, accountTypes, plansData, defaultFormState, mapFormDataToBackend, validateStep3, validateStep2, validateStep1 } from '../utils/onboardingData';

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fff;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 900px) {
    flex: none;
    padding: 2rem 0 0 0;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0 0 0;
  }
`;

const Logo = styled.img`
  width: 150px;
  
  @media (max-width: 480px) {
    width: 100px;
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Tagline = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #222;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-top: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-top: 0.5rem;
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: #fff;
  
  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.2rem;
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.3rem;
  
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.label`
  font-size: 1.08rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
  color: #222;
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1.1rem 1.2rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: black;
  font-size: 1.08rem;
  margin-top: 0.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  outline: none;

  &::placeholder {
    color: gray;
  }

  &:focus {
    background: #f0f0f0;
  }
  
  @media (max-width: 480px) {
    padding: 0.9rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: 1.1rem 1.2rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: black;
  font-size: 1.08rem;
  margin-top: 0.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  appearance: none;
  outline: none;

  &::placeholder {
    color: gray;
  }

  &:focus {
    background: #f0f0f0;
  }
  
  @media (max-width: 480px) {
    padding: 0.9rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
`;

const SelectIcon = styled(FaChevronDown)`
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
`;

const ButtonsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 1rem;
    margin-bottom: 1.5rem;
    justify-content: center;
  }
`;

const AccountCardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1.5rem 1rem;
  
  @media (max-width: 768px) {
    // grid-template-columns: 1fr;
    // max-width: 500px;
    margin: 0 auto;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.5rem;
    gap: 1.5rem;
  }
`;

const SkipLink = styled(Button)`
  background: none;
  color: #666;
  text-align: center;
  cursor: pointer;
  border: 1px solid #666;
  width: fit-content;
  transition: color 0.2s;
  
  &:hover {
    color: #000;
    border: 1px solid black;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Onboarding = () => {
  const navigate = useNavigate();
  const { saveFormState, completeGoogleProfile, completeProfile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultFormState);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 Handlers
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 2 Handlers - Updated to ensure planTab matches accountType
  const handleAccountTypeSelect = (id) => {
    setForm((prev) => ({
      ...prev,
      accountType: id,
      planTab: id,  // Keep planTab in sync with accountType
      plan: ''      // Reset plan selection when account type changes
    }));
  };

  // Step 3 Handlers
  const handlePlanTab = (id) => {
    setForm((prev) => ({ ...prev, planTab: id, plan: '' }));
  };

  const handlePlanSelect = (id) => {
    setForm((prev) => ({ ...prev, plan: id }));
  };

  const handleBilling = (billing) => {
    setForm((prev) => ({ ...prev, billing }));
  };

  // Navigation handlers
  const handleContinue = async (e) => {
    e && e.preventDefault();
    setSubmitError('');
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2(form)) {
        alert('Please select an account type');
        return;
      }
      setStep(3);
    } else {
      if (!validateStep3(form)) {
        alert('Please select a plan');
        return;
      }
      const backendData = mapFormDataToBackend(form);
      setIsSubmitting(true);
      // If user is a Google user (firebaseUid present), complete Google profile
      if (user && user.firebaseUid) {
        // console.log("User", user);
        const profileData = {
          ...backendData,
          firebaseUid: user.firebaseUid,
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
        };
        const result = await completeGoogleProfile(profileData);
        setIsSubmitting(false);
        if (result.success) {
          navigate('/chat');
        } else {
          setSubmitError(result.error || 'Failed to complete registration.');
        }
      } else {
        // For non-Google users, complete profile and redirect to chat
        const result = await completeProfile(backendData);
        setIsSubmitting(false);
        if (result.success) {
          navigate('/chat');
        } else {
          setSubmitError(result.error || 'Failed to complete profile.');
          // Optionally save form state for retry
          saveFormState({ onboarding: backendData });
        }
      }
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSkip = (skipStep) => {
    if (skipStep === 1) {
      // Skip step 1 - set minimal defaults
      setForm(prev => ({
        ...prev,
        whatDoYouDo: 'Not specified',
        describe: 'Not specified',
        purpose: 'Personal Assistant',
        whoYouAre: 'Individual Professional'
      }));
      setStep(2);
    } else if (skipStep === 2) {
      // Skip step 2 - use INDIVIDUAL as default
      setForm(prev => ({
        ...prev,
        accountType: 'INDIVIDUAL',
        planTab: 'INDIVIDUAL'
      }));
      setStep(3);
    } else if (skipStep === 3) {
      // Skip step 3 - use free plan as default
      const updatedForm = {
        ...form,
        plan: 'free',
        billing: 'MONTHLY'
      };

      const backendData = mapFormDataToBackend(updatedForm);
      saveFormState({ onboarding: backendData });
      navigate('/login');
    }
  };

  const handleContactSales = () => {
    // For enterprise plans, might want to redirect to a contact form
    // or handle it differently than regular plan selection
    setForm(prev => ({ ...prev, plan: 'enterprise' }));

    // Maybe redirect to contact form instead:
    // navigate('/contact-sales', { state: { accountType: form.accountType } });
  };

  return (
    <>
      {step === 1 && (
        <Wrapper>
          <Left>
            <FlexRow>
              <Logo src="/logo/logo-black-no-bg.png" alt="Cybertron.ai logo" />
              <Title>Cybertron.ai</Title>
            </FlexRow>
            <Tagline>All In One</Tagline>
          </Left>
          <Right>
            <Card style={{ maxWidth: 500, width: '100%' }} elevation='none'>
              <CardTitle>Just Answer Few Questions</CardTitle>
              <form onSubmit={handleContinue}>
                {onboardingQuestions.map((q) => (
                  <FormGroup key={q.name}>
                    <Label htmlFor={q.name}>{q.label}</Label>
                    {q.type === 'input' ? (
                      <Input
                        id={q.name}
                        name={q.name}
                        placeholder={q.placeholder}
                        value={form[q.name]}
                        onChange={handleChange}
                      />
                    ) : (
                      <SelectWrapper>
                        <Select
                          id={q.name}
                          name={q.name}
                          value={form[q.name]}
                          onChange={handleChange}
                          style={{ color: form[q.name] ? '#000' : 'gray' }}
                        >
                          {q.options.map((opt, idx) => (
                            <option key={idx} value={opt}>{opt || q.placeholder}</option>
                          ))}
                        </Select>
                        <SelectIcon />
                      </SelectWrapper>
                    )}
                  </FormGroup>
                ))}
                <ButtonsContainer>
                  <Button style={{ flex: 1 }}>Next</Button>
                  <Button variant="secondary" onClick={() => handleSkip(1)} style={{ flex: 1 }}>Skip</Button>
                </ButtonsContainer>
              </form>
            </Card>
          </Right>
        </Wrapper >
      )}
      {
        step === 2 && (
          <OnboardingPortraitLayout
            heading="Choose Account Type"
            subheading="( you can change it in settings )"
            actions={
              <ButtonsContainer>
                <Button variant="secondary" onClick={handleBack} style={{ flex: 1 }}>Back</Button>
                <Button onClick={handleContinue} disabled={!form.accountType} style={{ flex: 1 }}>Next</Button>
                <SkipLink onClick={() => handleSkip(2)}>Skip for now</SkipLink>
              </ButtonsContainer>
            }
          >
            <AccountCardGrid>
              {accountTypes.map((type) => (
                <AccountTypeCard
                  key={type.id}
                  title={type.title}
                  features={type.features}
                  selected={form.accountType === type.id}
                  onClick={() => handleAccountTypeSelect(type.id)}
                />
              ))}
            </AccountCardGrid>
          </OnboardingPortraitLayout>
        )
      }
      {
        step === 3 && (
          <Step3PlansLayout
            planTab={form.planTab}
            onPlanTabChange={handlePlanTab}
            billing={form.billing}
            onBillingChange={handleBilling}
            plans={plansData[form.planTab] || plansData['INDIVIDUAL']}
            selectedPlan={form.plan}
            onPlanSelect={handlePlanSelect}
            onContactSales={handleContactSales}
            onBack={handleBack}
            onContinue={handleContinue}
            disableContinue={!form.plan}
            onSkip={() => handleSkip(3)}
          />
        )
      }
    </>
  );
};

export default Onboarding; 