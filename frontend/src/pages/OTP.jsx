import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #fff;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 1rem;
  background: #fff;
  min-height: 25vh;
  
  @media (min-width: 768px) {
    min-height: auto;
    padding: 2rem;
  }
`;

const Logo = styled.img`
  width: 120px;
  margin-bottom: 0.75rem;
  
  @media (min-width: 768px) {
    width: 180px;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #000;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.25rem;
    margin-bottom: 1.5rem;
  }
`;

const ExploreBtn = styled.button`
  background: #000;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border-radius: 8px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #fafafa;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
    justify-content: center;
  }
`;

const OTPCard = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 1.5rem;
  border-radius: 16px;
  background-color: white;
  box-shadow: none;
  
  @media (min-width: 768px) {
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Heading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  text-align: center;
  color: #333;
`;

const OTPLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  display: block;
  text-align: left;
  width: 100%;
  color: #333;
`;

const OTPInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.25rem;
  
  @media (min-width: 400px) {
    gap: 0.75rem;
  }
`;

const OTPInput = styled.input`
  width: 40px;
  height: 48px;
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  background: #fff;
  color: #333;
  outline: none;
  box-shadow: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #635bff;
    box-shadow: 0 0 0 2px rgba(99, 91, 255, 0.2);
  }
  
  &:disabled {
    background: #f3f3f3;
    color: #aaa;
  }
  
  @media (min-width: 400px) {
    width: 48px;
    font-size: 2rem;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  text-align: center;
  margin-bottom: 1rem;
  background-color: #fee2e2;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ContinueButton = styled.button`
  width: 100%;
  background: #000;
  color: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  
  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #635bff;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  
  &:hover {
    color: #5046e4;
    text-decoration: underline;
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  &:before, &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #e0e0e0;
  }
  
  span {
    margin: 0 0.75rem;
    color: #666;
    font-size: 0.85rem;
  }
`;

const LoginBtn = styled.button`
  width: 100%;
  background: #635bff;
  color: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #5046e4;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(99, 91, 255, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Legal = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: #666;
  margin: 1rem 0 0.5rem;
  
  a {
    color: #635bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.p`
  text-align: center;
  font-size: 0.75rem;
  color: #888;
  margin: 0 0 0.5rem 0;
`;

const InfoText = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1.25rem;
`;

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP } = useAuth();
  const [otpValues, setOtpValues] = useState(['', '', '', '']); // Using 4 digits OTP
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimeout, setResendTimeout] = useState(0);
  const inputRefs = useRef([]);

  // Get identifier (email or phone) and redirect path from location state
  const identifier = location.state?.identifier || '';
  const redirectTo = location.state?.redirectTo || '/chat';

  // Setup input refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otpValues.length);
  }, [otpValues.length]);

  // Focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Resend timeout countdown
  useEffect(() => {
    let timer;
    if (resendTimeout > 0) {
      timer = setTimeout(() => {
        setResendTimeout(prevTimeout => prevTimeout - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendTimeout]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value.slice(-1);
    setOtpValues(newOtpValues);
    setError('');

    // Auto-focus next input field
    if (value && index < otpValues.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit if all fields are filled
    const allFilled = newOtpValues.every(val => val.length === 1);
    if (allFilled && index === otpValues.length - 1) {
      handleSubmit(newOtpValues);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (values = otpValues) => {
    const otpCode = values.join('');
    if (otpCode.length !== otpValues.length) {
      setError(`Please enter all ${otpValues.length} digits`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const verificationData = {
        otpCode
      };

      // Add email or phone to verification data
      if (identifier) {
        if (identifier.includes('@')) {
          verificationData.email = identifier;
        } else {
          verificationData.phoneNumber = identifier;
        }
      }

      const result = await verifyOTP(otpCode);

      if (result.success) {
        // OTP verified successfully - redirect to the requested page (default to onboarding)
        navigate(redirectTo || '/onboarding');
      } else {
        setError(result.error || 'Invalid OTP code. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('OTP verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimeout > 0 || !identifier) return;

    setIsResending(true);
    setError('');

    try {
      const result = await resendOTP(identifier);

      if (result.success) {
        // Start the resend cooldown timer (60 seconds)
        setResendTimeout(60);
      } else {
        setError(result.error || 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Mask email or phone for display
  const getMaskedIdentifier = () => {
    if (!identifier) return '';

    if (identifier.includes('@')) {
      // Email masking
      const [username, domain] = identifier.split('@');
      const maskedUsername = username.substring(0, 2) +
        '*'.repeat(Math.max(username.length - 4, 2)) +
        username.substring(username.length - 2);
      return `${maskedUsername}@${domain}`;
    } else {
      // Phone masking
      return '*'.repeat(identifier.length - 4) + identifier.slice(-4);
    }
  };

  return (
    <Container>
      <Left>
        <Logo src="/logo/logo-black-no-bg.png" alt="Cybertron.ai logo" />
        <Title>Cybertron.ai</Title>
        <ExploreBtn onClick={() => navigate('/chat')}>Explore AI Studio</ExploreBtn>
      </Left>
      <Right>
        <OTPCard>
          <Heading>Verification Code</Heading>

          <InfoText>
            We've sent a 4-digit code to {getMaskedIdentifier()}
          </InfoText>

          <OTPLabel htmlFor="otp-input-0">Enter verification code</OTPLabel>
          <OTPInputContainer>
            {otpValues.map((value, index) => (
              <OTPInput
                key={index}
                id={`otp-input-${index}`}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isSubmitting}
                autoComplete="off"
              />
            ))}
          </OTPInputContainer>

          <ErrorMessage show={error}>{error}</ErrorMessage>

          <ContinueButton
            onClick={() => handleSubmit()}
            disabled={isSubmitting || otpValues.some(val => !val)}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </ContinueButton>

          <ResendButton
            onClick={handleResendOTP}
            disabled={isResending || resendTimeout > 0}
          >
            {resendTimeout > 0
              ? `Resend code in ${resendTimeout}s`
              : isResending
                ? 'Sending...'
                : 'Resend code'}
          </ResendButton>

          <Divider><span>Or</span></Divider>

          <LoginBtn onClick={() => navigate('/login')}>Back to login</LoginBtn>

          <Legal>
            By continuing, you agree to Cybertron.ai's{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>
          </Legal>

          <Copyright>© 2024 Cybertron.ai, Inc.</Copyright>
        </OTPCard>
      </Right>
    </Container>
  );
};

export default OTP; 