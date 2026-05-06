import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export interface RAGResponse {
  answer: string;
  language: string;
  references: Array<{
    source_file: string;
    language: string;
    document_type: string;
  }>;
  status: string;
}

export interface IngestionResult {
  success: boolean;
  message: string;
  chunks?: number;
  language?: string;
}

export class RAGService {
  private pythonPath: string;
  private ragPath: string;

  constructor() {
    this.pythonPath = 'python';
    this.ragPath = path.join(process.cwd(), 'ai-verse', 'Data Ingestion');
  }

  async askQuestion(question: string): Promise<RAGResponse> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from rag.rag_engine import RAGEngine
import json

try:
    engine = RAGEngine()
    result = engine.ask("${question.replace(/"/g, '\\"')}")
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e), "status": "error"}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result as RAGResponse);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }

  async askFundingQuestion(question: string): Promise<RAGResponse> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from funding_rag_engine import FundingRAGEngine
import json

try:
    engine = FundingRAGEngine()
    result = engine.ask_funding_question("${question.replace(/"/g, '\\"')}")
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e), "status": "error"}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          
          if (result.error) {
            reject(new Error(result.error));
          } else {
            resolve(result as RAGResponse);
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }

  async ingestPDF(filePath: string): Promise<IngestionResult> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from ingestion.pipeline import process_pdf
import json
import os

try:
    result = process_pdf("${filePath.replace(/\\/g, '/')}")
    print(json.dumps({
        "success": True,
        "message": "PDF processed successfully",
        "chunks": len(result["chunks"]),
        "language": result["language"]
    }))
except Exception as e:
    print(json.dumps({"success": False, "message": str(e)}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result as IngestionResult);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }

  async ingestWebsite(url: string): Promise<IngestionResult> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from ingestion.pipeline import process_websites
import json

try:
    results = process_websites(["${url.replace(/"/g, '\\"')}"])
    if results:
        result = results[0]
        print(json.dumps({
            "success": True,
            "message": "Website processed successfully",
            "chunks": len(result["chunks"]),
            "language": result["language"]
        }))
    else:
        print(json.dumps({"success": False, "message": "Failed to process website"}))
except Exception as e:
    print(json.dumps({"success": False, "message": str(e)}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result as IngestionResult);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }

  async buildVectorDatabase(): Promise<IngestionResult> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from vector_store.build_store import build_vector_database
import json

try:
    build_vector_database()
    print(json.dumps({
        "success": True,
        "message": "Vector database built successfully"
    }))
except Exception as e:
    print(json.dumps({"success": False, "message": str(e)}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result as IngestionResult);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }

  async searchDocuments(query: string, topK: number = 5): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonScript = `
import sys
sys.path.append('${this.ragPath.replace(/\\/g, '/')}')
from vector_store.retriever import Retriever
import json

try:
    retriever = Retriever()
    docs, metas = retriever.search("${query.replace(/"/g, '\\"')}", top_k=${topK})
    
    results = []
    for doc, meta in zip(docs, metas):
        results.append({
            "content": doc,
            "metadata": meta
        })
    
    print(json.dumps({
        "success": True,
        "results": results
    }))
except Exception as e:
    print(json.dumps({"success": False, "message": str(e)}))
`;

      const python = spawn(this.pythonPath, ['-c', pythonScript], {
        cwd: this.ragPath
      });

      let output = '';
      let error = '';

      python.stdout.on('data', (data) => {
        output += data.toString();
      });

      python.stderr.on('data', (data) => {
        error += data.toString();
      });

      python.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process failed: ${error}`));
          return;
        }

        try {
          const lines = output.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      });
    });
  }
}