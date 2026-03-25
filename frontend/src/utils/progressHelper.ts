// Helper to calculate overall progress through the E-KYC flow
export const getStepProgress = (pathname: string): { step: number; total: number; percentage: number; label: string } => {
  const steps = [
    { path: '/login', label: 'Login & Consent' },
    { path: '/liveness', label: 'Liveness & Deepfake Check' },
    { path: '/pan-ocr', label: 'PAN OCR Extraction' },
    { path: '/signature', label: 'Signature Processing' },
    { path: '/voice-form', label: 'Voice Form Filling' },
    { path: '/fraud-detection', label: 'Document Fraud Detection' },
    { path: '/risk-scoring', label: 'Risk Scoring & Decision' },
    { path: '/confirmation', label: 'User Confirmation' },
  ];

  const currentStepIndex = steps.findIndex(step => step.path === pathname);
  const stepNumber = currentStepIndex === -1 ? 0 : currentStepIndex + 1;
  const totalSteps = steps.length;
  const percentage = Math.round((stepNumber / totalSteps) * 100);

  return {
    step: stepNumber,
    total: totalSteps,
    percentage,
    label: currentStepIndex === -1 ? '' : steps[currentStepIndex].label
  };
};