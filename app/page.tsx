"use client";

import { useEffect, useMemo, useState } from "react";

type Candidate = {
  id: string;
  name: string;
  initials: string;
  party: "D" | "R" | "I";
  partyName: string;
  title: string;
  home: string;
  tagline: string;
  cash: number;
  capital: number;
  momentum: number;
  stats: { label: string; value: number }[];
  colors: [string, string];
};

const candidates: Candidate[] = [
  {
    id: "newsom",
    name: "Gavin Newsom",
    initials: "GN",
    party: "D",
    partyName: "Democrat",
    title: "The Media Governor",
    home: "California",
    tagline: "National reach. Executive confidence. A very bright spotlight.",
    cash: 5.8,
    capital: 63,
    momentum: 54,
    stats: [
      { label: "Recognition", value: 88 },
      { label: "Donor network", value: 91 },
      { label: "Discipline", value: 67 },
    ],
    colors: ["#1a7cff", "#203c99"],
  },
  {
    id: "aoc",
    name: "Alexandria Ocasio-Cortez",
    initials: "AO",
    party: "D",
    partyName: "Democrat",
    title: "The Movement Builder",
    home: "New York",
    tagline: "Unmatched grassroots energy with a polarizing national profile.",
    cash: 3.1,
    capital: 72,
    momentum: 66,
    stats: [
      { label: "Grassroots", value: 96 },
      { label: "Digital", value: 94 },
      { label: "Crossover", value: 48 },
    ],
    colors: ["#24c9d8", "#1651a6"],
  },
  {
    id: "shapiro",
    name: "Josh Shapiro",
    initials: "JS",
    party: "D",
    partyName: "Democrat",
    title: "The Pragmatic Executive",
    home: "Pennsylvania",
    tagline: "A battleground-tested coalition builder with room to define himself.",
    cash: 4.2,
    capital: 70,
    momentum: 51,
    stats: [
      { label: "Crossover", value: 86 },
      { label: "Organization", value: 83 },
      { label: "Recognition", value: 60 },
    ],
    colors: ["#3ba7ff", "#174b72"],
  },
  {
    id: "beshear",
    name: "Andy Beshear",
    initials: "AB",
    party: "D",
    partyName: "Democrat",
    title: "The Red-State Bridge",
    home: "Kentucky",
    tagline: "High crossover appeal, low national profile, and a hard climb ahead.",
    cash: 2.6,
    capital: 68,
    momentum: 46,
    stats: [
      { label: "Crossover", value: 93 },
      { label: "Authenticity", value: 88 },
      { label: "Recognition", value: 45 },
    ],
    colors: ["#5a9fcf", "#243c69"],
  },
  {
    id: "vance",
    name: "JD Vance",
    initials: "JV",
    party: "R",
    partyName: "Republican",
    title: "The Populist Heir",
    home: "Ohio",
    tagline: "Built-in national stature and a direct lane to the party base.",
    cash: 5.1,
    capital: 78,
    momentum: 61,
    stats: [
      { label: "Recognition", value: 92 },
      { label: "Party leverage", value: 94 },
      { label: "Crossover", value: 51 },
    ],
    colors: ["#f25a62", "#862336"],
  },
  {
    id: "haley",
    name: "Nikki Haley",
    initials: "NH",
    party: "R",
    partyName: "Republican",
    title: "The Foreign-Policy Hawk",
    home: "South Carolina",
    tagline: "Debate strength, donor access, and a difficult party-unity equation.",
    cash: 4.7,
    capital: 65,
    momentum: 49,
    stats: [
      { label: "Debate", value: 92 },
      { label: "Donor network", value: 87 },
      { label: "Base trust", value: 57 },
    ],
    colors: ["#ff826f", "#8a2934"],
  },
  {
    id: "desantis",
    name: "Ron DeSantis",
    initials: "RD",
    party: "R",
    partyName: "Republican",
    title: "The Culture Warrior",
    home: "Florida",
    tagline: "A disciplined message machine with unfinished national business.",
    cash: 4.5,
    capital: 69,
    momentum: 52,
    stats: [
      { label: "Organization", value: 86 },
      { label: "Base intensity", value: 89 },
      { label: "Retail politics", value: 54 },
    ],
    colors: ["#ef4c58", "#601e36"],
  },
  {
    id: "cuban",
    name: "Mark Cuban",
    initials: "MC",
    party: "I",
    partyName: "Independent",
    title: "The Billionaire Outsider",
    home: "Texas",
    tagline: "Unlimited attention, unconventional tactics, and no party machine.",
    cash: 18,
    capital: 42,
    momentum: 58,
    stats: [
      { label: "Self-funding", value: 99 },
      { label: "Outsider appeal", value: 91 },
      { label: "Organization", value: 35 },
    ],
    colors: ["#d6ae5b", "#5b4b32"],
  },
];

type RaceState = {
  id: string;
  name: string;
  ev: number;
  x: number;
  y: number;
  demLean: number;
  support: number;
  visits: number;
  volunteers: number;
};

type CampaignAction = {
  id: string;
  mark: string;
  name: string;
  category: string;
  description: string;
  funds: number;
  energy: number;
  capital: number;
  momentum: number;
  support: number;
  volunteers: number;
  national: number;
  debate: number;
};

type GameState = {
  candidateId: string;
  turn: number;
  funds: number;
  capital: number;
  momentum: number;
  energy: number;
  volunteers: number;
  national: number;
  debate: number;
  data: number;
  states: RaceState[];
  selectedState: string;
  selectedAction: string;
  feed: string[];
  pollHistory: { turn: number; national: number; states: Record<string, number> }[];
  resolution: { title: string; body: string; changes: string[]; event?: string; actionId?: string } | null;
  gameOver: boolean;
};

const raceStateTemplates = [
  { id: "NV", name: "Nevada", ev: 6, x: 46, y: 42, demLean: -0.8 },
  { id: "AZ", name: "Arizona", ev: 11, x: 49, y: 61, demLean: -1.0 },
  { id: "TX", name: "Texas", ev: 40, x: 63, y: 72, demLean: -4.8 },
  { id: "MN", name: "Minnesota", ev: 10, x: 66, y: 21, demLean: 2.7 },
  { id: "WI", name: "Wisconsin", ev: 10, x: 70, y: 30, demLean: 0.1 },
  { id: "MI", name: "Michigan", ev: 15, x: 76, y: 28, demLean: 0.7 },
  { id: "GA", name: "Georgia", ev: 16, x: 81, y: 63, demLean: -0.9 },
  { id: "VA", name: "Virginia", ev: 13, x: 84, y: 47, demLean: 2.4 },
  { id: "PA", name: "Pennsylvania", ev: 19, x: 86, y: 36, demLean: 0.2 },
  { id: "NC", name: "North Carolina", ev: 16, x: 88, y: 55, demLean: -1.4 },
  { id: "FL", name: "Florida", ev: 30, x: 87, y: 78, demLean: -3.6 },
  { id: "NH", name: "New Hampshire", ev: 4, x: 94, y: 18, demLean: 1.6 },
];

