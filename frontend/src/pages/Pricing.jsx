import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Components
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

// Context
import { useAuth } from '../context/AuthContext';

// Data
import { subscriptionPlans } from '../utils/dummyData';

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space[6]} 0;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}20, ${({ theme }) => theme.colors.secondary}20);
`;

const ContentCard = styled(Card)`
  width: 100%;
  max-width: 960px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space[2]};
  text-align: center;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const BillingToggle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space[8]};
`;

const BillingOption = styled.span`
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ active, theme }) => active ? theme.fontWeights.semibold : theme.fontWeights.normal};
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 30px;
  margin: 0 ${({ theme }) => theme.space[3]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeInOut};
`;

const ToggleKnob = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ isYearly }) => isYearly ? '33px' : '3px'};
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 50%;
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeInOut};
`;

const PlansContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space[4]};
  margin-bottom: ${({ theme }) => theme.space[6]};
`;

const PlanCard = styled(Card)`
  border: 2px solid ${({ selected, popular, theme }) =>
    selected ? theme.colors.primary :
      popular ? theme.colors.secondary :
        'transparent'};
  transform: ${({ popular }) => popular ? 'scale(1.05)' : 'scale(1)'};
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeInOut};
  position: relative;
  overflow: visible;
  
  &:hover {
    transform: ${({ popular }) => popular ? 'scale(1.08)' : 'scale(1.03)'};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radii.full};
`;

const PlanName = styled.h3`
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const PlanPrice = styled.div`
  margin-bottom: ${({ theme }) => theme.space[4]};
`;

const PriceAmount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PricePeriod = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FeaturesList = styled.ul`
  margin-bottom: ${({ theme }) => theme.space[5]};
  padding-left: ${({ theme }) => theme.space[5]};
`;

const FeatureItem = styled.li`
  margin-bottom: ${({ theme }) => theme.space[2]};
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: -${({ theme }) => theme.space[5]};
    color: ${({ theme }) => theme.colors.success};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.space[6]};
`;

const Pricing = () => {
  const navigate = useNavigate();
  const { saveFormState } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');

  const toggleBillingCycle = () => {
    setIsYearly(!isYearly);
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    // Save plan selection
    saveFormState({
      plan: selectedPlan,
      billingCycle: isYearly ? 'yearly' : 'monthly',
    });

    // Navigate to explore page
    navigate('/chat');
  };

  const handleBack = () => {
    navigate('/select-account-type');
  };

  return (
    <PageContainer>
      <Container>
        <ContentCard>
          <Card.Body padding="lg">
            <LogoContainer>
              <Logo>Cybertron.AI</Logo>
            </LogoContainer>

            <Title>Choose your plan</Title>
            <Subtitle>Select the plan that best fits your needs</Subtitle>

            <BillingToggle>
              <BillingOption active={!isYearly}>Monthly</BillingOption>
              <ToggleSwitch onClick={toggleBillingCycle}>
                <ToggleKnob isYearly={isYearly} />
              </ToggleSwitch>
              <BillingOption active={isYearly}>Yearly (Save 20%)</BillingOption>
            </BillingToggle>

            <PlansContainer>
              {subscriptionPlans.map(plan => (
                <PlanCard
                  key={plan.id}
                  selected={selectedPlan === plan.id}
                  popular={plan.popular}
                  onClick={() => handlePlanSelect(plan.id)}
                  hoverable
                >
                  {plan.popular && <PopularBadge>MOST POPULAR</PopularBadge>}

                  <Card.Body>
                    <PlanName>{plan.name}</PlanName>
                    <PlanPrice>
                      <PriceAmount>${isYearly ? plan.price.yearly : plan.price.monthly}</PriceAmount>
                      <PricePeriod>/{isYearly ? 'year' : 'month'}</PricePeriod>
                    </PlanPrice>

                    <FeaturesList>
                      {plan.features.map((feature, index) => (
                        <FeatureItem key={index}>{feature}</FeatureItem>
                      ))}
                    </FeaturesList>

                    <Button
                      fullWidth
                      variant={plan.popular ? 'primary' : 'outline'}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                    </Button>
                  </Card.Body>
                </PlanCard>
              ))}
            </PlansContainer>

            <ButtonContainer>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>

              <Button
                onClick={handleContinue}
                disabled={!selectedPlan}
              >
                Continue to Dashboard
              </Button>
            </ButtonContainer>
          </Card.Body>
        </ContentCard>
      </Container>
    </PageContainer>
  );
};

export default Pricing; 