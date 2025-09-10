import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import { FcGoogle } from 'react-icons/fc';

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
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  margin-top: 0.5rem;
  
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

const LoginLink = styled.button`
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

const PasswordRequirements = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.75rem;
  font-size: 0.75rem;
  color: #666;
  
  li {
    margin-bottom: 0.25rem;
    display: flex;
    align-items: center;
    
    &:before {
      content: "•";
      margin-right: 0.5rem;
      color: #635bff;
    }
  }
`;

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      setSubmitError('');
      // console.log("On Submitting: ", values);

      const result = await signup({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        if (result.requiresOTP) {
          // Redirect to OTP page with identifier
          navigate('/otp', { state: { identifier: values.email, redirectTo: '/onboarding' } });
        } else {
          // Direct to onboarding (no OTP required)
          navigate('/onboarding');
        }
      } else {
        setSubmitError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await loginWithGoogle();

      if (result.success) {
        if (result.isNewUser) {
          // New user - redirect to onboarding to collect additional information
          navigate('/onboarding');
        } else {
          // Existing user - redirect to chat
          navigate('/chat');
        }
      } else {
        setSubmitError(result.error || 'Google sign up failed. Please try again.');
      }
    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.');
      console.error('Google signup error:', error);
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
          <FormHeading>Create your account</FormHeading>
          <ErrorText show={submitError}>{submitError}</ErrorText>

          <SocialButton onClick={handleGoogleSignup} disabled={isLoading}>
            <FcGoogle /> Continue with Google
          </SocialButton>

          <Divider><span>or</span></Divider>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
            }) => (
              <Form>
                <FormGroup>
                  <Input
                    id="name"
                    label="Full Name"
                    required
                    name="name"
                    placeholder="Enter your full name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />
                </FormGroup>

                <FormGroup>
                  <Input
                    id="email"
                    label="Email Address"
                    required
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                  />
                </FormGroup>

                <FormGroup>
                  <Input
                    id="password"
                    label="Password"
                    required
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && errors.password}
                  />
                </FormGroup>

                {/* <PasswordRequirements>
                  <li>At least 6 characters</li>
                  <li>Include numbers, letters, or symbols</li>
                </PasswordRequirements> */}

                <FormGroup>
                  <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    required
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.confirmPassword && errors.confirmPassword}
                  />
                </FormGroup>
                <SubmitButton type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </SubmitButton>
              </Form>
            )}
          </Formik>

          <Legal>
            By signing up, you agree to Cybertron.ai's{' '}
            <Link to="/terms">Terms of Service</Link> and{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </Legal>

          <Divider><span>Already have an account?</span></Divider>
          <LoginLink onClick={() => navigate('/login')}>Log in</LoginLink>
        </FormContainer>
      </Right>
    </Container>
  );
};

export default SignUp;
