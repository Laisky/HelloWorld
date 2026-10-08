Run the offline compatibility tests with Python 3.11 and the example's pinned
langchain, openai, and faiss-cpu versions:

    python -m unittest discover -s py3/ailangchain/tests -v

The tests exercise the legacy notebook imports, translation chain, window memory,
Markdown splitting, local FAISS retrieval, explicit trust for pickle loading,
and OpenAI 0.27 client construction. They make no model API requests. Full
notebooks, Detectron2, private ramjet/prd/kipp modules, database connections,
and the separate langchain_openai notebook are outside this offline test scope.
