import React from 'react';
import './CategorySelect.css';
import { starsLabel, getTopicsByStars } from '../utils/topicFilter';

function TopicButton({ topic, countLabel, onClick }) {
  return (
    <button className={`topic-button stars-${topic.stars}`} onClick={onClick}>
      <div className="topic-button-top">
        <span className="topic-icon">{topic.icon}</span>
        <span className="topic-name">{topic.name}</span>
      </div>
      <div className="topic-meta">
        <span className="topic-count">{countLabel}</span>
        <span className="topic-go">解く →</span>
      </div>
    </button>
  );
}

function PriorityBlock({ stars, title, desc, topicStats, onStartTopic, onStartMix }) {
  const topics = getTopicsByStars(stars);
  return (
    <div className={`mode-section priority-section priority-${stars}`}>
      <div className="priority-header">
        <div>
          <h3>
            <span className="stars-badge">{starsLabel(stars)}</span>
            {title}
          </h3>
          <p className="priority-desc">{desc}</p>
        </div>
        <button className="mix-button" onClick={onStartMix}>
          この優先度をまとめて
        </button>
      </div>
      <div className="topic-grid">
        {topics.map((topic) => (
          <TopicButton
            key={topic.id}
            topic={topic}
            countLabel={
              typeof topicStats[topic.id] === 'number'
                ? `${topicStats[topic.id]}問`
                : topicStats[topic.id] || `${topic.defaultCount}問`
            }
            onClick={() => onStartTopic(topic.id)}
          />
        ))}
      </div>
    </div>
  );
}

function CategorySelect({
  onStartQuiz,
  onStartTopic,
  onStartPriorityMix,
  categoryStats,
  topicStats,
  wrongQuestionsCount,
}) {
  const categories = [
    { id: 'all', name: 'すべて', icon: '📚' },
    { id: 'テクノロジー', name: 'テクノロジー', icon: '💻' },
    { id: 'マネジメント', name: 'マネジメント', icon: '📊' },
    { id: 'ストラテジー', name: 'ストラテジー', icon: '🎯' },
  ];

  return (
    <div className="category-select">
      <div className="category-select-content">
        <h2>学習モードを選択</h2>
        <p className="subtitle">基本情報技術者試験の問題を学習できます</p>

        {/* ランダム出題 */}
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

        {/* 計算問題集 */}
        <div className="mode-section calculation-section">
          <h3>💯 計算問題集（毎回異なる数値）</h3>
          <div className="special-modes">
            <button
              className="special-button calculation-button featured"
              onClick={() => onStartQuiz('calculation', false, false, true, false)}
            >
              <div className="special-icon">🧮</div>
              <div className="special-text">
                <div className="special-name">ランダム計算問題 100問</div>
                <div className="special-desc">基数変換・論理演算・確率統計・性能計算など - メモ機能付き</div>
              </div>
            </button>
          </div>
          <div className="calculation-topics">
            <span className="topic-tag">基数変換</span>
            <span className="topic-tag">補数表現</span>
            <span className="topic-tag">論理演算</span>
            <span className="topic-tag">シフト演算</span>
            <span className="topic-tag">順列・組合せ</span>
            <span className="topic-tag">期待値</span>
            <span className="topic-tag">平均・中央値</span>
            <span className="topic-tag">MIPS計算</span>
            <span className="topic-tag">稼働率</span>
          </div>
        </div>

        {/* 科目B */}
        <div className="mode-section subjectb-section">
          <h3>🧩 科目B（アルゴリズム・セキュリティ）</h3>
          <div className="special-modes">
            <button
              className="special-button subjectb-button featured"
              onClick={() => onStartQuiz('subjectB', false, false, false, true)}
            >
              <div className="special-icon">💻</div>
              <div className="special-text">
                <div className="special-name">科目B ランダム 20問</div>
                <div className="special-desc">擬似言語トレース・データ構造・整列探索・セキュリティ - メモ機能付き</div>
              </div>
            </button>
          </div>
          <div className="subjectb-topics">
            <span className="topic-tag-b">配列・ループ</span>
            <span className="topic-tag-b">スタック・キュー</span>
            <span className="topic-tag-b">探索・整列</span>
            <span className="topic-tag-b">再帰・計算量</span>
            <span className="topic-tag-b">情報セキュリティ</span>
          </div>
        </div>

        {/* カテゴリー別 */}
        <div className="mode-section">
          <h3>📖 カテゴリー別学習</h3>
          <div className="category-grid">
            {categories.map((category) => (
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

        {/* 復習 */}
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

        {/* 優先度別（下に追加） */}
        <div className="mode-section priority-intro">
          <h3>⭐ 優先度別学習</h3>
          <p className="priority-intro-desc">
            得点効率の高い単元から集中して解けます
          </p>
        </div>

        <PriorityBlock
          stars={5}
          title="最優先"
          desc="得点源になりやすい分野。まずここを固める"
          topicStats={topicStats}
          onStartTopic={onStartTopic}
          onStartMix={() => onStartPriorityMix(5)}
        />

        <PriorityBlock
          stars={4}
          title="準優先"
          desc="差がつきやすい分野。最優先の次に攻略"
          topicStats={topicStats}
          onStartTopic={onStartTopic}
          onStartMix={() => onStartPriorityMix(4)}
        />

        <PriorityBlock
          stars={3}
          title="基礎固め"
          desc="時間があれば安定得点を狙う"
          topicStats={topicStats}
          onStartTopic={onStartTopic}
          onStartMix={() => onStartPriorityMix(3)}
        />

        <div className="info-section">
          <h3>💡 このアプリについて</h3>
          <ul>
            <li>リアルタイムで正答率を確認できます</li>
            <li>間違えた問題を自動で記録し、復習できます</li>
            <li>計算・科目Bは毎回違う問題が生成されます</li>
            <li>優先度別で効率よく単元を絞って学習できます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategorySelect;
