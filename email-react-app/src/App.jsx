import { useState } from 'react';
import './App.css';
import {
  Box,
  Container,
  InputLabel,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [emailTone, setEmailTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:8080/api/emails/generate',
        { emailContent, emailTone }
      );
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (error) {
      setError(
        'Something went wrong. Failed to generate the reply. Please try again later.'
      );
      console.error('Error generating reply:', error);
    } finally {
      setLoading(false);
    }
  }; // ✅ closed handleSubmit properly here

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom color='black'>
        Email Reply Generator
      </Typography>
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth
          multiline
          minRows={4}
          variant="outlined"
          label="Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={emailTone || ''}
            label="Tone (Optional)"
            onChange={(e) => setEmailTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Concise">Concise</MenuItem>
            <MenuItem value="Sarcastic">Sarcastic</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Generate the reply'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
<FormControl fullWidth sx={{ mt: 2 }}>
      {generatedReply && (
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc' }}>
          <Typography variant="h6" gutterBottom color='black'>
            Generated Reply:
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            value={generatedReply || ''}
            InputProps={{ readOnly: true }}
          />
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy To Clipboard
          </Button>
        </Box>
      )}
      </FormControl>
    </Container>
  );
}

export default App; // ✅ outside everything
