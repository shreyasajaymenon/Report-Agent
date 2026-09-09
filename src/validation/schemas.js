const { z } = require('zod');

// Telemetry schemas
const TelemetrySchema = z.object({
  agentName: z.string(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  durationMs: z.number(),
  status: z.enum(['success', 'failed']),
  retries: z.number(),
  error: z.string().nullable().optional(),
  tokens: z.object({
    inputTokens: z.number().optional(),
    outputTokens: z.number().optional(),
    totalTokens: z.number().optional()
  }).optional()
});

const RunSummarySchema = z.object({
  totalDurationMs: z.number(),
  agentsRun: z.number(),
  agentsSucceeded: z.number(),
  agentsFailed: z.number(),
  totalRetries: z.number(),
  totalTokens: z.number(),
  totalCitations: z.number(),
});

// Evidence/Fact schemas
const EvidenceSchema = z.object({
  id: z.string(),
  claim: z.string().describe("The factual claim extracted."),
  sourceUrl: z.string().url().describe("The URL where this fact was found."),
  evidenceText: z.string().describe("Direct quote or data point supporting the claim."),
  agent: z.string(),
  timestamp: z.string().datetime(),
  confidence: z.number().min(0).max(1).optional(),
  valuationImpact: z.string().optional().describe("How this impacts valuation (e.g., 'Positive', 'Negative', 'Neutral')."),
  verificationStatus: z.enum(['pending', 'verified', 'failed']).default('pending')
});

// Domain schemas
const FinancialDataSchema = z.object({
  revenue: z.number().optional(),
  netIncome: z.number().optional(),
  debt: z.number().optional(),
  cashFlow: z.number().optional(),
  ratios: z.record(z.number()).optional(), // e.g., { "PE": 15.5, "PB": 2.1 }
  facts: z.array(EvidenceSchema.omit({ id: true, agent: true, timestamp: true, verificationStatus: true }))
});

const GovernanceDataSchema = z.object({
  boardIndependence: z.string().optional(),
  auditorRemarks: z.string().optional(),
  facts: z.array(EvidenceSchema.omit({ id: true, agent: true, timestamp: true, verificationStatus: true }))
});

const GenericSectionSchema = z.union([
  z.string(),
  z.object({
    content: z.string().optional(),
    facts: z.array(EvidenceSchema.omit({ id: true, agent: true, timestamp: true, verificationStatus: true })).optional()
  })
]);

// Global State Schema
const CompanyStateSchema = z.object({
  companyName: z.string(),
  ticker: z.string().optional(),
  objective: z.string().optional(),
  status: z.enum(['initializing', 'processing', 'completed', 'error']),
  currentPhase: z.string().optional(),
  
  // Data Sections
  data: z.object({
    cro: GenericSectionSchema.optional(),
    planner: GenericSectionSchema.optional(),
    discovery: GenericSectionSchema.optional(),
    nse: GenericSectionSchema.optional(),
    bse: GenericSectionSchema.optional(),
    companyIR: GenericSectionSchema.optional(),
    annualReport: GenericSectionSchema.optional(),
    quarterly: GenericSectionSchema.optional(),
    transcript: GenericSectionSchema.optional(),
    presentation: GenericSectionSchema.optional(),
    governance: GenericSectionSchema.optional(),
    financial: GenericSectionSchema.optional(),
    ratio: GenericSectionSchema.optional(),
    industry: GenericSectionSchema.optional(),
    competition: GenericSectionSchema.optional(),
    valuation: GenericSectionSchema.optional(),
    risk: GenericSectionSchema.optional(),
    investmentCommittee: GenericSectionSchema.optional(),
    finalText: z.string().optional(),
  }),

  // Evidence tracking (globally managed, not directly populated by raw agent outputs typically)
  evidence: z.array(EvidenceSchema).optional(),

  // Run Metadata
  completedAgents: z.array(z.string()).default([]),
  failedAgents: z.array(z.string()).default([]),
  telemetry: z.array(TelemetrySchema).default([]),
  errors: z.array(z.string()).default([]),
  runSummary: RunSummarySchema.optional()
});

const CriticOutputSchema = z.object({
  status: z.enum(['APPROVED', 'NEEDS_REVISION']),
  score: z.number().min(0).max(100),
  issues: z.array(z.string()).default([]),
  criticalIssues: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([])
});

module.exports = {
  TelemetrySchema,
  RunSummarySchema,
  EvidenceSchema,
  FinancialDataSchema,
  GovernanceDataSchema,
  GenericSectionSchema,
  CompanyStateSchema,
  CriticOutputSchema
};
