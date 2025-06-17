import { z } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import { 
  Box, 
  Card, 
  Grid,
  Button
} from '@mui/material';

import { saveBankSetup } from 'src/redux/slice/formData';
import { useDispatch, useSelector } from 'src/redux/store';

import { RHFSelect, RHFCheckbox, RHFTextField } from 'src/components/hook-form';

import type { BankData, AccountType, BankSetupData } from './types';

const bankList: BankData[] = [
  {
    name: "Bank of America",
    routingACH: "011000138",
    routingWire: "026009593",
  },
  { name: "Wells Fargo", routingACH: "121000248", routingWire: "121000248" },
  { name: "Chase", routingACH: "021000021", routingWire: "021000021" },
];

const accountTypes: AccountType[] = ["Checking", "Savings"];

// Form validation schema
const BankSetupSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  routingACH: z.string()
    .min(1, 'Routing number (ACH) is required')
    .regex(/^\d{9}$/, 'Must be 9 digits'),
  routingWire: z.string()
    .min(1, 'Routing number (Wire) is required')
    .regex(/^\d{9}$/, 'Must be 9 digits'),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .regex(/^\d+$/, 'Must contain only digits'),
  confirmAccountNumber: z.string()
    .min(1, 'Please confirm account number'),
  accountType: z.string().min(1, 'Account type is required'),
  authorize: z.boolean().refine(val => val === true, 'You must authorize to proceed')
});

export default function BankSetup() {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [isManualBank, setIsManualBank] = useState(false);

  const methods = useForm<BankSetupData>({
    resolver: zodResolver(BankSetupSchema),
    defaultValues: {
      bankName: '',
      routingACH: '',
      routingWire: '',
      accountNumber: '',
      confirmAccountNumber: '',
      accountType: '',
      authorize: false,
    }
  });

  const { setValue, watch, handleSubmit, reset } = methods;

  // Handle bank selection
  const handleBankSelect = (value: string) => {
    setSelectedBank(value);
    
    if (value === 'Enter Manually') {
      setIsManualBank(true);
      reset({
        ...methods.getValues(),
        bankName: '',
        routingACH: '',
        routingWire: '',
      });
    } else {
      const bank = bankList.find((b) => b.name === value);
      if (bank) {
        setIsManualBank(false);
        setValue('bankName', bank.name);
        setValue('routingACH', bank.routingACH);
        setValue('routingWire', bank.routingWire);
      } else {
        setIsManualBank(true);
        setValue('bankName', value);
        setValue('routingACH', '');
        setValue('routingWire', '');
      }
    }
  };

  const dispatch = useDispatch();
  const savedData = useSelector((state) => state.formData.bankSetup);

  const onSubmit = (data: BankSetupData) => {
    dispatch(saveBankSetup(data));
    console.log('Form submitted:', data);
  };

  return (
    <Box sx={{ p: 2 }}>
   
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFSelect
                  name="selectedBank"
                  label="Select Bank or Enter Manually"
                  value={selectedBank}
                  onChange={(e) => handleBankSelect(e.target.value)}
                >
                  <option value="" disabled>Select a bank</option>
                  {bankList.map((bank) => (
                    <option key={bank.name} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                  <option value="Enter Manually">Enter Manually</option>
                </RHFSelect>
              </Grid>
              
              <Grid item xs={12}>
                <RHFTextField
                  name="bankName"
                  label="Bank Name"
                  disabled={!isManualBank}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="routingACH"
                  label="Routing Number (ACH)"
                  disabled={!isManualBank}
                  inputProps={{ 
                    maxLength: 9,
                    onPaste: (e: React.ClipboardEvent) => e.preventDefault() 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="routingWire"
                  label="Routing Number (Wire)"
                  disabled={!isManualBank}
                  inputProps={{ 
                    maxLength: 9,
                    onPaste: (e: React.ClipboardEvent) => e.preventDefault() 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="accountNumber"
                  label="Account Number"
                  inputProps={{ 
                    inputMode: 'numeric',
                    onPaste: (e: React.ClipboardEvent) => e.preventDefault() 
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <RHFTextField
                  name="confirmAccountNumber"
                  label="Confirm Account Number"
                  inputProps={{ 
                    inputMode: 'numeric',
                    onPaste: (e: React.ClipboardEvent) => e.preventDefault() 
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <RHFSelect
                  name="accountType"
                  label="Account Type"
                >
                  <option value="" disabled>Select account type</option>
                  {accountTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>
              
              <Grid item xs={12}>
                <RHFCheckbox
                  name="authorize"
                  label="I authorize credit/debit transactions for this account"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    size="large"
                  >
                    Save Bank Information
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