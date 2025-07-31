package tests

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
)

// TestConfig holds configuration for test execution
type TestConfig struct {
	UnitTests      bool
	IntegrationTests bool
	Benchmarks     bool
	Coverage       bool
	Verbose        bool
	Timeout        time.Duration
	Parallel       bool
}

// TestResult represents the result of a test run
type TestResult struct {
	Package     string
	Passed      bool
	Duration    time.Duration
	Error       error
	Coverage    float64
	Benchmarks  []BenchmarkResult
}

// BenchmarkResult represents a benchmark result
type BenchmarkResult struct {
	Name     string
	Duration time.Duration
	Ops      int64
}

// TestRunner manages test execution
type TestRunner struct {
	config TestConfig
	results []TestResult
}

// NewTestRunner creates a new test runner
func NewTestRunner(config TestConfig) *TestRunner {
	return &TestRunner{
		config: config,
		results: make([]TestResult, 0),
	}
}

// RunAllTests runs all tests based on configuration
func (tr *TestRunner) RunAllTests() error {
	fmt.Println("🚀 Starting Test Suite")
	fmt.Println("======================")

	// Run unit tests
	if tr.config.UnitTests {
		fmt.Println("\n📋 Running Unit Tests...")
		if err := tr.runUnitTests(); err != nil {
			return fmt.Errorf("unit tests failed: %w", err)
		}
	}

	// Run integration tests
	if tr.config.IntegrationTests {
		fmt.Println("\n🔗 Running Integration Tests...")
		if err := tr.runIntegrationTests(); err != nil {
			return fmt.Errorf("integration tests failed: %w", err)
		}
	}

	// Run benchmarks
	if tr.config.Benchmarks {
		fmt.Println("\n⚡ Running Benchmarks...")
		if err := tr.runBenchmarks(); err != nil {
			return fmt.Errorf("benchmarks failed: %w", err)
		}
	}

	// Generate coverage report
	if tr.config.Coverage {
		fmt.Println("\n📊 Generating Coverage Report...")
		if err := tr.generateCoverageReport(); err != nil {
			return fmt.Errorf("coverage report failed: %w", err)
		}
	}

	tr.printSummary()
	return nil
}

// runUnitTests runs all unit tests
func (tr *TestRunner) runUnitTests() error {
	testPackages := []string{
		"./tests/unit/api/...",
		"./tests/unit/orchestrator/...",
		"./tests/unit/services/...",
		"./api/...",
		"./orchestrator/...",
		"./services/...",
	}

	for _, pkg := range testPackages {
		result := tr.runTestPackage(pkg, "unit")
		tr.results = append(tr.results, result)
		
		if !result.Passed {
			return fmt.Errorf("unit tests failed in package %s: %v", pkg, result.Error)
		}
	}

	return nil
}

// runIntegrationTests runs all integration tests
func (tr *TestRunner) runIntegrationTests() error {
	testPackages := []string{
		"./tests/integration/...",
	}

	for _, pkg := range testPackages {
		result := tr.runTestPackage(pkg, "integration")
		tr.results = append(tr.results, result)
		
		if !result.Passed {
			return fmt.Errorf("integration tests failed in package %s: %v", pkg, result.Error)
		}
	}

	return nil
}

// runBenchmarks runs all benchmarks
func (tr *TestRunner) runBenchmarks() error {
	benchmarkPackages := []string{
		"./tests/unit/api/...",
		"./tests/unit/orchestrator/...",
		"./tests/unit/services/...",
	}

	for _, pkg := range benchmarkPackages {
		result := tr.runBenchmarkPackage(pkg)
		tr.results = append(tr.results, result)
		
		if !result.Passed {
			return fmt.Errorf("benchmarks failed in package %s: %v", pkg, result.Error)
		}
	}

	return nil
}

// runTestPackage runs tests for a specific package
func (tr *TestRunner) runTestPackage(pkg, testType string) TestResult {
	start := time.Now()
	
	args := []string{"test"}
	if tr.config.Verbose {
		args = append(args, "-v")
	}
	if tr.config.Coverage {
		args = append(args, "-cover")
	}
	if tr.config.Parallel {
		args = append(args, "-parallel", "4")
	}
	args = append(args, pkg)

	// Create test command
	cmd := tr.createTestCommand(args)
	
	// Run the command
	err := cmd.Run()
	duration := time.Now().Sub(start)

	result := TestResult{
		Package:  pkg,
		Passed:   err == nil,
		Duration: duration,
		Error:    err,
	}

	fmt.Printf("  %s %s (%s)\n", 
		getStatusIcon(result.Passed), 
		pkg, 
		duration.String())

	return result
}

