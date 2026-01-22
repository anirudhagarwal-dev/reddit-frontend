import { createContext, useContext } from "react";

export const RedditContext = createContext();

export function useReddit() {
  return useContext(RedditContext);
}

