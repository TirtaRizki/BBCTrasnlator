'use server';
/**
 * @fileOverview Machine translation flow between Indonesian and Sundanese.
 *
 * - translateIndonesianSundanese - A function that handles the translation process.
 * - TranslateIndonesianSundaneseInput - The input type for the translateIndonesianSundanese function.
 * - TranslateIndonesianSundaneseOutput - The return type for the translateIndonesianSundanese function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateIndonesianSundaneseInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  sourceLanguage: z.enum(['indonesian', 'sundanese']).describe('The source language of the text.'),
});
export type TranslateIndonesianSundaneseInput = z.infer<typeof TranslateIndonesianSundaneseInputSchema>;

const TranslateIndonesianSundaneseOutputSchema = z.object({
  translation: z.string().describe('The translated text.'),
  targetLanguage: z.enum(['indonesian', 'sundanese']).describe('The target language of the translation.'),
});
export type TranslateIndonesianSundaneseOutput = z.infer<typeof TranslateIndonesianSundaneseOutputSchema>;

export async function translateIndonesianSundanese(
  input: TranslateIndonesianSundaneseInput
): Promise<TranslateIndonesianSundaneseOutput> {
  return translateIndonesianSundaneseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateIndonesianSundanesePrompt',
  input: {schema: TranslateIndonesianSundaneseInputSchema},
  output: {schema: TranslateIndonesianSundaneseOutputSchema},
  prompt: `You are a machine translation expert specializing in translating between Indonesian and Sundanese.

  Translate the following text from {{sourceLanguage}} to {{#ifEquals sourceLanguage "indonesian"}}sundanese{{else}}indonesian{{/ifEquals}}.

  Text: {{{text}}}

  Translation:`, 
  helpers: {
    ifEquals: function (arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

const translateIndonesianSundaneseFlow = ai.defineFlow(
  {
    name: 'translateIndonesianSundaneseFlow',
    inputSchema: TranslateIndonesianSundaneseInputSchema,
    outputSchema: TranslateIndonesianSundaneseOutputSchema,
  },
  async input => {
    const targetLanguage = input.sourceLanguage === 'indonesian' ? 'sundanese' : 'indonesian';
    const {output} = await prompt({...input, targetLanguage});
    return {
      translation: output!.translation,
      targetLanguage: targetLanguage as 'indonesian' | 'sundanese',
    };
  }
);
