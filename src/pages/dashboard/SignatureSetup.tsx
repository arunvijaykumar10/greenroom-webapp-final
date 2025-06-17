import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

import { 
  Box, 
  Card, 
  Stack,
  Radio,
  Button,
  FormLabel,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel
} from '@mui/material';

import type { SignaturePolicy, SignatureMethod } from './types';


export default function SignatureSetup() {
  const [signaturePolicy, setSignaturePolicy] = useState<SignaturePolicy>('single');
  const [sig1Method, setSig1Method] = useState<SignatureMethod>('');
  const [sig2Method, setSig2Method] = useState<SignatureMethod>('');

  const [sig1File, setSig1File] = useState<File | null>(null);
  const [sig2File, setSig2File] = useState<File | null>(null);
  
  const sig1PadRef = useRef<SignatureCanvas>(null);
  const sig2PadRef = useRef<SignatureCanvas>(null);

  const handlePolicyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as SignaturePolicy;
    setSignaturePolicy(value);
    if (value === 'single') {
      setSig2Method('');
      setSig2File(null);
    }
  };

  const handleSig1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSig1File(file);
    setSig1Method('upload');
  };

  const handleSig2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSig2File(file);
    setSig2Method('upload');
  };

  const handleDraw = (signatureNum: 1 | 2) => {
    if (signatureNum === 1) {
      setSig1Method('draw');
      setSig1File(null);
    } else {
      setSig2Method('draw');
      setSig2File(null);
    }
  };

  const handleClear = (pad: SignatureCanvas | null) => {
    pad?.clear();
  };
  
  const handleSaveSignature = () => {
    // Example of how to get the signature data as base64 image
    const sig1Data = sig1Method === 'draw' ? sig1PadRef.current?.getTrimmedCanvas().toDataURL('image/png') : null;
    const sig2Data = sig2Method === 'draw' ? sig2PadRef.current?.getTrimmedCanvas().toDataURL('image/png') : null;
    
    console.log('Signature 1:', sig1Data);
    console.log('Signature 2:', sig2Data);
    // Here you would typically save these signatures to your backend
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Signature Setup</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure signature settings for your documents.
      </Typography>
      
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <FormControl>
            <FormLabel>Signature Policy</FormLabel>
            <RadioGroup row value={signaturePolicy} onChange={handlePolicyChange}>
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="Single Signature"
              />
              <FormControlLabel
                value="double"
                control={<Radio />}
                label="Double Signature"
              />
            </RadioGroup>
          </FormControl>

          {/* Signature 1 */}
          <Box>
            <Typography variant="h6">Signature 1</Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" component="label">
                Upload Signature
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSig1Upload}
                />
              </Button>
              <Button variant="outlined" onClick={() => handleDraw(1)}>
                Draw Signature
              </Button>
            </Stack>

            {sig1Method === 'upload' && sig1File && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Uploaded: {sig1File.name}
              </Typography>
            )}

            {sig1Method === 'draw' && (
              <Box sx={{ mt: 2 }}>
                <Box sx={{ border: '1px solid #ccc', backgroundColor: '#fff', mb: 1 }}>
                  <SignatureCanvas
                    ref={sig1PadRef}
                    penColor="black"
                    canvasProps={{
                      width: 400,
                      height: 150,
                      className: 'sigCanvas',
                    }}
                  />
                </Box>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleClear(sig1PadRef.current)}
                >
                  Clear
                </Button>
              </Box>
            )}
          </Box>

          {/* Signature 2 */}
          {signaturePolicy === 'double' && (
            <Box>
              <Typography variant="h6">Signature 2</Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" component="label">
                  Upload Signature
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleSig2Upload}
                  />
                </Button>
                <Button variant="outlined" onClick={() => handleDraw(2)}>
                  Draw Signature
                </Button>
              </Stack>

              {sig2Method === 'upload' && sig2File && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Uploaded: {sig2File.name}
                </Typography>
              )}

              {sig2Method === 'draw' && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ border: '1px solid #ccc', backgroundColor: '#fff', mb: 1 }}>
                    <SignatureCanvas
                      ref={sig2PadRef}
                      penColor="black"
                      canvasProps={{
                        width: 400,
                        height: 150,
                        className: 'sigCanvas',
                      }}
                    />
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => handleClear(sig2PadRef.current)}
                  >
                    Clear
                  </Button>
                </Box>
              )}
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleSaveSignature}
            >
              Save Signature Settings
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}