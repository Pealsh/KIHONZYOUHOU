import React from 'react';
import './Result.css';

function Result({ score, totalQuestions, answeredQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { text: 'S', color: '#ffd700', message: '素晴らしい！' };
    if (percentage >= 80) return { text: 'A', color: '#4caf50', message: '優秀です！' };
    if (percentage >= 70) return { text: 'B', color: '#2196f3', message: '良くできました！' };
    if (percentage >= 60) return { text: 'C', color: '#ff9800', message: 'もう少し！' };
    return { text: 'D', color: '#f44336', message: '復習しましょう！' };
  };

  const grade = getGrade();

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
              {score} / {totalQuestions}
            </div>
            <div className="score-percentage">{percentage}%</div>
            <div className="grade-message">{grade.message}</div>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-label">正解数</div>
            <div className="stat-value correct">{score}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">不正解数</div>
            <div className="stat-value incorrect">{totalQuestions - score}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">正答率</div>
            <div className="stat-value">{percentage}%</div>
          </div>
        </div>

        <div className="review-section">
          <h3>復習</h3>
          <div className="review-list">
            {answeredQuestions.map((item, index) => (
              <div 
                key={index} 
                className={`review-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
              >
                <div className="review-header">
                  <span className="review-number">問題 {index + 1}</span>
                  <span className={`review-badge ${item.isCorrect ? 'correct' : 'incorrect'}`}>
                    {item.isCorrect ? '正解' : '不正解'}
                  </span>
                </div>
                <div className="review-question">{item.question.question}</div>
                <div className="review-answers">
                  <div className="review-answer">
                    <span className="answer-label">あなたの回答:</span>
                    <span className={item.isCorrect ? 'correct-text' : 'incorrect-text'}>
                      {item.question.choices[item.selectedAnswer]}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="review-answer">
                      <span className="answer-label">正解:</span>
                      <span className="correct-text">
                        {item.question.choices[item.question.correctAnswer]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="restart-button" onClick={onRestart}>
          もう一度挑戦する
        </button>
      </div>
    </div>
  );
}

export default Result;
