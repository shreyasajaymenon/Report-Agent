const EvidenceStore = require('../src/evidence/evidenceStore');
const TelemetryTracker = require('../src/telemetry/telemetry');
const assert = require('assert');

function runTests() {
  console.log('Running Tests...');
  let passed = 0;
  let failed = 0;

  try {
    const store = new EvidenceStore();
    store.addEvidence('TCS revenue is $25B', 'http://example.com', 'Actual quote', 'TestAgent');
    assert.strictEqual(store.getAllEvidence().length, 1);
    assert.strictEqual(store.getAllEvidence()[0].claim, 'TCS revenue is $25B');
    passed++;
    console.log('✅ EvidenceStore test passed');
  } catch (e) {
    console.error('❌ EvidenceStore test failed:', e.message);
    failed++;
  }

  try {
    const telemetry = new TelemetryTracker();
    telemetry.recordAgentRun('TestAgent', Date.now() - 1000, Date.now(), 'success', 0, null, { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 });
    telemetry.recordLLMCall({ prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }, false);
    
    const summary = telemetry.getRunSummary(null);
    assert.strictEqual(summary.agentsRun, 1);
    assert.strictEqual(summary.agentsSucceeded, 1);
    assert.strictEqual(summary.totalTokens, 15);
    passed++;
    console.log('✅ TelemetryTracker test passed');
  } catch (e) {
    console.error('❌ TelemetryTracker test failed:', e.message);
    failed++;
  }

  console.log(`\nTests Completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
