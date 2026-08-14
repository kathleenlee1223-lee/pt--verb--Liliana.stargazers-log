"use client";

import { FormEvent, useMemo, useState } from "react";

type Forms = Record<string, string[]>;
type Verb = { infinitive: string; meaning: string; category: string; note: string; forms: Forms };

const people = ["eu", "tu", "ele / ela / você", "nós", "vós", "eles / elas / vocês"];
const commandPeople = ["—", "tu", "você", "nós", "vós", "vocês"];
const labels: Record<string, string> = {
  indicative: "陈述式", subjunctive: "虚拟式", imperative: "命令式",
  present: "一般现在时", simplePast: "一般过去时（简单）", compoundPast: "一般过去时（复合）", imperfect: "过去未完成时", future: "将来时", affirmative: "肯定命令式", negative: "否定命令式",
};
const tenseOrder: Record<string, string[]> = { indicative: ["present", "simplePast", "compoundPast", "imperfect", "future"], subjunctive: ["present", "simplePast", "compoundPast", "imperfect", "future"], imperative: ["affirmative", "negative"] };
const ter = ["tenho", "tens", "tem", "temos", "tendes", "têm"];

function regular(word: string): Verb | null {
  const type = word.slice(-2) as "ar" | "er" | "ir";
  if (!(["ar", "er", "ir"] as string[]).includes(type) || word.length < 4) return null;
  const stem = word.slice(0, -2);
  const present = type === "ar" ? ["o", "as", "a", "amos", "ais", "am"] : type === "er" ? ["o", "es", "e", "emos", "eis", "em"] : ["o", "es", "e", "imos", "is", "em"];
  const preterite = type === "ar" ? ["ei", "aste", "ou", "ámos", "astes", "aram"] : ["i", "este", "eu", "emos", "estes", "eram"];
  const imperfect = type === "ar" ? ["ava", "avas", "ava", "ávamos", "áveis", "avam"] : ["ia", "ias", "ia", "íamos", "íeis", "iam"];
  const subjPresent = type === "ar" ? ["e", "es", "e", "emos", "eis", "em"] : ["a", "as", "a", "amos", "ais", "am"];
  const subjImperfect = type === "ar" ? ["asse", "asses", "asse", "ássemos", "ásseis", "assem"] : ["esse", "esses", "esse", "êssemos", "êsseis", "essem"];
  const subjFuture = type === "ar" ? ["ar", "ares", "ar", "armos", "ardes", "arem"] : type === "er" ? ["er", "eres", "er", "ermos", "erdes", "erem"] : ["ir", "ires", "ir", "irmos", "irdes", "irem"];
  const participle = type === "ar" ? `${stem}ado` : `${stem}ido`;
  const p = present.map((x) => stem + x); const sp = subjPresent.map((x) => stem + x);
  return { infinitive: word, meaning: "规则动词", category: `规则 -${type}`, note: "规则动词会自动生成三大语气的常用时态。", forms: {
    "indicative-present": p, "indicative-simplePast": preterite.map((x) => stem + x), "indicative-compoundPast": ter.map((x) => `${x} ${participle}`), "indicative-imperfect": imperfect.map((x) => stem + x), "indicative-future": ["ei", "ás", "á", "emos", "eis", "ão"].map((x) => word + x),
    "subjunctive-present": sp, "subjunctive-simplePast": subjImperfect.map((x) => stem + x), "subjunctive-compoundPast": ["tenha", "tenhas", "tenha", "tenhamos", "tenhais", "tenham"].map((x) => `${x} ${participle}`), "subjunctive-imperfect": subjImperfect.map((x) => stem + x), "subjunctive-future": subjFuture.map((x) => stem + x),
    "imperative-affirmative": ["—", p[1].slice(0, -1), sp[2], sp[3], sp[4], sp[5]], "imperative-negative": ["—", `não ${sp[1]}`, `não ${sp[2]}`, `não ${sp[3]}`, `não ${sp[4]}`, `não ${sp[5]}`],
  }};
}

