// src/components/Step1.js
import React from 'react';
import { TextInput, Button } from 'carbon-components-react';

const Step1 = ({ formData, setFormData, nextStep }) => {
  return (
    <div className="bx--form-item">
      <h3>Personal Information</h3>
      <TextInput
        id="first-name"
        labelText="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
      />
      <TextInput
        id="last-name"
        labelText="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
      />
      <TextInput
        id="email"
        labelText="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <TextInput
        id="phone"
        labelText="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <Button onClick={nextStep}>Next</Button>
    </div>
  );
};

export default Step1;
