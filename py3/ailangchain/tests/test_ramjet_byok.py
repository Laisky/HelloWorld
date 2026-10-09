"""Run actual notebook caller functions with synthetic credentials and local mocks."""
import ast
import contextlib
import io
import json
import logging
import os
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import Mock, patch

NOTEBOOK_ROOT = Path(__file__).resolve().parents[1]
NOTEBOOKS = ("immigrate.ipynb", "security.ipynb")
KEY = "synthetic-notebook-byok-key"
BACKEND = "http://127.0.0.1:17980/selected/v1"


def load_caller(notebook, embed, credential_error=None):
    """Compile definitions only, avoiding imports, data files and cell execution."""
    document = json.loads((NOTEBOOK_ROOT / notebook).read_text())
    cell = next(cell for cell in document["cells"]
                if "def run_scan_pdfs():" in "".join(cell.get("source", [])))
    module = ast.parse("".join(cell["source"]))
    definitions = [node for node in module.body if isinstance(node, ast.FunctionDef)]
    stream = io.StringIO()
    logger = logging.Logger("synthetic-notebook-caller")
    logger.addHandler(logging.StreamHandler(stream))
    resolver = Mock(side_effect=credential_error if credential_error else
                    lambda key, base: {"api_key": key, "base_url": base})
    namespace = {
        "resolve_model_credentials": resolver,
        "os": os, "_embedding_pdf": embed, "logger": logger,
        "index_dirpath": "synthetic-index", "name": "synthetic-dataset",
        "load_store": Mock(return_value=SimpleNamespace(
            store=SimpleNamespace(merge_from=Mock()))),
        "save_store": Mock(), "is_file_scaned": Mock(return_value=False),
    }
    exec(compile(ast.Module(body=definitions, type_ignores=[]),
                 notebook, "exec"), namespace)
    namespace["gen_pdfs"] = lambda: iter(["synthetic.pdf"])
    return namespace, stream


class RamjetBYOKNotebookContracts(unittest.TestCase):
    def run_caller(self, notebook, environment, failure=None):
        captured = []
        def embed(*, apikey, api_base="https://api.openai.com/v1", **kwargs):
            captured.append((apikey, api_base))
            if failure:
                raise ValueError(failure)
            return SimpleNamespace(store=object())
        namespace, logs = load_caller(notebook, embed)
        with patch.dict(os.environ, environment, clear=True):
            with contextlib.redirect_stdout(io.StringIO()):
                namespace["run_scan_pdfs"]()
        return captured, namespace, logs.getvalue()

    def test_key_and_selected_backend_reach_actual_embedding_call(self):
        for notebook in NOTEBOOKS:
            with self.subTest(notebook=notebook):
                captured, _, _ = self.run_caller(notebook, {
                    "OPENAI_API_KEY": KEY, "OPENAI_API_BASE": BACKEND})
                self.assertEqual(captured, [(KEY, BACKEND)])

    def test_root_backend_gets_one_v1_suffix(self):
        for notebook in NOTEBOOKS:
            with self.subTest(notebook=notebook):
                captured, _, _ = self.run_caller(notebook, {
                    "OPENAI_API_KEY": KEY,
                    "OPENAI_API_BASE": "http://127.0.0.1:17980/selected/"})
                self.assertEqual(captured, [(KEY, BACKEND)])

    def test_missing_key_fails_before_loading_or_saving_an_index(self):
        for notebook in NOTEBOOKS:
            with self.subTest(notebook=notebook):
                embed = Mock()
                namespace, _ = load_caller(notebook, embed, ValueError("BYOK required"))
                with patch.dict(os.environ, {"OPENAI_API_BASE": BACKEND}, clear=True):
                    with contextlib.redirect_stdout(io.StringIO()):
                        with self.assertRaises((ValueError, KeyError)):
                            namespace["run_scan_pdfs"]()
                namespace["resolve_model_credentials"].assert_called_once_with(
                    None, BACKEND)
                namespace["load_store"].assert_not_called()
                namespace["save_store"].assert_not_called()
                embed.assert_not_called()

    def test_invalid_key_stops_before_loading_or_saving_an_index(self):
        for notebook in NOTEBOOKS:
            for bad_key in ("", "  ", "synthetic\ninvalid"):
                with self.subTest(notebook=notebook, key_kind=len(bad_key)):
                    embed = Mock()
                    namespace, logs = load_caller(
                        notebook, embed, ValueError("Invalid BYOK credentials"))
                    with patch.dict(os.environ, {
                        "OPENAI_API_KEY": bad_key, "OPENAI_API_BASE": BACKEND},
                        clear=True):
                        with self.assertRaisesRegex(ValueError, "Invalid BYOK"):
                            namespace["run_scan_pdfs"]()
                    namespace["resolve_model_credentials"].assert_called_once_with(
                        bad_key, BACKEND)
                    namespace["load_store"].assert_not_called()
                    namespace["save_store"].assert_not_called()
                    embed.assert_not_called()
                    self.assertEqual(logs.getvalue(), "")

    def test_missing_backend_has_no_implicit_destination(self):
        for notebook in NOTEBOOKS:
            with self.subTest(notebook=notebook):
                embed = Mock()
                namespace, _ = load_caller(notebook, embed)
                with patch.dict(os.environ, {"OPENAI_API_KEY": KEY}, clear=True):
                    with self.assertRaisesRegex(ValueError, "OPENAI_API_BASE"):
                        namespace["run_scan_pdfs"]()
                namespace["resolve_model_credentials"].assert_not_called()
                namespace["load_store"].assert_not_called()
                namespace["save_store"].assert_not_called()
                embed.assert_not_called()

    def test_upstream_exception_cannot_put_the_key_in_logs(self):
        for notebook in NOTEBOOKS:
            with self.subTest(notebook=notebook):
                _, _, logs = self.run_caller(notebook, {
                    "OPENAI_API_KEY": KEY, "OPENAI_API_BASE": BACKEND},
                    failure="upstream echoed " + KEY)
                self.assertNotIn(KEY, logs)
                self.assertIn("Failed", logs)


if __name__ == "__main__":
    unittest.main()
