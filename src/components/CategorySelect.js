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

function CategorySelect({ onStartQuiz, onStartTopic, onStartPriorityMix, topicStats, wrongQuestionsCount }) {
  return (
    <div className="category-select">
      <div className="category-select-content">
        <h2>効率学習メニュー</h2>
        <p className="subtitle">優先度の高い単元から集中して解けます</p>

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

        <div className="mode-section other-modes">
          <h3>その他</h3>
          <div className="special-modes stacked">
            <button
              className="special-button random-button"
              onClick={() => onStartQuiz('all', true, false)}
            >
              <div className="special-icon">🔀</div>
              <div className="special-text">
                <div className="special-name">ランダム全問題</div>
                <div className="special-desc">全カテゴリーから実戦形式</div>
              </div>
            </button>

            {wrongQuestionsCount > 0 && (
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
            )}
          </div>
        </div>

        <div className="info-section">
          <h3>💡 使い方</h3>
          <ul>
            <li>★★★★★ から順にトピック単位で解くのが効率的です</li>
            <li>「まとめて」で同じ優先度を一気に演習できます</li>
            <li>計算・アルゴリズムは毎回違う問題が生成されます</li>
            <li>途中で「終わる」を押すと、その時点の結果を確認できます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CategorySelect;
