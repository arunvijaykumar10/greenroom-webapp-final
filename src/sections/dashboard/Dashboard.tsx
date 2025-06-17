import { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import { 
  Box, 
  Step, 
  Card, 
  Paper, 
  alpha, 
  Button,
  Stepper,
  Container,
  StepLabel,
  Typography,
  StepConnector,
  stepConnectorClasses
} from "@mui/material";

import { resetFormData } from 'src/redux/slice/formData';
import { useDispatch, useSelector } from 'src/redux/store';

import BankSetup from './BankSetup';
import InviteAdmin from './InviteAdmin';
import SendToReview from './SendToReview';
import SignatureSetup from './SignatureSetup';
import PayrollAndTaxes from './PayrollAndTaxes';
import { Iconify } from '../../components/iconify';
import CompanyInformation from './CompanyInformation';
import UnionConfiguration from './UnionConfiguration';
import CustomChartOfAccounts from './CustomChartOfAccounts';

// Custom connector with line connecting steps
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 4,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : alpha(theme.palette.grey[500], 0.2),
    borderRadius: 4,
  },
}));

// Custom step icon
const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : alpha(theme.palette.grey[500], 0.2),
  zIndex: 1,
  color: theme.palette.text.secondary,
  width: 48,
  height: 48,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  transition: theme.transitions.create(['background-color', 'box-shadow', 'color']),
  ...(ownerState.active && {
    color: theme.palette.common.white,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: `0 8px 16px 0 ${alpha(theme.palette.primary.main, 0.24)}`,
  }),
  ...(ownerState.completed && {
    color: theme.palette.common.white,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  }),
}));

function ColorlibStepIcon(props: any) {
  const { active, completed, className, icon } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <Iconify icon="mdi:office-building" width={24} />,
    2: <Iconify icon="mdi:account-group" width={24} />,
    3: <Iconify icon="mdi:bank" width={24} />,
    4: <Iconify icon="mdi:signature" width={24} />,
    5: <Iconify icon="mdi:cash-register" width={24} />,
    6: <Iconify icon="mdi:file-document-check" width={24} />,
    7: <Iconify icon="mdi:chart-bar" width={24} />,
    8: <Iconify icon="mdi:account-plus" width={24} />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}

// Styled component for step content wrapper
const StepContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.neutral,
  transition: theme.transitions.create('opacity'),
}));

export default function Dashboard() {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<{[k: number]: boolean}>({});
  
  const formData = useSelector((state) => state.formData);
  
  // Mark steps as completed based on saved data
  useEffect(() => {
    const newCompleted = { ...completed };
    
    if (formData.companyInformation) newCompleted[0] = true;
    if (formData.unionConfiguration) newCompleted[1] = true;
    if (formData.bankSetup) newCompleted[2] = true;
    if (formData.signatureSetup) newCompleted[3] = true;
    if (formData.payrollAndTaxes) newCompleted[4] = true;
    
    setCompleted(newCompleted);
  }, [formData]);

  const steps = [
    {
      label: 'Company Information',
      component: <CompanyInformation />
    },
    {
      label: 'Union Configuration',
      component: <UnionConfiguration />
    },
    {
      label: 'Bank Setup',
      component: <BankSetup />
    },
    {
      label: 'Signature Setup',
      component: <SignatureSetup /> 
    },
    {
      label: 'Payroll & Taxes',
      component: <PayrollAndTaxes />
    },  
    {
      label: 'Send to Review',
      component: <SendToReview />
    },
    {
      label: 'Custom Chart of Accounts',
      component: <CustomChartOfAccounts />
    },
    {
      label: 'Invite Admin',
      component: <InviteAdmin />
    }
  ];

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
    dispatch(resetFormData());
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Card sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Onboarding Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Complete the following steps to set up your account
        </Typography>
      </Card>

      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          connector={<ColorlibConnector />}
          sx={{ 
            py: 3,
            px: { xs: 0, md: 5 },
            overflowX: 'auto',
            '& .MuiStepLabel-label': {
              mt: 1.5,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.secondary',
              '&.Mui-active': {
                color: 'primary.main',
              },
              '&.Mui-completed': {
                color: 'primary.dark',
              }
            }
          }}
        >
          {steps.map((step, index) => (
            <Step key={step.label} completed={completed[index]}>
              <StepLabel 
                StepIconComponent={ColorlibStepIcon}
                onClick={handleStep(index)}
                sx={{ cursor: 'pointer' }}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          {activeStep === steps.length ? (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: (theme) => alpha(theme.palette.primary.lighter, 0.2)
              }}
            >
              <Iconify 
                icon="eva:checkmark-circle-2-fill" 
                color="success.main" 
                width={80} 
                height={80} 
                sx={{ mb: 3, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.16))' }} 
              />
              <Typography variant="h5" sx={{ mb: 1 }}>All steps completed - you&apos;re finished</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your account setup is complete. You can now start using all features.
              </Typography>
              <Button 
                onClick={handleReset} 
                variant="contained" 
                size="large"
                startIcon={<Iconify icon="eva:refresh-fill" />}
              >
                Start Over
              </Button>
            </Paper>
          ) : (
            <>
              <StepContentWrapper>
                {steps[activeStep].component}
              </StepContentWrapper>
              
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3 }}>
                <Button
                  variant="outlined"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, px: 3 }}
                  startIcon={<Iconify icon="eva:arrow-back-fill" />}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button 
                  onClick={handleNext} 
                  variant="contained"
                  size="large"
                  sx={{ px: 3 }}
                  endIcon={<Iconify icon={activeStep === steps.length - 1 ? "eva:checkmark-fill" : "eva:arrow-forward-fill"} />}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Continue'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
}