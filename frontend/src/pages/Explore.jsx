import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

// Components
import Layout from '../components/layout/Layout';

// Data
import { aiWorks, aiTools } from '../utils/dummyData';
import AiToolCard from '../components/explore/ToolCard';
import AiWorkCard from '../components/explore/WorkCard';

const AllToolsContainer = styled.div`
  width: 100%;
  padding: 1.5rem;
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  background: #eee;
  width: fit-content;
  border-radius: 8px;
  overflow: hidden;
  margin: 1rem 0;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
`;

const TabButton = styled.button`
  background: ${({ active }) => (active ? '#000' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 1.25rem 2.2rem;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  outline: none;
`;

const SearchBarRow = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  width: 100%;
  gap: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1.1rem;
  color: #333;
  outline: none;
  
  &::placeholder {
    color: #999;
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(225px, 1fr));
  gap: 1rem;
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0;
  color: #666;
  margin-left: 5px;
`;

const Explore = () => {
  const [tab, setTab] = useState('tools');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Authentication check - redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/explore' } } });
    }
  }, [isAuthenticated, navigate]);

  // Search logic
  const filterTools = (tools, search) => {
    if (!search.trim()) return tools;
    const s = search.toLowerCase();
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(s) ||
      tool.description.toLowerCase().includes(s) ||
      tool.category.toLowerCase().includes(s) ||
      (tool.platforms && tool.platforms.some(p => p.toLowerCase().includes(s)))
    );
  };

  const filterWorks = (works, search) => {
    if (!search.trim()) return works;
    const s = search.toLowerCase();
    return works.filter(work =>
      (work.title && work.title.toLowerCase().includes(s)) ||
      (work.description && work.description.toLowerCase().includes(s)) ||
      (work.type && work.type.toLowerCase().includes(s))
    );
  };

  // Handle tool click
  const handleToolClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  // Clear search on tab switch
  const handleTabSwitch = (tabName) => {
    setTab(tabName);
    setSearch('');
  };

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Explore">
      <AllToolsContainer>
        <SearchBarRow>
          <SearchInput
            placeholder="Ex - Text to video"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <FaSearch style={{ color: 'black', fontSize: '1.25rem' }} />
        </SearchBarRow>

        <TabRow>
          <TabButton active={tab === 'tools'} onClick={() => handleTabSwitch('tools')}>
            AI Tools
          </TabButton>
          <TabButton active={tab === 'works'} onClick={() => handleTabSwitch('works')}>
            AI Works
          </TabButton>
        </TabRow>

        {tab === 'tools' && (
          <>
            <Heading>AI Tools</Heading>
            <ToolsGrid>
              {filterTools(aiTools, search).map((tool) => (
                <AiToolCard
                  key={tool.id}
                  onClick={() => handleToolClick(tool.route)}
                  icon={tool.icon}
                  title={tool.name}
                  platforms={tool.platforms}
                />
              ))}
            </ToolsGrid>
          </>
        )}

        {tab === 'works' && (
          <>
            <Heading>AI Works</Heading>
            <ToolsGrid>
              {filterWorks(aiWorks, search).map((work) => (
                <AiWorkCard
                  key={work.id}
                  onClick={() => handleToolClick(work.route)}
                  icon={work.icon}
                  title={work.name}
                  description={work.description}
                />
              ))}
            </ToolsGrid>
          </>
        )}
      </AllToolsContainer>
    </Layout>
  );
};

export default Explore;