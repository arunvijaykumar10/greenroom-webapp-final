import React from 'react';

import { Card, Grid, Stack, Alert, Divider, Typography } from '@mui/material';

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

export default function SendToReview() {
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
    </Card>
  );
}