const irregular: Verb[] = [
  { infinitive: "ser", meaning: "是；成为", category: "不规则动词", note: "完整展示 ser 的常用变位。", forms: {
    "indicative-present":["sou","és","é","somos","sois","são"], "indicative-simplePast":["fui","foste","foi","fomos","fostes","foram"], "indicative-compoundPast":ter.map(x=>`${x} sido`), "indicative-imperfect":["era","eras","era","éramos","éreis","eram"], "indicative-future":["serei","serás","será","seremos","sereis","serão"],
    "subjunctive-present":["seja","sejas","seja","sejamos","sejais","sejam"], "subjunctive-simplePast":["fosse","fosses","fosse","fôssemos","fôsseis","fossem"], "subjunctive-compoundPast":["tenha sido","tenhas sido","tenha sido","tenhamos sido","tenhais sido","tenham sido"], "subjunctive-imperfect":["fosse","fosses","fosse","fôssemos","fôsseis","fossem"], "subjunctive-future":["for","fores","for","formos","fordes","forem"],
    "imperative-affirmative":["—","sê","seja","sejamos","sede","sejam"], "imperative-negative":["—","não sejas","não seja","não sejamos","não sejais","não sejam"]
  }},
  { infinitive: "estar", meaning: "在；处于", category: "不规则动词", note: "完整展示 estar 的常用变位。", forms: {
    "indicative-present":["estou","estás","está","estamos","estais","estão"], "indicative-simplePast":["estive","estiveste","esteve","estivemos","estivestes","estiveram"], "indicative-compoundPast":ter.map(x=>`${x} estado`), "indicative-imperfect":["estava","estavas","estava","estávamos","estáveis","estavam"], "indicative-future":["estarei","estarás","estará","estaremos","estareis","estarão"],
    "subjunctive-present":["esteja","estejas","esteja","estejamos","estejais","estejam"], "subjunctive-simplePast":["estivesse","estivesses","estivesse","estivéssemos","estivésseis","estivessem"], "subjunctive-compoundPast":["tenha estado","tenhas estado","tenha estado","tenhamos estado","tenhais estado","tenham estado"], "subjunctive-imperfect":["estivesse","estivesses","estivesse","estivéssemos","estivésseis","estivessem"], "subjunctive-future":["estiver","estiveres","estiver","estivermos","estiverdes","estiverem"],
    "imperative-affirmative":["—","está","esteja","estejamos","estai","estejam"], "imperative-negative":["—","não estejas","não esteja","não estejamos","não estejais","não estejam"]
  }},
  { infinitive: "ir", meaning: "去", category: "不规则动词", note: "完整展示 ir 的常用变位。", forms: {
    "indicative-present":["vou","vais","vai","vamos","ides","vão"], "indicative-simplePast":["fui","foste","foi","fomos","fostes","foram"], "indicative-compoundPast":ter.map(x=>`${x} ido`), "indicative-imperfect":["ia","ias","ia","íamos","íeis","iam"], "indicative-future":["irei","irás","irá","iremos","ireis","irão"],
    "subjunctive-present":["vá","vás","vá","vamos","vades","vão"], "subjunctive-simplePast":["fosse","fosses","fosse","fôssemos","fôsseis","fossem"], "subjunctive-compoundPast":["tenha ido","tenhas ido","tenha ido","tenhamos ido","tenhais ido","tenham ido"], "subjunctive-imperfect":["fosse","fosses","fosse","fôssemos","fôsseis","fossem"], "subjunctive-future":["for","fores","for","formos","fordes","forem"],
    "imperative-affirmative":["—","vai","vá","vamos","ide","vão"], "imperative-negative":["—","não vás","não vá","não vamos","não vades","não vão"]
  }},
];

export default function Home() {
  const [query, setQuery] = useState("falar"); const [mood, setMood] = useState("indicative"); const [tense, setTense] = useState("present");
  const normalized = query.trim().toLowerCase();
  const result = useMemo(() => irregular.find(v => v.infinitive === normalized) ?? regular(normalized), [normalized]);
  const pickMood = (next: string) => { setMood(next); setTense(tenseOrder[next][0]); };
  const forms = result?.forms[`${mood}-${tense}`] ?? [];
  return <main>
    <nav className="nav"><a className="brand" href="#top">verbo<span>pt</span></a><span className="nav-note">葡萄牙语动词变位查询</span></nav>
    <section className="hero" id="top"><p className="eyebrow">PORTUGUÊS · CONJUGAÇÃO</p><h1>每一个动词，<br/><em>都有它的节奏。</em></h1><p className="intro">查询葡萄牙语动词的陈述式、虚拟式和命令式。规则 -ar、-er、-ir 动词可自动生成完整常用变位。</p><form className="search" onSubmit={(e:FormEvent)=>e.preventDefault()}><label htmlFor="verb">查询动词</label><div className="search-row"><input id="verb" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如 falar, ser, comer" autoComplete="off"/><button type="submit">查询 <span>→</span></button></div></form><div className="quick"><span>试试这些</span>{["falar","comer","abrir","ser","estar","ir"].map(w=><button key={w} onClick={()=>setQuery(w)}>{w}</button>)}</div></section>
    <section className="result-section" aria-live="polite">{result ? <div className="result-card"><div className="result-head"><div><p className="eyebrow">{result.category}</p><h2>{result.infinitive}</h2><p className="meaning">{result.meaning}</p></div><p className="note-top">{result.note}</p></div><div className="mood-tabs">{["indicative","subjunctive","imperative"].map(x=><button className={mood===x?"active":""} onClick={()=>pickMood(x)} key={x}>{labels[x]}</button>)}</div><div className="tense-tabs">{tenseOrder[mood].map(x=><button className={tense===x?"active":""} onClick={()=>setTense(x)} key={x}>{labels[x]}</button>)}</div><div className="forms">{forms.map((form,index)=><div className="form" key={index}><span>{mood==="imperative"?commandPeople[index]:people[index]}</span><strong>{form}</strong></div>)}</div>{mood==="subjunctive"&&<p className="grammar-note">注：虚拟式的传统术语与陈述式不完全一一对应；此处“简单过去时”呈现 <em>pretérito imperfeito do conjuntivo</em>，复合过去时呈现 <em>pretérito perfeito composto</em>。</p>}</div> : <div className="empty"><p className="eyebrow">暂时无法生成</p><h2>请输入动词原形</h2><p>已支持全部规则 -ar、-er、-ir 动词，以及 ser、estar、ir 的完整常用变位。</p></div>}</section>
    <footer><span>verbo<span>pt</span></span><p>为葡语学习者准备的轻量变位工具</p></footer>
  </main>;
}
