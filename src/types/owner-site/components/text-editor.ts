export interface TextEditorData {
  title: string;
  lastUpdated: string;
  content: string;
  sections?: {
    id: string;
    title: string;
    content: string;
  }[];
}

export interface TextEditorComponentData {
  id: string | number;
  component_id: string;
  component_type: "text_editor";
  data: TextEditorData;
  order: number;
  page?: number;
}

// Default text editor data
export const defaultTextEditorData: TextEditorData = {
  title: "Rich Text Content",
  lastUpdated: new Date().toISOString().split("T")[0],
  content: `
    <h2>Welcome to Your Text Editor</h2>
    <p>This is a fully customizable rich text editor where you can create any type of content for your website.</p>
    
    <h3>Key Features:</h3>
    <ul>
      <li>Rich text formatting with bold, italic, and underline</li>
      <li>Multiple heading levels for better structure</li>
      <li>Bullet points and numbered lists</li>
      <li>Hyperlinks to external resources</li>
      <li>Easy-to-use interface</li>
    </ul>
    
    <h3>How to Use:</h3>
    <ol>
      <li>Click the edit button to start customizing</li>
      <li>Use the toolbar to format your text</li>
      <li>Add sections to organize your content</li>
      <li>Save your changes when done</li>
    </ol>
    
    <p>Start creating your content now!</p>
  `,
  sections: [
    {
      id: "section-1",
      title: "Getting Started",
      content:
        "<p>This is your first section. You can add multiple sections to organize your content better.</p>",
    },
  ],
};
