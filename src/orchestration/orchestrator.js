const fs = require('fs');
const execSync = require('child_process').execSync;
const StateManager = require('../core/stateManager');
const EvidenceStore = require('../evidence/evidenceStore');
const TelemetryTracker = require('../telemetry/telemetry');
const PDFGenerator = require('../reporting/pdfGenerator');

// Import all agents
const ChiefResearchOfficerAgent = require('../agents/ChiefResearchOfficerAgent');
const PlannerAgent = require('../agents/PlannerAgent');
const DiscoveryAgent = require('../agents/DiscoveryAgent');
const NSEAgent = require('../agents/NSEAgent');
const BSEAgent = require('../agents/BSEAgent');
const CompanyIRAgent = require('../agents/CompanyIRAgent');
const AnnualReportAgent = require('../agents/AnnualReportAgent');
const QuarterlyAgent = require('../agents/QuarterlyAgent');
const TranscriptAgent = require('../agents/TranscriptAgent');
const PresentationAgent = require('../agents/PresentationAgent');
const GovernanceAgent = require('../agents/GovernanceAgent');
const FinancialEngine = require('../agents/FinancialEngine');
const RatioEngine = require('../agents/RatioEngine');
const IndustryAgent = require('../agents/IndustryAgent');
const CompetitionAgent = require('../agents/CompetitionAgent');
const ValuationAgent = require('../agents/ValuationAgent');
const RiskAgent = require('../agents/RiskAgent');
const InvestmentCommittee = require('../agents/InvestmentCommittee');
const ChiefWriter = require('../agents/ChiefWriter');
const Editor = require('../agents/Editor');
const Formatter = require('../agents/Formatter');
const VerificationAgent = require('../agents/VerificationAgent');
const DataExtractionAgent = require('../agents/DataExtractionAgent');
const CriticAgent = require('../agents/CriticAgent');

class Orchestrator {
  constructor(companyName) {
    this.companyName = companyName;
    this.stateManager = new StateManager(companyName);
    this.evidenceStore = new EvidenceStore();
    this.telemetry = new TelemetryTracker();
    
    this.options = {
       stateManager: this.stateManager,
       evidenceStore: this.evidenceStore,
       telemetry: this.telemetry
    };
  }

