"use client";

import { useState } from "react";
import { CircleCheck, CircleX } from "lucide-react";
import type { QuizQuestion } from "@/content/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { renderInline } from "./inline";

type Feedback = Record<string, boolean>;

interface QuizProps {
  questions: QuizQuestion[];
  onPassed: () => void;
  submitLabel: string;
}

/** Comprobación final: todas las respuestas deben ser correctas para completar la misión. */
export function Quiz({ questions, onPassed, submitLabel }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Feedback>({});
  const [attempted, setAttempted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id]);
  const wrongCount = Object.values(feedback).filter((ok) => !ok).length;

  function select(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    // Al cambiar la respuesta, se borra su corrección anterior.
    setFeedback((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }

  function check() {
    const result: Feedback = {};
    for (const q of questions) result[q.id] = answers[q.id] === q.correctOptionId;
    setFeedback(result);
    setAttempted(true);
    if (Object.values(result).every(Boolean)) onPassed();
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (allAnswered) check();
      }}
      className="space-y-6"
    >
      {questions.map((question, index) => {
        const result = feedback[question.id];
        const answered = result !== undefined;
        return (
          <fieldset key={question.id} className="space-y-3">
            <legend className="font-semibold text-fg">
              <span className="mr-2 font-mono text-sm text-primary-ink">
                {index + 1}/{questions.length}
              </span>
              {question.prompt}
            </legend>
            <div className="space-y-2">
              {question.options.map((option) => {
                const checked = answers[question.id] === option.id;
                return (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary",
                      checked && !answered && "border-primary bg-primary-soft",
                      checked && answered && result && "border-accent bg-accent-soft",
                      checked && answered && !result && "border-danger-ink/60 bg-danger-soft",
                      !checked && "border-border bg-surface hover:border-border-strong",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={checked}
                      onChange={() => select(question.id, option.id)}
                      className="size-4 accent-[var(--primary-fill)] focus:outline-none"
                    />
                    <span className="text-fg">{option.label}</span>
                  </label>
                );
              })}
            </div>
            <div aria-live="polite">
              {answered && (
                <p
                  className={cn(
                    "flex items-start gap-2 rounded-xl px-3 py-2 text-sm",
                    result ? "bg-accent-soft text-fg" : "bg-danger-soft text-fg",
                  )}
                >
                  {result ? (
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent-ink" aria-hidden="true" />
                  ) : (
                    <CircleX className="mt-0.5 size-4 shrink-0 text-danger-ink" aria-hidden="true" />
                  )}
                  <span>
                    <strong className="font-semibold">{result ? "¡Correcto! " : "Todavía no. "}</strong>
                    {result ? renderInline(question.explanation) : "Revisa los pasos anteriores y prueba otra opción."}
                  </span>
                </p>
              )}
            </div>
          </fieldset>
        );
      })}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={!allAnswered}>
          {submitLabel}
        </Button>
        <p className="text-sm text-fg-muted" aria-live="polite">
          {!allAnswered
            ? "Responde todas las preguntas para continuar."
            : attempted && wrongCount > 0
              ? `${wrongCount === 1 ? "Hay 1 respuesta" : `Hay ${wrongCount} respuestas`} por revisar.`
              : ""}
        </p>
      </div>
    </form>
  );
}
