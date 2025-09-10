import { createElement } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import styled from 'styled-components'

const CardWrapper = styled.div`
    position: relative;
    background: transparent;
    border-radius: 4px;
    border: 1px solid #6666;
    box-shadow: 0px 1px 3px #6666;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    max-width: 250px;
    height: 110px;
    cursor: pointer;

    &:hover{
      background: #EDECF1ff;
    }
`;

const Row = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
`;

const Icon = styled.div`
    font-size: 1.5rem;
    color: #000;
`;

const Title = styled.div`
    font-size: 1.2rem;
    font-weight: 600;
`;

const InfoButton = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #777;
    
    &:hover {
      color: #333;
    }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  right: -10px;
  background: #333;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  max-width: 250px;
  width: 150px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: all 0.2s ease-in-out;
  z-index: 999;
  text-align: left;
  line-height: 1.4;
  font-weight: 400;
  margin-top: 8px;

  &::before {
    content: '';
    position: absolute;
    bottom: -4px;
    right: 13px;
    width: 8px;
    height: 8px;
    background: #333;
    transform: rotate(45deg);
  }

  ${InfoButton}:hover & {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AiWorkCard = ({ icon, title, description, onClick }) => {
  return (
    <CardWrapper
      onClick={onClick}
    >
      <InfoButton>
        <IoIosInformationCircleOutline size={20} />
        <Tooltip>{description}</Tooltip>
      </InfoButton>
      <Row>
        <Icon>{createElement(icon)}</Icon>
        <Title>{title}</Title>
      </Row>
    </CardWrapper>
  )
}

export default AiWorkCard