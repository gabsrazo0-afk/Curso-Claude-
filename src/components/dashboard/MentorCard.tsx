"use client";

import { Bot, MessageCircleQuestion } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mentorName } from "@/content/mentor";
import { mentor } from "@/lib/mentor-store";

export function MentorCard() {
  return (
    <Card aria-labelledby="mentor-titulo">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary-ink">
          <Bot className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="mentor-titulo" className="font-semibold tracking-tight">
            ¿Necesitas ayuda?
          </h2>
          <p className="text-sm text-fg-muted">{mentorName}, tu mentora, te guía.</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted">
        Pistas adaptadas a la pantalla en la que estás, preguntas frecuentes y el siguiente paso recomendado.
      </p>
      <Button
        variant="secondary"
        className="mt-4 w-full"
        onClick={mentor.open}
        aria-haspopup="dialog"
        icon={<MessageCircleQuestion className="size-4" aria-hidden="true" />}
      >
        Hablar con {mentorName}
      </Button>
    </Card>
  );
}
