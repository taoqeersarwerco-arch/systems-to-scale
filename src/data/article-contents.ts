// ============================================================================
// Systems to Scale — Authoritative Article Content Registry
// Technical deep-dives researched against production RFC specs & enterprise architectures
// ============================================================================

export interface ArticleTable {
  headers: string[];
  rows: string[][];
}

export interface ArticleSection {
  badge?: string;
  title: string;
  content: string[];
  subsections?: Array<{
    title: string;
    content: string[];
  }>;
  diagramTitle?: string;
  diagramAscii?: string;
  table?: ArticleTable;
  codeBlock?: {
    language: string;
    title: string;
    code: string;
  };
  formula?: {
    expression: string;
    explanation: string;
  };
  callout?: {
    type: 'note' | 'warning' | 'tip';
    title: string;
    text: string;
  };
}

export interface DetailedArticleContent {
  slug: string;
  answerIsland: string;
  keyTakeaways: string[];
  sections: ArticleSection[];
}

export const ARTICLE_CONTENTS: Record<string, DetailedArticleContent> = {
  'how-enterprise-crm-works': {
    slug: 'how-enterprise-crm-works',
    answerIsland:
      'Enterprise CRM is a distributed customer operating system coordinating identity, transactional history, and event-driven workflows across sales, marketing, and service. Under the hood, it unifies relational entities (accounts, contacts, opportunities) with immutable event streams, resolving identities across touchpoints and syncing modeled attributes back from data warehouses via reverse ETL to drive frontline operational actions.',
    keyTakeaways: [
      'Dual System Role: Enterprise CRM functions simultaneously as an ACID-compliant System of Record and an event-driven System of Action.',
      'Entity-Relationship-Event Model: Separates mutable business state (Accounts, Deals) from immutable event streams (Page Viewed, Contract Signed).',
      'Identity Resolution: Reconciles cross-device touchpoints into canonical golden records using deterministic anchors and probabilistic clustering with strict survivorship rules.',
      'Reverse ETL Activation: Shifts analytical computation into the lakehouse, syncing scores and churn indicators back to operational reps via activation contracts.',
      'Failure-Mode Prevention: Over 50% of CRM deployments degrade due to mandatory field fatigue, false identity merges, and bidirectional sync race conditions.'
    ],
    sections: [
      {
        badge: 'Mechanism 01',
        title: 'The Dual Nature of CRM: System of Record vs. System of Action',
        content: [
          'The most pervasive architectural misconception in enterprise software is treating a CRM as a static relational database where sales representatives log phone calls and notes. In production engineering, an enterprise CRM is a distributed customer operating system operating across untrusted network boundaries.',
          'A modern CRM must reconcile two fundamentally contradictory operational requirements simultaneously: transactional ACID consistency (System of Record) and asynchronous event-driven workflow execution (System of Action).'
        ],
        subsections: [
          {
            title: '1. System of Record (SoR)',
            content: [
              'The SoR plane manages durable business entities: Accounts, Contacts, Leads, Opportunities, Products, Price Books, Contracts, and Regulatory Consents. These objects require strict schema validation, field-level security (FLS), role-based access control (RBAC), and transactional finality.',
              'When an opportunity transitions to "Closed-Won", the transaction must lock rows, validate that required contractual fields are populated, and emit an immutable financial commitment without allowing race conditions.'
            ]
          },
          {
            title: '2. System of Action (SoA)',
            content: [
              'The SoA plane is an event-driven runtime. It listens for real-time customer signals—such as web activity, product telemetry, failed invoice webhooks, or support tickets—and evaluates policy rules to dispatch actions.',
              'Rather than forcing human reps to comb through historical tables, the SoA plane pushes context-aware recommendations, triggers automated webhook sequences, or dynamically reprioritizes customer service queues.'
            ]
          }
        ],
        callout: {
          type: 'note',
          title: 'Architectural Principle',
          text: 'Separate immutable events from mutable state. Events answer "what happened" across time; entity tables answer "what is true right now". Blurring this distinction corrupts historical auditability.'
        }
      },
      {
        badge: 'Mechanism 02',
        title: 'Reference System Architecture: Ingress, Identity & Activation',
        content: [
          'To support thousands of concurrent frontline operators across sales, customer success, and service without data drift, enterprise CRM sits within a 6-layer distributed topology.',
          'Raw behavioral signals arrive through omnichannel ingress endpoints, are normalized across schema registries, resolved into canonical customer graphs, and enriched by analytical data warehouses before triggering frontline actions.'
        ],
        diagramTitle: 'Enterprise CRM 6-Layer Reference Topology',
        diagramAscii: `
  +--------------------------------------------------------------------------+
  |                   1. OMNICHANNEL INGRESS & EXPERIENCE                     |
  |   Seller Workspace  |  Agent Desktop  |  Portals  |  Email/Voice  |  API |
  +--------------------------------------------------------------------------+
                                       |
                                       v
  +--------------------------------------------------------------------------+
  |                     2. EVENT STREAMING & INGESTION                        |
  |        Kafka Event Bus  |  CDC Webhooks  |  Schema Registry Versioning   |
  +--------------------------------------------------------------------------+
                                       |
                                       v
  +--------------------------------------------------------------------------+
  |                     3. IDENTITY RESOLUTION ENGINE                         |
  |   Deterministic Key Match  |  Probabilistic Clustering  |  Survivorship  |
  +--------------------------------------------------------------------------+
                                       |
                                       v
  +--------------------------------------------------------------------------+
  |              4. OPERATIONAL CRM UNIFIED DATA MODEL (SoR)                 |
  |     Accounts     |    Contacts    |    Opportunities    |     Cases      |
  +--------------------------------------------------------------------------+
                      ^                                    |
                      | (Reverse ETL Sync)                 | (Analytical ELT)
                      v                                    v
  +-----------------------------------+  +-----------------------------------+
  |   5. DATA WAREHOUSE & ANALYTICS   |  |   6. WORKFLOW & STATE MACHINES    |
  | Churn Models | LTV | Health Scores|  | CPQ Engine | SLA Heaps | Webhooks |
  +-----------------------------------+  +-----------------------------------+
        `,
        codeBlock: {
          language: 'json',
          title: 'Immutable CRM Customer Event Payload Specification',
          code: `{
  "event_id": "evt_98f1a23c-7b4d-4e9a",
  "event_type": "contract.renewal_risk_flagged",
  "occurred_at": "2026-11-02T14:32:00.000Z",
  "received_at": "2026-11-02T14:32:00.114Z",
  "actor": {
    "system": "lakehouse_ml_service",
    "model_version": "v4.2.1"
  },
  "subject": {
    "account_id": "acc_0019A82Bc91Z",
    "canonical_person_id": "usr_99824f11",
    "primary_email": "cto@acmeglobal.com"
  },
  "payload": {
    "current_health_score": 42.8,
    "churn_hazard_percentile": 87.4,
    "primary_driver": "weekly_active_seats_dropped_34_percent",
    "contract_expiration_date": "2027-01-15"
  },
  "idempotency_key": "idemp_risk_acc_0019A82Bc91Z_20261102"
}`
        }
      },
      {
        badge: 'Mechanism 03',
        title: 'Identity Resolution: Constructing the Canonical Golden Record',
        content: [
          'In modern customer lifecycles, an individual interacts through multiple fragmented digital channels: an anonymous cookie on marketing landing pages, an email address on whitepaper downloads, an employee ID inside product telemetry, and a company billing address during credit card checkouts.',
          'Identity resolution is the algorithmic process of merging these disconnected digital breadcrumbs into a single canonical entity graph.'
        ],
        subsections: [
          {
            title: 'Deterministic Matching',
            content: [
              'Deterministic reconciliation relies on absolute, immutable identifiers: corporate tax numbers, validated emails, phone numbers formatted to E.164, and authenticated customer portal user IDs.',
              'When two incoming payloads carry the exact same verified email or national tax code, the identity engine creates a deterministic link with 100% confidence.'
            ]
          },
          {
            title: 'Probabilistic Matching & Jaro-Winkler Distance',
            content: [
              'When explicit keys are absent, the engine applies probabilistic fuzzy matching. It evaluates string distance metrics (such as Jaro-Winkler or Levenshtein distance) across company names, IP geographic coordinates, and corporate web domains.',
              'If the calculated confidence score exceeds a pre-set threshold (e.g., 0.92), the records are linked. If the score falls into the ambiguity window (0.75 - 0.91), the record is quarantined to a human data stewardship review queue to prevent false-merge contamination.'
            ]
          },
          {
            title: 'Survivorship & Source Precedence Rules',
            content: [
              'When source systems supply conflicting values for the same attribute (e.g. ERP reports Billing Address A, while Sales rep types Billing Address B), the CRM must enforce survivorship rules.',
              'Authoritative ownership is assigned per field: Billing & Accounting always wins on Payment Terms and Tax IDs; Frontline Sales Reps win on Buying Committee Roles and Champion designations.'
            ]
          }
        ]
      },
      {
        badge: 'Mechanism 04',
        title: 'The Warehouse Connection: Reverse ETL & Activation Contracts',
        content: [
          'Historically, organizations attempted to run heavy machine learning and complex cohort analytics directly inside their operational CRM. This resulted in database lock contention, sluggish page loads, and prohibitive platform license fees.',
          'The modern paradigm shifts heavy computation to the cloud data warehouse (BigQuery, Snowflake, Databricks). Reverse ETL then synchronizes aggregated insights back into frontline CRM fields as an explicit activation contract.'
        ],
        formula: {
          expression: 'LTV = \\sum_{t=1}^{T} \\frac{R_t - C_t}{(1 + r)^t}',
          explanation: 'Discounted Customer Lifetime Value: Where R_t is expected revenue in period t, C_t is the direct cost to serve and retain, r is the corporate discount rate, and T is the contract horizon. Computed in the warehouse and pushed to CRM as an operational tier flag.'
        },
        callout: {
          type: 'warning',
          title: 'The Bidirectional Sync Race Condition Trap',
          text: 'If the data warehouse writes an Account Health Score back to the CRM, and the CRM triggers an automation that immediately updates the same row, an infinite loop is born. Reverse ETL contracts must specify single-writer field ownership and employ version vector concurrency checks.'
        }
      },
      {
        badge: 'Mechanism 05',
        title: 'Why Conventional Intuition Breaks: The 5 Enterprise Failure Modes',
        content: [
          'Industry benchmarks indicate that over 50% of enterprise CRM implementations either fail to achieve adoption or suffer catastrophic data degradation within 18 months of launch.',
          'These failures are rarely caused by software bugs. They are architectural failure modes resulting from mismatched incentives and flawed synchronization logic.'
        ],
        table: {
          headers: ['Failure Mode', 'Root Cause', 'Observable Symptom', 'Engineering Control'],
          rows: [
            [
              'The "Mandatory Fields" Trap',
              'Leadership attempts to force data hygiene by making 30 fields required on stage save.',
              'Sales reps enter placeholder garbage ("asdf", fake phone numbers) or store deals in personal spreadsheets.',
              'Tie required fields strictly to discrete stage transitions (e.g. deal size required only at Stage 3).'
            ],
            [
              'False Merge Contamination',
              'Over-eager probabilistic matching merges distinct customers with common corporate names.',
              'Sensitive pricing, contract terms, or support tickets leak between competing client accounts.',
              'Enforce high confidence thresholds (≥0.95) and quarantine ambiguous candidates to human review.'
            ],
            [
              'Bidirectional Sync Race Condition',
              'Both CRM and ERP claim write authority over customer contact and address data.',
              'Values oscillate back and forth; last-write-wins overwrites fresh operational updates.',
              'Establish single-writer field ownership and require correlation IDs and idempotency headers.'
            ],
            [
              'Batch Latency Mistaken for Real Time',
              'Time-critical triggers (e.g. cart abandonment, SLA breach) run on nightly batch ETL.',
              'Customers receive recovery emails 24 hours after bouncing; high-value SLAs breach before dispatch.',
              'Deploy event-driven webhooks and Change Data Capture (CDC) streaming for sub-second triggers.'
            ],
            [
              'Management Surveillance Bias',
              'CRM is engineered purely as a reporting mechanism for executives rather than a tool of leverage.',
              'Frontline reps experience high administrative toil with zero personal productivity benefit; system decays.',
              'Automate meeting/email logging and push proactive contextual recommendations to operators.'
            ]
          ]
        }
      }
    ]
  }
};

