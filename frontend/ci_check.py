import subprocess

checks: list[tuple[str, str]] = [
    ("Format", "npm run format:check"),
    ("Lint", "npm run lint"),
    ("Test", "npm run test")
]

def _run_cmd(cmd: str) -> bool:
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        return result.returncode == 0
    except subprocess.CalledProcessError:
        return False

def _print_results(results: list[tuple[str, str, bool]]) -> None:
    for check, cmd, result in results:
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{check}: {status} ({cmd})")

def check() -> bool:
    results: list[tuple[str, str, bool]] = []

    for check, cmd in checks:
        results.append((check, cmd, _run_cmd(cmd)))

    _print_results(results)

    return all(result for _, _, result in results)

if __name__ == "__main__":
    exit(0 if check() else 1)
