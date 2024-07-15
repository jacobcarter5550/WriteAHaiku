// src/components/MultiStepForm.js
import React, { useState } from 'react';
import Step1 from './step1.tsx';
import Step2 from './step1.tsx';
import Step3 from './step1.tsx';
import Step4 from './step1.tsx';
import Step5 from './step1.tsx';


// Import other steps similarly

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  switch (step) {
    case 1:
      return <Step1 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    case 2:
      return <Step2 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    case 3:
      return <Step3 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    case 4:
        return <Step4 formData={formData} setFormData={setFormData} nextStep={nextStep} />
    case 5:
        return <Step5 formData={formData} setFormData={setFormData} nextStep={nextStep} />;
    // Add other cases for steps 2 to 5
    default:
      return <div>Step not found</div>;
  }
};

export default MultiStepForm;