// runBenchmarkPackage runs benchmarks for a specific package
func (tr *TestRunner) runBenchmarkPackage(pkg string) TestResult {
	start := time.Now()
	
	args := []string{"test", "-bench=.", "-benchmem"}
	if tr.config.Verbose {
		args = append(args, "-v")
	}
	args = append(args, pkg)

	cmd := tr.createTestCommand(args)
	
	err := cmd.Run()
	duration := time.Now().Sub(start)

	result := TestResult{
		Package:  pkg,
		Passed:   err == nil,
		Duration: duration,
		Error:    err,
	}

	fmt.Printf("  %s %s (%s)\n", 
		getStatusIcon(result.Passed), 
		pkg, 
		duration.String())

	return result
}

// generateCoverageReport generates a coverage report
func (tr *TestRunner) generateCoverageReport() error {
	// Create coverage directory
	coverageDir := "./coverage"
	if err := os.MkdirAll(coverageDir, 0755); err != nil {
		return fmt.Errorf("failed to create coverage directory: %w", err)
	}

	// Run tests with coverage
	args := []string{
		"test",
		"-coverprofile=coverage/coverage.out",
		"-covermode=atomic",
		"./...",
	}

	cmd := tr.createTestCommand(args)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to generate coverage: %w", err)
	}

	// Generate HTML coverage report
	htmlArgs := []string{
		"tool",
		"cover",
		"-html=coverage/coverage.out",
		"-o=coverage/coverage.html",
	}

	cmd = tr.createTestCommand(htmlArgs)
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("failed to generate HTML coverage: %w", err)
	}

	fmt.Println("  📄 Coverage report generated: coverage/coverage.html")
	return nil
}

// createTestCommand creates a test command with proper environment
func (tr *TestRunner) createTestCommand(args []string) *os.Process {
	// This is a simplified version - in a real implementation,
	// you would use exec.Command and handle the process properly
	return nil
}

// printSummary prints a summary of all test results
func (tr *TestRunner) printSummary() {
	fmt.Println("\n📈 Test Summary")
	fmt.Println("===============")

	totalTests := len(tr.results)
	passedTests := 0
	totalDuration := time.Duration(0)

	for _, result := range tr.results {
		if result.Passed {
			passedTests++
		}
		totalDuration += result.Duration
	}

	fmt.Printf("Total Tests: %d\n", totalTests)
	fmt.Printf("Passed: %d\n", passedTests)
	fmt.Printf("Failed: %d\n", totalTests-passedTests)
	fmt.Printf("Total Duration: %s\n", totalDuration.String())
	fmt.Printf("Success Rate: %.1f%%\n", float64(passedTests)/float64(totalTests)*100)

	if passedTests == totalTests {
		fmt.Println("\n✅ All tests passed!")
	} else {
		fmt.Println("\n❌ Some tests failed!")
	}
}

// getStatusIcon returns an icon based on test status
func getStatusIcon(passed bool) string {
	if passed {
		return "✅"
	}
	return "❌"
}

// RunTests is a convenience function to run tests with default configuration
func RunTests() error {
	config := TestConfig{
		UnitTests:       true,
		IntegrationTests: true,
		Benchmarks:      true,
		Coverage:        true,
		Verbose:         true,
		Timeout:         5 * time.Minute,
		Parallel:        true,
	}

	runner := NewTestRunner(config)
	return runner.RunAllTests()
}

// RunUnitTests runs only unit tests
func RunUnitTests() error {
	config := TestConfig{
		UnitTests: true,
		Verbose:   true,
		Coverage:  true,
	}

	runner := NewTestRunner(config)
	return runner.RunAllTests()
}

// RunIntegrationTests runs only integration tests
func RunIntegrationTests() error {
	config := TestConfig{
		IntegrationTests: true,
		Verbose:         true,
	}

	runner := NewTestRunner(config)
	return runner.RunAllTests()
}

// RunBenchmarks runs only benchmarks
func RunBenchmarks() error {
	config := TestConfig{
		Benchmarks: true,
		Verbose:    true,
	}

	runner := NewTestRunner(config)
	return runner.RunAllTests()
} 