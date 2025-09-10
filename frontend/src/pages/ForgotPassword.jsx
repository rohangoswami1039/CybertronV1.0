import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Input from '../components/common/Input';
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
const SuccessText = styled.div`
  color: #22c55e;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  text-align: center;
  background-color: #dcfce7;
  padding: 0.5rem;
  border-radius: 4px;
  display: ${props => props.show ? 'block' : 'none'};
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

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { requestPasswordReset, resetPassword } = useAuth();
    const [step, setStep] = useState(1); // 1: request, 2: verify/reset
    const [submitError, setSubmitError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');

    // Step 1: Request password reset
    const RequestSchema = Yup.object().shape({
        identifier: Yup.string()
            .test('is-email-or-phone', 'Enter a valid email or phone number', value => {
                if (!value) return false;
                const emailRegex = /.+@.+\..+/;
                const phoneRegex = /^\d{10,15}$/;
                return emailRegex.test(value) || phoneRegex.test(value.replace(/\D/g, ''));
            })
            .required('Mobile number or email is required'),
    });

    // Step 2: Reset password with OTP
    const ResetSchema = Yup.object().shape({
        otpCode: Yup.string().required('OTP is required'),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
    });

    const handleRequest = async (values, { setSubmitting }) => {
        setSubmitError('');
        setSuccessMsg('');
        setSubmitting(true);
        setIsLoading(true);
        try {
            let email = '', phone = '';
            if (/.+@.+\..+/.test(values.identifier)) email = values.identifier;
            else phone = values.identifier;
            const result = await requestPasswordReset(email, phone);
            if (result.success) {
                setSuccessMsg('OTP sent! Please check your email or phone.');
                setIdentifier(values.identifier);
                setStep(2);
            } else {
                setSubmitError(result.error || 'Failed to request password reset.');
            }
        } catch (error) {
            setSubmitError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    const handleReset = async (values, { setSubmitting }) => {
        setSubmitError('');
        setSuccessMsg('');
        setSubmitting(true);
        setIsLoading(true);
        try {
            let email = '', phone = '';
            if (/.+@.+\..+/.test(identifier)) email = identifier;
            else phone = identifier;
            const result = await resetPassword(email, phone, values.otpCode, values.newPassword);
            if (result.success) {
                setSuccessMsg('Password reset successful! You can now log in.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setSubmitError(result.error || 'Failed to reset password.');
            }
        } catch (error) {
            setSubmitError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
            setSubmitting(false);
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
                    <FormHeading>Reset your password</FormHeading>
                    <ErrorText show={!!submitError}>{submitError}</ErrorText>
                    <SuccessText show={!!successMsg}>{successMsg}</SuccessText>
                    {step === 1 && (
                        <Formik
                            initialValues={{ identifier: '' }}
                            validationSchema={RequestSchema}
                            onSubmit={handleRequest}
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
                                    <SubmitButton type="submit" disabled={isSubmitting || isLoading}>
                                        {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                                    </SubmitButton>
                                </Form>
                            )}
                        </Formik>
                    )}
                    {step === 2 && (
                        <Formik
                            initialValues={{ otpCode: '', newPassword: '' }}
                            validationSchema={ResetSchema}
                            onSubmit={handleReset}
                        >
                            {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
                                <Form>
                                    <FormGroup>
                                        <Input
                                            id="otpCode"
                                            label="OTP Code"
                                            required
                                            name="otpCode"
                                            type="text"
                                            placeholder="Enter the OTP sent to your email or phone"
                                            value={values.otpCode}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.otpCode && errors.otpCode}
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <Input
                                            id="newPassword"
                                            label="New Password"
                                            required
                                            name="newPassword"
                                            type="password"
                                            placeholder="Enter your new password"
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.newPassword && errors.newPassword}
                                        />
                                    </FormGroup>
                                    <SubmitButton type="submit" disabled={isSubmitting || isLoading}>
                                        {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                    </SubmitButton>
                                </Form>
                            )}
                        </Formik>
                    )}
                    <Divider><span>Back to</span></Divider>
                    <SubmitButton onClick={() => navigate('/login')} style={{ background: '#635bff', marginTop: 0 }}>Log in</SubmitButton>
                </FormContainer>
            </Right>
        </Container>
    );
};

export default ForgotPassword; 