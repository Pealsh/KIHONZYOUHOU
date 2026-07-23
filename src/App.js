import React, { useState, useEffect } from 'react';
import './App.css';
import QuizCard from './components/QuizCard';
import CategorySelect from './components/CategorySelect';
import Result from './components/Result';

// 問題データをインポート
import technologyQuestions from './questions/technology.json';
import technologyQuestions2 from './questions/technology2.json';
import technologyQuestions3 from './questions/technology3.json';
import technologyQuestions4 from './questions/technology4.json';
import technologyQuestions5 from './questions/technology5.json';
import technologyQuestions6 from './questions/technology6.json';
import managementQuestions from './questions/management.json';
import managementQuestions2 from './questions/management2.json';
import managementQuestions3 from './questions/management3.json';
import managementQuestions4 from './questions/management4.json';
import strategyQuestions from './questions/strategy.json';
import strategyQuestions2 from './questions/strategy2.json';
import strategyQuestions3 from './questions/strategy3.json';
import strategyQuestions4 from './questions/strategy4.json';
import strategyQuestions5 from './questions/strategy5.json';

function App() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [isRandomMode, setIsRandomMode] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isWrongOnlyMode, setIsWrongOnlyMode] = useState(false);

  // 問題データを読み込み
  useEffect(() => {
    const questions = [
      ...technologyQuestions,
      ...technologyQuestions2,
      ...technologyQuestions3,
      ...technologyQuestions4,
      ...technologyQuestions5,
      ...technologyQuestions6,
      ...managementQuestions,
      ...managementQuestions2,
      ...managementQuestions3,
      ...managementQuestions4,
      ...strategyQuestions,
      ...strategyQuestions2,
      ...strategyQuestions3,
      ...strategyQuestions4,
      ...strategyQuestions5
    ];
    setAllQuestions(questions);
  }, []);

  // カテゴリーごとの問題数を計算
  const getCategoryStats = () => {
    const stats = {
      all: allQuestions.length,
      テクノロジー: allQuestions.filter(q => q.category === 'テクノロジー').length,
      マネジメント: allQuestions.filter(q => q.category === 'マネジメント').length,
      ストラテジー: allQuestions.filter(q => q.category === 'ストラテジー').length
    };
    return stats;
  };

  // クイズを開始
  const startQuiz = (category, random = false, wrongOnly = false) => {
    setSelectedCategory(category);
    setIsRandomMode(random);
    setIsWrongOnlyMode(wrongOnly);
    
    // 問題リストを準備
    let questions = [];
    if (wrongOnly) {
      questions = wrongQuestions;
    } else if (category === 'all') {
      questions = allQuestions;
    } else {
      questions = allQuestions.filter(q => q.category === category);
    }
    
    // ランダムモードの場合、最初に1回だけシャッフル
    if (random && questions.length > 0) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }
    
    setFilteredQuestions(questions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizStarted(true);
    setQuizFinished(false);
  };

  // 回答を処理
  const handleAnswer = (selectedAnswer, isCorrect) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    // 回答を記録
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: currentQuestion,
        selectedAnswer,
        isCorrect
      }
    ]);

    // 正解ならスコアを増やす
    if (isCorrect) {
      setScore(score + 1);
    } else {
      // 間違った問題を記録
      if (!wrongQuestions.find(q => q.id === currentQuestion.id)) {
        setWrongQuestions([...wrongQuestions, currentQuestion]);
      }
    }
  };

  // 次の問題へ
  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  // 前の問題へ
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // クイズを途中で終了
  const endQuiz = () => {
    setQuizFinished(true);
  };

  // クイズをリセット
  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setFilteredQuestions([]);
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="App">
      <header className="App-header">
        <h1>基本情報技術者試験 クイズ</h1>
      </header>

      <main className="App-main">
        {!quizStarted ? (
          <CategorySelect 
            onStartQuiz={startQuiz} 
            categoryStats={categoryStats}
            wrongQuestionsCount={wrongQuestions.length}
          />
        ) : quizFinished ? (
          <Result 
            score={score}
            totalQuestions={filteredQuestions.length}
            answeredQuestions={answeredQuestions}
            onRestart={resetQuiz}
          />
        ) : (
          <QuizCard
            question={filteredQuestions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={filteredQuestions.length}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            onEnd={endQuiz}
            currentScore={score}
            canGoBack={currentQuestionIndex > 0}
          />
        )}
      </main>

      <footer className="App-footer">
        <p>© 2026 基本情報技術者試験 クイズアプリ</p>
      </footer>
    </div>
  );
}

export default App;
