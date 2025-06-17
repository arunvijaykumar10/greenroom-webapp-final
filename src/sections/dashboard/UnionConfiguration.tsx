import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';

import { 
  Box, 
  Card, 
  Grid,
  Button,
  Typography
} from '@mui/material';

import { useDispatch, useSelector } from 'src/redux/store';
import { saveUnionConfiguration } from 'src/redux/slice/formData';

import { RHFTextField, RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';

import type { AgreementType, UnionConfigurationData } from './types';

const UNION_OPTIONS = [
  { label: 'Non-Union', value: 'Non-Union' },
  { label: 'Union', value: 'Union' }
];
const UNIONS = ["Actor's Equity Association"];
const AGREEMENT_OPTIONS: AgreementType[] = [
  'Equity/League Production Contract',
  'Off-Broadway Agreement',
  'Development Agreement (Work Session)',
  '29 Hour Reading',
];
const MUSICAL_OR_DRAMATIC_OPTIONS = ['Musical', 'Dramatic'];
const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'];

export default function UnionConfiguration() {
  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.formData.unionConfiguration);
  
  const methods = useForm<UnionConfigurationData>({
    defaultValues: savedData || {
      unionStatus: 'Non-Union',
      union: '',
      agreementType: '',
      musicalOrDramatic: '',
      tier: '',
      aeaEmployerId: '',
      aeaProductionTitle: '',
      aeaBusinessRep: '',
    }
  });

  const { watch, setValue, reset } = methods;
  
  const unionStatus = watch('unionStatus');
  const union = watch('union');
  const agreementType = watch('agreementType');
  
  // Reset dependent fields when unionStatus changes
  useEffect(() => {
    if (unionStatus === 'Non-Union') {
      reset({
        ...methods.getValues(),
        union: '',
        agreementType: '',
        musicalOrDramatic: '',
        tier: '',
        aeaEmployerId: '',
        aeaProductionTitle: '',
        aeaBusinessRep: '',
      });
    }
  }, [unionStatus, reset, methods]);
  
  // Reset dependent fields when union changes
  useEffect(() => {
    if (union !== "Actor's Equity Association") {
      reset({
        ...methods.getValues(),
        agreementType: '',
        musicalOrDramatic: '',
        tier: '',
        aeaEmployerId: '',
        aeaProductionTitle: '',
        aeaBusinessRep: '',
      });
    }
  }, [union, reset, methods]);
  
  // Reset dependent fields when agreementType changes
  useEffect(() => {
    reset({
      ...methods.getValues(),
      musicalOrDramatic: '',
      tier: '',
    });
  }, [agreementType, reset, methods]);
  
  const showUnionField = unionStatus === 'Union';
  const showAgreementField = unionStatus === 'Union' && union === "Actor's Equity Association";
  const showMusicalOrDramatic = 
    agreementType === 'Equity/League Production Contract' || 
    agreementType === 'Off-Broadway Agreement';
  const showTier = agreementType === 'Development Agreement (Work Session)';
  const showAEAFields = 
    unionStatus === 'Union' && 
    union === "Actor's Equity Association" && 
    agreementType !== '29 Hour Reading';

  const onSubmit = (data: UnionConfigurationData) => {
    dispatch(saveUnionConfiguration(data));
    console.log('Form submitted:', data);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Union Configuration</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure union settings for your production.
      </Typography>
      
      <FormProvider {...methods}>
        <Box component="form" onSubmit={methods.handleSubmit(onSubmit)}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFRadioGroup
                  name="unionStatus"
                  label="Is this a union production?"
                  options={UNION_OPTIONS}
                  row
                />
              </Grid>
              
              {showUnionField && (
                <Grid item xs={12}>
                  <RHFAutocomplete
                    name="union"
                    label="Union"
                    placeholder="Select a union"
                    options={UNIONS}
                    slotProps={{
                      textfield: { fullWidth: true }
                    }}
                  />
                </Grid>
              )}
              
              {showAgreementField && (
                <Grid item xs={12}>
                  <RHFAutocomplete
                    name="agreementType"
                    label="Agreement Type"
                    placeholder="Select an agreement type"
                    options={AGREEMENT_OPTIONS}
                    slotProps={{
                      textfield: { fullWidth: true, required: true }
                    }}
                  />
                </Grid>
              )}
              
              {showMusicalOrDramatic && (
                <Grid item xs={12}>
                  <RHFAutocomplete
                    name="musicalOrDramatic"
                    label="Musical or Dramatic"
                    placeholder="Select type"
                    options={MUSICAL_OR_DRAMATIC_OPTIONS}
                    slotProps={{
                      textfield: { fullWidth: true }
                    }}
                  />
                </Grid>
              )}
              
              {showTier && (
                <Grid item xs={12}>
                  <RHFAutocomplete
                    name="tier"
                    label="Tier"
                    placeholder="Select tier"
                    options={TIER_OPTIONS}
                    slotProps={{
                      textfield: { fullWidth: true }
                    }}
                  />
                </Grid>
              )}
              
              {showAEAFields && (
                <>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="aeaEmployerId"
                      label="AEA Employer ID"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="aeaProductionTitle"
                      label="AEA Production Title"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RHFTextField
                      name="aeaBusinessRep"
                      label="AEA Business Representative"
                    />
                  </Grid>
                </>
              )}
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                  >
                    Save Union Configuration
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Box>
      </FormProvider>
    </Box>
  );
}