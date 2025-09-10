import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 2rem;
  // height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Logo = styled.img`
  width: 64px;
  
  @media (max-width: 480px) {
    width: 48px;
  }
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    padding: 0;
  }
`;

const HeadingRow = styled(FlexRow)`
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const Heading = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  padding-left: 3rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding-left: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding-left: 0.5rem;
  }
`;

const SubHeading = styled.div`
  font-size: 1.1rem;
  color: #444;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding-left: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding-left: 0.5rem;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  // overflow-y: auto;
`;

// const Actions = styled.div`
//   width: 100%;
//   max-width: 600px;
//   margin: 0 auto;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 0.7rem;
//   padding: 1rem 0;

//   @media (max-width: 480px) {
//     flex-direction: column;
//     gap: 0.5rem;
//   }
// `;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const OnboardingPortraitLayout = ({
  logo = '/logo/logo-black-no-bg.png',
  heading,
  subheading,
  children,
  actions
}) => (
  <Wrapper>
    <FlexRow>
      <Logo src={logo} alt="Cybertron.ai logo" />
      <Title>Cybertron.ai</Title>
    </FlexRow>
    <HeadingRow>
      <Heading>{heading}</Heading>
      {subheading && <SubHeading>{subheading}</SubHeading>}
    </HeadingRow>
    <Content>{children}</Content>
    <>{actions}</>
  </Wrapper>
);

export default OnboardingPortraitLayout; 