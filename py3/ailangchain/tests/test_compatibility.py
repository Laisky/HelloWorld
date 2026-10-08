"""Offline behavior from the historical notebooks; no model API or credentials."""
import tempfile
import unittest

from langchain.chains import LLMChain, RetrievalQAWithSourcesChain, VectorDBQAWithSourcesChain
from langchain.chat_models import ChatOpenAI
from langchain.embeddings.fake import DeterministicFakeEmbedding
from langchain.llms.fake import FakeListLLM
from langchain.memory import ConversationBufferWindowMemory
from langchain.prompts import PromptTemplate
from langchain.text_splitter import MarkdownTextSplitter
from langchain.vectorstores import FAISS


class NotebookCompatibility(unittest.TestCase):
    def test_translation_chain(self):
        chain = LLMChain(
            llm=FakeListLLM(responses=["bonjour"]),
            prompt=PromptTemplate.from_template("Translate {text}"),
        )
        self.assertEqual(chain.invoke({"text": "hello"})["text"], "bonjour")

    def test_local_vector_search_and_untrusted_pickle_default(self):
        embeddings = DeterministicFakeEmbedding(size=16)
        index = FAISS.from_texts(["hello world", "other document"], embeddings)
        self.assertEqual(index.similarity_search("hello world", k=1)[0].page_content, "hello world")
        with tempfile.TemporaryDirectory() as folder:
            index.save_local(folder)
            # Loading even our harmless saved index must require explicit trust.
            with self.assertRaises(ValueError):
                FAISS.load_local(folder, embeddings)

    def test_splitter_and_window_memory(self):
        chunks = MarkdownTextSplitter(chunk_size=20, chunk_overlap=0).split_text(
            "# heading\n\nhello world\n\nmore text"
        )
        self.assertTrue(chunks)
        memory = ConversationBufferWindowMemory(k=1, return_messages=True)
        memory.save_context({"input": "old"}, {"output": "old reply"})
        memory.save_context({"input": "new"}, {"output": "new reply"})
        self.assertEqual([m.content for m in memory.load_memory_variables({})["history"]],
                         ["new", "new reply"])

    def test_legacy_openai_client_can_be_constructed_without_request(self):
        client = ChatOpenAI(openai_api_key="offline-test-unused")
        self.assertEqual(client.model_name, "gpt-3.5-turbo")


if __name__ == "__main__":
    unittest.main()
