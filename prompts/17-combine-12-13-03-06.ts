import { prompt as prompt12 } from "./prompts/12-role-teacher";
import { prompt as prompt13 } from "./prompts/13-transpile-bulletpoints";
import { prompt as prompt3 } from "./prompts/03-writing-technical-improve";
import { prompt as prompt6 } from "./prompts/06-simplify-college";

/**
 * Took a few of my favorite prompts and naively smashed them into one.
 *
 * @attribute Combination
 */
export const prompt = [prompt12, prompt13, prompt3, prompt6].join(
  "\n\n---\n\n"
);
