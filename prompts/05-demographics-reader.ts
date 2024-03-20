const authorDemo = `sex: male; age: 26; race: white; social-status: upper-class; education: bachelor's degree; occupation: software engineer`;

/**
 * This is more experimental, but it's well documented that demographics can influence the way people write and speak (for example, in job descriptions: https://www.paycor.com/resource-center/articles/are-your-job-descriptions-driving-away-talent-with-unconscious-gender-bias/)
 * This prompt attempts to see, if given the demographics of the reader, the AI can rewrite the passage to be noticeably more comprehensible.
 *
 * I understand this may produce problematic results and expose the bias of the underlying AI, but I think that too is important to observe and study.
 *
 * @attribute Demographics
 */
export const prompt = `
Here is the demographic information of the author: ${authorDemo}

Given this information, rewrite the passage to be easier for the reader to comprehend.
`;
