import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect, useCallback } from 'react';

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
  const [isUserVerified, setIsUserVerified] = useState(() => {
    const saved = localStorage.getItem('registration_user_verified');
    return saved ? JSON.parse(saved) : false;
  });
  const [isOtpVerified, setIsOtpVerified] = useState(() => {
    const saved = localStorage.getItem('registration_otp_verified');
    return saved ? JSON.parse(saved) : false;
  });
  const schema = makeRegisterValidation(activeStep);
  const methods = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: (() => {
      const savedValues = localStorage.getItem('registration_form_values');
      const parsedValues = savedValues ? JSON.parse(savedValues) : {};

      return {
        // Company Info defaults
        entity_name: parsedValues.entity_name || formData?.companyInfo?.entity_name || '',
        entity_type: parsedValues.entity_type || formData?.companyInfo?.entity_type || '',
        fein: parsedValues.fein || formData?.companyInfo?.fein || '',
        address_line_1: parsedValues.address_line_1 || formData?.companyInfo?.address_line_1 || '',
        address_line_2: parsedValues.address_line_2 || formData?.companyInfo?.address_line_2 || '',
        city: parsedValues.city || formData?.companyInfo?.city || '',
        state: parsedValues.state || formData?.companyInfo?.state || 'NY',
        zip_code: parsedValues.zip_code || formData?.companyInfo?.zip_code || '',
        phone_number: parsedValues.phone_number || formData?.companyInfo?.phone_number || '',
        nys_unemployment_registration_number:
          parsedValues.nys_unemployment_registration_number ||
          formData?.companyInfo?.nys_unemployment_registration_number ||
          '',

        // User Info defaults
        first_name: parsedValues.first_name || formData?.userInfo?.first_name || '',
        last_name: parsedValues.last_name || formData?.userInfo?.last_name || '',
        email_address: parsedValues.email_address || formData?.userInfo?.email_address || '',
        role_title: parsedValues.role_title || formData?.userInfo?.role_title || '',

        // Payroll Info defaults
        pay_frequency:
          parsedValues.pay_frequency || formData?.payrollInfo?.pay_frequency || 'weekly',
        pay_period: parsedValues.pay_period || formData?.payrollInfo?.pay_period || '',
        payroll_start_date:
          parsedValues.payroll_start_date || formData?.payrollInfo?.payroll_start_date || '',
        check_number: parsedValues.check_number || formData?.payrollInfo?.check_number || '',

        // Terms defaults
        terms_service: parsedValues.terms_service || false,
        privacy_policy: parsedValues.privacy_policy || false,
        data_processing_agreement: parsedValues.data_processing_agreement || false,
      };
    })(),
  });

  // Save form values to localStorage whenever they change
  useEffect(() => {
    const subscription = methods.watch((formValues) => {
      localStorage.setItem('registration_form_values', JSON.stringify(formValues));
    });

    return () => subscription.unsubscribe();
  }, [methods]);

  // Save verification states to localStorage
  useEffect(() => {
    localStorage.setItem('registration_user_verified', JSON.stringify(isUserVerified));
    localStorage.setItem('registration_otp_verified', JSON.stringify(isOtpVerified));
  }, [isUserVerified, isOtpVerified]);

  const handleSubmit = useCallback(async () => {
    const formDataValues = methods.getValues();
    await onSubmit(formDataValues);
  }, [methods, onSubmit]);

  const {
    formState: { errors },
  } = methods;

  // Disable Next button conditions:
  // 1. On UserInfo step if user is not verified or OTP is not verified
  // 2. On Summary step if terms are not accepted
  const isNextDisabled = activeStep === StepIndex.UserInfo && (!isUserVerified || !isOtpVerified);

  // Disable Back button on first step
  const isBackDisabled = activeStep === StepIndex.CompanyInfo;

  // Change button text on final step
  const isSubmitStep = activeStep === StepIndex.Summary;
  const isDisableSubmit =
    isSubmitStep &&
    (!methods.watch('terms_service') ||
      !methods.watch('privacy_policy') ||
      !methods.watch('data_processing_agreement'));

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
            onSubmit={onSubmit}
          />

          <Stack direction="row" justifyContent="space-between">
            <Button variant="outlined" onClick={onBack} disabled={isBackDisabled}>
              Back
            </Button>
            {activeStep === 1 && (
              <Button
                variant="contained"
                type="submit"
                disabled={isNextDisabled || (isSubmitStep && isDisableSubmit)}
                color={isSubmitStep ? 'success' : 'primary'}
              >
                {isSubmitStep ? 'Submit Registration' : 'Next'}
              </Button>
            )}
          </Stack>
        </Stack>
      </Scrollbar>
    </Form>
  );
};

export default RegistrationForm;
