import React from 'react';

export interface SchematicProps {
  isHovered?: boolean;
  isRevealed?: boolean;
}

// 01. AI & Automation: Pipeline Execution & Retry State Machine
export const AutomationSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <linearGradient id="sts-auto-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
        <filter id="glow-auto" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Grid track */}
      <line x1="20" y1="50" x2="340" y2="50" stroke="rgba(255, 255, 255, 0.12)" strokeDasharray="3 3" />
      <path
        d="M48 50 H110 M155 50 H215 M255 50 H315"
        stroke={active ? 'url(#sts-auto-grad)' : 'rgba(255, 255, 255, 0.25)'}
        strokeWidth={active ? '2.5' : '1.5'}
        style={{ transition: 'stroke-width 0.3s ease' }}
      />

      {/* Animated Traveling Data Packets */}
      <circle cx="75" cy="50" r={active ? 3.5 : 2} fill="#FFFFFF" filter={active ? 'url(#glow-auto)' : 'none'}>
        <animate attributeName="cx" values="48;110" dur={active ? '1.2s' : '2.4s'} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;1;0.1" dur={active ? '1.2s' : '2.4s'} repeatCount="indefinite" />
      </circle>
      <circle cx="180" cy="50" r={active ? 3.5 : 2} fill="#FFFFFF" filter={active ? 'url(#glow-auto)' : 'none'}>
        <animate attributeName="cx" values="155;215" dur={active ? '1.2s' : '2.4s'} begin={active ? '0.3s' : '0.6s'} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;1;0.1" dur={active ? '1.2s' : '2.4s'} begin={active ? '0.3s' : '0.6s'} repeatCount="indefinite" />
      </circle>
      <circle cx="280" cy="50" r={active ? 3.5 : 2} fill="#FFFFFF" filter={active ? 'url(#glow-auto)' : 'none'}>
        <animate attributeName="cx" values="255;315" dur={active ? '1.2s' : '2.4s'} begin={active ? '0.6s' : '1.2s'} repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.1;1;0.1" dur={active ? '1.2s' : '2.4s'} begin={active ? '0.6s' : '1.2s'} repeatCount="indefinite" />
      </circle>

      {/* Stage 1: Ingress Webhook */}
      <g transform="translate(16, 32)">
        <rect
          width="34"
          height="36"
          rx="6"
          fill="#111315"
          stroke={active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}
          strokeWidth="1.2"
        />
        <text x="17" y="16" fill="#888888" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          01
        </text>
        <text x="17" y="27" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          TRIG
        </text>
      </g>

      {/* Stage 2: Mutex Lock & Retry Worker */}
      <g transform="translate(108, 26)">
        <rect
          width="48"
          height="48"
          rx="8"
          fill="#16191A"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          strokeWidth={active ? '2' : '1.2'}
        />
        <circle cx="24" cy="18" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="24" y="32" fill="#888888" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          02 MUTEX
        </text>
        <text x="24" y="42" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          RETRY:3
        </text>
      </g>

      {/* Stage 3: Fault Gate & Exp Jitter */}
      <g transform="translate(215, 32)">
        <rect
          width="40"
          height="36"
          rx="6"
          fill="#111315"
          stroke={active ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.18)'}
          strokeWidth="1.2"
        />
        <text x="20" y="16" fill="#888888" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
          03
        </text>
        <text x="20" y="27" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          SAFE
        </text>
      </g>

      {/* Stage 4: Output 200 Finality */}
      <g transform="translate(315, 34)">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="#1C1F22"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
          strokeWidth={active ? '2' : '1.2'}
        />
        <text x="16" y="20" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          200
        </text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          PIPELINE: INGRESS UUID ➔ WORKER LOCK ➔ EXP JITTER ➔ WAL COMMIT
        </text>
      )}
    </svg>
  );
};

