import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FcGoogle } from 'react-icons/fc';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';

// Future Social Login
// import { FaFacebook, FaGithub, FaKey } from 'react-icons/fa';

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

const FormContainer = styled.div`
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

const FormHeading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.25rem;
  color: #333;
`;

const FormGroup = styled.div`
  width: 100%;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #000;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 0.5rem;
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

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.95rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #333;
  font-weight: 500;
  margin-bottom: 1rem;

  &:hover {
    background: #f5f5f5;
    border-color: #d0d0d0;
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const CreateLink = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  background: #635bff;
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  margin-top: 1rem;
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
  margin: 1rem 0;
  
  a {
    color: #635bff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const ErrorText = styled.div`
  color: #e53e3e;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
  background-color: #fee2e2;
  padding: 0.5rem;
  border-radius: 4px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin: 0.5rem 0 1rem;
  
  a {
    color: #635bff;
    font-size: 0.85rem;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .test('is-email-or-phone', 'Enter a valid email or phone number', value => {
      if (!value) return false;
      const emailRegex = /.+@.+\..+/;
      const phoneRegex = /^\d{10,15}$/;
      return emailRegex.test(value) || phoneRegex.test(value.replace(/\D/g, ''));
    })
    .required('Mobile number or email is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the redirect path from state or default to '/chat'
  const from = location.state?.from?.pathname || '/chat';

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitError('');
    setSubmitting(true);

    try {
      const result = await login({
        identifier: values.identifier,
        password: values.password
      });

      if (result.success) {
        if (result.requiresOTP) {
          // Redirect to OTP verification
          navigate('/otp', {
            state: {
              identifier: values.identifier,
              redirectTo: from
            }
          });
        } else {
          // Direct login successful (no OTP required)
          navigate(from);
        }
      } else {
        setSubmitError(result.error || 'Failed to log in. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await loginWithGoogle();
      // console.log("Result is: ", result);
      if (result.success) {
        if (result.isNewUser) {
          // New user - redirect to onboarding to collect additional information
          navigate('/onboarding');
        } else {
          // Existing user - redirect to the original requested page
          navigate(from);
        }
      } else {
        setSubmitError(result.error || 'Google login failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
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
        <FormContainer>
          <FormHeading>Log in to your account</FormHeading>
          <ErrorText show={submitError}>{submitError}</ErrorText>

          <SocialButton onClick={handleGoogleLogin} disabled={isLoading}>
            <FcGoogle /> Continue with Google
          </SocialButton>

          <Divider><span>or</span></Divider>

          <Formik
            initialValues={{ identifier: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
              <Form>
                <FormGroup>
                  <Input
                    id="identifier"
                    label="Email or phone number"
                    required
                    name="identifier"
                    type="text"
                    placeholder="Enter your email or phone"
                    value={values.identifier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.identifier && errors.identifier}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    id="password"
                    label="Password"
                    required
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                  />
                </FormGroup>
                <ForgotPassword>
                  <Link to="/forgot-password">Forgot password?</Link>
                </ForgotPassword>
                <SubmitButton type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Logging in...' : 'Log in'}
                </SubmitButton>
              </Form>
            )}
          </Formik>
          <Legal>
            By continuing, you agree to Cybertron.ai's{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </Legal>
          <Divider><span>New to Cybertron.ai?</span></Divider>
          <CreateLink onClick={() => navigate('/signup')}>Create an account</CreateLink>
        </FormContainer>
      </Right>
    </Container>
  );
};

export default Login;
