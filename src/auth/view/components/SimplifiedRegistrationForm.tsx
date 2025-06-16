import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Stack, Alert, IconButton, Typography, InputAdornment } from '@mui/material';

import { EmailInboxIcon } from 'src/assets/icons';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { Form, Field, RHFCheckbox, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { signUp, confirmSignUp } from 'src/auth/context';
import { FormHead } from 'src/auth/components/form-head';

// Constants
const ENTITY_TYPES = ['Corp', 'Partnership', 'Sole Proprietor', 'Non Profit', 'Single-member LLC'];

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Validation schema
const registrationSchema = z
  .object({
    entity_name: z.string().min(1, 'Entity name is required'),
    entity_type: z.string().min(1, 'Entity type is required'),
    first_name: z.string().min(1, 'First name is required'),
    middle_name: z.string().min(1, 'Middle name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email_address: z.string().email('Invalid email address'),
    password: z.string().regex(passwordRegex, {
      message:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
    }),
    confirm_password: z.string().min(6, 'Confirm password must match your password'),
    terms_and_conditions: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms of service',
    }),
    privacy_policy: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match!',
    path: ['confirm_password'],
  });

interface FormProps {
  onSubmit: (data: any) => Promise<void>;
  formData?: any;
}

export const SimplifiedRegistrationForm = ({ onSubmit, formData }: FormProps) => {
  const showPassword = useBoolean();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUserVerified, setIsUserVerified] = useState(() => {
    const saved = localStorage.getItem('registration_user_verified');
    return saved ? JSON.parse(saved) : false;
  });
  const [isOtpVerified, setIsOtpVerified] = useState(() => {
    const saved = localStorage.getItem('registration_otp_verified');
    return saved ? JSON.parse(saved) : false;
  });

  const methods = useForm({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: (() => {
      const savedValues = localStorage.getItem('registration_form_values');
      const parsedValues = savedValues ? JSON.parse(savedValues) : {};

      return {
        entity_name: parsedValues.entity_name || formData?.companyInfo?.entity_name || '',
        entity_type: parsedValues.entity_type || formData?.companyInfo?.entity_type || '',
        first_name: parsedValues.first_name || formData?.userInfo?.first_name || '',
        last_name: parsedValues.last_name || formData?.userInfo?.last_name || '',
        middle_name: parsedValues.middle_name || formData?.userInfo?.middle_name || '',
        email_address: parsedValues.email_address || formData?.userInfo?.email_address || '',
        password: parsedValues.password || '',
        terms_and_condition: parsedValues.terms_and_conditions || false,
        privacy_policy: parsedValues.privacy_policy || false,
        code: '',
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
        companyName: formValues.entity_name,
        companyType: formValues.entity_type,
      });

      setIsUserVerified(true);
    } catch (error) {
      console.error('Error signing up user:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to create account. Please try again.';

      if (errorMsg.includes('already exists')) {
        setErrorMessage('An account with this email already exists. Please sign in instead.');
      } else if (errorMsg.includes('password') || errorMsg.includes('Password')) {
        methods.setError('password', {
          type: 'manual',
          message: errorMsg,
        });
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [methods]);

  const handleOtpVerification = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const formValues = methods.getValues();
      const email = formValues.email_address;

      await confirmSignUp({
        username: email,
        confirmationCode: formValues.code,
      });

      setIsOtpVerified(true);
      await onSubmit(formValues);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'Invalid verification code. Please try again.';

      if (errorMsg.includes('expired')) {
        setErrorMessage('Verification code has expired. Please request a new code.');
      } else if (errorMsg.includes('not found') || errorMsg.includes('Invalid verification')) {
        methods.setError('code', {
          type: 'manual',
          message: 'Invalid verification code. Please check and try again.',
        });
      } else {
        methods.setError('code', {
          type: 'manual',
          message: errorMsg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [methods, onSubmit]);

  const renderRegistrationForm = () => (
    <Stack spacing={3}>
      <Typography variant="h6">Company Information</Typography>
      <RHFTextField name="entity_name" label="Entity Name *" />
      <RHFAutocomplete options={ENTITY_TYPES} name="entity_type" label="Entity Type *" />

      <Typography variant="h6" sx={{ mt: 2 }}>
        User Information
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 3, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Field.Text name="first_name" label="First name *" />
        <Field.Text name="middle_name" label="Middle name *" />
        <Field.Text name="last_name" label="Last name *" />
      </Box>

      <Field.Text name="email_address" label="Email address *" />

      <Field.Text
        name="password"
        label="Password *"
        required
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
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

      <Field.Text
        name="confirm_password"
        label="Confirm Password *"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
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

      <Stack
        direction="row"
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <RHFCheckbox
          name="terms_and_conditions"
          label={<Typography variant="body2">Terms and Conditions</Typography>}
        />
        <Box>
          <IconButton>
            <Iconify icon="mdi-package-down" />
          </IconButton>
        </Box>
      </Stack>
      <Stack
        direction="row"
        sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <RHFCheckbox
          name="privacy_policy"
          label={<Typography variant="body2">Privacy Policy</Typography>}
        />
        <IconButton>
          <Iconify icon="mdi-package-down" />
        </IconButton>
      </Stack>

      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}

      <LoadingButton
        fullWidth
        color="primary"
        size="large"
        variant="contained"
        onClick={handleSignUp}
        loading={isSubmitting}
        loadingIndicator="Creating account..."
        disabled={!methods.formState.isValid}
      >
        Register
      </LoadingButton>
    </Stack>
  );

  const renderOtpVerification = () => (
    <Stack spacing={3}>
      <FormHead
        icon={<EmailInboxIcon />}
        title="Please check your email!"
        description={`We've emailed a 6-digit confirmation code to ${methods.getValues().email_address}. \nPlease enter the code in the box below to verify your email.`}
      />
      <Field.Code name="code" />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <LoadingButton
          fullWidth
          size="large"
          variant="outlined"
          onClick={() => {
            const email = methods.getValues().email_address;
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
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Scrollbar>
        <Stack spacing={3} py={3}>
          {!isUserVerified && renderRegistrationForm()}
          {isUserVerified && !isOtpVerified && renderOtpVerification()}
        </Stack>
      </Scrollbar>
    </Form>
  );
};

export default SimplifiedRegistrationForm;