// 02. Marketing & Ads: Millisecond Real-Time Ad Auction Waves
export const MarketingSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      <defs>
        <filter id="glow-mkt" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Latency Axis Scale */}
      <line x1="20" y1="70" x2="340" y2="70" stroke="rgba(255, 255, 255, 0.12)" />
      <text x="30" y="82" fill="#888888" fontSize="7" fontFamily="monospace">0ms INGEST</text>
      <text x="180" y="82" fill="#888888" fontSize="7" fontFamily="monospace" textAnchor="middle">45ms MULTI-DSP</text>
      <text x="330" y="82" fill="#FFFFFF" fontSize="7" fontFamily="monospace" textAnchor="end">88ms CLEAR</text>

      {/* Competing Bidding Waves */}
      <path
        d="M20 52 Q 80 18, 140 45 T 260 25 T 340 35"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        fill="none"
      />
      <path
        d="M20 60 Q 90 35, 170 55 T 280 20 T 340 22"
        stroke="#FFFFFF"
        strokeWidth={active ? '2.4' : '1.5'}
        filter={active ? 'url(#glow-mkt)' : 'none'}
        fill="none"
      />

      {/* Auction Clearing Settlement Node */}
      <g transform="translate(325, 14)">
        <circle cx="12" cy="12" r="12" fill="#16191A" stroke="#FFFFFF" strokeWidth="1.8" />
        <path d="M8 12 L11 15 L16 9" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Active Bid Value Tag */}
      <g transform="translate(150, 8)">
        <rect
          width="62"
          height="20"
          rx="5"
          fill="#1C1F22"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.25)'}
          strokeWidth="1.2"
        />
        <text x="31" y="14" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          $4.82 CPM
        </text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="96" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          AUCTION ENGINE: SSP BROADCAST ➔ DSP BIDDING ➔ VICKREY 2ND PRICE
        </text>
      )}
    </svg>
  );
};

// 03. Web Design: Browser DOM-to-Pixel Rendering Path
export const WebDesignSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Frame Wireframe Container */}
      <rect x="25" y="10" width="310" height="66" rx="8" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" />
      
      {/* Browser Tab Bar */}
      <line x1="25" y1="26" x2="335" y2="26" stroke="rgba(255,255,255,0.1)" />
      <circle cx="37" cy="18" r="2.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="46" cy="18" r="2.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="55" cy="18" r="2.5" fill="rgba(255,255,255,0.3)" />
      <text x="180" y="20" fill="#888888" fontSize="7" fontFamily="monospace" textAnchor="middle">
        CHROME COMPOSITOR: PARSE → RASTER → 60 FPS
      </text>

      {/* Rendering Pipeline Stages */}
      <g transform="translate(36, 34)">
        <rect width="48" height="28" rx="5" fill="#141414" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.2)'} />
        <text x="24" y="17" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle">DOM</text>
      </g>

      <path d="M88 48 L108 48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

      <g transform="translate(112, 34)">
        <rect width="52" height="28" rx="5" fill="#141414" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.2)'} />
        <text x="26" y="17" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle">LAYOUT</text>
      </g>

      <path d="M168 48 L188 48" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />

      <g transform="translate(192, 34)">
        <rect width="56" height="28" rx="5" fill="#141414" stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.2)'} />
        <text x="28" y="17" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle">COMPOSITE</text>
      </g>

      <path d="M252 48 L272 48" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

      <g transform="translate(276, 34)">
        <rect
          width="48"
          height="28"
          rx="5"
          fill="#22262A"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1.5"
        />
        <text x="24" y="17" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          PAINT
        </text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          CRITICAL PATH: BYTE TOKENS ➔ TREE BUILD ➔ GEOMETRY ➔ GPU RASTER
        </text>
      )}
    </svg>
  );
};

// 04. E-commerce: Tokenized Payment Vault & 3-D Secure Handshake
export const EcommerceSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Encryption Tunnel Lines */}
      <path
        d="M30 45 C 90 20, 150 70, 210 45 S 290 25, 330 45"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M30 45 C 90 20, 150 70, 210 45 S 290 25, 330 45"
        stroke="#FFFFFF"
        strokeWidth={active ? '2' : '1.5'}
        strokeDasharray="6 4"
        fill="none"
      >
        <animate attributeName="stroke-dashoffset" values="0;-40" dur={active ? '1.2s' : '2s'} repeatCount="indefinite" />
      </path>

      {/* Token Vault Badge 1: Client Card */}
      <g transform="translate(25, 26)">
        <rect width="48" height="36" rx="6" fill="#141618" stroke="rgba(255,255,255,0.25)" />
        <rect x="6" y="8" width="14" height="8" rx="1.5" fill="rgba(255,255,255,0.4)" />
        <line x1="6" y1="24" x2="42" y2="24" stroke="#FFFFFF" strokeWidth="1.5" />
      </g>

      {/* Step 2: 3-D Secure Cryptographic Vault */}
      <g transform="translate(140, 20)">
        <rect
          width="80"
          height="48"
          rx="8"
          fill="#181B1E"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          strokeWidth="1.5"
        />
        <circle cx="40" cy="18" r="6" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
        <path d="M40 15 V17" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="40" y="38" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          3DS VAULT
        </text>
      </g>

      {/* Step 3: Instant Capture 200 */}
      <g transform="translate(290, 26)">
        <circle cx="18" cy="18" r="16" fill="#22262A" stroke="#FFFFFF" strokeWidth="1.8" />
        <text x="18" y="22" fill="#FFFFFF" fontSize="8.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          $ CAP
        </text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          TWO-PHASE SETTLEMENT: TOKENIZE ➔ 3DS RISK ➔ AUTH HOLD ➔ CAPTURE
        </text>
      )}
    </svg>
  );
};

