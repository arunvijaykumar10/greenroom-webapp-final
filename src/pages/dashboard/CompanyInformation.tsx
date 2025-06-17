import { useForm, FormProvider } from 'react-hook-form';

import { 
  Box, 
  Grid,
  Card
} from "@mui/material";

import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import type { CompanyFormData } from './types';

const ENTITY_TYPES = ['Corp', 'Partnership', 'Sole Proprietor', 'Non Profit', 'Single-member LLC'];
const STATES = ['NY','US'];

const CompanyInformation = () => {
  const methods = useForm<CompanyFormData>({
    defaultValues: {
      entityName: '',
      entityType: '',
      fein: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'NY',
      zipCode: '',
      phoneNumber: '',
      nysUnemploymentNumber: ''
    }
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: CompanyFormData) => {
    console.log('Form submitted:', data);
  };

  return (
    <Box sx={{ p: 2 }}>

      
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField 
                  name="entityName" 
                  label="Entity Name" 
                  required
                  inputProps={{ maxLength: 64 }} 
                  helperText="Legal name of the production (max 64 characters)"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFAutocomplete 
                  options={ENTITY_TYPES} 
                  name="entityType" 
                  label="Entity Type" 
                  slotProps={{
                    textfield: {
                      sx: { '& .MuiOutlinedInput-root': { borderRadius: 1 } }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField 
                  name="fein" 
                  label="FEIN" 
                  required
                  placeholder="99-9999999" 
                  helperText="Format: 99-9999999"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
             
              <Grid item xs={12}>
                <RHFTextField 
                  name="addressLine1" 
                  label="Address Line 1" 
                  required
                  inputProps={{ maxLength: 64 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <RHFTextField 
                  name="addressLine2" 
                  label="Address Line 2" 
                  inputProps={{ maxLength: 64 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField 
                  name="city" 
                  label="City" 
                  required
                  inputProps={{ maxLength: 24 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <RHFAutocomplete 
                  options={STATES} 
                  name="state" 
                  label="State" 
                  slotProps={{
                    textfield: {
                      sx: { '& .MuiOutlinedInput-root': { borderRadius: 1 } }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <RHFTextField 
                  name="zipCode" 
                  label="Zip Code" 
                  required
                  placeholder="12345" 
                  helperText="5-digit NY zip code"
                  inputProps={{ maxLength: 5 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField 
                  name="phoneNumber" 
                  label="Phone Number" 
                  required
                  placeholder="(999)-999-9999" 
                  helperText="Format: (999)-999-9999"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="nysUnemploymentNumber"
                  label="NYS Unemployment Registration Number"
                  required
                  placeholder="9999999"
                  helperText="7-digit Employer Account Number"
                  inputProps={{ maxLength: 7 }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                />
              </Grid>
              
            </Grid>
          </Card>
        </Box>
      </FormProvider>
    </Box>
  );
};

export default CompanyInformation;