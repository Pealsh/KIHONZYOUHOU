import React, { useState } from 'react';
import './Result.css';

function Result({ score, totalQuestions, answeredQuestions, onRestart }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const actualTotal = answeredQuestions.length;
  const percentage = actualTotal > 0 ? Math.round((score / actualTotal) * 100) : 0;
  
  const getGrade = () => {
    if (percentage >= 90) return { text: 'S', color: '#ffd700', message: '素晴らしい！' };
    if (percentage >= 80) return { text: 'A', color: '#4caf50', message: '優秀です！' };
    if (percentage >= 70) return { text: 'B', color: '#2196f3', message: '良くできました！' };
    if (percentage >= 60) return { text: 'C', color: '#ff9800', message: 'もう少し！' };
    return { text: 'D', color: '#f44336', message: '復習しましょう！' };
  };

  const grade = getGrade();

  const handleQuestionClick = (index) => {
    if (selectedQuestion === index) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(index);
    }
  };

  return (
    <div className="result-container">
      <div className="result-card">
        <h2>結果発表</h2>
        
        <div className="score-section">
          <div className="grade-circle" style={{ borderColor: grade.color }}>
            <span className="grade-text" style={{ color: grade.color }}>
              {grade.text}
            </span>
          </div>
          <div className="score-info">
            <div className="score-number">
              {score} / {actualTotal}
            </div>
            <div className="score-percentage">{percentage}%</div>
            <div className="grade-message">{grade.message}</div>
            {actualTotal < totalQuestions && (
              <div className="partial-info">
                ({totalQuestions}問中{actualTotal}問解答)
              </div>
            )}
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-label">正解数</div>
            <div className="stat-value correct">{score}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">不正解数</div>
            <div className="stat-value incorrect">{actualTotal - score}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">正答率</div>
            <div className="stat-value">{percentage}%</div>
          </div>
        </div>

        <div className="question-grid-section">
          <h3>解答一覧</h3>
          <p className="grid-instruction">問題をクリックすると詳細を表示</p>
          <div className="question-grid">
            {answeredQuestions.map((item, index) => (
              <button
                key={index}
                className={`question-cell ${item.isCorrect ? 'correct' : 'incorrect'} ${selectedQuestion === index ? 'selected' : ''}`}
                onClick={() => handleQuestionClick(index)}
              >
                <span className="cell-number">{index + 1}</span>
                <span className="cell-mark">{item.isCorrect ? '○' : '×'}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedQuestion !== null && (
          <div className="detail-section">
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-number">問題 {selectedQuestion + 1}</span>
                <span className={`detail-badge ${answeredQuestions[selectedQuestion].isCorrect ? 'correct' : 'incorrect'}`}>
                  {answeredQuestions[selectedQuestion].isCorrect ? '○ 正解' : '× 不正解'}
                </span>
                <button className="detail-close" onClick={() => setSelectedQuestion(null)}>✕</button>
              </div>
              
              <div className="detail-question">
                {answeredQuestions[selectedQuestion].question.question}
              </div>
              
              <div className="detail-answers">
                <div className="detail-answer">
                  <span className="detail-label">あなたの回答:</span>
                  <span className={answeredQuestions[selectedQuestion].isCorrect ? 'correct-text' : 'incorrect-text'}>
                    {String.fromCharCode(65 + answeredQuestions[selectedQuestion].selectedAnswer)}. {answeredQuestions[selectedQuestion].question.choices[answeredQuestions[selectedQuestion].selectedAnswer]}
                  </span>
                </div>
                
                {!answeredQuestions[selectedQuestion].isCorrect && (
                  <div className="detail-answer">
                    <span className="detail-label">正解:</span>
                    <span className="correct-text">
                      {String.fromCharCode(65 + answeredQuestions[selectedQuestion].question.correctAnswer)}. {answeredQuestions[selectedQuestion].question.choices[answeredQuestions[selectedQuestion].question.correctAnswer]}
                    </span>
                  </div>
                )}
              </div>

              <div className="detail-explanation">
                <h4>解説</h4>
                <div className="explanation-text">
                  {answeredQuestions[selectedQuestion].question.explanation.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button className="restart-button" onClick={onRestart}>
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}

export default Result;
