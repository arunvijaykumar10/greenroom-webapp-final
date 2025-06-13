import _ from 'lodash';
import { useState, useCallback } from 'react';

import { Box, Step, Card, Stack, Alert, Stepper, StepLabel, Typography, CardContent } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/components/snackbar';

import { StepIndex } from '../types';
import { useRegisterMutation } from '../api';
import { RegistrationForm } from './components';

import type { PayrollDetails, UserInformation, CompanyInformation, RegistrationFormData } from '../types';

const REGISTRATION_STEPS = ['Company Information', 'User Details', 'Payroll Details', 'Review & Submit'];

export default function SignUpView() {
  const [currentStep, setCurrentStep] = useState<StepIndex>(StepIndex.CompanyInfo);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [register] = useRegisterMutation()

  const router = useRouter();

  const goToNextStep = () =>
    setCurrentStep((prevStep) => Math.min(prevStep + 1, StepIndex.Summary));

  const goToPreviousStep = () =>
    setCurrentStep((prevStep) => Math.max(prevStep - 1, StepIndex.CompanyInfo));

  const handleStepSubmit = useCallback(
    async (stepData: any) => {
      console.log('formData', currentStep);
      try {
        switch (currentStep) {
          case StepIndex.CompanyInfo:
            setFormData((prev) => ({
              ...prev,
              companyInfo: {
                entity_name: stepData.entity_name,
                entity_type: stepData.entity_type,
                fein: stepData.fein,
                address_line_1: stepData.address_line_1,
                address_line_2: stepData.address_line_2,
                city: stepData.city,
                state: stepData.state,
                zip_code: stepData.zip_code,
                phone_number: stepData.phone_number,
                nys_unemployment_registration_number: stepData.nys_unemployment_registration_number,
              } as CompanyInformation
            }));
            goToNextStep();
            break;

          case StepIndex.UserInfo:
            setFormData((prev) => ({
              ...prev,
              userInfo: {
                first_name: stepData.first_name,
                last_name: stepData.last_name,
                email_address: stepData.email_address,
                role_title: stepData.role_title,
              } as UserInformation
            }));
            goToNextStep();
            break;

          case StepIndex.Payroll:
            setFormData((prev) => ({
              ...prev,
              payrollInfo: {
                pay_frequency: stepData.pay_frequency,
                pay_period: stepData.pay_period,
                payroll_start_date: stepData.payroll_start_date,
                check_number: parseInt(stepData.check_number, 10) || 1,
              } as PayrollDetails
            }));
            goToNextStep();
            break;

          case StepIndex.Summary:
            if (formData.companyInfo && formData.userInfo && formData.payrollInfo) {
              register(formData)
            }
            break;

          default:
            toast.error('Invalid step.');
        }
      } catch (error) {
        console.error('Registration error:', error);
        setRegistrationError(error instanceof Error ? error.message : 'An error occurred during registration');
      }
    },
    [currentStep, formData, router]
  );

  if (registrationComplete) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          py: 5
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 700 }}>
          <CardContent>
            <Stack spacing={4} alignItems="center">
              <Typography variant="h5" textAlign="center">
                Registration Complete!
              </Typography>

              <Typography variant="body1" textAlign="center">
                You will be redirected to the login page shortly...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        py: 5
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 700 }}>
        <CardContent>
          <Stack spacing={4}>
            <Typography variant="h5" textAlign="center">
              Register
            </Typography>

            {registrationError && (
              <Alert severity="error" onClose={() => setRegistrationError(null)}>
                {registrationError}
              </Alert>
            )}

            <Stepper activeStep={currentStep} alternativeLabel>
              {_.map(REGISTRATION_STEPS, (label: string) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <RegistrationForm
              activeStep={currentStep}
              onBack={goToPreviousStep}
              onSubmit={handleStepSubmit}
              formData={formData}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
