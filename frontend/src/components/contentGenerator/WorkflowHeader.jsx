import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
`;
        
const ScrollContainer = styled.div`
    padding: 16px 20px;
    overflow-x: auto;
    overflow-y: hidden;
    
    /* Hide scrollbar on mobile for cleaner look */
    @media (max-width: 768px) {
        scrollbar-width: none;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;

const StepsWrapper = styled.div`
    display: flex;
    align-items: center;
    min-width: max-content;
    white-space: nowrap;
`;

const StepContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${props => props.disabled ? '0.6' : '1'};
    position: relative;
`;

const StepNumber = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
    
    ${props => props.completed ? `
        background-color: #000;
        color: white;
    ` : `
        background-color: #666;
        color: #fff;
    `}
`;

const StepTitle = styled.span`
    font-size: 16px;
    font-weight: 500;
    transition: color 0.2s ease;
    
    ${props => props.completed ? `
        color: #000;
        font-weight: 700;
    ` : `
        color: #666;
    `}
    @media (max-width: 480px) {
        font-size: 13px;
    }
`;

const Separator = styled.div`
    width: 16px;
    height: 1px;
    background-color: #d1d5db;
    margin: 0 4px;
    flex-shrink: 0;
    
    @media (max-width: 480px) {
        width: 12px;
    }
`;

const ScrollHint = styled.div`
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40px;
    background: linear-gradient(to right, transparent, #f8fafc);
    pointer-events: none;
    display: none;
    
    @media (max-width: 768px) {
        display: block;
    }
`;

const Tooltip = styled.div`
    position: absolute;
    bottom: -40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 10;
    pointer-events: none;
    opacity: ${props => props.show ? '1' : '0'};
    transition: opacity 0.2s ease;
`;

// Map step numbers to workflow steps
const STEP_TO_WORKFLOW = {
    1: 'YOUTUBE_SEARCH',
    2: 'AUDIO_GENERATION',
    3: 'THUMBNAIL_CREATION',
    4: 'VIDEO_CREATION',
    5: 'EDITOR',
    6: 'PUBLISH'
};

const WORKFLOW_TO_STEP = {
    'YOUTUBE_SEARCH': 1,
    'SCRIPT_GENERATION': 1,
    'PROMPT_BASED_EDITOR': 1,
    'AUDIO_GENERATION': 2,
    'THUMBNAIL_CREATION': 3,
    'VIDEO_CREATION': 4,
    'EDITOR': 5,
    'PUBLISH': 6
};

const WorkflowHeader = ({ currentStep, onStepClick }) => {
    const steps = [
        { number: 1, title: 'Step (Script)', active: false },
        { number: 2, title: 'Step (Audio)', active: false },
        { number: 3, title: 'Thumbnail', active: false },
        { number: 4, title: 'Video', active: false },
        { number: 5, title: 'Editor', active: false },
        { number: 6, title: 'Publish', active: false },
    ];
    
    const scrollContainerRef = useRef(null);
    const [showScrollHint, setShowScrollHint] = useState(false);
    const [tooltipStep, setTooltipStep] = useState(null);
    
    // Determine current step number based on workflow step
    const currentStepNumber = WORKFLOW_TO_STEP[currentStep] || 1;
    
    // Update active state for each step
    steps.forEach(step => {
        step.active = step.number === currentStepNumber;
        step.completed = step.number <= currentStepNumber;
    });
    
    const handleStepClick = (stepNumber) => {
        // Only allow clicking on completed steps or the next step
        if (stepNumber > currentStepNumber) {
            setTooltipStep(stepNumber);
            setTimeout(() => setTooltipStep(null), 2000);
            return;
        }
        
        // Handle step click
        if (onStepClick) {
            const workflowStep = STEP_TO_WORKFLOW[stepNumber];
            if (workflowStep) {
                onStepClick(workflowStep);
            } else if (stepNumber > 3) {
                // For steps that aren't implemented yet
                alert("This feature is coming soon!");
            }
        }
    };
    
    useEffect(() => {
        const checkScroll = () => {
            if (scrollContainerRef.current) {
                const { scrollWidth, clientWidth } = scrollContainerRef.current;
                setShowScrollHint(scrollWidth > clientWidth);
            }
        };
        
        checkScroll();
        window.addEventListener('resize', checkScroll);
        
        return () => window.removeEventListener('resize', checkScroll);
    }, []);
    
    // Create an array of elements that includes both steps and separators
    const stepsWithSeparators = [];
    steps.forEach((step, index) => {
        stepsWithSeparators.push(
            <StepContainer 
                key={`step-${step.number}`}
                onClick={() => handleStepClick(step.number)}
                disabled={step.number > currentStepNumber}
            >
            <StepNumber completed={step.completed}>{step.number}</StepNumber>
            <StepTitle completed={step.completed}>{step.title}</StepTitle>
                {tooltipStep === step.number && (
                    <Tooltip show={true}>
                        Complete previous steps first
                    </Tooltip>
                )}
            </StepContainer>
        );
        
        if (index < steps.length - 1) {
            stepsWithSeparators.push(
                <Separator key={`separator-${step.number}`} />
            );
        }
    });
    
    return (
        <HeaderContainer>
            <ScrollContainer ref={scrollContainerRef} className="custom-scroll">
                <StepsWrapper>
                    {stepsWithSeparators}
                </StepsWrapper>
            </ScrollContainer>
            {showScrollHint && <ScrollHint />}
        </HeaderContainer>
    );
};

export default WorkflowHeader;