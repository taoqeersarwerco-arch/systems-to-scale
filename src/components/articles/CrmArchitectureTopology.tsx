import React, { useState } from 'react';
import { Layers, Terminal, ChevronDown, ChevronUp, Cpu, Database, Activity, GitFork, RefreshCw, AlertCircle } from 'lucide-react';
import styles from '../../styles/crmArchitectureTopology.module.css';

interface LayerData {
  id: number;
  title: string;
  components: string;
  protocol: string;
  p99Latency: string;
  throughput: string;
  failureMode: string;
}

const LAYERS: LayerData[] = [
  {
    id: 1,
    title: 'Omnichannel Ingress & Experience',
    components: 'Seller Workspace, Agent Desktop, Customer Portal, Telephony CTI, Inbound Webhooks',
    protocol: 'HTTPS / WSS / GraphQL',
    p99Latency: '85ms',
    throughput: '4,200 req/sec',
    failureMode: 'Session timeout on slow mobile networks'
  },
  {
    id: 2,
    title: 'Event Streaming & Change Ingestion',
    components: 'Apache Kafka Event Bus, Debezium CDC Connectors, Avro Schema Registry',
    protocol: 'Kafka Binary Protocol / TLS',
    p99Latency: '12ms',
    throughput: '48,000 events/sec',
    failureMode: 'Poison pill message halting partition consumer'
  },
  {
    id: 3,
    title: 'Identity Resolution & Entity Graph Engine',
    components: 'Deterministic Matching Keys, Jaro-Winkler Distance Engine, Survivorship Arbitrator',
    protocol: 'Graph Traversal / In-Memory Redis Cache',
    p99Latency: '35ms',
    throughput: '8,500 reconciliations/sec',
    failureMode: 'False merge contamination across shared corporate domains'
  },
  {
    id: 4,
    title: 'Operational CRM Unified Data Model (System of Record)',
    components: 'PostgreSQL Relational Tables (Accounts, Contacts, Deals, Cases), Row-Level Locks, WAL',
    protocol: 'PostgreSQL Wire / ACID Strict Locks',
    p99Latency: '18ms',
    throughput: '12,000 transactions/sec',
    failureMode: 'Deadlock on concurrent deal stage updates'
  },
  {
    id: 5,
    title: 'Cloud Data Warehouse & Analytical Intelligence',
    components: 'Snowflake / BigQuery, Churn Hazard Predictors, Discounted LTV Calculus',
    protocol: 'Columnar SQL / Lakehouse Delta Engine',
    p99Latency: '3.2s (Batch Batching)',
    throughput: '1.2B rows scanned/hr',
    failureMode: 'Batch latency mistaken for real-time trigger'
  },
  {
    id: 6,
    title: 'Reverse ETL Activation & Operational State Machines',
    components: 'Reverse ETL Workers, SLA Priority Min-Heaps, Automated CPQ Discount Dispatchers',
    protocol: 'Optimistic Version Vectors / Idempotent Webhooks',
    p99Latency: '140ms',
    throughput: '6,400 syncs/min',
    failureMode: 'Bidirectional sync write loop between CRM and ERP'
  }
];

interface CrmArchitectureTopologyProps {
  rawAscii: string;
}

export const CrmArchitectureTopology: React.FC<CrmArchitectureTopologyProps> = ({ rawAscii }) => {
  const [viewMode, setViewMode] = useState<'interactive' | 'ascii'>('interactive');
  const [selectedLayer, setSelectedLayer] = useState<number>(2); // Default to Event streaming

  return (
    <div className={styles.topologyContainer}>
      <div className={styles.topologyHeader}>
        <div className={styles.topologyTitle}>
          <Layers size={14} color="#E5A93C" />
          <span>Interactive Reference Architecture (6-Layer Pipeline)</span>
        </div>

        <div className={styles.viewModeToggle}>
          <button
            type="button"
            className={`${styles.toggleBtn} ${viewMode === 'interactive' ? styles.toggleBtnActive : ''}`}
            onClick={() => setViewMode('interactive')}
          >
            Interactive Blueprint
          </button>
          <button
            type="button"
            className={`${styles.toggleBtn} ${viewMode === 'ascii' ? styles.toggleBtnActive : ''}`}
            onClick={() => setViewMode('ascii')}
          >
            <Terminal size={11} style={{ display: 'inline', marginRight: 4 }} />
            Raw ASCII
          </button>
        </div>
      </div>

      {viewMode === 'ascii' ? (
        <pre className={styles.asciiPre}>{rawAscii}</pre>
      ) : (
        <div className={styles.layersWrapper}>
          {LAYERS.map((layer) => {
            const isSelected = selectedLayer === layer.id;
            return (
              <div
                key={layer.id}
                className={`${styles.layerCard} ${isSelected ? styles.layerCardActive : ''}`}
                onClick={() => setSelectedLayer(isSelected ? 0 : layer.id)}
              >
                <div className={styles.layerTop}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className={styles.layerNumber}>LAYER 0{layer.id}</span>
                    <span className={styles.layerTitle}>{layer.title}</span>
                  </div>
                  {isSelected ? <ChevronUp size={14} color="#E5A93C" /> : <ChevronDown size={14} color="rgba(255,255,255,0.4)" />}
                </div>

                <div className={styles.layerSpecs}>{layer.components}</div>

                {isSelected && (
                  <div className={styles.layerDrawer}>
                    <div className={styles.drawerItem}>
                      <span className={styles.drawerKey}>Protocol</span>
                      <span className={styles.drawerVal}>{layer.protocol}</span>
                    </div>
                    <div className={styles.drawerItem}>
                      <span className={styles.drawerKey}>p99 Latency</span>
                      <span className={styles.drawerVal} style={{ color: '#4ade80' }}>{layer.p99Latency}</span>
                    </div>
                    <div className={styles.drawerItem}>
                      <span className={styles.drawerKey}>Peak Throughput</span>
                      <span className={styles.drawerVal} style={{ color: '#E5A93C' }}>{layer.throughput}</span>
                    </div>
                    <div className={styles.drawerItem} style={{ gridColumn: 'span 2' }}>
                      <span className={styles.drawerKey}>Primary Failure Mode</span>
                      <span className={styles.drawerVal} style={{ color: '#f87171' }}>{layer.failureMode}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
