Run the offline compatibility tests with Python 3.11 and the example's pinned
langchain, openai, and faiss-cpu versions:

    python -m unittest discover -s py3/ailangchain/tests -v

The tests exercise the legacy notebook imports, translation chain, window memory,
Markdown splitting, local FAISS retrieval, explicit trust for pickle loading,
and OpenAI 0.27 client construction. They make no model API requests. Full
notebooks, Detectron2, private ramjet/prd/kipp modules, database connections,
and the separate langchain_openai notebook are outside this offline test scope.


The Ramjet PDF caller contracts run independently with the Python standard library:

    python -m unittest discover -s py3/ailangchain/tests -p test_ramjet_byok.py -v

These tests compile only the actual PDF scanner function definitions from
immigrate.ipynb and security.ipynb. All embedding and index operations are
mocked; configuration contains only synthetic keys and loopback destinations.
The shared Ramjet request credential/backend resolver is a contract double here: its real
validation and SDK behavior are qualified in Ramjet's own suite. Missing/invalid
keys and missing backend configuration must fail before index work. Both a base
root and an existing /v1 base preserve the selected destination exactly once.
Provider exception text must not reach logs, even when it echoes the test key.

The notebooks require a Ramjet version exporting
ramjet.tasks.gptchat.credentials.resolve_request_credentials. Configure the
existing OPENAI_API_KEY and OPENAI_API_BASE routes before running the PDF
scanner; no provider default or Ramjet server key is substituted. Backend roots
receive one /v1 suffix through the shared resolver, preserving configured query and fragment values. Install/qualify that shared-resolver version before
using the updated notebook cells. Run these caller tests before enforcing
Ramjet's no-fallback policy for other production clients. Do not run full
notebooks for regression validation: they access private configuration and data.
