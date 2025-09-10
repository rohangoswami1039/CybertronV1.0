import React from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import { planTabs } from '../../utils/onboardingData';
import { FaCheckCircle } from 'react-icons/fa';

const Wrapper = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
    gap: 0.75rem;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
  margin: ${({ margin }) => margin || '0'};
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: ${({ gap }) => gap || '0.5rem'};
  }
`;

const LogoTitle = styled(Row)`
  justify-content: flex-start;
  gap: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const Logo = styled.img`
  width: 56px;
  height: 56px;
  
  @media (max-width: 480px) {
    width: 42px;
    height: 42px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const TabsBillingRow = styled(Row)`
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PlanTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const PlanTab = styled.button`
  background: ${({ selected }) => (selected ? '#635bff' : '#fff')};
  color: ${({ selected }) => (selected ? '#fff' : '#222')};
  border: 2px solid #635bff;
  font-weight: 600;
  font-size: 1.08rem;
  padding: 0.7rem 2.2rem;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  outline: none;
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.5rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    flex: 1;
    white-space: nowrap;
  }
`;

const BillingToggle = styled.div`
  display: flex;
  align-items: center;
  background: #eee;
  border-radius: 12px;
  overflow: hidden;
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const BillingBtn = styled.button`
  background: ${({ active }) => (active ? '#000' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.7rem 2.2rem;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  outline: none;
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.8rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    flex: 1;
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

const CardWrapper = styled.div`
  max-width: 768px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  border-radius: 18px;
  border: ${({ selected }) => (selected ? '2.5px solid #635bff' : '2px solid #e5e7eb')};
  box-shadow: ${({ selected }) => (selected ? '0 4px 16px rgba(99,91,255,0.08)' : '0 2px 8px rgba(0,0,0,0.04)')};
  background: #fff;
  padding: 0;
  
  @media (max-width: 768px) {
    min-width: 250px;
    flex: 1 1 250px;
  }
  
  @media (max-width: 480px) {
    min-width: 100%;
  }
`;

const CardInner = styled.div`
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1.5rem 1.25rem 1.25rem 1.25rem;
  }
`;

const BottomSection = styled.div`
  border-top: 1.5px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CardBottom = styled(BottomSection)`
  padding: 1.2rem 1.5rem;
  
  @media (max-width: 480px) {
    padding: 1rem 1.25rem;
  }
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #111;
  margin-bottom: 0.3rem;
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const OldPrice = styled.span`
  font-size: 1.1rem;
  color: #aaa;
  text-decoration: line-through;
  margin-left: 0.7rem;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    margin-left: 0.5rem;
  }
`;

const RadioCircle = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #bbb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ selected }) => selected && `
    border: 2.5px solid #635bff;
    &::after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #635bff;
    }
  `}
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #111;
  
  @media (max-width: 480px) {
    font-size: 1.15rem;
    margin-bottom: 1rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
  
  @media (max-width: 480px) {
    margin: 0 0 1rem 0;
  }
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  margin-bottom: 0.8rem;
  color: #333;

  svg {
    color: #635bff;
    margin-left: 0.6rem;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
    
    svg {
      font-size: 1rem;
    }
  }
`;

const EnterpriseButton = styled(Button)`
  width: 100%;
  font-size: 1.15rem;
  font-weight: 600;
  border-radius: 0 0 18px 18px;
  margin: 0;
  max-width: 100%;
  padding: 1.2rem 1.5rem;
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 1rem 1.25rem;
  }
`;

const ActionsRow = styled(Row)`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.75rem;
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

const Step3PlansLayout = ({
  logo = '/logo/logo-black-no-bg.png',
  title = 'Cybertron.ai',
  planTab,
  onPlanTabChange,
  billing,
  onBillingChange,
  plans,
  selectedPlan,
  onPlanSelect,
  onContactSales,
  onBack,
  onContinue,
  disableContinue,
  onSkip
}) => (
  <Wrapper>
    <LogoTitle>
      <Logo src={logo} alt="Cybertron.ai logo" />
      <Title>{title}</Title>
    </LogoTitle>
    <TabsBillingRow>
      <PlanTabs>
        {planTabs.map(tab => (
          <PlanTab
            key={tab.id}
            selected={planTab === tab.id}
            onClick={() => onPlanTabChange(tab.id)}
          >
            {tab.label}
          </PlanTab>
        ))}
      </PlanTabs>
      <BillingToggle>
        <BillingBtn
          type="button"
          active={billing === 'monthly'}
          onClick={() => onBillingChange('monthly')}
        >
          Monthly
        </BillingBtn>
        <BillingBtn
          type="button"
          active={billing === 'yearly'}
          onClick={() => onBillingChange('yearly')}
        >
          Yearly
        </BillingBtn>
      </BillingToggle>
    </TabsBillingRow>

    <AccountCardGrid>
      {plans.filter(plan => plan.id !== 'enterprise').map(plan => (
        <CardWrapper
          key={plan.id}
          selected={selectedPlan === plan.id}
          onClick={() => onPlanSelect(plan.id)}
        >
          <RadioCircle selected={selectedPlan === plan.id} />
          <CardInner>
            <CardTitle>{plan.name}</CardTitle>
            <FeatureList>
              {plan.features.map((feature, idx) => (
                <FeatureItem key={idx}>
                  {feature}
                  <FaCheckCircle />
                </FeatureItem>
              ))}
            </FeatureList>
          </CardInner>
          <CardBottom>
            <div>
              <Price>
                ${billing === 'yearly'
                  ? (plan.price * 10).toFixed(2)
                  : plan.price.toFixed(2)}
                <OldPrice>
                  ${billing === 'yearly'
                    ? (plan.price * 12).toFixed(2)
                    : plan.price}
                </OldPrice>
              </Price>
              <div>{billing === 'monthly' ? '/month' : '/year'}</div>
            </div>
            {/* No button here, whole card is clickable */}
          </CardBottom>
        </CardWrapper>
      ))}

      {plans.find(plan => plan.id === 'enterprise') && (
        <CardWrapper>
          <CardInner>
            <CardTitle>Enterprise</CardTitle>
            <FeatureList>
              {plans.find(plan => plan.id === 'enterprise').features.map((feature, idx) => (
                <FeatureItem key={idx}>
                  {feature}
                  <FaCheckCircle />
                </FeatureItem>
              ))}
            </FeatureList>
          </CardInner>
          <EnterpriseButton onClick={() => onContactSales()}>
            Contact Sales
          </EnterpriseButton>
        </CardWrapper>
      )}
    </AccountCardGrid>

    <ActionsRow>
      <Button variant="secondary" onClick={onBack} style={{ flex: 1 }}>
        Back
      </Button>
      <Button onClick={onContinue} disabled={disableContinue} style={{ flex: 1 }}>
        Next
      </Button>
      {onSkip && (
        <SkipLink onClick={onSkip}>
          Skip for now
        </SkipLink>
      )}
    </ActionsRow>

  </Wrapper>
);

export default Step3PlansLayout; 