import { fetch } from "@forge/api";
import Resolver from "@forge/resolver";

const TOKEN = "";

const resolver = new Resolver();

type Response = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

resolver.define("getText", async (req) => {
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate description for jira issue ticket by the following title: "${req.payload.query}"`,
        },
      ],
      temperature: "0.7",
    }),
  });
  const chat = (await response.json()) as Response;

  // For simplicity, we will return a static response
  // to avoid making an API call to OpenAI as we do not have a valid API key
  // you call uncomment the below line and comment the below line to use the OpenAI API if you have a valid API key

  // return chat.choices[0].message.content;

  return "This Jira issue aims to implement a sign-up page functionality that enables users to easily create an account on our platform. The sign-up page will provide a seamless experience for new users, guiding them through the process of entering their necessary information such as username, email, password, and any additional required details. Additionally, the page will incorporate validation checks to ensure data accuracy and security. By creating this sign-up page, we aim to enhance user onboarding, improve accessibility, and expand our user base.";
});

export const handler = resolver.getDefinitions();
