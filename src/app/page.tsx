"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Languages, Loader2, ArrowRightLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  translateIndonesianSundanese,
  type TranslateIndonesianSundaneseInput,
  type TranslateIndonesianSundaneseOutput,
} from "@/ai/flows/translate-indonesian-sundanese";

const formSchema = z.object({
  inputText: z.string().min(1, { message: "Please enter text to translate." }),
  sourceLanguage: z.enum(["indonesian", "sundanese"], {
    required_error: "Please select a language.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function BasaTranslatorPage() {
  const [outputText, setOutputText] = React.useState<string>("");
  const [isTranslating, setIsTranslating] = React.useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputText: "",
      sourceLanguage: "indonesian",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsTranslating(true);
    setOutputText("");
    try {
      const result: TranslateIndonesianSundaneseOutput =
        await translateIndonesianSundanese({
          text: data.inputText,
          sourceLanguage: data.sourceLanguage,
        });
      setOutputText(result.translation);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        variant: "destructive",
        title: "Translation Failed",
        description:
          "An error occurred while translating. Please try again later.",
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    const currentSourceLanguage = form.getValues("sourceLanguage");
    const currentInputText = form.getValues("inputText");
    const currentOutputText = outputText;

    const newSourceLanguage = currentSourceLanguage === "indonesian" ? "sundanese" : "indonesian";
    
    form.setValue("sourceLanguage", newSourceLanguage);
    form.setValue("inputText", currentOutputText);
    setOutputText(currentInputText);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background">
      <Card className="w-full max-w-2xl shadow-2xl rounded-xl">
        <CardHeader className="text-center p-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
            <Languages className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            BASA TRANSLATOR
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
          Terjemahan Bahasa Indonesia ke Sundanese dengan Mudah
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                <FormField
                  control={form.control}
                  name="sourceLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isTranslating}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select source language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="indonesian">Indonesian</SelectItem>
                          <SelectItem value="sundanese">Sundanese</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={swapLanguages} 
                  className="mb-1 self-end text-primary hover:text-primary/80 disabled:text-muted-foreground"
                  aria-label="Swap languages"
                  disabled={isTranslating}
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </Button>

                <FormItem>
                  <FormLabel>To</FormLabel>
                   <Select value={form.watch("sourceLanguage") === "indonesian" ? "sundanese" : "indonesian"} disabled>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="indonesian">Indonesian</SelectItem>
                       <SelectItem value="sundanese">Sundanese</SelectItem>
                    </SelectContent>
                   </Select>
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="inputText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Kata Anda</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter text to translate..."
                        className="min-h-[120px] resize-y rounded-md shadow-sm focus:ring-primary focus:border-primary"
                        {...field}
                        disabled={isTranslating}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md py-3 text-base font-semibold shadow-md transition-all duration-150 ease-in-out hover:shadow-lg active:scale-[0.98]"
                disabled={isTranslating}
              >
                {isTranslating ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : null}
                {isTranslating ? "Translating..." : "Translate"}
              </Button>

              <FormItem>
                <FormLabel>Terjemahan</FormLabel>
                <Textarea
                  readOnly
                  value={outputText}
                  placeholder="Translation will appear here..."
                  className="min-h-[120px] resize-y rounded-md bg-muted/50 border-muted shadow-sm"
                  disabled={isTranslating}
                />
              </FormItem>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="p-6 text-center text-xs text-muted-foreground">
          Dibuat Oleh BBC TEAM - Pemrograman Bahasa Alami
        </CardFooter>
      </Card>
    </main>
  );
}
