import React from 'react';
import styled, { css } from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  min-width: 260px;
  max-width: 320px;
  flex: 1 1 260px;
  cursor: pointer;
  position: relative;
  transition: border 0.18s, box-shadow 0.18s;
  ${({ selected }) => selected && css`
    border: 2.5px solid #635bff;
    box-shadow: 0 4px 16px rgba(99,91,255,0.08);
  `}
`;

const Title = styled.h3`
  font-size: 1.18rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.2rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  font-size: 1.01rem;
  margin-bottom: 0.7rem;
  color: #222;
  svg {
    color: #111;
    margin-left: 0.5rem;
    font-size: 1.1rem;
  }
`;

const Price = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #635bff;
  margin-bottom: 0.7rem;
`;

const OldPrice = styled.span`
  font-size: 1rem;
  color: #aaa;
  text-decoration: line-through;
  margin-left: 0.7rem;
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
  ${({ selected }) => selected && css`
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

const PlanCard = ({ title, features, price, oldPrice, selected, onClick }) => (
  <Card selected={selected} onClick={onClick} tabIndex={0} role="button" aria-pressed={selected}>
    <Title>{title}</Title>
    <Price>
      ₹{price}
      {oldPrice && <OldPrice>₹{oldPrice}</OldPrice>}
    </Price>
    <FeatureList>
      {features.map((f, i) => (
        <FeatureItem key={i}>{f} <FaCheckCircle /></FeatureItem>
      ))}
    </FeatureList>
    <RadioCircle selected={selected} />
  </Card>
);

export default PlanCard; 