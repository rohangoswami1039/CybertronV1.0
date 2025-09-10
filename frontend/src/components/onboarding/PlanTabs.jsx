import React from 'react';
import styled, { css } from 'styled-components';

const TabsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  outline: none;
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  padding: 0.7rem 1.7rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  transition: color 0.18s, border 0.18s;
  ${({ selected }) => selected && css`
    color: #635bff;
    border-bottom: 2.5px solid #635bff;
    background: #f7f7ff;
  `}
`;

const PlanTabs = ({ tabs, selectedTab, onTabChange }) => (
  <TabsWrapper>
    {tabs.map(tab => (
      <Tab
        key={tab.id}
        selected={selectedTab === tab.id}
        onClick={() => onTabChange(tab.id)}
        aria-selected={selectedTab === tab.id}
        tabIndex={0}
      >
        {tab.label}
      </Tab>
    ))}
  </TabsWrapper>
);

export default PlanTabs; 