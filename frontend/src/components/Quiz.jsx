// frontend/src/components/Quiz.jsx
import React, { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../utils/api';

export default function Quiz({ monumentId }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const apiBaseUrl = getApiBaseUrl();
        const res = await fetch(`${apiBaseUrl}/api/quiz/${monumentId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to load quiz');
        const data = await res.json();
        setQuestions(data);
      } catch (e) {
        setError(e.message);
      } finally { setLoading(false); }
    }
    load();
  }, [monumentId]);

  function choose(qId, idx) {
    setAnswers(prev => ({ ...prev, [qId]: idx }));
  }

  async function submit() {
    try {
      const payload = { answers: Object.entries(answers).map(([questionId, chosenIndex]) => ({ questionId, chosenIndex })) };
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/quiz/${monumentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Submit failed');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    }
  }

  if (loading) return <div className="card">Loading quiz…</div>;
  if (error) return <div className="card">Error: {error}</div>;
  if (result) {
    return (
      <div className="card">
        <h3>Your score: {result.attempt.score}%</h3>
        <p>{result.attempt.correctCount} / {result.attempt.total} correct</p>
        {result.awarded && result.awarded.length > 0 ? (
          <div>
            <h4>New Badges</h4>
            <div style={{ display: 'flex', gap: 8 }}>
              {result.awarded.map(b => (
                <div key={b.key} className="badge" title={b.description}>
                  <div style={{ fontSize: 20 }}>{b.icon}</div>
                  <div style={{ fontSize: 12 }}>{b.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : <p>No new badges this time.</p>}
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Quiz</h3>
      {questions.map((q, i) => (
        <div key={q._id} style={{ marginBottom: 12 }}>
          <div><strong>{i + 1}. {q.text}</strong></div>
          {q.options.map((opt, idx) => (
            <label key={idx} style={{ display: 'block', cursor: 'pointer' }}>
              <input type="radio" name={q._id} checked={answers[q._id] === idx} onChange={() => choose(q._id, idx)} /> {opt}
            </label>
          ))}
        </div>
      ))}
      <button className="btn" onClick={submit}>Submit</button>
    </div>
  );
}
