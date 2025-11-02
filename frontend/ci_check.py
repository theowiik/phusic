import subprocess
from typing import Callable
import os
import re

# VVV CUSTOM CHECKS VVV


def check_file_naming() -> bool:
    extensions = ["ts", "tsx", "js", "jsx", "json"]
    error = False

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in ["node_modules", ".git", "dist"]]
        
        for file in files:
            if any(file.endswith(f".{ext}") for ext in extensions):
                file_path = os.path.join(root, file)
                basename = os.path.splitext(file)[0]
                
                if not re.match(r"^[a-z0-9]+(?:[.-][a-z0-9]+)*$", basename):
                    print(f"❌ File {file_path} is not in kebab-case")
                    error = True

    if not error:
        print("🌯 All files follow kebab-case")

    return not error


# ^^^ CUSTOM CHECKS ^^^


checks: list[tuple[str, str | Callable[[], bool]]] = [
    ("Biome check", "npm run check"),
    ("TypeScript", "npx tsc --noEmit"),
    ("Test", "npm run test"),
    ("File naming", check_file_naming)
]

def _run_cmd(cmd: str) -> bool:
    try:
        result = subprocess.run(cmd, shell=True, check=True, capture_output=False, text=True)
        return result.returncode == 0
    except subprocess.CalledProcessError:
        return False


def _print_results(results: list[tuple[str, str | Callable, bool]]) -> None:
    check_width = max(len(check) for check, _, _ in results) if results else 10
    print("\nResults:")
    
    for check, cmd, result in results:
        status = "✅" if result else "❌"
        cmd_str = cmd if isinstance(cmd, str) else cmd.__name__
        print(f"{status} {check:<{check_width}} | {cmd_str}")
    print()


def check() -> bool:
    results: list[tuple[str, str | Callable, bool]] = []

    for check, cmd in checks:
        if isinstance(cmd, str):
            results.append((check, cmd, _run_cmd(cmd)))
        else:
            results.append((check, cmd, cmd()))

    _print_results(results)

    return all(result for _, _, result in results)


if __name__ == "__main__":
    exit(0 if check() else 1)