const campaignActions: CampaignAction[] = [
  { id: "speech", mark: "◈", name: "Major speech", category: "Earned media", description: "Own the day with a prime-time address tailored to the target state.", funds: -0.18, energy: -10, capital: 2, momentum: 4, support: 1.7, volunteers: 140, national: 0.25, debate: 1 },
  { id: "doors", mark: "⌂", name: "Door-knock surge", category: "Field", description: "Flood priority precincts with trained volunteers and local organizers.", funds: -0.12, energy: -12, capital: 1, momentum: 2, support: 1.35, volunteers: 620, national: 0.05, debate: 0 },
  { id: "townhall", mark: "◎", name: "Town hall", category: "Retail politics", description: "Take unscripted questions and earn trust one voter at a time.", funds: -0.11, energy: -11, capital: 3, momentum: 2, support: 1.5, volunteers: 210, national: 0.15, debate: 3 },
  { id: "fundraiser", mark: "$", name: "High-dollar fundraiser", category: "Finance", description: "Refill the war chest, at a small cost to outsider credibility.", funds: 1.4, energy: -9, capital: -2, momentum: 0, support: 0.15, volunteers: 0, national: -0.05, debate: 0 },
  { id: "digital", mark: "▦", name: "Digital blitz", category: "Paid media", description: "Micro-target persuadable voters with a high-frequency message push.", funds: -0.85, energy: -3, capital: 0, momentum: 3, support: 2.15, volunteers: 80, national: 0.2, debate: 0 },
  { id: "policy", mark: "§", name: "Policy rollout", category: "Agenda", description: "Spend capital to define the race around a signature national proposal.", funds: -0.35, energy: -7, capital: -4, momentum: 2, support: 0.85, volunteers: 120, national: 0.75, debate: 2 },
  { id: "debate", mark: "◇", name: "Debate prep", category: "Readiness", description: "Pressure-test answers, rehearse attacks, and avoid a national stumble.", funds: -0.22, energy: -8, capital: 0, momentum: 1, support: 0.45, volunteers: 0, national: 0.1, debate: 15 },
  { id: "oppo", mark: "⌖", name: "Opposition research", category: "Intelligence", description: "Find a vulnerability. The hit could land—or backfire on your campaign.", funds: -0.48, energy: -5, capital: -5, momentum: 4, support: 1.3, volunteers: 0, national: 0.2, debate: 0 },
  { id: "rest", mark: "+", name: "Candidate reset", category: "Recovery", description: "Stand down for a week, recover stamina, and sharpen the operation.", funds: 0, energy: 28, capital: 1, momentum: -2, support: 0, volunteers: 0, national: -0.1, debate: 2 },
];

const turnDates = ["Jan 15", "Feb 5", "Mar 5", "Apr 9", "May 14", "Jun 18", "Jul 17", "Aug 21", "Sep 5", "Sep 19", "Oct 3", "Oct 17", "Oct 31", "Nov 7"];

const events = [
  { headline: "Jobs report jolts the race", body: "A surprise hiring surge shifts attention toward wages, costs, and economic stewardship.", momentum: 2, national: 0.35 },
  { headline: "Viral clip breaks through", body: "A candid exchange from the trail dominates feeds and humanizes the campaign.", momentum: 4, national: 0.45 },
  { headline: "Deepfake floods social media", body: "The rapid-response team debunks it, but the campaign loses precious oxygen.", momentum: -3, national: -0.3 },
  { headline: "Major union makes its choice", body: "An influential organization mobilizes members across the industrial Midwest.", momentum: 3, national: 0.2 },
  { headline: "Donor network freezes giving", body: "Bundlers demand a strategy reset after a bruising week of coverage.", momentum: -2, national: -0.15 },
  { headline: "Youth turnout spikes in polling", body: "New registration data suggests the electorate may look different than expected.", momentum: 2, national: 0.3 },
];

const electionStates = [
  ["IN", "Indiana", 11, -14], ["KY", "Kentucky", 8, -19], ["VT", "Vermont", 3, 24], ["VA", "Virginia", 13, 5], ["GA", "Georgia", 16, -1], ["SC", "South Carolina", 9, -11],
  ["FL", "Florida", 30, -6], ["OH", "Ohio", 17, -9], ["WV", "West Virginia", 4, -28], ["NC", "North Carolina", 16, -2], ["NH", "New Hampshire", 4, 3], ["ME", "Maine", 4, 7],
  ["AL", "Alabama", 9, -25], ["CT", "Connecticut", 7, 14], ["DE", "Delaware", 3, 12], ["DC", "District of Columbia", 3, 40], ["IL", "Illinois", 19, 14], ["MD", "Maryland", 10, 25],
  ["MA", "Massachusetts", 11, 25], ["MS", "Mississippi", 6, -18], ["NJ", "New Jersey", 14, 12], ["OK", "Oklahoma", 7, -26], ["PA", "Pennsylvania", 19, 0], ["RI", "Rhode Island", 4, 15],
  ["TN", "Tennessee", 11, -20], ["MO", "Missouri", 10, -15], ["AR", "Arkansas", 6, -22], ["KS", "Kansas", 6, -16], ["LA", "Louisiana", 8, -19], ["MI", "Michigan", 15, 1],
  ["MN", "Minnesota", 10, 5], ["NE", "Nebraska", 5, -18], ["NM", "New Mexico", 5, 8], ["NY", "New York", 28, 20], ["ND", "North Dakota", 3, -27], ["SD", "South Dakota", 3, -24],
  ["TX", "Texas", 40, -8], ["WI", "Wisconsin", 10, 0], ["WY", "Wyoming", 3, -32], ["AZ", "Arizona", 11, -1], ["CO", "Colorado", 10, 8], ["IA", "Iowa", 6, -10],
  ["MT", "Montana", 4, -17], ["NV", "Nevada", 6, 0], ["UT", "Utah", 6, -20], ["CA", "California", 54, 25], ["ID", "Idaho", 4, -28], ["OR", "Oregon", 8, 10],
  ["WA", "Washington", 12, 14], ["HI", "Hawaii", 4, 20], ["AK", "Alaska", 3, -13],
] as const;

