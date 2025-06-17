import React, { useState } from 'react';
import { keyframes } from '@emotion/react';

import { 
  Box, 
  Card, 
  Grid, 
  Zoom, 
  Grow, 
  Stack, 
  Alert, 
  Paper,
  Button,
  Dialog,
  Avatar,
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';

import { useSelector } from 'src/redux/store';

const renderField = (label: string, value?: string | boolean) => (
  <Grid item xs={12} sm={6}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1">
      {value !== undefined && value !== "" ? String(value) : "-"}
    </Typography>
  </Grid>
);

// Define animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function SendToReview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    companyInformation, 
    unionConfiguration, 
    bankSetup, 
    signatureSetup, 
    payrollAndTaxes 
  } = useSelector((state) => state.formData);

  const hasCompanyInfo = !!companyInformation;
  const hasUnionConfig = !!unionConfiguration;
  const hasBankSetup = !!bankSetup;
  const hasSignatureSetup = !!signatureSetup;
  const hasPayrollSetup = !!payrollAndTaxes;
  
  const handleSendReview = () => {
    setIsSubmitting(true);
    
    // Simulate submission with delay
    setTimeout(() => {
      setIsSubmitting(false);
      setOpenDialog(true);
      
      // Close dialog automatically after 5 seconds
      setTimeout(() => {
        setOpenDialog(false);
      }, 5000);
    }, 1000);
    
    // Additional logic for sending review can be added here
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Card sx={{ maxWidth: 900, margin: 'auto', p: 2 }}>
      <Stack spacing={1} sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6">Setup Summary</Typography>
      </Stack>
      
      {(!hasCompanyInfo && !hasUnionConfig && !hasBankSetup && !hasSignatureSetup && !hasPayrollSetup) && (
        <Alert severity="info" sx={{ mx: 3, mb: 3 }}>
          No information has been saved yet. Please complete the previous steps to see your data here.
        </Alert>
      )}
      
      <Stack spacing={3} sx={{ p: 3 }}>
        {/* Company Information */}
        {hasCompanyInfo && (
          <div>
            <Typography variant="h6" gutterBottom>
              Company Information
            </Typography>
            <Grid container spacing={2}>
              {renderField("Entity Name", companyInformation.entityName)}
              {renderField("Entity Type", companyInformation.entityType)}
              {renderField("FEIN", companyInformation.fein)}
              {renderField("NYS Unemployment No", companyInformation.nysUnemploymentNumber)}
              {renderField("Address Line 1", companyInformation.addressLine1)}
              {renderField("Address Line 2", companyInformation.addressLine2)}
              {renderField("City", companyInformation.city)}
              {renderField("State", companyInformation.state)}
              {renderField("Zip Code", companyInformation.zipCode)}
              {renderField("Phone", companyInformation.phoneNumber)}
            </Grid>
          </div>
        )}

        {hasCompanyInfo && hasUnionConfig && <Divider />}

        {/* Union Configuration */}
        {hasUnionConfig && (
          <div>
            <Typography variant="h6" gutterBottom>
              Union Configuration
            </Typography>
            <Grid container spacing={2}>
              {renderField("Union Status", unionConfiguration.unionStatus)}
              {renderField("Union", unionConfiguration.union)}
              {renderField("Agreement Type", unionConfiguration.agreementType)}
              {renderField("Production Type", unionConfiguration.musicalOrDramatic)}
              {renderField("Tier", unionConfiguration.tier)}
              {renderField("Employer ID", unionConfiguration.aeaEmployerId)}
              {renderField("Production Title", unionConfiguration.aeaProductionTitle)}
              {renderField("Business Rep", unionConfiguration.aeaBusinessRep)}
            </Grid>
          </div>
        )}

        {hasUnionConfig && hasBankSetup && <Divider />}

        {/* Bank Account */}
        {hasBankSetup && (
          <div>
            <Typography variant="h6" gutterBottom>
              Bank Account
            </Typography>
            <Grid container spacing={2}>
              {renderField("Bank Name", bankSetup.bankName)}
              {renderField("Routing Number (ACH)", bankSetup.routingACH)}
              {renderField("Routing Number (Wire)", bankSetup.routingWire)}
              {renderField("Account Number", bankSetup.accountNumber)}
              {renderField("Account Type", bankSetup.accountType)}
              {renderField("Authorized Transactions", bankSetup.authorize ? "Yes" : "No")}
            </Grid>
          </div>
        )}

        {hasBankSetup && hasSignatureSetup && <Divider />}

        {/* Signature Configuration */}
        {hasSignatureSetup && (
          <div>
            <Typography variant="h6" gutterBottom>
              Signature Configuration
            </Typography>
            <Grid container spacing={2}>
              {renderField("Signature Policy", signatureSetup.signaturePolicy)}
              {renderField("Signature 1 Method", signatureSetup.sig1Method)}
              {renderField("Signature 2 Method", signatureSetup.sig2Method || "N/A")}
            </Grid>
          </div>
        )}

        {hasSignatureSetup && hasPayrollSetup && <Divider />}

        {/* Payroll Setup */}
        {hasPayrollSetup && (
          <div>
            <Typography variant="h6" gutterBottom>
              Payroll Setup
            </Typography>
            <Grid container spacing={2}>
              {renderField("Pay Frequency", payrollAndTaxes.payFrequency)}
              {renderField("Pay Period", payrollAndTaxes.payPeriod)}
              {renderField("Schedule Start", payrollAndTaxes.payScheduleStart)}
              {renderField("Timesheet Due", payrollAndTaxes.timesheetDue)}
              {renderField("Check Number", payrollAndTaxes.checkNumber)}
            </Grid>
          </div>
        )}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSendReview}
          disabled={isSubmitting}
          sx={{
            position: 'relative',
            animation: isSubmitting ? 'none' : `${pulse} 2s infinite ease-in-out`,
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Review'}
        </Button>
      </Box>
      
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="review-dialog-title"
        aria-describedby="review-dialog-description"
        maxWidth="md"
        fullWidth
        TransitionComponent={Zoom}
        transitionDuration={500}
        PaperProps={{
          elevation: 24,
          sx: { 
            borderRadius: 2,
            p: 1,
            overflowY: 'visible'
          }
        }}
      >
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
            overflow: 'visible'
          }}
        >
          <Grow in={openDialog} timeout={800}>
            <Avatar 
              sx={{ 
                bgcolor: 'success.main', 
                width: 80, 
                height: 80, 
                mx: 'auto',
                mb: 2,
                animation: `${spin} 1s ease-out`
              }}
            />
          </Grow>
          
          <DialogTitle 
            id="review-dialog-title"
            sx={{ 
              fontSize: 28, 
              fontWeight: 'bold',
              mb: 2,
              animation: `${fadeIn} 0.8s ease-out`,
              animationDelay: '0.3s',
              animationFillMode: 'both'
            }}
          >
            Review Submission Successful
          </DialogTitle>
          
          <DialogContent sx={{ overflow: 'hidden' }}>
            <DialogContentText 
              id="review-dialog-description"
              sx={{ textAlign: 'center' }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: 'text.primary',
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: '0.5s',
                  animationFillMode: 'both'
                }}
              >
                Thank you for your submission!
              </Typography>
              
              <Typography 
                paragraph 
                sx={{ 
                  fontSize: 18, 
                  mt: 2,
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: '0.7s',
                  animationFillMode: 'both'
                }}
              >
                Your review request has been successfully submitted to our team.
              </Typography>
              
              <Typography 
                paragraph 
                sx={{ 
                  fontSize: 20, 
                  fontWeight: 'medium',
                  color: 'primary.main',
                  p: 2,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  borderRadius: 1,
                  backgroundColor: 'primary.lighter',
                  mt: 3,
                  animation: `${pulse} 2s infinite ease-in-out`,
                  animationDelay: '1s',
                  animationFillMode: 'both'
                }}
              >
                Please wait for 3 working days for the approval.
              </Typography>
              
              <Typography 
                paragraph
                sx={{ 
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: '1.2s',
                  animationFillMode: 'both'
                }}
              >
                Our team will review your information and get back to you as soon as possible.
              </Typography>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 3,
                  animation: `${fadeIn} 0.8s ease-out`,
                  animationDelay: '1.5s',
                  animationFillMode: 'both'
                }}
              >
                This window will close automatically in 5 seconds.
              </Typography>
            </DialogContentText>
          </DialogContent>
        </Paper>
      </Dialog>
    </Card>
  );
}