import { useForm, FormProvider } from 'react-hook-form';

import { 
  Card, 
  Stack, 
  MenuItem, 
  Typography 
} from '@mui/material';

import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const payFrequencies = ["Weekly", "Bi-weekly", "Monthly"];
const payPeriods = ["Current", "1 week in arrears", "2 weeks in arrears"];

// ----------------------------------------------------------------------

export default function PayrollAndTaxes() {
  const methods = useForm({
    defaultValues: {
      payFrequency: "",
      payPeriod: "",
      payScheduleStart: "",
      timesheetDue: "",
      checkNumber: "",
    }
  });

  const { handleSubmit } = methods;

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Typography variant="h6">Payroll & Taxes Configuration</Typography>

            <RHFSelect name="payFrequency" label="Pay Frequency">
              {payFrequencies.map((freq) => (
                <MenuItem key={freq} value={freq}>
                  {freq}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFSelect name="payPeriod" label="Pay Period">
              {payPeriods.map((period) => (
                <MenuItem key={period} value={period}>
                  {period}
                </MenuItem>
              ))}
            </RHFSelect>

            <RHFTextField
              name="payScheduleStart"
              label="Pay Schedule Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="timesheetDue"
              label="Timesheet Due Date"
              type="date"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="checkNumber"
              label="Check Number"
            />
          </Stack>
        </Card>
      </form>
    </FormProvider>
  );
}