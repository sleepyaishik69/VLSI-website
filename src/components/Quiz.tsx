"use client";

import React, { useState } from "react";
import { vlsiTopics } from "../data/vlsiTopics";
import styles from "./Quiz.module.css";

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  const questions = vlsiTopics.map((topic) => ({
    topicTitle: topic.title,
    ...topic.quickReview,
  }));

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === currentQuestion.answerIdx) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextClick = () => {
    setSelectedIdx(null);
    setIsAnswered(false);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setScore(0);
    setIsAnswered(false);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    let verdict = "";
    let description = "";

    if (percentage === 100) {
      verdict = "Silicon Architect Master Class! 🏆";
      description = "Perfect score! You fully understand the entire VLSI design pipeline, from device physics to tape-out. You are ready to design the next generation of processors.";
    } else if (percentage >= 70) {
      verdict = "Solid Design Engineer! ⚡";
      description = "Great job! You have a firm grasp of VLSI fundamentals, timing margins, and manufacturing. A little refinement on the physical verification or physics side and you're set.";
    } else {
      verdict = "Apprentice Chip Designer 🛠️";
      description = "You're off to a good start, but semiconductor engineering takes time. Review the topic guides, play with the timing and CMOS simulators, and try again!";
    }

    return (
      <div className={`${styles.resultCard} glass`}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreVal}>{score}</span>
          <span className={styles.scoreTotal}>/ {questions.length}</span>
        </div>
        <h3 className={styles.resultVerdict}>{verdict}</h3>
        <p className={styles.resultText}>{description}</p>
        <button onClick={handleRestart} className={styles.restartButton}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles.quizContainer} glass`}>
      <div className="flex justify-between items-center w-full">
        <h3 className={styles.title}>
          <span>⚡</span> IC Design Challenge
        </h3>
        <span className={styles.progress}>
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      <p className={styles.question}>
        <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>
          Context: {currentQuestion.topicTitle}
        </span>
        {currentQuestion.question}
      </p>

      <div className={styles.optionsGrid}>
        {currentQuestion.options.map((option, idx) => {
          let btnClass = styles.optionButton;
          if (isAnswered) {
            if (idx === currentQuestion.answerIdx) {
              btnClass += ` ${styles.correct}`;
            } else if (idx === selectedIdx) {
              btnClass += ` ${styles.incorrect}`;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={btnClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={styles.explanation}>
          <strong>
            {selectedIdx === currentQuestion.answerIdx
              ? "✓ Correct!"
              : `✗ Incorrect (Correct Answer: ${currentQuestion.options[currentQuestion.answerIdx]})`}
          </strong>
          <p style={{ marginTop: "0.5rem" }}>{currentQuestion.explanation}</p>
        </div>
      )}

      {isAnswered && (
        <button onClick={handleNextClick} className={styles.nextButton}>
          {currentIdx + 1 === questions.length ? "Finish Quiz" : "Next Question →"}
        </button>
      )}
    </div>
  );
}
