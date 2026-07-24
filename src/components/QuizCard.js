import React, { useState, useRef, useEffect } from 'react';
import './QuizCard.css';

function QuizCard({ question, questionNumber, totalQuestions, onAnswer, onNext, onPrev, onEnd, currentScore, canGoBack }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answered, setAnswered] = useState(false);
  const explanationRef = useRef(null);

  const accuracyRate = questionNumber > 1 ? Math.round((currentScore / (questionNumber - 1)) * 100) : 0;

  useEffect(() => {
    if (showExplanation && explanationRef.current) {
      setTimeout(() => {
        explanationRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [showExplanation]);

  const handleAnswerClick = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);
    setShowExplanation(true);

    const isCorrect = index === question.correctAnswer;
    onAnswer(index, isCorrect);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowHint(false);
    setShowExplanation(false);
    setAnswered(false);
    onNext();
  };

  const handleEnd = () => {
    if (window.confirm('クイズを終了しますか？現在の結果が表示されます。')) {
      onEnd();
    }
  };

  const toggleHint = () => {
    setShowHint(!showHint);
  };

  const getChoiceClass = (index) => {
    if (!answered) return 'choice-button';
    
    if (index === question.correctAnswer) {
      return 'choice-button correct';
    }
    
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return 'choice-button incorrect';
    }
    
    return 'choice-button disabled';
  };

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <div className="progress-info">
          <div className="nav-buttons">
            <button 
              className="nav-button prev" 
              onClick={onPrev}
              disabled={!canGoBack}
            >
              ← 前の問題
            </button>
            <button 
              className="nav-button next" 
              onClick={onNext}
              disabled={questionNumber >= totalQuestions}
            >
              次の問題 →
            </button>
          </div>
          <div className="question-number">
            問題 {questionNumber} / {totalQuestions}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {questionNumber > 1 && (
          <div className="accuracy-display">
            <div className="accuracy-label">リアルタイム正答率</div>
            <div className="accuracy-value">{accuracyRate}%</div>
            <div className="accuracy-details">
              {currentScore} / {questionNumber - 1} 問正解
            </div>
          </div>
        )}

        <div className="header-actions">
          <div className="badges">
            <div className="category-badge">{question.category}</div>
            {question.subcategory && (
              <div className="subcategory-badge">{question.subcategory}</div>
            )}
          </div>
          <button className="end-quiz-button" onClick={handleEnd}>
            終わる
          </button>
        </div>
      </div>

      <div className="question-content">
        <h2 className="question-text">{question.question}</h2>

        <div className="choices">
          {question.choices.map((choice, index) => (
            <button
              key={index}
              className={getChoiceClass(index)}
              onClick={() => handleAnswerClick(index)}
              disabled={answered}
            >
              <span className="choice-label">{String.fromCharCode(65 + index)}</span>
              <span className="choice-text">{choice}</span>
              {answered && index === question.correctAnswer && (
                <span className="correct-icon">✓</span>
              )}
              {answered && index === selectedAnswer && index !== question.correctAnswer && (
                <span className="incorrect-icon">✗</span>
              )}
            </button>
          ))}
        </div>

        {!answered && (
          <div className="hint-section">
            <button className="hint-button" onClick={toggleHint}>
              {showHint ? '💡 ヒントを閉じる' : '💡 ヒントを見る'}
            </button>
            {showHint && (
              <div className="hint-content">
                <div className="hint-icon">💡</div>
                <div className="hint-text">
                  {question.hint.split('\n').map((line, index) => (
                    <p key={index}>{line || '\u00A0'}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {showExplanation && (
          <div className="explanation-section" ref={explanationRef}>
            <h3>解答解説</h3>
            <div className="result-badge">
              {selectedAnswer === question.correctAnswer ? (
                <span className="correct-badge">✓ 正解！</span>
              ) : (
                <span className="incorrect-badge">✗ 不正解</span>
              )}
            </div>
            <div className="explanation-content">
              {question.explanation.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <button className="next-button" onClick={handleNext}>
              次の問題へ →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizCard;
