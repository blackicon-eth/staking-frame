export interface SourceDocument {
  pageContent: string;
  metadata: {
    description: string;
    language: string;
    source: string;
    title: string;
  };
}

export interface Result {
  text: string;
  sourceDocuments: SourceDocument[];
}

export interface BrianKnowledgeResponse {
  result: Result;
}