  async runAgents() {
    console.log(`[Orchestrator] Starting V2 Multi-Agent Pipeline for ${this.companyName}`);
    this.stateManager.updateMetadata('status', 'processing');

    try {
      let currentState = this.stateManager.getState();
      const verificationAgent = new VerificationAgent();

      const verify = async (draft) => {
        if (!draft) return null;
        return await verificationAgent.verify(this.companyName, draft, this.options);
      };

      // Helper to safely extract settled promise value
      const extractValue = (result) => result.status === 'fulfilled' ? result.value : null;

      // Phase 1: Leadership & Planning (Sequential)
      console.log('[Orchestrator] Phase 1: Leadership & Planning...');
      const croResult = await new ChiefResearchOfficerAgent().run(this.companyName, currentState, this.options);
      this.stateManager.updateState('cro', croResult);
      currentState = this.stateManager.getState();

      const plannerResult = await new PlannerAgent().run(this.companyName, currentState, this.options);
      this.stateManager.updateState('planner', plannerResult);
      currentState = this.stateManager.getState();

      // Phase 2: Discovery & Data Acquisition (Concurrent)
      console.log('[Orchestrator] Phase 2: Data Gathering (Concurrent)...');
      const phase2Promises = [
        new DiscoveryAgent().run(this.companyName, currentState, this.options),
        new NSEAgent().run(this.companyName, currentState, this.options),
        new BSEAgent().run(this.companyName, currentState, this.options),
        new CompanyIRAgent().run(this.companyName, currentState, this.options),
        new AnnualReportAgent().run(this.companyName, currentState, this.options),
        new QuarterlyAgent().run(this.companyName, currentState, this.options),
        new TranscriptAgent().run(this.companyName, currentState, this.options),
        new PresentationAgent().run(this.companyName, currentState, this.options)
      ];

      const phase2Results = await Promise.allSettled(phase2Promises);
      
      this.stateManager.updateState('discovery', await verify(extractValue(phase2Results[0])));
      this.stateManager.updateState('nse', await verify(extractValue(phase2Results[1])));
      this.stateManager.updateState('bse', await verify(extractValue(phase2Results[2])));
      this.stateManager.updateState('companyIR', await verify(extractValue(phase2Results[3])));
      this.stateManager.updateState('annualReport', await verify(extractValue(phase2Results[4])));
      this.stateManager.updateState('quarterly', await verify(extractValue(phase2Results[5])));
      this.stateManager.updateState('transcript', await verify(extractValue(phase2Results[6])));
      this.stateManager.updateState('presentation', await verify(extractValue(phase2Results[7])));
      currentState = this.stateManager.getState();

      // Phase 3: Analytical Engines (Concurrent)
      console.log('[Orchestrator] Phase 3: Analytical Engines (Concurrent)...');
      const phase3Promises = [
        new GovernanceAgent().run(this.companyName, currentState, this.options),
        new FinancialEngine().run(this.companyName, currentState, this.options),
        new RatioEngine().run(this.companyName, currentState, this.options),
        new IndustryAgent().run(this.companyName, currentState, this.options),
        new CompetitionAgent().run(this.companyName, currentState, this.options),
        new ValuationAgent().run(this.companyName, currentState, this.options),
        new RiskAgent().run(this.companyName, currentState, this.options)
      ];

      const phase3Results = await Promise.allSettled(phase3Promises);
      
      this.stateManager.updateState('governance', await verify(extractValue(phase3Results[0])));
      this.stateManager.updateState('financial', await verify(extractValue(phase3Results[1])));
      this.stateManager.updateState('ratio', await verify(extractValue(phase3Results[2])));
      this.stateManager.updateState('industry', await verify(extractValue(phase3Results[3])));
      this.stateManager.updateState('competition', await verify(extractValue(phase3Results[4])));
      this.stateManager.updateState('valuation', await verify(extractValue(phase3Results[5])));
      this.stateManager.updateState('risk', await verify(extractValue(phase3Results[6])));
      currentState = this.stateManager.getState();

      // Phase 4: Synthesis & Output (Sequential)
      console.log('[Orchestrator] Phase 4: Synthesis...');
      const icResult = await new InvestmentCommittee().run(this.companyName, currentState, this.options);
      this.stateManager.updateState('investmentCommittee', icResult);
      currentState = this.stateManager.getState();

      // Critic / Revision Loop
      console.log('[Orchestrator] Phase 4: Writer & Critic Loop...');
      let finalDraft = await new ChiefWriter().run(this.companyName, currentState, this.options);
      
      const critic = new CriticAgent();
      const ConfigManager = require('../config');
      const maxLoops = ConfigManager.getConfig().runtime.criticMaxIterations || 2;
      let loopCount = 0;
      
      while (loopCount < maxLoops) {
         const criticOutput = await critic.run(this.companyName, finalDraft, this.options);
         if (criticOutput && criticOutput.status === 'APPROVED') {
            console.log(`[Orchestrator] Draft approved on iteration ${loopCount + 1} (Score: ${criticOutput.score})`);
            break;
         } else if (criticOutput) {
            console.log(`[Orchestrator] Critic requested revisions (Loop ${loopCount + 1}, Score: ${criticOutput.score})...`);
            finalDraft = await new Editor().run(this.companyName, { draft: finalDraft, feedback: criticOutput }, this.options);
         } else {
            console.warn(`[Orchestrator] Critic failed. Proceeding with draft.`);
            break;
         }
         loopCount++;
      }

      let finalFormattedText = await new Formatter().run(this.companyName, finalDraft, this.options);
      this.stateManager.updateState('finalText', finalFormattedText);

      console.log('[Orchestrator] Running DataExtractionAgent for JSON financials...');
      const dataInputJSON = await new DataExtractionAgent().run(this.companyName, currentState, this.options);

      console.log('[Orchestrator] Pipeline execution completed. Writing state and handing to Python Engine...');
      
      this.stateManager.setEvidence(this.evidenceStore.getAllEvidence());
      this.stateManager.updateMetadata('telemetry', this.telemetry.getAgentMetrics());
      this.stateManager.updateMetadata('runSummary', this.telemetry.getRunSummary(this.evidenceStore));
      this.stateManager.updateMetadata('status', 'completed');
      
      // Ensure state is perfectly valid before final handoff
      const validatedState = this.stateManager.validateState();
      
      const payload = {
        companyName: this.companyName,
        sections: validatedState.data,
        DATA_INPUT: dataInputJSON
      };
      
      fs.writeFileSync('report_data.json', JSON.stringify(payload, null, 2));
      fs.writeFileSync('ventura_run_telemetry.json', JSON.stringify(validatedState, null, 2));
      
      // Execute Python PDF Generator
      console.log(execSync('python src/reporting/equity_report_template.py').toString());

    } catch (error) {
      console.error('[Orchestrator] Fatal workflow error:', error);
      this.stateManager.updateMetadata('status', 'error');
      this.stateManager.addError(`Fatal: ${error.message}`);
    }
  }
}

module.exports = Orchestrator;
