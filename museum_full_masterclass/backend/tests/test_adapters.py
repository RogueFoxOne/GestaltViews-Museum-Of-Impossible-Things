import importlib
import pkgutil
import inspect
import os

import pytest

ADAPTERS_PKG = 'backend.adapters'

def _iter_adapter_modules():
    path = os.path.join(os.getcwd(), 'backend', 'adapters')
    if not os.path.isdir(path):
        return []
    for finder, name, ispkg in pkgutil.iter_modules([path]):
        yield name

def test_adapters_importable():
    names = list(_iter_adapter_modules())
    assert names, "No adapters detected in backend/adapters"
    for nm in names:
        module_path = f"{ADAPTERS_PKG}.{nm}"
        m = importlib.import_module(module_path)
        callables = [n for n, o in inspect.getmembers(m, inspect.isfunction) if not n.startswith('_')]
        classes = [n for n, o in inspect.getmembers(m, inspect.isclass) if not n.startswith('_')]
        assert callables or classes, f'Adapter {module_path} has no public callables or classes'
