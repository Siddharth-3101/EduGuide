import json
from pathlib import Path
from typing import Dict, Any
from ai_service.taxonomy.normalizer import get_skill_normalizer

def run_normalizer_benchmark(gold_path: Path) -> Dict[str, Any]:
    with open(gold_path, "r", encoding="utf-8") as f:
        gold_data = json.load(f)

    normalizer = get_skill_normalizer()
    total = len(gold_data)
    correct = 0
    failures = []

    for item in gold_data:
        raw_input = item["input"]
        expected_id = item["expected_id"]
        res = normalizer.normalize(raw_input)

        if res.canonical_skill_id == expected_id:
            correct += 1
        else:
            failures.append({
                "input": raw_input,
                "expected_id": expected_id,
                "expected_name": item["expected_name"],
                "got_id": res.canonical_skill_id,
                "got_name": res.canonical_skill_name,
                "match_type": res.match_type.value,
                "confidence": res.confidence
            })

    accuracy = correct / total if total > 0 else 0.0
    return {
        "total_evaluated": total,
        "correct": correct,
        "accuracy": accuracy,
        "failed_count": len(failures),
        "failures": failures
    }

if __name__ == "__main__":
    benchmark_file = Path(__file__).parent / "test_normalizer_gold.json"
    results = run_normalizer_benchmark(benchmark_file)
    print(f"Normalizer Evaluation Benchmark:")
    print(f"Total: {results['total_evaluated']}, Correct: {results['correct']}, Accuracy: {results['accuracy']:.2%}")
    if results['failures']:
        print(f"Failures ({len(results['failures'])}):")
        for f in results['failures']:
            print(f"  - '{f['input']}': expected {f['expected_id']} ({f['expected_name']}), got {f['got_id']} ({f['got_name']})")
