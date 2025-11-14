#!/usr/bin/env python3
"""
PYC to PY Decompiler Utility
Converts compiled Python bytecode (.pyc) files back to readable .py or .txt format
"""

import os
import sys
import dis
import marshal
import importlib.util
from pathlib import Path
from typing import Optional
import uncompyle6
from uncompyle6.main import decompile


def decompile_pyc_file(pyc_path: str, output_path: Optional[str] = None) -> bool:
    """
    Decompile a .pyc file to readable Python code
    
    Args:
        pyc_path: Path to .pyc file
        output_path: Optional output path (defaults to same name with .py extension)
    
    Returns:
        bool: Success status
    """
    pyc_file = Path(pyc_path)
    
    if not pyc_file.exists():
        print(f"Error: File {pyc_path} not found")
        return False
    
    if not pyc_file.suffix == '.pyc':
        print(f"Error: {pyc_path} is not a .pyc file")
        return False
    
    # Determine output path
    if output_path is None:
        output_path = pyc_file.with_suffix('.py')
    
    try:
        # Method 1: Try uncompyle6 (works for Python 2.7-3.8)
        print(f"Decompiling {pyc_path}...")
        
        with open(output_path, 'w') as output_file:
            with open(pyc_path, 'rb') as pyc:
                uncompyle6.main.decompile_file(pyc_path, output_file)
        
        print(f"✓ Successfully decompiled to {output_path}")
        return True
        
    except Exception as e:
        print(f"uncompyle6 failed: {e}")
        print("Trying alternative method (disassembly)...")
        
        try:
            # Method 2: Disassemble bytecode (more readable than nothing)
            return disassemble_pyc(pyc_path, output_path)
        except Exception as e2:
            print(f"Error: All decompilation methods failed: {e2}")
            return False


def disassemble_pyc(pyc_path: str, output_path: str) -> bool:
    """
    Disassemble .pyc file to readable bytecode instructions
    
    Args:
        pyc_path: Path to .pyc file
        output_path: Output path for disassembled code
    
    Returns:
        bool: Success status
    """
    try:
        with open(pyc_path, 'rb') as f:
            # Skip magic number and timestamp (first 16 bytes in Python 3.7+)
            f.seek(16)
            code_object = marshal.load(f)
        
        with open(output_path, 'w') as out:
            out.write(f"# Disassembled bytecode from {pyc_path}
")
            out.write(f"# This is not executable Python code, but shows the operations

")
            
            # Redirect dis.dis output to file
            import io
            import contextlib
            
            string_io = io.StringIO()
            with contextlib.redirect_stdout(string_io):
                dis.dis(code_object)
            
            out.write(string_io.getvalue())
        
        print(f"✓ Disassembled bytecode saved to {output_path}")
        return True
        
    except Exception as e:
        print(f"Error during disassembly: {e}")
        return False


def batch_decompile_directory(directory: str, output_dir: Optional[str] = None):
    """
    Decompile all .pyc files in a directory
    
    Args:
        directory: Directory containing .pyc files
        output_dir: Optional output directory
    """
    directory_path = Path(directory)
    
    if not directory_path.is_dir():
        print(f"Error: {directory} is not a directory")
        return
    
    # Find all .pyc files
    pyc_files = list(directory_path.rglob('*.pyc'))
    
    if not pyc_files:
        print(f"No .pyc files found in {directory}")
        return
    
    print(f"Found {len(pyc_files)} .pyc files")
    
    success_count = 0
    for pyc_file in pyc_files:
        if output_dir:
            output_path = Path(output_dir) / pyc_file.with_suffix('.py').name
        else:
            output_path = pyc_file.with_suffix('.py')
        
        if decompile_pyc_file(str(pyc_file), str(output_path)):
            success_count += 1
    
    print(f"
Completed: {success_count}/{len(pyc_files)} files successfully decompiled")


def main():
    """Main entry point for CLI usage"""
    if len(sys.argv) < 2:
        print("PYC Decompiler Utility")
        print("=" * 60)
        print("
Usage:")
        print("  python pyc_decompiler.py <file.pyc> [output.py]")
        print("  python pyc_decompiler.py --dir <directory> [output_dir]")
        print("
Examples:")
        print("  python pyc_decompiler.py module.pyc")
        print("  python pyc_decompiler.py module.pyc readable_code.py")
        print("  python pyc_decompiler.py --dir __pycache__")
        print("  python pyc_decompiler.py --dir __pycache__ decompiled/")
        sys.exit(1)
    
    if sys.argv[1] == '--dir':
        directory = sys.argv[2] if len(sys.argv) > 2 else '.'
        output_dir = sys.argv[3] if len(sys.argv) > 3 else None
        batch_decompile_directory(directory, output_dir)
    else:
        pyc_file = sys.argv[1]
        output_file = sys.argv[2] if len(sys.argv) > 2 else None
        decompile_pyc_file(pyc_file, output_file)


if __name__ == '__main__':
    main()
