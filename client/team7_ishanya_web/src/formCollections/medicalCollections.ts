import { createListCollection } from "@chakra-ui/react";

// Primary Diagnosis Collection
export const primaryDiagnosisCollection = createListCollection({
    items: [
      { label: "Autism Spectrum Disorder (ASD)", value: "Autism Spectrum Disorder (ASD)" },
      { label: "Mild ASD", value: "Mild ASD" },
      { label: "Learning Disability (LD)", value: "Learning Disability (LD)" },
      { label: "Down Syndrome", value: "Down Syndrome" },
      { label: "Intellectual Disability (ID)", value: "Intellectual Disability (ID)" },
      { label: "Muscular Dystrophy", value: "Muscular Dystrophy" },
      { label: "Slow Learner", value: "Slow Learner" },
      { label: "ADHD", value: "ADHD" },
      { label: "Global Developmental Delay (GDD)", value: "Global Developmental Delay (GDD)" },
      { label: "Mild MR", value: "Mild MR" },
      { label: "Mild CP", value: "Mild CP" },
      { label: "Delayed Milestones", value: "Delayed Milestones" },
      { label: "Speech Delay", value: "Speech Delay" }
    ]
  });
  
  // Comorbidity Collection
  export const comorbidityCollection = createListCollection({
    items: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" }
    ]
  });