import { useForm } from 'react-hook-form';
import React, { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { Stack, Button } from '@mui/material';

import { Form } from 'src/components/hook-form';
import { Scrollbar } from 'src/components/scrollbar';

import { StepIndex } from 'src/auth/types';

import RegistrationFormContent from './RegistrationFormContent';
import makeRegisterValidation from './makeRegistrationValidation';

interface FormProps {
  activeStep: StepIndex;
  onBack: () => void;
  onSubmit: (data: any) => Promise<void>;
  formData?: any;
}

export const RegistrationForm = ({ activeStep, onBack, onSubmit, formData }: FormProps) => {
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const schema = makeRegisterValidation(activeStep);
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      // Company Info defaults
      entity_name: formData?.companyInfo?.entity_name || '',
      entity_type: formData?.companyInfo?.entity_type || '',
      fein: formData?.companyInfo?.fein || '',
      address_line_1: formData?.companyInfo?.address_line_1 || '',
      address_line_2: formData?.companyInfo?.address_line_2 || '',
      city: formData?.companyInfo?.city || '',
      state: formData?.companyInfo?.state || 'NY',
      zip_code: formData?.companyInfo?.zip_code || '',
      phone_number: formData?.companyInfo?.phone_number || '',
      nys_unemployment_registration_number: formData?.companyInfo?.nys_unemployment_registration_number || '',

      // User Info defaults
      first_name: formData?.userInfo?.first_name || '',
      last_name: formData?.userInfo?.last_name || '',
      email_address: formData?.userInfo?.email_address || '',
      role_title: formData?.userInfo?.role_title || '',

      // Payroll Info defaults
      pay_frequency: formData?.payrollInfo?.pay_frequency || 'weekly',
      pay_period: formData?.payrollInfo?.pay_period || '',
      payroll_start_date: formData?.payrollInfo?.payroll_start_date || '',
      check_number: formData?.payrollInfo?.check_number || '',
      
      // Terms defaults
      terms_service: false,
      privacy_policy: false,
      data_processing_agreement: false,
    }
  });

  const handleSubmit = useCallback(async () => {
    const formDataValues = methods.getValues();
    await onSubmit(formDataValues);
  }, [methods, onSubmit]);

  const { formState: { errors } } = methods;

  // Disable Next button conditions:
  // 1. On UserInfo step if user is not verified or OTP is not verified
  // 2. On Summary step if terms are not accepted
  const isNextDisabled = activeStep === StepIndex.UserInfo && (!isUserVerified || !isOtpVerified);

  // Disable Back button on first step
  const isBackDisabled = activeStep === StepIndex.CompanyInfo;

  // Change button text on final step
  const isSubmitStep = activeStep === StepIndex.Summary;
  const isDisableSubmit = isSubmitStep && 
    (!methods.watch('terms_service') || !methods.watch('privacy_policy') || !methods.watch('data_processing_agreement'));

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
      <Scrollbar>
        <Stack spacing={3} py={3}>
          <RegistrationFormContent
            activeStep={activeStep}
            isUserVerified={isUserVerified}
            setIsUserVerified={setIsUserVerified}
            isOtpVerified={isOtpVerified}
            setIsOtpVerified={setIsOtpVerified}
            formData={formData}
          />

          <Stack direction="row" justifyContent="space-between">
            <Button
              variant="outlined"
              onClick={onBack}
              disabled={isBackDisabled}
            >
              Back
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={isNextDisabled || (isSubmitStep && isDisableSubmit)}
              color={isSubmitStep ? "success" : "primary"}
            >
              {isSubmitStep ? 'Submit Registration' : 'Next'}
            </Button>
          </Stack>
        </Stack>
      </Scrollbar>
    </Form>
  );
};

export default RegistrationForm;
