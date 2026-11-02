import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import styles from '../../styles/crmFailureModesExplorer.module.css';

interface FailureModeItem {
  id: number;
  title: string;
  shortName: string;
  rootCause: string;
  observableSymptom: string;
  engineeringControl: string;
  technicalMechanism: string;
}

const FAILURE_MODES: FailureModeItem[] = [
  {
    id: 1,
    title: 'The "Mandatory Fields" Data Fatigue Trap',
    shortName: '01. Mandatory Fields',
    rootCause: 'Executive leadership attempts to enforce complete data entry by making 30+ relational fields required on early deal stage transitions.',
    observableSymptom: 'Sales reps enter placeholder noise ("asdf", "555-0199", "TBD") or circumvent the CRM by managing high-value pipeline in private spreadsheets.',
    engineeringControl: 'Stage-gated conditional validation: strictly tie required fields to discrete commercial gates (e.g., deal size required only at Stage 3; legal entity only at Stage 5).',
    technicalMechanism: 'Implement declarative validation rules that evaluate ISCHANGED(StageName) combined with PRIORVALUE(StageName) rather than universal NOT(ISBLANK()) checks.'
  },
  {
    id: 2,
    title: 'False Merge Contamination across Customer Tenancies',
    shortName: '02. False Merges',
    rootCause: 'Over-eager probabilistic clustering links distinct customer entities sharing generic corporate names or shared ISP proxy IP subnets.',
    observableSymptom: 'Confidential commercial contract terms, discounted rate cards, and sensitive support tickets accidentally leak across competing accounts.',
    engineeringControl: 'Enforce high confidence thresholds (≥0.95) for automated fusion. Direct all ambiguous candidates (0.75–0.94) into a human stewardship review queue.',
    technicalMechanism: 'Combine Jaro-Winkler string similarity with strict negative constraints (e.g. conflicting verified VAT tax IDs immediately veto an identity merge).'
  },
  {
    id: 3,
    title: 'Bidirectional Sync Infinite Race Condition Loop',
    shortName: '03. Bidirectional Sync',
    rootCause: 'Both CRM and ERP claim simultaneous write authority over customer billing and contact records without single-writer partition boundaries.',
    observableSymptom: 'Record attributes endlessly oscillate back and forth every 30 seconds; database transaction logs balloon, and fresh frontline updates are silently overwritten.',
    engineeringControl: 'Establish explicit single-writer field ownership per object. Require version vector concurrency checks and HTTP 409 conflict mitigation.',
    technicalMechanism: 'Each field carries an authoritative source namespace (e.g. ERP owns Billing_Address__c; CRM owns Buying_Role__c). Sync workers check version vectors before committing.'
  },
  {
    id: 4,
    title: 'Batch Latency Mistaken for Real-Time Event Processing',
    shortName: '04. Batch Latency',
    rootCause: 'Time-critical triggers (e.g., payment failure, high-risk churn signals, contractual SLA timers) are executed via scheduled nightly batch ETL runs.',
    observableSymptom: 'Critical contract SLAs breach hours before tickets are assigned; churn recovery interventions reach customers days after they have cancelled.',
    engineeringControl: 'Decouple high-velocity operational triggers from batch pipelines using Change Data Capture (CDC) streaming and sub-second webhook subscribers.',
    technicalMechanism: 'Deploy Debezium CDC on PostgreSQL write-ahead logs to push row-level mutations into Kafka topics within < 50ms of commit.'
  },
  {
    id: 5,
    title: 'Management Surveillance Bias & Adoption Decay',
    shortName: '05. Surveillance Bias',
    rootCause: 'CRM is architected solely as a managerial tracking inspection mechanism for executives rather than a productivity multiplier for operators.',
    observableSymptom: 'Frontline operators experience extreme administrative toil with zero personal leverage. Data quality decays exponentially within 12 months.',
    engineeringControl: 'Automate background email and calendar ingestion, and push contextual next-best-action intelligence directly into operator screens.',
    technicalMechanism: 'Use asynchronous IMAP/Exchange sync and reverse ETL to push pre-scored buying intent signals directly to reps, saving 6+ hours of manual logging weekly.'
  }
];

export const CrmFailureModesExplorer: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [mitigationState, setMitigationState] = useState<Record<number, boolean>>({});

  const current = FAILURE_MODES[activeIdx];
  const isMitigated = !!mitigationState[current.id];

  const toggleMitigation = () => {
    setMitigationState((prev) => ({
      ...prev,
      [current.id]: !prev[current.id]
    }));
  };

  return (
    <div className={styles.explorerContainer}>
      <div className={styles.explorerHeader}>
        <div className={styles.explorerTitle}>
          <AlertTriangle size={13} color="#FFFFFF" />
          <span>Interactive Failure Mode Simulator & Engineering Controls</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.failureTabs}>
        {FAILURE_MODES.map((f, idx) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.failureTabBtn} ${activeIdx === idx ? styles.failureTabBtnActive : ''}`}
            onClick={() => setActiveIdx(idx)}
          >
            {f.shortName}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.cardBody}>
        {/* Status Banner */}
        <div className={`${styles.statusBanner} ${isMitigated ? styles.statusBannerMitigated : styles.statusBannerFail}`}>
          <div className={styles.statusText}>
            {isMitigated ? (
              <>
                <ShieldCheck size={15} color="#FFFFFF" />
                <span>ENGINEERING CONTROL DEPLOYED // ZERO STATE DECAY</span>
              </>
            ) : (
              <>
                <AlertTriangle size={15} color="rgba(255,255,255,0.6)" />
                <span>VULNERABILITY ACTIVE // UNGUARDED FAILURE MODE</span>
              </>
            )}
          </div>

          <button
            type="button"
            className={styles.controlActionBtn}
            onClick={toggleMitigation}
          >
            {isMitigated ? (
              <>
                <RefreshCw size={11} />
                <span>Simulate Breakdown</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={11} />
                <span>Deploy Engineering Control</span>
              </>
            )}
          </button>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', margin: 0, fontWeight: 600 }}>
          {current.title}
        </h3>

        {/* Breakdown Details Grid */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailBox}>
            <span className={styles.detailHeading}>Root Cause Architecture</span>
            <span className={styles.detailText}>{current.rootCause}</span>
          </div>

          <div className={styles.detailBox}>
            <span className={styles.detailHeading}>Observable Production Breakdown</span>
            <span className={styles.detailText} style={{ color: isMitigated ? 'rgba(255,255,255,0.7)' : '#FFFFFF' }}>
              {current.observableSymptom}
            </span>
          </div>

          <div className={styles.detailBox} style={{ gridColumn: 'span 2' }}>
            <span className={styles.detailHeading} style={{ color: '#FFFFFF' }}>
              RFC Engineering Control & Technical Implementation
            </span>
            <span className={styles.detailText} style={{ color: isMitigated ? '#FFFFFF' : 'rgba(255,255,255,0.85)' }}>
              {isMitigated ? current.technicalMechanism : current.engineeringControl}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
