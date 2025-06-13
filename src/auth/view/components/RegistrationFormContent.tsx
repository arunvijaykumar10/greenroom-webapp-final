import { useFormContext } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import React, { useState, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Alert, Divider, IconButton, Typography, InputAdornment } from '@mui/material';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Field, RHFCheckbox, RHFTextField, RHFDatePicker, RHFAutocomplete } from 'src/components/hook-form';

import { StepIndex } from 'src/auth/types';
import { FormHead } from 'src/auth/components/form-head';
import { signUp, confirmSignUp } from 'src/auth/context';

// Constants
const ENTITY_TYPES = ['Corp', 'Partnership', 'Sole Proprietor', 'Non Profit', 'Single-member LLC'];
const STATES = ['NY'];
const PAY_FREQUENCIES = ['weekly', 'bi-weekly'];
const PAY_PERIODS = ['in arrears', 'same week'];
const ROLES = ['Producer', 'Director', 'Production Manager', 'Accountant', 'Other'];

interface RegistrationFormContentProps {
  activeStep: StepIndex;
  setIsUserVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isUserVerified: boolean;
  setIsOtpVerified: React.Dispatch<React.SetStateAction<boolean>>;
  isOtpVerified: boolean;
  formData?: any;
}

const RegistrationFormContent: React.FC<RegistrationFormContentProps> = ({
  activeStep,
  isUserVerified,
  setIsUserVerified,
  setIsOtpVerified,
  isOtpVerified,
  formData,
}) => {
  const showPassword = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState({
    terms: false,
    privacy: false,
    dataProcessing: false
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const methods = useFormContext();

  const handleSignUp = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const formValues = methods.getValues();

      await signUp({
        username: formValues.email_address,
        password: formValues.password,
        firstName: formValues.first_name,
        lastName: formValues.last_name,
        middleName: formValues.middle_name,
      });

      setIsUserVerified(true);

    } catch (error) {
      console.error('Error signing up user:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to create account. Please try again.';

      // Check for common Cognito errors
      if (errorMsg.includes('already exists')) {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else if (errorMsg.includes('password') || errorMsg.includes('Password')) {
        methods.setError('password', {
          type: 'manual',
          message: errorMsg
        });
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [methods, setIsUserVerified, setErrorMessage]);

  const handleOtpVerification = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const formValues = methods.getValues();
      // Get email from session storage or form values
      const email = formValues.email_address;

      await confirmSignUp({
        username: email,
        confirmationCode: formValues.code,
      });

      setIsOtpVerified(true);
      sessionStorage.setItem('otpVerified', 'true');

      // Clear any previous errors
      methods.clearErrors('code');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMsg = error instanceof Error ? error.message : 'Invalid verification code. Please try again.';

      // Check for specific OTP errors
      if (errorMsg.includes('expired')) {
        setErrorMessage('Verification code has expired. Please request a new code.');
      } else if (errorMsg.includes('not found') || errorMsg.includes('Invalid verification')) {
        methods.setError('code', {
          type: 'manual',
          message: 'Invalid verification code. Please check and try again.'
        });
      } else {
        methods.setError('code', {
          type: 'manual',
          message: errorMsg
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [methods, setIsOtpVerified, setErrorMessage]);

  const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted({
      ...termsAccepted,
      [event.target.name]: event.target.checked
    });
  };

  const renderCompanyInfoStep = () => (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Company Information</Typography>
      <RHFTextField
        name="entity_name"
        label="Entity Name *"
        inputProps={{ maxLength: 64 }}
      />
      <RHFAutocomplete
        options={ENTITY_TYPES}
        name="entity_type"
        label="Entity Type *"
      />
      <RHFTextField
        name="fein"
        label="FEIN"
        placeholder="99-9999999"
      />
      <RHFTextField
        name="address_line_1"
        label="Address Line 1"
        inputProps={{ maxLength: 64 }}
      />
      <RHFTextField
        name="address_line_2"
        label="Address Line 2"
        inputProps={{ maxLength: 64 }}
      />
      <RHFTextField
        name="city"
        label="City"
        inputProps={{ maxLength: 24 }}
      />
      <RHFAutocomplete
        options={STATES}
        name="state"
        label="State"
        defaultValue="NY"
      />
      <RHFTextField
        name="zip_code"
        label="Zip Code"
        placeholder="12345"
      />
      <RHFTextField
        name="phone_number"
        label="Phone Number"
        placeholder="(999)-999-9999"
      />
      <RHFTextField
        name="nys_unemployment_registration_number"
        label="NYS Unemployment Registration Number"
        placeholder="9999999"
      />
    </Stack>
  );

  const renderUserInfoStep = () => (
    <Stack spacing={3}>
      <Typography variant="subtitle1">Administrator Information</Typography>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Field.Text
          name="first_name"
          label="First name *"
        />
        <Field.Text
          name="middle_name"
          label="Middle name"
        />

        <Field.Text
          name="last_name"
          label="Last name *"
        />
      </Box>

      <Field.Text
        name="email_address"
        label="Email address *"
        error={!!methods.formState.errors.email_address}
        helperText={methods.formState.errors.email_address?.message?.toString()}
      />

      <RHFAutocomplete
        options={ROLES}
        name="role_title"
        label="Role / Title"
      />

      <Field.Text
        name="password"
        label="Password *"
        required
        placeholder="6+ characters"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {!isUserVerified && (
        <>
          {errorMessage && (
            <Alert severity="error" onClose={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          )}
          <LoadingButton
            fullWidth
            color="inherit"
            size="large"
            variant="contained"
            onClick={handleSignUp}
            loading={isSubmitting}
            loadingIndicator="Creating account..."
          >
            Confirm
          </LoadingButton>
        </>
      )}

      {isUserVerified && !isOtpVerified && (
        <>
          <FormHead
            icon={<EmailInboxIcon />}
            title="Please check your email!"
            description={`We've emailed a 6-digit confirmation code to ${sessionStorage.getItem('userEmail') || methods.getValues().email_address}. \nPlease enter the code in the box below to verify your email.`}
          />
          <Field.Code
            name="code"
          />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <LoadingButton
              fullWidth
              size="large"
              variant="outlined"
              onClick={() => {
                const email = sessionStorage.getItem('userEmail') || methods.getValues().email_address;
                import('src/auth/context').then(({ resendSignUpCode }) => {
                  resendSignUpCode({ username: email });
                });
              }}
            >
              Resend Code
            </LoadingButton>

            <LoadingButton
              fullWidth
              size="large"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Verifying..."
              onClick={handleOtpVerification}
              disabled={!methods.watch('code')}
            >
              Verify
            </LoadingButton>
          </Stack>
        </>
      )}
    </Stack>
  );

  const renderPayrollStep = () => (
    <Stack spacing={2}>
      <Typography variant="subtitle1">Payroll Information</Typography>
      <RHFAutocomplete
        name="pay_frequency"
        label="Pay Frequency"
        options={PAY_FREQUENCIES}
        defaultValue="weekly"
        helperText="Payroll's pay schedule frequency"
      />
      <RHFAutocomplete
        name="pay_period"
        label="Pay Period"
        options={PAY_PERIODS}
        helperText="The indication of the period being paid"
      />
      <RHFDatePicker
        name="payroll_start_date"
        label="Payroll Start Date"
      />
      <RHFTextField
        name="check_number"
        label="Check Number"
        type="number"
        helperText="Checks will be sequentially numbered starting this number"
        inputProps={{ min: 1 }}
      />
    </Stack>
  );

  const renderSummaryStep = () => {
    if (!formData) return null;

    const { companyInfo, userInfo, payrollInfo } = formData;

    return (
      <Stack spacing={3}>
        <Typography variant="h6">Registration Summary</Typography>

        <Box>
          <Typography variant="subtitle1" gutterBottom>Company Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Typography variant="body2"><strong>Entity Name:</strong> {companyInfo?.entity_name}</Typography>
            <Typography variant="body2"><strong>Entity Type:</strong> {companyInfo?.entity_type}</Typography>
            {companyInfo?.fein && <Typography variant="body2"><strong>FEIN:</strong> {companyInfo.fein}</Typography>}

            {companyInfo?.address_line_1 && (
              <>
                <Typography variant="body2"><strong>Address:</strong></Typography>
                <Typography variant="body2">{companyInfo.address_line_1}</Typography>
                {companyInfo?.address_line_2 && <Typography variant="body2">{companyInfo.address_line_2}</Typography>}
                <Typography variant="body2">{companyInfo?.city}, {companyInfo?.state} {companyInfo?.zip_code}</Typography>
              </>
            )}

            {companyInfo?.phone_number && <Typography variant="body2"><strong>Phone:</strong> {companyInfo.phone_number}</Typography>}
            {companyInfo?.nys_unemployment_registration_number && (
              <Typography variant="body2">
                <strong>NYS Unemployment Registration:</strong> {companyInfo.nys_unemployment_registration_number}
              </Typography>
            )}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>Administrator Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Typography variant="body2">
              <strong>Name:</strong> {userInfo?.first_name} {userInfo?.last_name}
            </Typography>
            <Typography variant="body2"><strong>Email:</strong> {userInfo?.email_address}</Typography>
            {userInfo?.role_title && <Typography variant="body2"><strong>Role:</strong> {userInfo.role_title}</Typography>}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle1" gutterBottom>Payroll Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1}>
            <Typography variant="body2"><strong>Pay Frequency:</strong> {payrollInfo?.pay_frequency}</Typography>
            <Typography variant="body2"><strong>Pay Period:</strong> {payrollInfo?.pay_period}</Typography>
            <Typography variant="body2">
              <strong>Payroll Start Date:</strong> {new Date(payrollInfo?.payroll_start_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2"><strong>Check Number:</strong> {payrollInfo?.check_number}</Typography>
          </Stack>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Terms and Agreements</Typography>
          <Divider sx={{ mb: 2 }} />

          <RHFCheckbox name='terms_service' label={
            <Typography variant="body2">
              I agree to the <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>Terms of Service</Typography>
            </Typography>
          } />
          <RHFCheckbox name='privacy_policy' label={
            <Typography variant="body2">
              I agree to the <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>Privacy Policy</Typography>
            </Typography>
          } />
          <RHFCheckbox name='data_processing_agreement' label={
            <Typography variant="body2">
              I consent to the <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>Data Processing Agreement</Typography>
            </Typography>
          } />
        </Box>
      </Stack>
    );
  };

  switch (activeStep) {
    case StepIndex.CompanyInfo:
      return renderCompanyInfoStep();
    case StepIndex.UserInfo:
      return renderUserInfoStep();
    case StepIndex.Payroll:
      return renderPayrollStep();
    case StepIndex.Summary:
      return renderSummaryStep();
    default:
      return null;
  }
};

export default RegistrationFormContent;