export default function Home() {
  const [selectedId, setSelectedId] = useState("shapiro");
  const [stage, setStage] = useState<"select" | "campaign">("select");
  const [panel, setPanel] = useState<"issues" | "how" | null>(null);
  const [game, setGame] = useState<GameState | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId],
  );
  const campaignCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === game?.candidateId) ?? selected,
    [game?.candidateId, selected],
  );

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("road-to-270-campaign");
      if (!saved) return;
      const parsed = JSON.parse(saved) as GameState;
      if (parsed?.candidateId && Array.isArray(parsed.states)) {
        const startingPoll = { turn: 0, national: parsed.national, states: Object.fromEntries(parsed.states.map((state) => [state.id, state.support])) };
        setGame({ ...parsed, data: Number.isFinite(parsed.data) ? parsed.data : 48, pollHistory: parsed.pollHistory?.length ? parsed.pollHistory : [startingPoll], resolution: null });
        setSelectedId(parsed.candidateId);
      }
    } catch {
      window.localStorage.removeItem("road-to-270-campaign");
    }
  }, []);

  useEffect(() => {
    if (game) window.localStorage.setItem("road-to-270-campaign", JSON.stringify({ ...game, resolution: null }));
  }, [game]);

  const launchGame = () => {
    setGame(createInitialGame(selected));
    setStage("campaign");
  };

  const returnToCampaign = () => {
    if (!game) launchGame();
    else setStage("campaign");
  };

  const newGame = () => {
    window.localStorage.removeItem("road-to-270-campaign");
    setGame(null);
    setStage("select");
  };

  const deployAction = () => {
    if (!game || game.gameOver) return;
    const action = campaignActions.find((item) => item.id === game.selectedAction) ?? campaignActions[0];
    const target = game.states.find((item) => item.id === game.selectedState) ?? game.states[0];
    if (game.funds + action.funds < 0) {
      setGame({ ...game, resolution: { title: "Insufficient funds", body: "The finance team cannot authorize this plan. Raise money or choose a lower-cost move.", changes: ["No week was used"] } });
      return;
    }
    if (game.energy + action.energy < 0) {
      setGame({ ...game, resolution: { title: "Candidate exhausted", body: "Your candidate cannot safely execute this schedule. Choose Candidate Reset before the next push.", changes: ["No week was used"] } });
      return;
    }
    if (game.capital + action.capital < 0) {
      setGame({ ...game, resolution: { title: "Not enough political capital", body: "Allies are unwilling to support the move. Build goodwill with speeches, field work, or town halls.", changes: ["No week was used"] } });
      return;
    }

    const efficiency = 0.82 + Math.min(0.35, game.momentum / 220) + Math.min(0.18, game.data / 500);
    const stateGain = action.support * efficiency;
    const targetOnly = !["policy", "rest", "fundraiser", "debate"].includes(action.id);
    let nextStates = game.states.map((state) => {
      let gain = state.id === target.id ? stateGain : 0;
      if (!targetOnly) gain += action.id === "policy" ? 0.32 : action.id === "debate" ? 0.18 : 0;
      return {
        ...state,
        support: clamp(state.support + gain, 24, 68),
        visits: state.id === target.id && targetOnly ? state.visits + 1 : state.visits,
        volunteers: state.id === target.id ? state.volunteers + action.volunteers : state.volunteers,
      };
    });

    const counterPool = nextStates.filter((state) => state.id !== target.id);
    const counterTarget = counterPool[(game.turn * 3 + selected.name.length) % counterPool.length];
    const counterHit = 0.45 + ((game.turn * 17) % 8) / 10;
    nextStates = nextStates.map((state) => state.id === counterTarget.id ? { ...state, support: clamp(state.support - counterHit, 24, 68) } : state);

    const event = game.turn % 3 === 0 ? events[(game.turn / 3 + selected.name.length) % events.length] : null;
    const nextTurn = game.turn + 1;
    const eventMomentum = event?.momentum ?? 0;
    const eventNational = event?.national ?? 0;
    const actionSummary = targetOnly ? `${action.name} deployed in ${target.name}.` : `${action.name} executed nationally.`;
    const changes = [
      action.support > 0 ? `${targetOnly ? target.id : "National"} support +${targetOnly ? stateGain.toFixed(1) : "0.3"}` : "Polling held steady",
      action.funds !== 0 ? `Cash ${signedMoney(action.funds)}` : "No cash cost",
      `${action.energy >= 0 ? "Energy" : "Energy"} ${signed(action.energy)}`,
      `Momentum ${signed(action.momentum + eventMomentum)}`,
    ];

    const nextNational = clamp(game.national + action.national + eventNational, 25, 64);
    if (audioEnabled) playCampaignAudio(action.id);
    setGame({
      ...game,
      turn: Math.min(14, nextTurn),
      funds: clamp(game.funds + action.funds, 0, 99),
      capital: clamp(game.capital + action.capital, 0, 100),
      momentum: clamp(game.momentum + action.momentum + eventMomentum, 0, 100),
      energy: clamp(game.energy + action.energy, 0, 100),
      volunteers: Math.max(0, game.volunteers + action.volunteers),
      national: nextNational,
      debate: clamp(game.debate + action.debate, 0, 100),
      data: clamp(game.data + (action.id === "digital" ? 12 : action.id === "doors" ? 7 : 2), 0, 100),
      states: nextStates,
      pollHistory: [...game.pollHistory, { turn: game.turn, national: nextNational, states: Object.fromEntries(nextStates.map((state) => [state.id, state.support])) }].slice(-15),
      feed: [`${turnDates[game.turn - 1]} · ${actionSummary}`, `Opponent counters in ${counterTarget.name}, trimming your support ${counterHit.toFixed(1)} points.`, ...(event ? [`Breaking · ${event.headline}`] : []), ...game.feed].slice(0, 8),
      resolution: {
        title: actionSummary,
        body: action.description,
        changes,
        event: event ? `${event.headline} — ${event.body}` : undefined,
        actionId: action.id,
      },
      gameOver: nextTurn > 14,
    });
  };

  return (
    <main className="game-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setStage("select")} aria-label="Road to 270 home">
          <span className="brand-star" aria-hidden="true">★</span>
          <span className="brand-number">270</span>
          <span className="brand-name">Road to 270</span>
        </button>
        <nav className="nav-links" aria-label="Primary navigation">
          <button className={stage === "campaign" ? "active" : ""} onClick={returnToCampaign}>Campaign</button>
          <button className={stage === "select" ? "active" : ""} onClick={() => setStage("select")}>Candidates</button>
          <button onClick={() => setPanel("issues")}>Issues</button>
          <button onClick={() => setPanel("how")}>How to play</button>
        </nav>
        <button className="outline-button" onClick={newGame}>New game</button>
      </header>

      {stage === "select" ? (
        <section className="select-screen">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-map" aria-hidden="true" />
          <div className="hero-copy">
            <div className="eyebrow"><span /> Election simulation · 2028</div>
            <h1>Road to <em>270</em></h1>
            <p className="hero-subtitle">Win the 2028 presidential election</p>
            <p className="hero-description">
              Build a coalition. Command the map. Survive the news cycle. Make history.
            </p>
            <div className="hero-metrics" aria-label="Selected candidate starting resources">
              <Metric label="Electoral votes" value="0 / 270" />
              <Metric label="Cash" value={`$${selected.cash.toFixed(1)}M`} />
              <Metric label="Political capital" value={String(selected.capital)} />
              <Metric label="Momentum" value={`+${selected.momentum}`} />
              <Metric label="Weeks" value="42" />
            </div>
          </div>

          <div className="candidate-zone">
            <div className="section-heading">
              <div>
                <span className="kicker">Choose your candidate</span>
                <h2>Eight paths to the White House</h2>
              </div>
              <p>Public figures appear in a fictional, unaffiliated strategy simulation.</p>
            </div>
            <div className="candidate-row" role="radiogroup" aria-label="Candidate roster">
              {candidates.map((candidate) => (
                <button
                  key={candidate.id}
                  className={`candidate-card ${selectedId === candidate.id ? "selected" : ""}`}
                  style={{ "--candidate-a": candidate.colors[0], "--candidate-b": candidate.colors[1] } as React.CSSProperties}
                  onClick={() => setSelectedId(candidate.id)}
                  role="radio"
                  aria-checked={selectedId === candidate.id}
                >
                  <span className="candidate-portrait">
                    <span className="portrait-rings" />
                    <span className="candidate-initials">{candidate.initials}</span>
                    <span className={`party-badge party-${candidate.party.toLowerCase()}`}>{candidate.party}</span>
                  </span>
                  <span className="candidate-content">
                    <span className="candidate-overline">{candidate.home} · {candidate.partyName}</span>
                    <strong>{candidate.name}</strong>
                    <span className="candidate-title">{candidate.title}</span>
                    <span className="candidate-tagline">{candidate.tagline}</span>
                    <span className="stat-list">
                      {candidate.stats.map((stat) => (
                        <span className="mini-stat" key={stat.label}>
                          <span>{stat.label}</span>
                          <i><b style={{ width: `${stat.value}%` }} /></i>
                          <em>{stat.value}</em>
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="selected-check" aria-hidden="true">✓</span>
                </button>
              ))}
            </div>
            <div className="launch-bar">
              <div className="launch-candidate">
                <span className="launch-avatar" style={{ background: `linear-gradient(145deg, ${selected.colors[0]}, ${selected.colors[1]})` }}>{selected.initials}</span>
                <span><small>Your candidate</small><strong>{selected.name}</strong></span>
              </div>
              <div className="launch-brief">
                <span><small>Difficulty</small><strong>{selected.party === "I" ? "Historic" : "Hard"}</strong></span>
                <span><small>Opening lane</small><strong>{selected.title.replace("The ", "")}</strong></span>
              </div>
              <button className="launch-button" onClick={launchGame}>
                Launch campaign <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>
      ) : (
        game ? <CampaignBoard candidate={campaignCandidate} game={game} setGame={setGame} deploy={deployAction} newGame={newGame} audioEnabled={audioEnabled} setAudioEnabled={setAudioEnabled} /> : null
      )}

      {panel && (
        <InfoPanel kind={panel} onClose={() => setPanel(null)} />
      )}

      <footer className="legal-strip">
        Fictional political strategy game. No candidate is affiliated with or has endorsed this project. Gameplay ratings and events are invented for entertainment.
      </footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CampaignBoard({ candidate, game, setGame, deploy, newGame, audioEnabled, setAudioEnabled }: { candidate: Candidate; game: GameState; setGame: (game: GameState) => void; deploy: () => void; newGame: () => void; audioEnabled: boolean; setAudioEnabled: (enabled: boolean) => void }) {
  const [consoleView, setConsoleView] = useState<"map" | "polls">("map");
  const target = game.states.find((state) => state.id === game.selectedState) ?? game.states[0];
  const action = campaignActions.find((item) => item.id === game.selectedAction) ?? campaignActions[0];
  const ev = projectedEv(game, candidate.party);
  const phase = phaseFor(game.turn);
  const isWinning = ev >= 270;

  if (game.gameOver && !game.resolution) {
    return <ElectionNight candidate={candidate} game={game} newGame={newGame} replay={() => setGame({ ...createInitialGame(candidate), selectedAction: game.selectedAction })} audioEnabled={audioEnabled} />;
  }

  return (
    <section className="campaign-screen">
      <div className="campaign-ribbon">
        <div className="command-candidate">
          <span style={{ background: `linear-gradient(145deg, ${candidate.colors[0]}, ${candidate.colors[1]})` }}>{candidate.initials}</span>
          <div><small>{candidate.partyName} campaign</small><strong>{candidate.name}</strong></div>
        </div>
        <div className="phase-clock">
          <small>{phase}</small>
          <strong>{turnDates[game.turn - 1]}, 2028</strong>
          <span>Week {game.turn} / 14</span>
        </div>
        <div className="ribbon-controls">
          <button className={`audio-toggle ${audioEnabled ? "active" : ""}`} onClick={() => { const next = !audioEnabled; setAudioEnabled(next); if (next) playCampaignAudio("toggle"); }} aria-pressed={audioEnabled}>
            <span aria-hidden="true">{audioEnabled ? "♪" : "×"}</span>{audioEnabled ? "Sound on" : "Sound off"}
          </button>
          <div className="save-status"><i /> Local save active</div>
        </div>
      </div>

      <div className="command-stats">
        <StatusMetric label="Projected EV" value={`${ev}`} tone={isWinning ? "gold" : "cyan"} sub="270 to win" />
        <StatusMetric label="Cash on hand" value={`$${game.funds.toFixed(2)}M`} sub={`${action.funds < 0 ? `$${Math.abs(action.funds).toFixed(2)}M plan` : "finance ready"}`} />
        <StatusMetric label="Political capital" value={`${Math.round(game.capital)}`} sub="coalition leverage" />
        <StatusMetric label="Momentum" value={`${Math.round(game.momentum)}`} sub={game.momentum > 60 ? "surging" : game.momentum < 40 ? "slipping" : "competitive"} />
        <StatusMetric label="Candidate energy" value={`${Math.round(game.energy)}%`} tone={game.energy < 25 ? "red" : "cyan"} sub={game.energy < 25 ? "recovery advised" : "schedule ready"} />
        <StatusMetric label="Volunteers" value={compactNumber(game.volunteers)} sub="field force" />
      </div>

      <div className="command-grid">
        <aside className="action-dock">
          <div className="dock-heading">
            <div><small>Weekly operations</small><h2>Choose a move</h2></div>
            <span>{14 - game.turn} left</span>
          </div>
          <div className="action-list">
            {campaignActions.map((item) => (
              <button key={item.id} className={`action-card ${game.selectedAction === item.id ? "selected" : ""}`} onClick={() => setGame({ ...game, selectedAction: item.id })}>
                <span className="action-mark">{item.mark}</span>
                <span className="action-copy"><small>{item.category}</small><strong>{item.name}</strong></span>
                <span className="action-cost">{item.funds > 0 ? `+$${item.funds.toFixed(1)}M` : item.funds < 0 ? `−$${Math.abs(item.funds).toFixed(2)}M` : "FREE"}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="map-console">
          <div className="console-heading">
            <div><small>National strategy map</small><h2>Select a battleground</h2></div>
            <div className="console-tabs" role="tablist" aria-label="Campaign intelligence view">
              <button className={consoleView === "map" ? "active" : ""} onClick={() => setConsoleView("map")} role="tab" aria-selected={consoleView === "map"}>Map</button>
              <button className={consoleView === "polls" ? "active" : ""} onClick={() => setConsoleView("polls")} role="tab" aria-selected={consoleView === "polls"}>Poll tracker</button>
            </div>
          </div>
          {consoleView === "map" ? <><div className="map-legend map-legend-inline"><span className="leaning" /> Leaning your way <span className="tossup" /> Toss-up <span className="trailing" /> Trailing</div><div className="battle-map">
            {game.states.map((state) => {
              const status = state.support >= 51.5 ? "leaning" : state.support < 48.5 ? "trailing" : "tossup";
              return (
                <button
                  key={state.id}
                  className={`state-pin ${status} ${game.selectedState === state.id ? "selected" : ""}`}
                  style={{ left: `${state.x}%`, top: `${state.y}%` }}
                  onClick={() => setGame({ ...game, selectedState: state.id })}
                  aria-label={`${state.name}, ${state.ev} electoral votes, ${state.support.toFixed(1)} percent support`}
                >
                  <strong>{state.id}</strong><span>{state.ev}</span>
                </button>
              );
            })}
            <div className="map-watermark"><span>270</span><small>to win</small></div>
          </div></> : <PollTracker candidate={candidate} game={game} setGame={setGame} />}
          <div className="target-brief">
            <div className="target-id"><span>{target.id}</span><div><small>Selected target</small><strong>{target.name} · {target.ev} EV</strong></div></div>
            <div className="poll-bar-block">
              <div><span>{candidate.name.split(" ").at(-1)} {target.support.toFixed(1)}%</span><span>Opponent {(100 - target.support).toFixed(1)}%</span></div>
              <i><b style={{ width: `${target.support}%` }} /></i>
            </div>
            <div className="target-facts"><span><small>Visits</small><strong>{target.visits}</strong></span><span><small>Field staff</small><strong>{compactNumber(target.volunteers)}</strong></span></div>
          </div>
          <div className="deploy-bar">
            <div>
              <span className="action-mark">{action.mark}</span>
              <div><small>Current plan</small><strong>{action.name}{["policy", "rest", "fundraiser", "debate"].includes(action.id) ? " · National" : ` · ${target.name}`}</strong><p>{action.description}</p></div>
            </div>
            <button className="deploy-button" onClick={deploy}>Deploy plan <span>→</span></button>
          </div>
        </div>

        <aside className="intel-dock">
          <section className="intel-card race-card">
            <div className="intel-heading"><span>Race intelligence</span><small>Live model</small></div>
            <div className="ev-ring" style={{ "--ev": `${Math.min(100, ev / 5.38)}%` } as React.CSSProperties}>
              <div><strong>{ev}</strong><span>Projected EV</span></div>
            </div>
            <div className="win-path"><span><i style={{ width: `${Math.min(100, ev / 2.7)}%` }} /></span><small>{Math.max(0, 270 - ev)} more electoral votes needed</small></div>
          </section>

          <section className="intel-card">
            <div className="intel-heading"><span>Campaign readiness</span><small>0—100</small></div>
            <Readiness label="National polling" value={game.national} />
            <Readiness label="Debate prep" value={game.debate} />
            <Readiness label="Data operation" value={game.data} />
            <Readiness label="Field intensity" value={Math.min(100, 30 + game.volunteers / 85)} />
          </section>

          <section className="intel-card news-card">
            <div className="intel-heading"><span>War room feed</span><small className="live-dot">Live</small></div>
            <div className="news-feed">
              {game.feed.slice(0, 5).map((item, index) => <p key={`${item}-${index}`}><i />{item}</p>)}
            </div>
          </section>
        </aside>
      </div>

      {game.resolution && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="resolution-title">
          <div className="resolution-card">
            {game.resolution.actionId && <ActionScene candidate={candidate} actionId={game.resolution.actionId} audioEnabled={audioEnabled} replayAudio={() => playCampaignAudio(game.resolution?.actionId ?? "toggle")} />}
            <span className="result-stamp">Week {game.turn === 14 && game.gameOver ? 14 : Math.max(1, game.turn - 1)} complete</span>
            <h2 id="resolution-title">{game.resolution.title}</h2>
            <p>{game.resolution.body}</p>
            <div className="change-grid">
              {game.resolution.changes.map((change) => <span key={change}>{change}</span>)}
            </div>
            {game.resolution.event && <div className="breaking-event"><small>Breaking development</small><strong>{game.resolution.event}</strong></div>}
            <button className="launch-button" onClick={() => setGame({ ...game, resolution: null })}>
              {game.gameOver ? "View election night" : `Continue to ${turnDates[game.turn - 1]}`} <span>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ElectionNight({ candidate, game, newGame, replay, audioEnabled }: { candidate: Candidate; game: GameState; newGame: () => void; replay: () => void; audioEnabled: boolean }) {
  const duration = 78;
  const callStart = 2.5;
  const callSpacing = 1.27;
  const [elapsed, setElapsed] = useState(0);
  const results = useMemo(() => buildElectionResults(candidate, game), [candidate, game]);
  const calledCount = elapsed < callStart ? 0 : Math.min(results.length, Math.floor((elapsed - callStart) / callSpacing) + 1);
  const called = results.slice(0, calledCount);
  const candidateEv = called.filter((state) => state.winner === "candidate").reduce((sum, state) => sum + state.ev, 0);
  const opponentEv = called.filter((state) => state.winner === "opponent").reduce((sum, state) => sum + state.ev, 0);
  const finalCandidateEv = results.filter((state) => state.winner === "candidate").reduce((sum, state) => sum + state.ev, 0);
  const finalOpponentEv = 538 - finalCandidateEv;
  const complete = elapsed >= duration;
  const winnerIsCandidate = finalCandidateEv >= 270;
  const latest = called.at(-1);
  const latestIsFlip = Boolean(latest?.flipped);
  const next = results[calledCount];
  const reporting = next ? Math.min(99, Math.max(2, Math.round(((elapsed - callStart - calledCount * callSpacing) / callSpacing + 1) * 92))) : 100;
  const popularShare = clamp(game.national + (game.momentum - 50) / 24, 36, 59);
  const voteFraction = Math.min(1, elapsed / (duration - 7));
  const totalVotes = Math.round(158_200_000 * voteFraction);
  const candidateVotes = Math.round(totalVotes * popularShare / 100);
  const opponentVotes = Math.max(0, totalVotes - candidateVotes);
  const opponentName = candidate.party === "D" ? "Evan Mercer" : candidate.party === "R" ? "Elena Torres" : "Major-party field";
  const virtualMinutes = Math.min(300, Math.floor((elapsed / duration) * 300));
  const virtualHour = 19 + Math.floor(virtualMinutes / 60);
  const virtualMinute = virtualMinutes % 60;
  const virtualTime = `${virtualHour > 12 ? virtualHour - 12 : virtualHour}:${String(virtualMinute).padStart(2, "0")} ${virtualHour >= 24 ? "AM" : "PM"} ET`;

  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => {
      const seconds = (performance.now() - started) / 1000;
      setElapsed((current) => current >= duration ? duration : Math.min(duration, seconds));
      if (seconds >= duration) window.clearInterval(timer);
    }, 200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioEnabled && calledCount > 0 && calledCount % 5 === 0) playCampaignAudio("call");
  }, [audioEnabled, calledCount]);

  useEffect(() => {
    if (audioEnabled && complete) playCampaignAudio("decision");
  }, [audioEnabled, complete]);

  const progress = Math.min(100, elapsed / duration * 100);

  return (
    <section className={`election-broadcast ${complete ? "complete" : ""}`}>
      <header className="broadcast-header">
        <div className="broadcast-brand"><span>★</span><div><strong>ROAD TO 270</strong><small>Election headquarters</small></div></div>
        <div className="broadcast-live"><i /> Live · {virtualTime}</div>
        <div className="broadcast-controls"><span>{Math.max(0, Math.ceil(duration - elapsed))} sec to projection</span><button onClick={() => setElapsed(duration)}>Skip to result</button></div>
        <div className="broadcast-progress"><i style={{ width: `${progress}%` }} /></div>
      </header>

      <div className="ev-scoreboard">
        <div className="score-candidate">
          <span className="score-avatar" style={{ background: `linear-gradient(145deg, ${candidate.colors[0]}, ${candidate.colors[1]})` }}>{candidate.initials}</span>
          <div><small>{candidate.partyName}</small><strong>{candidate.name}</strong><span>{formatVotes(candidateVotes)} votes · {popularShare.toFixed(1)}%</span></div>
          <b>{complete ? finalCandidateEv : candidateEv}</b>
        </div>
        <div className="score-center"><span>270</span><small>electoral votes to win</small><i><b style={{ width: `${Math.min(100, ((complete ? finalCandidateEv : candidateEv) / 270) * 100)}%` }} /></i></div>
        <div className="score-opponent">
          <b>{complete ? finalOpponentEv : opponentEv}</b>
          <div><small>{candidate.party === "D" ? "Republican" : candidate.party === "R" ? "Democrat" : "Combined opposition"}</small><strong>{opponentName}</strong><span>{formatVotes(opponentVotes)} votes · {(100 - popularShare).toFixed(1)}%</span></div>
          <span className="score-avatar opponent">{candidate.party === "D" ? "EM" : candidate.party === "R" ? "ET" : "OP"}</span>
        </div>
      </div>

      <div className="broadcast-grid">
        <main className="state-wall-panel">
          <div className={`race-alert ${complete ? "projected" : latestIsFlip ? "flip-alert" : latest ? "called" : "waiting"}`}>
            <span>{complete ? "Decision desk projection" : latestIsFlip ? "State flipped" : latest ? "State called" : "Polls closing"}</span>
            <strong>{complete ? `${winnerIsCandidate ? candidate.name : opponentName} wins the presidency` : latest ? `${latest.name} · ${latest.ev} EV` : "First results moments away"}</strong>
            <em>{complete ? `${winnerIsCandidate ? finalCandidateEv : finalOpponentEv} electoral votes` : latest ? `${latest.winner === "candidate" ? candidate.name : opponentName} +${latest.margin.toFixed(1)}` : "Live returns beginning at 7:00 PM ET"}</em>
          </div>

          <div className="state-wall" aria-label="State election calls">
            {results.map((state, index) => {
              const isCalled = index < calledCount;
              const isNext = index === calledCount;
              return (
                <div key={state.abbr} className={`broadcast-state ${isCalled ? `called ${state.winner}${state.flipped ? " flipped" : ""}` : ""} ${isNext ? "reporting" : ""}`} aria-label={`${state.name}, ${state.ev} electoral votes${isCalled ? `, called for ${state.winner === "candidate" ? candidate.name : opponentName}${state.flipped ? ", flipped from its pre-election lean" : ""}` : isNext ? `, ${reporting}% reporting` : ", not yet called"}`}>
                  <strong>{state.abbr}</strong><span>{state.ev}</span><small>{isCalled ? (state.winner === "candidate" ? candidate.initials : "OPP") : isNext ? `${reporting}%` : "—"}</small>
                  {isCalled && state.flipped && <b className="flip-badge">Flipped</b>}
                </div>
              );
            })}
          </div>

          <div className="popular-vote-panel">
            <div><span>National popular vote</span><strong>{formatVotes(totalVotes)} counted</strong></div>
            <div className="popular-bar"><i style={{ width: `${popularShare}%`, background: candidate.colors[0] }} /><b /></div>
            <div><span style={{ color: candidate.colors[0] }}>{candidate.name.split(" ").at(-1)} {popularShare.toFixed(1)}%</span><span>{opponentName.split(" ").at(-1)} {(100 - popularShare).toFixed(1)}%</span></div>
          </div>
        </main>

        <aside className="broadcast-sidebar">
          <section className="latest-call-card">
            <div className="side-heading"><span>{latest ? "Latest call" : "Decision desk"}</span><i>Live</i></div>
            {latest ? <>
              <div className={`latest-state ${latest.winner} ${latest.flipped ? "flipped" : ""}`}><strong>{latest.abbr}</strong><span>{latest.ev}<small>EV</small></span>{latest.flipped && <b className="latest-flip-badge">Flipped</b>}</div>
              <h3>{latest.name}</h3>
              <p>Projected for <b>{latest.winner === "candidate" ? candidate.name : opponentName}</b></p>
              <div className="latest-margin"><span>{latest.winner === "candidate" ? candidate.name.split(" ").at(-1) : opponentName.split(" ").at(-1)}</span><strong>+{latest.margin.toFixed(1)}</strong></div>
            </> : <div className="standby-pulse"><i /><strong>Stand by</strong><span>Vote data incoming</span></div>}
          </section>

          <section className="key-races-card">
            <div className="side-heading"><span>Key race watch</span><i>{game.states.length} battlegrounds</i></div>
            {game.states.slice().sort((a, b) => Math.abs(a.support - 50) - Math.abs(b.support - 50)).slice(0, 7).map((state) => {
              const result = results.find((item) => item.abbr === state.id);
              const resultIndex = results.findIndex((item) => item.abbr === state.id);
              const stateCalled = resultIndex >= 0 && resultIndex < calledCount;
              return <div className={`key-race ${stateCalled && result?.flipped ? "flipped" : ""}`} key={state.id}><strong>{state.id}<small>{state.ev} EV</small></strong><span>{stateCalled ? (result?.flipped ? "Flipped" : "Called") : resultIndex === calledCount ? `${reporting}% in` : "Too early"}</span><em className={stateCalled ? result?.winner : ""}>{stateCalled ? (result?.winner === "candidate" ? candidate.initials : "OPP") : state.support.toFixed(1)}</em></div>;
            })}
          </section>

          <section className="next-close-card">
            <small>Now reporting</small><strong>{next ? next.name : "All polls closed"}</strong><span>{next ? `${next.ev} electoral votes · ${reporting}% reporting` : "538 electoral votes allocated"}</span>
          </section>
        </aside>
      </div>

      <div className="broadcast-ticker"><b>ROAD TO 270</b><span>{complete ? `THE DECISION DESK PROJECTS ${winnerIsCandidate ? candidate.name.toUpperCase() : opponentName.toUpperCase()} AS THE NEXT PRESIDENT` : latest ? `${latest.flipped ? "FLIP ALERT · " : ""}${latest.name.toUpperCase()} CALLED FOR ${(latest.winner === "candidate" ? candidate.name : opponentName).toUpperCase()} · ${538 - candidateEv - opponentEv} ELECTORAL VOTES REMAIN` : "FIRST POLLS HAVE CLOSED · RESULTS ARE BEGINNING TO ARRIVE"}</span></div>

      {complete && <div className="projection-overlay">
        <div className="projection-card">
          <span className="projection-label">Decision desk projection</span>
          <div className="projection-star">★</div>
          <h1>{winnerIsCandidate ? "President-elect" : "Race called"}</h1>
          <h2>{winnerIsCandidate ? candidate.name : opponentName}</h2>
          <p>{winnerIsCandidate ? `${candidate.name} has secured ${finalCandidateEv} electoral votes and will become the next President of the United States.` : `${opponentName} crosses 270. Your campaign finishes with ${finalCandidateEv} electoral votes.`}</p>
          <div className="projection-score"><span><small>{candidate.name.split(" ").at(-1)}</small><strong>{finalCandidateEv}</strong></span><i>—</i><span><small>{opponentName.split(" ").at(-1)}</small><strong>{finalOpponentEv}</strong></span></div>
          <div className="result-actions"><button className="launch-button" onClick={newGame}>Start new race <span>→</span></button><button className="outline-button" onClick={replay}>Replay candidate</button></div>
        </div>
      </div>}
    </section>
  );
}

function buildElectionResults(candidate: Candidate, game: GameState) {
  const targetEv = projectedEv(game, candidate.party);
  const scored = electionStates.map(([abbr, name, ev, lean]) => {
    const battleground = game.states.find((state) => state.id === abbr);
    const battlegroundEdge = battleground ? (battleground.support - 50) * 3.2 : 0;
    const baseScore = candidate.party === "D" ? lean : candidate.party === "R" ? -lean : -Math.abs(lean) * 0.72 + (candidate.home.includes(name) ? 12 : 0);
    return { abbr, name, ev, lean, score: baseScore + battlegroundEdge };
  });
  const strongest = [...scored].sort((a, b) => b.score - a.score);
  const candidateStates = new Set<string>();
  let accumulated = 0;
  for (const state of strongest) {
    if (accumulated >= targetEv) break;
    candidateStates.add(state.abbr);
    accumulated += state.ev;
  }
  return scored.map((state) => {
    const winner = candidateStates.has(state.abbr) ? "candidate" as const : "opponent" as const;
    const baselineWinner = candidate.party === "D" ? (state.lean >= 0 ? "candidate" : "opponent") : candidate.party === "R" ? (state.lean <= 0 ? "candidate" : "opponent") : "opponent";
    const rawMargin = 0.4 + Math.abs(state.score) * 0.47 + ((state.ev * 7) % 9) / 10;
    return { ...state, winner, flipped: winner !== baselineWinner, margin: clamp(rawMargin, 0.4, 24.8) };
  });
}

function formatVotes(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return String(value);
}

function PollTracker({ candidate, game, setGame }: { candidate: Candidate; game: GameState; setGame: (game: GameState) => void }) {
  const history = game.pollHistory?.length ? game.pollHistory : [{ turn: 0, national: game.national, states: Object.fromEntries(game.states.map((state) => [state.id, state.support])) }];
  const chartWidth = 620;
  const chartHeight = 185;
  const minPoll = Math.min(42, ...history.map((point) => point.national)) - 1;
  const maxPoll = Math.max(54, ...history.map((point) => point.national)) + 1;
  const points = history.map((point, index) => {
    const x = history.length === 1 ? 16 : 16 + (index / (history.length - 1)) * (chartWidth - 32);
    const y = 14 + ((maxPoll - point.national) / Math.max(1, maxPoll - minPoll)) * (chartHeight - 34);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const starting = history[0];
  const last = history.at(-1) ?? starting;
  const nationalDelta = last.national - starting.national;

  return (
    <div className="poll-tracker" role="tabpanel">
      <div className="poll-chart-card">
        <div className="poll-card-heading">
          <div><small>National polling average</small><strong>{game.national.toFixed(1)}%</strong></div>
          <span className={nationalDelta >= 0 ? "up" : "down"}>{signed(Number(nationalDelta.toFixed(1)))} since launch</span>
        </div>
        <div className="chart-shell">
          <div className="chart-y-axis"><span>{maxPoll.toFixed(0)}%</span><span>{((maxPoll + minPoll) / 2).toFixed(0)}%</span><span>{minPoll.toFixed(0)}%</span></div>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={`National polling trend from ${starting.national.toFixed(1)} to ${last.national.toFixed(1)} percent`}>
            <defs>
              <linearGradient id="pollFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={candidate.colors[0]} stopOpacity=".38" /><stop offset="1" stopColor={candidate.colors[0]} stopOpacity="0" /></linearGradient>
              <filter id="pollGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            {[35, 75, 115, 155].map((y) => <line key={y} x1="16" x2={chartWidth - 16} y1={y} y2={y} className="chart-grid-line" />)}
            {history.length > 1 && <polygon points={`16,${chartHeight - 18} ${points} ${chartWidth - 16},${chartHeight - 18}`} fill="url(#pollFill)" />}
            <polyline points={points} fill="none" stroke={candidate.colors[0]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#pollGlow)" />
            {history.map((point, index) => {
              const [x, y] = points.split(" ")[index].split(",");
              return <circle key={`${point.turn}-${index}`} cx={x} cy={y} r="5" fill="#07111f" stroke={candidate.colors[0]} strokeWidth="3"><title>Week {point.turn}: {point.national.toFixed(1)}%</title></circle>;
            })}
          </svg>
          <div className="chart-x-axis"><span>Launch</span><span>Nomination</span><span>Convention</span><span>Election</span></div>
        </div>
      </div>
      <div className="state-poll-grid">
        {game.states.map((state) => {
          const start = starting.states[state.id] ?? state.support;
          const delta = state.support - start;
          return (
            <button key={state.id} className={game.selectedState === state.id ? "selected" : ""} onClick={() => setGame({ ...game, selectedState: state.id })}>
              <span className="state-poll-id">{state.id}<small>{state.ev} EV</small></span>
              <span className="state-poll-value"><strong>{state.support.toFixed(1)}%</strong><em className={delta >= 0 ? "up" : "down"}>{signed(Number(delta.toFixed(1)))}</em></span>
              <i><b style={{ width: `${state.support}%` }} /></i>
            </button>
          );
        })}
      </div>
      <p className="poll-note">Fictional rolling average · Updates after every campaign week · Click a state to target it</p>
    </div>
  );
}

function ActionScene({ candidate, actionId, audioEnabled, replayAudio }: { candidate: Candidate; actionId: string; audioEnabled: boolean; replayAudio: () => void }) {
  const isSpeech = actionId === "speech";
  const labels: Record<string, string> = {
    speech: "Prime-time address", doors: "Field surge", townhall: "Town hall", fundraiser: "Finance reception", digital: "Digital command", policy: "Policy launch", debate: "Debate camp", oppo: "Research operation", rest: "Campaign reset",
  };
  return (
    <div className={`action-scene scene-${actionId}`} style={{ "--scene-a": candidate.colors[0], "--scene-b": candidate.colors[1] } as React.CSSProperties}>
      <div className="scene-beams" aria-hidden="true"><i /><i /><i /></div>
      {isSpeech ? (
        <>
          <div className="camera-flash flash-one" /><div className="camera-flash flash-two" /><div className="camera-flash flash-three" />
          <div className="crowd-layer" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <i key={index} style={{ animationDelay: `${index * -0.11}s`, height: `${32 + (index % 4) * 5}px` }}><b /></i>)}</div>
          <div className="podium-speaker" aria-label={`${candidate.name} speaking at a campaign podium`}>
            <span className="speaker-head" /><span className="speaker-body"><em>{candidate.initials}</em></span>
            <span className="podium"><i /><b>270</b><small>{candidate.name}</small></span>
          </div>
          <div className="applause-meter"><span>Crowd energy</span><i><b /></i><strong>ROARING</strong></div>
        </>
      ) : (
        <div className="generic-action-visual"><span>{campaignActions.find((action) => action.id === actionId)?.mark ?? "◈"}</span><i /><b>{labels[actionId] ?? "Campaign operation"}</b></div>
      )}
      <div className="scene-caption"><small>Live campaign moment</small><strong>{labels[actionId] ?? "Campaign operation"}</strong></div>
      <button className="scene-audio" onClick={replayAudio} disabled={!audioEnabled} aria-label={audioEnabled ? "Replay campaign sound" : "Enable sound from the campaign dashboard first"}>{audioEnabled ? "♪ Replay" : "Sound off"}</button>
    </div>
  );
}

function InfoPanel({ kind, onClose }: { kind: "issues" | "how"; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="info-panel">
        <button className="close-button" onClick={onClose} aria-label="Close panel">×</button>
        <span className="eyebrow"><span /> Campaign briefing</span>
        {kind === "how" ? (
          <>
            <h2>How to reach 270</h2>
            <div className="briefing-grid">
              <article><b>01</b><strong>Pick a path</strong><p>Every public figure starts with different cash, capital, momentum, strengths, and liabilities.</p></article>
              <article><b>02</b><strong>Target the map</strong><p>Select a battleground, then pair it with a speech, field push, fundraiser, ad blitz, policy move, or recovery week.</p></article>
              <article><b>03</b><strong>Manage the candidate</strong><p>Cash buys reach; political capital unlocks allies; energy limits the schedule; momentum amplifies every move.</p></article>
              <article><b>04</b><strong>Survive events</strong><p>Rivals counter-program, news breaks, debates loom, and one bad week can flip a close state.</p></article>
            </div>
          </>
        ) : (
          <>
            <h2>The 2028 issue landscape</h2>
            <p className="panel-lede">Issue salience changes through the fictional season. National policy rollouts improve broad support; local events reward targeted campaigning.</p>
            <div className="issue-grid">
              {[
                ["Cost of living", 92, "Prices, housing, wages"], ["Healthcare", 81, "Access, costs, rural care"], ["Immigration", 78, "Border, labor, legal pathways"], ["AI & jobs", 74, "Automation, education, safety"], ["Abortion", 71, "Federal and state authority"], ["Climate & energy", 63, "Reliability, transition, resilience"],
              ].map(([name, value, note]) => <article key={String(name)}><div><strong>{name}</strong><span>{note}</span></div><em>{value}</em><i><b style={{ width: `${value}%` }} /></i></article>)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatusMetric({ label, value, sub, tone = "cyan" }: { label: string; value: string; sub: string; tone?: "cyan" | "gold" | "red" }) {
  return <div className={`status-metric tone-${tone}`}><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>;
}

function Readiness({ label, value }: { label: string; value: number }) {
  return <div className="readiness"><div><span>{label}</span><em>{Math.round(value)}</em></div><i><b style={{ width: `${value}%` }} /></i></div>;
}

function createInitialGame(candidate: Candidate): GameState {
  const supportBase = candidate.party === "D" ? 49.2 : candidate.party === "R" ? 50.2 : 38.5;
  const states = raceStateTemplates.map((state) => ({
    ...state,
    support: clamp(supportBase + (candidate.party === "D" ? state.demLean : candidate.party === "R" ? -state.demLean : Math.abs(state.demLean) * -0.35), 34, 57),
    visits: 0,
    volunteers: candidate.party === "I" ? 70 : 180,
  }));
  return {
    candidateId: candidate.id,
    turn: 1,
    funds: candidate.cash,
    capital: candidate.capital,
    momentum: candidate.momentum,
    energy: 88,
    volunteers: candidate.party === "I" ? 650 : 1350,
    national: candidate.party === "I" ? 35 : 47 + (candidate.momentum - 50) / 20,
    debate: candidate.stats.some((stat) => stat.label === "Debate") ? 78 : 52,
    data: candidate.stats.some((stat) => stat.label === "Digital") ? 82 : 48,
    states,
    pollHistory: [{ turn: 0, national: candidate.party === "I" ? 35 : 47 + (candidate.momentum - 50) / 20, states: Object.fromEntries(states.map((state) => [state.id, state.support])) }],
    selectedState: "PA",
    selectedAction: "speech",
    feed: [
      `Campaign launches in ${candidate.home} before a national crowd.`,
      "Field directors identify twelve states with plausible paths to victory.",
      "Rival campaigns reserve early television and streaming inventory.",
    ],
    resolution: null,
    gameOver: false,
  };
}

function projectedEv(game: GameState, party: Candidate["party"]) {
  const safe = party === "D" ? 226 : party === "R" ? 231 : 118;
  return Math.min(538, safe + game.states.reduce((total, state) => total + (state.support >= 50 ? state.ev : 0), 0));
}

function phaseFor(turn: number) {
  if (turn <= 4) return "Primary sprint";
  if (turn <= 8) return "Nomination fight";
  if (turn <= 11) return "Convention & reset";
  return "General election";
}

function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function signed(value: number) { return `${value >= 0 ? "+" : "−"}${Math.abs(value)}`; }
function signedMoney(value: number) { return `${value >= 0 ? "+" : "−"}$${Math.abs(value).toFixed(2)}M`; }
function compactNumber(value: number) { return value >= 1000 ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K` : String(Math.round(value)); }

function playCampaignAudio(actionId: string) {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  const context = new AudioContextCtor();
  const now = context.currentTime;
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.11, now + 0.06);
  master.gain.exponentialRampToValueAtTime(0.0001, now + (actionId === "speech" ? 2.6 : 1.1));
  master.connect(context.destination);

  const tone = (frequency: number, start: number, duration: number, type: OscillatorType = "sine", volume = 0.12) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now + start);
    gain.gain.setValueAtTime(0.0001, now + start);
    gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);
    oscillator.connect(gain).connect(master);
    oscillator.start(now + start);
    oscillator.stop(now + start + duration + 0.02);
  };

  if (actionId === "speech") {
    const crowdBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 2.4), context.sampleRate);
    const crowdData = crowdBuffer.getChannelData(0);
    for (let index = 0; index < crowdData.length; index++) crowdData[index] = (Math.random() * 2 - 1) * (0.45 + Math.sin(index / 5400) * 0.18);
    const crowd = context.createBufferSource();
    const crowdFilter = context.createBiquadFilter();
    const crowdGain = context.createGain();
    crowd.buffer = crowdBuffer;
    crowdFilter.type = "bandpass";
    crowdFilter.frequency.value = 780;
    crowdFilter.Q.value = 0.45;
    crowdGain.gain.setValueAtTime(0.035, now);
    crowdGain.gain.linearRampToValueAtTime(0.22, now + 1.1);
    crowdGain.gain.linearRampToValueAtTime(0.04, now + 2.35);
    crowd.connect(crowdFilter).connect(crowdGain).connect(master);
    crowd.start(now);

    for (let clap = 0; clap < 12; clap++) {
      const clapBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.065), context.sampleRate);
      const clapData = clapBuffer.getChannelData(0);
      for (let index = 0; index < clapData.length; index++) clapData[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / clapData.length, 2);
      const clapSource = context.createBufferSource();
      const clapFilter = context.createBiquadFilter();
      const clapGain = context.createGain();
      clapSource.buffer = clapBuffer;
      clapFilter.type = "highpass";
      clapFilter.frequency.value = 900 + (clap % 4) * 170;
      clapGain.gain.value = 0.16;
      clapSource.connect(clapFilter).connect(clapGain).connect(master);
      clapSource.start(now + 0.18 + clap * 0.14 + (clap % 3) * 0.025);
    }
    tone(261.6, 0.05, 0.8, "triangle", 0.13);
    tone(329.6, 0.25, 0.9, "triangle", 0.11);
    tone(392, 0.48, 1.05, "triangle", 0.1);
  } else {
    const notes: Record<string, number[]> = {
      toggle: [523, 659], call: [392, 523], decision: [262, 330, 392, 523], doors: [220, 330, 440], townhall: [294, 392], fundraiser: [523, 659, 784], digital: [440, 660, 880], policy: [262, 330, 392], debate: [196, 294, 392], oppo: [185, 165], rest: [330, 294, 262],
    };
    (notes[actionId] ?? [392, 523]).forEach((note, index) => tone(note, index * 0.12, 0.3, actionId === "digital" ? "square" : "triangle", 0.09));
  }
  window.setTimeout(() => { void context.close(); }, actionId === "speech" ? 3000 : 1400);
}