// 05. Customer Service: SLA Ticket Routing & Bot Deflection Matrix
export const CustomerServiceSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Inbound Ticket Stream */}
      <g transform="translate(20, 30)">
        <rect width="56" height="34" rx="6" fill="#141618" stroke="rgba(255,255,255,0.25)" />
        <text x="28" y="21" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          TICKETS
        </text>
      </g>

      {/* Fork Paths */}
      <path d="M80 47 H125 C145 47, 145 25, 175 25 H210" stroke="#FFFFFF" strokeWidth={active ? '2' : '1.5'} fill="none" />
      <path d="M80 47 H125 C145 47, 145 68, 175 68 H210" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />

      {/* Top Fork: 74% AI Deflected */}
      <g transform="translate(215, 12)">
        <rect
          width="118"
          height="28"
          rx="6"
          fill="#1C1F22"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          strokeWidth="1.5"
        />
        <text x="12" y="18" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">
          74% DEFLECTED
        </text>
        <circle cx="102" cy="14" r="3.5" fill="#FFFFFF" />
      </g>

      {/* Bottom Fork: 26% Tier-1 SLA Escalation */}
      <g transform="translate(215, 54)">
        <rect width="118" height="28" rx="6" fill="#141618" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        <text x="12" y="18" fill="#A3A3A3" fontSize="8" fontFamily="monospace">
          26% SLA ESCALATE
        </text>
        <circle cx="102" cy="14" r="3.5" fill="#888888" />
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          PRIORITY QUEUE: INTENT SCORING ➔ DEFLECTION GATE ➔ SLA HANDOFF
        </text>
      )}
    </svg>
  );
};

// 06. Virtual Assistance: 24-Hour Asynchronous Timezone Mesh
export const VirtualAssistanceSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Global Timezone Orbit Arc */}
      <path
        d="M30 45 Q 180 8, 330 45"
        stroke={active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.25)'}
        strokeWidth={active ? '2.2' : '1.5'}
        fill="none"
      />

      {/* Moving Handshake Token across timezones */}
      <circle cx="180" cy="27" r="4" fill="#FFFFFF">
        <animate attributeName="cx" values="60;180;300;180;60" dur={active ? '2.5s' : '4s'} repeatCount="indefinite" />
        <animate attributeName="cy" values="40;22;40;22;40" dur={active ? '2.5s' : '4s'} repeatCount="indefinite" />
      </circle>

      {/* UTC-5 Node (NYC) */}
      <g transform="translate(35, 22)">
        <circle cx="20" cy="20" r="18" fill="#141618" stroke="rgba(255,255,255,0.3)" />
        <text x="20" y="18" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">NYC</text>
        <text x="20" y="28" fill="#888888" fontSize="6.5" fontFamily="monospace" textAnchor="middle">17:00</text>
      </g>

      {/* Center Handoff Vault (Async SOP Log) */}
      <g transform="translate(140, 26)">
        <rect width="80" height="32" rx="6" fill="#1C1F22" stroke="#FFFFFF" strokeWidth="1.5" />
        <text x="40" y="19" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          SOP HANDOFF
        </text>
      </g>

      {/* UTC+9 Node (TYO) */}
      <g transform="translate(285, 22)">
        <circle cx="20" cy="20" r="18" fill="#141618" stroke="rgba(255,255,255,0.3)" />
        <text x="20" y="18" fill="#FFFFFF" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">TYO</text>
        <text x="20" y="28" fill="#888888" fontSize="6.5" fontFamily="monospace" textAnchor="middle">09:00</text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          DELEGATION RING: INGESTION ➔ SOP VALIDATION ➔ CROSS-TIMEZONE HANDSHAKE
        </text>
      )}
    </svg>
  );
};

