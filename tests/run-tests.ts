import { monetizationTests, type TestCase } from "./monetization.test.ts";
import { listingWorkflowTests } from "./listing-workflow.test.ts";
import { reportTests } from "./reports.test.ts";
import { paymentTests } from "./payments.test.ts";
import { authTests } from "./auth.test.ts";

const tests: TestCase[] = [
  ...monetizationTests,
  ...listingWorkflowTests,
  ...reportTests,
  ...paymentTests,
  ...authTests,
];

let passed = 0;

for (const test of tests) {
  try {
    test.run();
    passed += 1;
    console.log(`PASS ${test.name}`);
  } catch (error) {
    console.error(`FAIL ${test.name}`);
    console.error(error);
    process.exitCode = 1;
  }
}

if (process.exitCode) {
  console.error(`${tests.length - passed}/${tests.length} tests failed`);
} else {
  console.log(`${passed}/${tests.length} tests passed`);
}
