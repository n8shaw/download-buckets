"""
Download Buckets - Build Script
Packages the native host into a standalone executable.

Usage:
    python build.py

Requirements:
    pip install pyinstaller
"""

import subprocess
import sys
import os
from pathlib import Path

ROOT = Path(__file__).parent.parent
HOST_DIR = ROOT / 'host'
DIST_DIR = ROOT / 'dist'

def main():
    print("Building Download Buckets companion app...")
    
    # Ensure dist directory exists
    DIST_DIR.mkdir(exist_ok=True)
    
    # Build with PyInstaller
    subprocess.run([
        sys.executable, '-m', 'PyInstaller',
        '--onefile',
        '--noconsole',
        '--name', 'bucket_engine',
        '--distpath', str(DIST_DIR),
        '--workpath', str(ROOT / 'build'),
        '--specpath', str(ROOT / 'build'),
        str(HOST_DIR / 'bucket_engine.py')
    ], check=True)
    
    print(f"\n✓ Built: {DIST_DIR / 'bucket_engine.exe'}")
    print("\nNext steps:")
    print("1. Update EXTENSION_ID in installer/installer.iss")
    print("2. Compile installer with Inno Setup")

if __name__ == '__main__':
    main()
