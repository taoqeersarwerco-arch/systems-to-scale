import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import styles from '../../styles/articleExecutiveCockpit.module.css';

export interface SpecItem {
  key: string;
  value: string;
}

export interface ArticleExecutiveCockpitProps {
  answerIsland: string;
  keyTakeaways: string[];
  specs?: SpecItem[];
  rfcCode?: string;
}

const DEFAULT_SPECS: SpecItem[] = [
  { key: 'System Archetype', value: 'Event-Driven SoR / SoA Hybrid' },
  { key: 'Identity Engine', value: 'Deterministic Graph (Union-Find)' },
  { key: 'Ingress Protocol', value: 'Bidirectional gRPC / Webhooks' },
  { key: 'Activation Protocol', value: 'Reverse ETL / CDC Stream' },
  { key: 'Latency Profile', value: 'p99 < 85ms Event Dispatch' },
  { key: 'Primary Hazard', value: 'Split-Brain Identity Divergence' }
];

export const ArticleExecutiveCockpit: React.FC<ArticleExecutiveCockpitProps> = ({
  answerIsland,
  keyTakeaways,
  specs = DEFAULT_SPECS,
  rfcCode = 'RFC-CRM-2026'
}) => {
  return (
    <section className={styles.cockpitContainer} aria-label="Executive Architectural Summary">
      {/* Top Header Row (Matches Topic Sim Headers) */}
      <div className={styles.cockpitHeader}>
        <div className={styles.cockpitHeaderLeft}>
          <div>
            <span className="sts-badge sts-badge-steel" style={{ marginBottom: '0.4rem' }}>
              Answer Island // Architecture Spec Sheet
            </span>
          </div>
          <h2 className={styles.cockpitTitle}>
            Mechanical Architecture & Deterministic Constraints
          </h2>
        </div>

        <div className={styles.telemetryStatus}>
          <span className={styles.statusPulseDot} />
          <span>SYS_STATE: AUDITED // DETERMINISTIC</span>
        </div>
      </div>

      {/* Recessed Inner Stage (Direct match to Topic Detail Sim Viewport) */}
      <div className={styles.innerStage}>
        {/* Left Column: Direct LLM/GEO Answer Island Definition */}
        <div className={styles.answerColumn}>
          <div className={styles.sectionLabel}>
            // Executive Architectural Definition
          </div>
          <p className={styles.answerText}>
            {answerIsland}
          </p>

          {keyTakeaways && keyTakeaways.length > 0 && (
            <div className={styles.takeawaysGroup}>
              <div className={styles.takeawaysTitle}>
                <CheckCircle2 size={13} color="#FFFFFF" />
                <span>Key Operational Takeaways</span>
              </div>
              {keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className={styles.takeawayItem}>
                  <span className={styles.takeawayIndex}>0{idx + 1}.</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Architectural Telemetry Spec Sheet */}
        <div className={styles.specsColumn}>
          <div>
            <div className={styles.sectionLabel} style={{ marginBottom: '1rem' }}>
              // System Telemetry & Ingress Profile
            </div>
            <div className={styles.specsList}>
              {specs.map((spec, idx) => (
                <div key={idx} className={styles.specRow}>
                  <span className={styles.specKey}>{spec.key}</span>
                  <span className={styles.specVal}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.auditFooter}>
            STATUS: Formally verified against {rfcCode} enterprise standard.
          </div>
        </div>
      </div>
    </section>
  );
};
