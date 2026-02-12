"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { DEFAULT_LETTERS, getLetterData } from "@/lib/letters";
import { LetterSelector } from "@/components/letter-selector";
import { LetterDisplay } from "@/components/letter-display";
import { Loader } from "lucide-react";

const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

type DisplayContent = {
  key: string;
  type: "letter" | "message";
  value: string;
  color?: string;
};

export default function Home() {
  const [selectedLetters, setSelectedLetters] = useLocalStorage<string[]>(
    "peek-a-letter-selection",
    DEFAULT_LETTERS
  );

  const [lettersInCycle, setLettersInCycle] = useState<string[]>([]);

  const availableLetters = useMemo(() => {
    return selectedLetters.length > 0 ? selectedLetters : [];
  }, [selectedLetters]);
  
  const getInitialLetter = () => {
    const letter = availableLetters.length > 0 ? availableLetters[0] : 'a';
    const data = getLetterData(letter);
    return {
      key: "initial",
      type: "letter" as const,
      value: letter,
      color: data?.color,
    }
  }

  const [displayContent, setDisplayContent] = useState<DisplayContent>(getInitialLetter());
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setLettersInCycle([]);
  }, [availableLetters]);

  useEffect(() => {
    if (availableLetters.length === 0) {
      setDisplayContent((prev) =>
        prev.value !== "Choose some letters in the menu!"
          ? {
              key: "no-letters",
              type: "message",
              value: "Choose some letters in the menu!",
            }
          : prev
      );
    } else if (
      displayContent.type === "letter" &&
      !availableLetters.includes(displayContent.value)
    ) {
      const firstLetter = availableLetters[0];
      const data = getLetterData(firstLetter);
      setDisplayContent({
        key: "update-from-selection",
        type: "letter",
        value: firstLetter,
        color: data?.color,
      });
    }
  }, [availableLetters, displayContent]);

  const showNextContent = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);

    if (availableLetters.length === 0) {
      setDisplayContent({
        key: "no-letters-msg",
        type: "message",
        value: "Choose some letters in the menu!",
      });
      setTimeout(() => setIsLoading(false), 1000);
      return;
    }

    let currentCycle = lettersInCycle;
    if (currentCycle.length === 0) {
      currentCycle = shuffle([...availableLetters]);
    }
    
    const newLetter = currentCycle[0];
    const newCycle = currentCycle.slice(1);
    setLettersInCycle(newCycle);

    const letterData = getLetterData(newLetter);

    setDisplayContent({
      key: Date.now().toString(),
      type: "letter",
      value: newLetter,
      color: letterData?.color,
    });

    setTimeout(() => setIsLoading(false), 1000);
  }, [isLoading, availableLetters, lettersInCycle, setLettersInCycle]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        showNextContent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showNextContent]);

  return (
    <main
      className="flex h-svh w-screen cursor-pointer items-center justify-center bg-background overflow-hidden relative focus:outline-none"
      onClick={showNextContent}
      tabIndex={-1}
    >
      <LetterDisplay content={displayContent} />
      <LetterSelector
        selectedLetters={selectedLetters}
        setSelectedLetters={setSelectedLetters}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader className="h-16 w-16 animate-spin text-primary" />
        </div>
      )}
    </main>
  );
}
