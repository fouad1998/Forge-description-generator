import { invoke, requestJira, view } from "@forge/bridge";
import ForgeReconciler, {
  Box,
  LoadingButton,
  Text,
  useProductContext,
} from "@forge/react";
import React, { useState } from "react";

type Ticket = {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
  };
};
async function getTicket(ticketId: string) {
  const request = await requestJira("/rest/api/3/issue/" + ticketId);
  return (await request.json()) as Ticket;
}

async function updateTicket(ticketId: string, description: string) {
  await requestJira("/rest/api/3/issue/" + ticketId, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        description: {
          type: "doc",
          version: 1,
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: description,
                },
              ],
            },
          ],
        },
      },
    }),
  });
}

const App = () => {
  const [isLoading, setLoading] = useState(false);

  const context = useProductContext();

  function onClick() {
    if (!context) {
      return;
    }

    const issueId = context.extension.issue.id;
    setLoading(true);
    getTicket(issueId)
      .then((ticket) => {
        return invoke<string>("getText", { query: ticket.fields.summary });
      })
      .then((description) => {
        return updateTicket(issueId, description);
      })
      .then(() => view.refresh())
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Box padding="space.100">
        <Text>Generate a description for your ticket by your title</Text>
      </Box>

      <LoadingButton isLoading={isLoading} onClick={onClick}>
        Generate
      </LoadingButton>
    </>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
