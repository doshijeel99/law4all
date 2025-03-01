export const NODE_SERVER_URL = `${process.env.NODE_SERVER}/api`;
export const AI_SERVER_URL =
  `${process.env.NEXT_PUBLIC_AI_SERVER_URL}`;

export const USER_REGISTER_ROUTE = `${NODE_SERVER_URL}/auth/register`;
export const CHATBOT_ROUTE = `${AI_SERVER_URL}/ai-chatbot`
