import { createListCollection } from "@chakra-ui/react";

export const statusCollection = createListCollection({
    items: [
      { label: "Active", value: "Active" },
      { label: "Temporary Leave", value: "Temporary Leave" },
      { label: "Relieved", value: "Relieved" }
    ]
  });