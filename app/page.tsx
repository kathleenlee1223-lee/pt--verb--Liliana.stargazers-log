"use client";

import { FormEvent, useMemo, useState } from "react";

type Verb = {
  infinitive: string;
  meaning: string;
  category: string;
  note: string;
  forms: string[];
};

const pronouns = ["eu", "tu", "você / ele / ela", "nós", "vocês / eles / elas"];
const endings: Record<string, string[]> = {
  ar: ["o", "as", "a", "amos", "am"],
  er: ["o", "es", "e", "emos", "em"],
  ir: ["o", "es", "e", "imos", "em"],
};

const verbs: Verb[] = [
  { infinitive: "ser", meaning: "是；成为", category: "不规则动词", note: "用于身份、特征、时间与地点。", forms: ["sou", "és", "é", "somos", "são"] },
  { infinitive: "estar", meaning: "在；处于", category: "不规则动词", note: "用于状态、位置与暂时情况。", forms: ["estou", "estás", "está", "estamos", "estão"] },
  { infinitive: "ter", meaning: "有；拥有", category: "不规则动词", note: "也常用作复合时态的助动词。", forms: ["tenho", "tens", "tem", "temos", "têm"] },
  { infinitive: "ir", meaning: "去", category: "不规则动词", note: "表达移动，也可组成近期将来时。", forms: ["vou", "vais", "vai", "vamos", "vão"] },
  { infinitive: "fazer", meaning: "做；制作", category: "不规则动词", note: "第一人称单数发生词干变化。", forms: ["faço", "fazes", "faz", "fazemos", "fazem"] },
  { infinitive: "poder", meaning: "能；可以", category: "不规则动词", note: "表示能力、许可或可能性。", forms: ["posso", "podes", "pode", "podemos", "podem"] },
  { infinitive: "querer", meaning: "想要；喜爱", category: "不规则动词", note: "第一人称单数为 quero。", forms: ["quero", "queres", "quer", "queremos", "querem"] },
  { infinitive: "saber", meaning: "知道；会", category: "不规则动词", note: "第一人称单数为 sei。", forms: ["sei", "sabes", "sabe", "sabemos", "sabem"] },
];

function regularVerb(word: string): Verb | null {
  const suffix = word.slice(-2) as keyof typeof endings;
  if (!endings[suffix] || word.length < 4) return null;
  const stem = word.slice(0, -2);
  return { infinitive: word, meaning: "规则动词", category: `规则 -${suffix}`, note: "直陈式现在时（presente do indicativo）。", forms: endings[suffix].map((ending) => stem + ending) };
}

export default function Home() {
  const [query, setQuery] = useState("falar");
  const normalized = query.trim().toLowerCase();
  const result = useMemo(() => verbs.find((verb) => verb.infinitive === normalized) ?? regularVerb(normalized), [normalized]);
  const suggestions = verbs.filter((verb) => verb.infinitive.includes(normalized) || verb.meaning.includes(normalized)).slice(0, 5);
  const search = (event: FormEvent) => event.preventDefault();

  return (
    <main>
      <nav className="nav"><a className="brand" href="#top">verbo<span>pt</span></a><span className="nav-note">葡萄牙语动词变位查询</span></nav>
      <section className="hero" id="top">
        <p className="eyebrow">PORTUGUÊS · PRESENTE</p>
        <h1>每一个动词，<br /><em>都有它的节奏。</em></h1>
        <p className="intro">输入葡萄牙语动词原形，即刻查看直陈式现在时变位。支持常见不规则动词与规则 -ar、-er、-ir 动词。</p>
        <form className="search" onSubmit={search}>
          <label htmlFor="verb">查询动词</label>
          <div className="search-row"><input id="verb" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如 falar, ser, comer" autoComplete="off" /><button type="submit">查询 <span>→</span></button></div>
        </form>
        <div className="quick"><span>试试这些</span>{["falar", "comer", "abrir", "ser", "ir"].map((word) => <button key={word} onClick={() => setQuery(word)}>{word}</button>)}</div>
      </section>

      <section className="result-section" aria-live="polite">
        {result ? <div className="result-card">
          <div className="result-head"><div><p className="eyebrow">{result.category}</p><h2>{result.infinitive}</h2><p className="meaning">{result.meaning}</p></div><div className="tense">直陈式<br /><strong>现在时</strong></div></div>
          <div className="forms">{pronouns.map((pronoun, index) => <div className="form" key={pronoun}><span>{pronoun}</span><strong>{result.forms[index]}</strong></div>)}</div>
          <p className="note">{result.note}</p>
        </div> : <div className="empty"><p className="eyebrow">未找到精确结果</p><h2>试试动词原形</h2><p>目前可自动计算规则的 -ar、-er、-ir 动词，例如 <button onClick={() => setQuery("falar")}>falar</button>、<button onClick={() => setQuery("comer")}>comer</button>。</p></div>}
      </section>
      {normalized && suggestions.length > 0 && !verbs.some((v) => v.infinitive === normalized) && <section className="suggestions"><p>你也许在找</p>{suggestions.map((verb) => <button onClick={() => setQuery(verb.infinitive)} key={verb.infinitive}>{verb.infinitive} <span>{verb.meaning}</span></button>)}</section>}
      <footer><span>verbo<span>pt</span></span><p>为葡语学习者准备的轻量变位工具</p></footer>
    </main>
  );
}
