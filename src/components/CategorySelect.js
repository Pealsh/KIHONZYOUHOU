import React from 'react';
import './CategorySelect.css';

function CategorySelect({ onStartQuiz, categoryStats, wrongQuestionsCount }) {
  const categories = [
    { id: 'all', name: 'すべて', icon: '📚' },
    { id: 'テクノロジー', name: 'テクノロジー', icon: '💻' },
    { id: 'マネジメント', name: 'マネジメント', icon: '📊' },
    { id: 'ストラテジー', name: 'ストラテジー', icon: '🎯' }
  ];

  return (
    <div className="category-select">
      <div className="category-select-content">
        <h2>学習モードを選択</h2>
        <p className="subtitle">基本情報技術者試験の問題を学習できます</p>
        
        {/* ランダム出題を一番上に */}
        <div className="mode-section featured">
          <h3>🎲 おすすめ：ランダム出題</h3>
          <div className="special-modes">
            <button
              className="special-button random-button featured"
              onClick={() => onStartQuiz('all', true, false)}
            >
              <div className="special-icon">🔀</div>
              <div className="special-text">
                <div className="special-name">ランダム全問題</div>
                <div className="special-desc">全カテゴリーからランダムに出題 - 実戦形式</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mode-section">
          <h3>📖 カテゴリー別学習</h3>
          <div className="category-grid">
            {categories.map(category => (
              <button
                key={category.id}
                className="category-button"
                onClick={() => onStartQuiz(category.id, false, false)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
                <div className="category-count">
                  {categoryStats[category.id] || 0}問
                </div>
              </button>
            ))}
          </div>
        </div>

        {wrongQuestionsCount > 0 && (
          <div className="mode-section">
            <h3>❌ 復習モード</h3>
            <div className="special-modes">
              <button
                className="special-button wrong-button"
                onClick={() => onStartQuiz('all', false, true)}
              >
                <div className="special-icon">📝</div>
                <div className="special-text">
                  <div className="special-name">間違えた問題のみ</div>
                  <div className="special-desc">{wrongQuestionsCount}問の復習</div>
                </div>
              </button>
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>💡 このアプリについて</h3>
          <ul>
            <li>リアルタイムで正答率を確認できます</li>
            <li>間違えた問題を自動で記録し、復習できます</li>
            <li>解答後は自動スクロールで次の問題へ</li>
            <li>各問題にヒントと詳しい解説が付いています</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategorySelect;
