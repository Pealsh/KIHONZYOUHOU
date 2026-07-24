import React, { useState, useEffect } from 'react';
import './App.css';
import QuizCard from './components/QuizCard';
import CalculationQuizCard from './components/CalculationQuizCard';
import CategorySelect from './components/CategorySelect';
import Result from './components/Result';
import {
  buildTopicQuiz,
  buildPriorityMixQuiz,
  getTopicStats,
} from './utils/topicFilter';

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
  const [useMemoCard, setUseMemoCard] = useState(false);
  const [memoMode, setMemoMode] = useState('calculation'); // calculation | algorithm

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
      ...strategyQuestions5,
    ];
    setAllQuestions(questions);
  }, []);

  const beginQuiz = (questions, { random = false, memo = false, memoKind = 'calculation', label = 'all' } = {}) => {
    let qs = questions;
    if (!qs || qs.length === 0) {
      window.alert('このトピックの問題がまだ見つかりませんでした。');
      return;
    }
    if (random) {
      qs = [...qs].sort(() => Math.random() - 0.5);
    }
    setSelectedCategory(label);
    setFilteredQuestions(qs);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizStarted(true);
    setQuizFinished(false);
    setUseMemoCard(memo);
    setMemoMode(memoKind);
  };

  // 旧API互換（ランダム全問・復習）
  const startQuiz = (category, random = false, wrongOnly = false) => {
    setIsRandomMode(random);
    setIsWrongOnlyMode(wrongOnly);
    if (wrongOnly) {
      beginQuiz(wrongQuestions, { label: 'wrong' });
      return;
    }
    let questions = category === 'all'
      ? allQuestions
      : allQuestions.filter((q) => q.category === category);
    beginQuiz(questions, { random, label: category });
  };

  // 優先度トピック開始
  const startTopic = (topicId) => {
    const { questions, topic, useMemo } = buildTopicQuiz(allQuestions, topicId);
    const memoKind = topicId === 'calculation' ? 'calculation' : 'algorithm';
    beginQuiz(questions, {
      random: true,
      memo: useMemo,
      memoKind,
      label: topic ? topic.name : topicId,
    });
  };

  // 同一優先度まとめ
  const startPriorityMix = (stars) => {
    const perTopic = stars === 5 ? 6 : stars === 4 ? 8 : 10;
    const { questions, useMemo } = buildPriorityMixQuiz(allQuestions, stars, perTopic);
    beginQuiz(questions, {
      random: true,
      memo: useMemo,
      memoKind: stars === 4 ? 'algorithm' : 'calculation',
      label: `優先度${stars}`,
    });
  };

  const handleAnswer = (selectedAnswer, isCorrect) => {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    setAnsweredQuestions([
      ...answeredQuestions,
      { question: currentQuestion, selectedAnswer, isCorrect },
    ]);
    if (isCorrect) {
      setScore(score + 1);
    } else if (!wrongQuestions.find((q) => q.id === currentQuestion.id)) {
      setWrongQuestions([...wrongQuestions, currentQuestion]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const endQuiz = () => setQuizFinished(true);

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnsweredQuestions([]);
    setFilteredQuestions([]);
    setUseMemoCard(false);
  };

  const topicStats = getTopicStats(allQuestions);

  return (
    <div className="App">
      <header className="App-header">
        <h1>基本情報技術者試験 クイズ</h1>
      </header>

      <main className="App-main">
        {!quizStarted ? (
          <CategorySelect
            onStartQuiz={startQuiz}
            onStartTopic={startTopic}
            onStartPriorityMix={startPriorityMix}
            topicStats={topicStats}
            wrongQuestionsCount={wrongQuestions.length}
          />
        ) : quizFinished ? (
          <Result
            score={score}
            totalQuestions={filteredQuestions.length}
            answeredQuestions={answeredQuestions}
            onRestart={resetQuiz}
          />
        ) : useMemoCard ? (
          <CalculationQuizCard
            question={filteredQuestions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={filteredQuestions.length}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
            onPrev={prevQuestion}
            onEnd={endQuiz}
            currentScore={score}
            canGoBack={currentQuestionIndex > 0}
            modeLabel={memoMode === 'calculation' ? '計算問題' : 'アルゴリズム'}
            memoTitle={memoMode === 'calculation' ? '📝 計算メモ' : '📝 トレースメモ'}
            memoPlaceholder={
              memoMode === 'calculation'
                ? '計算過程をここにメモできます...'
                : '変数の変化や実行過程をここにメモできます...'
            }
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
