import { createElement } from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import styled from 'styled-components'

const CardWrapper = styled.div`
    position: relative;
    background: #EDECF1ff;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0px 1px 3px #6666;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    max-width: 250px;
    cursor: pointer;

    &:hover{
      border: 1px solid rgba(0, 0, 0, 0.4);
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

const PlatformRow = styled.div`
    position: absolute;
    bottom: 0;
    right: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
`;

const PlatformIcon = styled.div`
    font-size: 0.85rem;
    color: #000;
`;

const AiToolCard = ({ icon, title, platforms, onClick }) => {
    return (
        <CardWrapper
            onClick={onClick}
        >
            <Row>
                <Icon>{createElement(icon)}</Icon>
                <Title>{title}</Title>
            </Row>
            <PlatformRow>
                {platforms && platforms.length > 0 &&
                    platforms.map((platform, i) => (
                        <PlatformIcon key={i}>
                            {platform === 'Instagram' && <FaInstagram />}
                            {platform === 'Facebook' && <FaFacebook />}
                            {platform === 'Twitter' && <FaTwitter />}
                            {platform === 'LinkedIn' && <FaLinkedin />}
                        </PlatformIcon>
                    ))
                }
            </PlatformRow>
        </CardWrapper>
    )
}

export default AiToolCard