// 07. Pitch Decks: Persuasion Tension & Narrative Arc
export const PitchDeckSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Tension Axis Grid */}
      <line x1="25" y1="70" x2="335" y2="70" stroke="rgba(255, 255, 255, 0.12)" />
      <line x1="25" y1="15" x2="25" y2="70" stroke="rgba(255, 255, 255, 0.12)" />
      
      <text x="35" y="82" fill="#888888" fontSize="7" fontFamily="monospace">STATUS QUO</text>
      <text x="180" y="82" fill="#888888" fontSize="7" fontFamily="monospace" textAnchor="middle">PARADOX / TENSION</text>
      <text x="325" y="82" fill="#FFFFFF" fontSize="7" fontFamily="monospace" textAnchor="end">CONVICTION</text>

      {/* High-tension Persuasion Arc */}
      <path
        d="M30 65 Q 110 55, 170 20 T 330 18"
        stroke={active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)'}
        strokeWidth={active ? '2.8' : '1.8'}
        fill="none"
      />

      {/* Peak Tension Marker */}
      <g transform="translate(160, 10)">
        <circle cx="10" cy="10" r="5" fill="#FFFFFF" />
        <circle cx="10" cy="10" r="11" stroke="#FFFFFF" strokeWidth="1.2" fill="none" opacity="0.5" />
        <text x="10" y="-4" fill="#FFFFFF" fontSize="7.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
          THE MECHANISM
        </text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          NARRATIVE ARC: 0:00 HOOK ➔ 0:30 FRICTION ➔ 1:00 MECHANISM ➔ 2:00 CONVICTION
        </text>
      )}
    </svg>
  );
};

// 08. Personal Assistance: Dynamic Scheduling & Conflict Resolution Grid
export const PersonalAssistanceSchematic: React.FC<SchematicProps> = ({ isHovered, isRevealed }) => {
  const active = isHovered || isRevealed;
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* Calendar Grid Matrix */}
      <g transform="translate(30, 14)">
        {/* Time slots */}
        <rect x="0" y="0" width="80" height="26" rx="4" fill="#141618" stroke="rgba(255,255,255,0.18)" />
        <text x="10" y="16" fill="#888888" fontSize="8" fontFamily="monospace">09:00 FOCUS</text>

        <rect x="90" y="0" width="105" height="26" rx="4" fill="#1A1D20" stroke="rgba(255,255,255,0.28)" />
        <text x="100" y="16" fill="#FFFFFF" fontSize="8" fontFamily="monospace">CONFLICT RES</text>

        <rect
          x="205"
          y="0"
          width="95"
          height="26"
          rx="4"
          fill="#22262A"
          stroke={active ? '#FFFFFF' : 'rgba(255,255,255,0.3)'}
          strokeWidth="1.4"
        />
        <text x="215" y="16" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold">INBOX ZERO</text>

        {/* Row 2 */}
        <rect x="0" y="34" width="145" height="26" rx="4" fill="#181B1E" stroke="rgba(255,255,255,0.2)" />
        <text x="10" y="50" fill="#D4D4D4" fontSize="8" fontFamily="monospace">DEEP WORK BLOCK (FREEZE)</text>

        <rect x="155" y="34" width="145" height="26" rx="4" fill="#141618" stroke="rgba(255,255,255,0.14)" />
        <text x="165" y="50" fill="#888888" fontSize="8" fontFamily="monospace">AUTOMATED TRIAGE</text>
      </g>

      {/* Subtitle in revealed mode */}
      {isRevealed && (
        <text x="180" y="94" fill="#A3A3A3" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="0.08em">
          CONSTRAINT SOLVER: CALENDAR INGEST ➔ CONFLICT MATRIX ➔ ARBITRATION
        </text>
      )}
    </svg>
  );
};

// Unified Dispatcher Map
export const SCHEMATIC_MAP: Record<string, React.FC<SchematicProps>> = {
  'ai-automation': AutomationSchematic,
  'marketing-ads': MarketingSchematic,
  'web-design': WebDesignSchematic,
  'e-commerce': EcommerceSchematic,
  'customer-service': CustomerServiceSchematic,
  'virtual-assistance': VirtualAssistanceSchematic,
  'pitch-decks': PitchDeckSchematic,
  'personal-assistance': PersonalAssistanceSchematic,
};

export const TopicSchematic: React.FC<{ topicSlug: string; isHovered?: boolean; isRevealed?: boolean }> = ({
  topicSlug,
  isHovered,
  isRevealed,
}) => {
  const Component = SCHEMATIC_MAP[topicSlug] || AutomationSchematic;
  return <Component isHovered={isHovered} isRevealed={isRevealed} />;
};
