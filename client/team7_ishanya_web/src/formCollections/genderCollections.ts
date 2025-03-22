import { createListCollection } from "@chakra-ui/react";

export const genderCollection = createListCollection({
    items: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" }
    ]
});