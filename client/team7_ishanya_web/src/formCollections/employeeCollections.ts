import { createListCollection } from "@chakra-ui/react";

// Employee form collections
export const designationCollection = createListCollection({
  items: [
    { label: "Founder", value: "Founder" },
    { label: "Co-Founder", value: "Co-Founder" },
    { label: "Program Director", value: "Program Director" },
    { label: "Manager - Communications & Operations", value: "Manager - Communications & Operations" },
    { label: "Program Associate", value: "Program Associate" },
    { label: "Program Manager", value: "Program Manager" },
    { label: "Program Intern", value: "Program Intern" },
    { label: "Jnr Program Associate", value: "Jnr Program Associate" },
    { label: "Admin Associate", value: "Admin Associate" }
  ]
});

export const departmentCollection = createListCollection({
  items: [
    { label: "Management", value: "Management" },
    { label: "Admin", value: "Admin" },
    { label: "Special Education", value: "Special Education" },
    { label: "Design", value: "Design" }
  ]
});

export const employmentTypeCollection = createListCollection({
  items: [
    { label: "Trustee", value: "Trustee" },
    { label: "FTE", value: "FTE" },
    { label: "FTC", value: "FTC" },
    { label: "Intern", value: "Intern" }
  ]
});